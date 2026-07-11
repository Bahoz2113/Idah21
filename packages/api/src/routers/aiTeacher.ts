import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, permissionProcedure } from "../trpc";
import { scopedStudentWhere } from "../scope";
import { checkRateLimit } from "../rateLimit";
import {
  analyzeMaterial, adaptToAge, buildVisualStoryboard, simplify,
  detectLearningStyle, detectWeaknesses, tutorRespond, type AgeContext,
} from "@cezeri/ai";

// ── Ortak yardımcılar (ai.ts ile aynı güvenlik deseni) ──
const clean = (s: string, n: number) => s.replace(/["""''`]/g, "'").slice(0, n);

async function ageContext(ctx: any, ageGroupId?: string | null): Promise<AgeContext> {
  if (!ageGroupId) return { name: "Genel", minAge: 6, maxAge: 18, tone: "sade ve açık" };
  const ag = await ctx.prisma.ageGroup.findFirst({
    where: { id: ageGroupId, organizationId: ctx.user.organizationId },
  });
  if (!ag) throw new TRPCError({ code: "NOT_FOUND", message: "Yaş grubu bulunamadı" });
  return { name: ag.name, minAge: ag.minAge, maxAge: ag.maxAge, tone: ag.tone ?? "sade" };
}

async function assertMaterialInOrg(ctx: any, materialId: string) {
  const m = await ctx.prisma.lessonMaterial.findFirst({
    where: { id: materialId, lesson: { class: { organizationId: ctx.user.organizationId } } },
    select: { id: true, type: true, title: true, extractedText: true },
  });
  if (!m) throw new TRPCError({ code: "FORBIDDEN", message: "Materyal erişim izni yok" });
  return m;
}

async function assertSessionInOrg(ctx: any, sessionId: string) {
  const s = await ctx.prisma.aiTeacherSession.findUnique({ where: { id: sessionId } });
  if (!s) throw new TRPCError({ code: "NOT_FOUND", message: "Oturum bulunamadı" });
  if (s.ageGroupId) {
    const ag = await ctx.prisma.ageGroup.findFirst({ where: { id: s.ageGroupId, organizationId: ctx.user.organizationId } });
    if (!ag) throw new TRPCError({ code: "FORBIDDEN" });
  } else if (s.studentId) {
    const st = await ctx.prisma.student.findFirst({ where: { id: s.studentId, organizationId: ctx.user.organizationId } });
    if (!st) throw new TRPCError({ code: "FORBIDDEN" });
  }
  return s;
}

async function resolveStudentId(ctx: any, given?: string): Promise<string> {
  if (ctx.user.role === "STUDENT") {
    const s = await ctx.prisma.student.findFirst({
      where: { userId: ctx.user.id, organizationId: ctx.user.organizationId }, select: { id: true },
    });
    if (!s) throw new TRPCError({ code: "FORBIDDEN", message: "Öğrenci kaydı bulunamadı" });
    return s.id;
  }
  if (!given) throw new TRPCError({ code: "BAD_REQUEST", message: "studentId gerekli" });
  const where = await scopedStudentWhere(ctx);
  const s = await ctx.prisma.student.findFirst({ where: { ...where, id: given }, select: { id: true } });
  if (!s) throw new TRPCError({ code: "FORBIDDEN", message: "Öğrenci erişim izni yok" });
  return s.id;
}

export const aiTeacherRouter = router({
  // ═══════════════ 1) MATERYAL ANALİZİ ═══════════════
  // Eğitmen materyalin metnini girer/yükler → AI yapılandırılmış özet çıkarır, DB'ye yazar.
  analyzeMaterial: permissionProcedure("ai:use")
    .input(z.object({
      materialId: z.string(),
      text: z.string().min(10).max(40000),   // materyalden çıkarılmış ham metin
    }))
    .mutation(async ({ ctx, input }) => {
      checkRateLimit(ctx.user.id, "ai:material", 8);
      const m = await assertMaterialInOrg(ctx, input.materialId);
      const summary = await analyzeMaterial({
        title: m.title ?? undefined,
        materialType: m.type,
        extractedText: input.text,
      });
      await ctx.prisma.lessonMaterial.update({
        where: { id: m.id },
        data: { extractedText: input.text.slice(0, 40000), aiSummary: summary as any, analyzedAt: new Date() },
      });
      return { materialId: m.id, summary };
    }),

  // ═══════════════ 2) YAŞ ADAPTASYONU ═══════════════
  adaptToAge: permissionProcedure("ai:use")
    .input(z.object({
      content: z.string().min(10).max(20000),
      topic: z.string().min(2).max(200),
      ageGroupId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      checkRateLimit(ctx.user.id, "ai:adapt", 10);
      const age = await ageContext(ctx, input.ageGroupId);
      return adaptToAge({ content: clean(input.content, 20000), topic: clean(input.topic, 200), age });
    }),

  // ═══════════════ 3) GÖRSEL ÖĞRENME (storyboard) ═══════════════
  visualStoryboard: permissionProcedure("ai:use")
    .input(z.object({
      topic: z.string().min(2).max(200),
      ageGroupId: z.string().optional(),
      content: z.string().max(8000).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      checkRateLimit(ctx.user.id, "ai:visual", 10);
      const age = await ageContext(ctx, input.ageGroupId);
      return buildVisualStoryboard({ topic: clean(input.topic, 200), age, content: input.content });
    }),

  // ═══════════════ 4) İÇERİK SADELEŞTİRME ═══════════════
  simplify: permissionProcedure("ai:use")
    .input(z.object({
      topic: z.string().min(2).max(200),
      ageGroupId: z.string().optional(),
      previousExplanation: z.string().min(2).max(4000),
      studentConfusion: z.string().max(500).optional(),
      triedMetaphors: z.array(z.string().max(100)).max(10).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      checkRateLimit(ctx.user.id, "ai:simplify", 15);
      const age = await ageContext(ctx, input.ageGroupId);
      return simplify({
        topic: clean(input.topic, 200), age,
        previousExplanation: input.previousExplanation,
        studentConfusion: input.studentConfusion,
        triedMetaphors: input.triedMetaphors,
      });
    }),

  // ═══════════════ 5) İNTERAKTİF DERS MOTORU ═══════════════
  // Öğrenci/eğitmen mesaj gönderir → AI yanıtlar; konuşma AiTeacherSession.messages'a yazılır.
  tutorChat: permissionProcedure("ai:use")
    .input(z.object({
      sessionId: z.string(),
      message: z.string().min(1).max(1000),
    }))
    .mutation(async ({ ctx, input }) => {
      checkRateLimit(ctx.user.id, "ai:tutor", 30);
      const session = await assertSessionInOrg(ctx, input.sessionId);
      const age = await ageContext(ctx, session.ageGroupId);

      const history = (session.messages as any[] ?? []) as { role: "ai" | "student"; text: string }[];
      const lessonContent = session.content ? JSON.stringify(session.content).slice(0, 3000) : undefined;

      const turn = await tutorRespond({
        topic: session.topic, age, lessonContent, history,
        studentMessage: clean(input.message, 1000),
      });

      const newHistory = [
        ...history,
        { role: "student" as const, text: input.message, at: new Date().toISOString() },
        { role: "ai" as const, text: turn.cevap, at: new Date().toISOString() },
      ].slice(-60); // son 60 mesajı tut

      await ctx.prisma.aiTeacherSession.update({
        where: { id: session.id },
        data: { messages: newHistory as any, updatedAt: new Date() },
      });

      return { turn, historyLength: newHistory.length };
    }),

  // ═══════════════ 6) ÖĞRENME STİLİ TANIMA ═══════════════
  detectStyle: permissionProcedure("ai:read")
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const session = await assertSessionInOrg(ctx, input.sessionId);
      const history = (session.messages as any[] ?? []) as { role: string; text: string }[];
      const result = await detectLearningStyle({ interactions: history });
      // Tespit edilen stili oturuma yaz (öğretmen sonradan görebilir)
      if (result.stil !== "UNKNOWN") {
        await ctx.prisma.aiTeacherSession.update({
          where: { id: session.id },
          data: { detectedStyle: result.stil, learningStyle: result.stil as any },
        });
      }
      return result;
    }),

  // ═══════════════ 7) ZAYIFLIK TESPİTİ ═══════════════
  detectWeaknesses: permissionProcedure("ai:read")
    .input(z.object({ studentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      checkRateLimit(ctx.user.id, "ai:weakness", 10);
      const studentId = await resolveStudentId(ctx, input.studentId);

      const student = await ctx.prisma.student.findFirst({
        where: { id: studentId },
        select: { firstName: true, lastName: true },
      });

      // Son quiz raporları
      const reports = await ctx.prisma.aiReport.findMany({
        where: { type: "STUDENT_ANALYSIS", subjectId: studentId },
        orderBy: { createdAt: "desc" }, take: 5,
      });
      const quizResults = reports.map((r: any) => {
        const p = r.payload ?? {};
        return { topic: p.topic ?? "genel", correct: p.correct ?? 0, wrong: p.wrong ?? 0, empty: 0, weakConcepts: p.weakConcepts };
      });

      // Son değerlendirme puanları (18 kriter)
      const evalRow = await ctx.prisma.studentEvaluation.findFirst({
        where: { studentId }, orderBy: { period: "desc" },
      });

      const report = await detectWeaknesses({
        studentName: student ? `${student.firstName} ${student.lastName ?? ""}`.trim() : undefined,
        quizResults: quizResults.length ? quizResults : undefined,
        evaluationScores: (evalRow?.scores as any) ?? undefined,
      });

      // Zayıflıkları son oturuma da yazabiliriz (öğretmen görünürlüğü)
      return report;
    }),
});
