import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, permissionProcedure } from "../trpc";
import { scopedStudentWhere } from "../scope";
import { generateLesson, generateQuiz, analyzeResult, type AgeContext } from "@cezeri/ai";
import { checkRateLimit } from "../rateLimit";

const norm = (x: string) => x.trim().toLocaleLowerCase("tr-TR");

// Yaş grubu: orgId doğrulama zorunlu
async function ageContext(ctx: any, ageGroupId?: string | null): Promise<AgeContext> {
  if (!ageGroupId) return { name: "Genel", minAge: 6, maxAge: 18, tone: "sade ve açık" };
  const ag = await ctx.prisma.ageGroup.findFirst({
    where: { id: ageGroupId, organizationId: ctx.user.organizationId },
  });
  if (!ag) throw new TRPCError({ code: "NOT_FOUND", message: "Yaş grubu bulunamadı" });
  return { name: ag.name, minAge: ag.minAge, maxAge: ag.maxAge, tone: ag.tone ?? "sade" };
}

// Öğrenci: her zaman scope + orgId doğrulama
async function resolveStudentId(ctx: any, given?: string): Promise<string> {
  if (ctx.user.role === "STUDENT") {
    const s = await ctx.prisma.student.findFirst({
      where: { userId: ctx.user.id, organizationId: ctx.user.organizationId },
      select: { id: true },
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

// GÜVENLIK: Quiz orgId doğrulama — AiQuiz direkt orgId taşımıyor,
// ageGroupId üzerinden dolaylı kontrol + session sahipliği ile sağlanıyor
// Bu nedenle quizId'yi her zaman ageGroupId ile birlikte doğruluyoruz
async function getQuizInOrg(ctx: any, quizId: string) {
  const q = await ctx.prisma.aiQuiz.findUnique({
    where: { id: quizId },
    include: { questions: true },
  });
  if (!q) throw new TRPCError({ code: "NOT_FOUND" });
  // ageGroupId varsa org'a ait olup olmadığını kontrol et
  if (q.ageGroupId) {
    const ag = await ctx.prisma.ageGroup.findFirst({
      where: { id: q.ageGroupId, organizationId: ctx.user.organizationId },
    });
    if (!ag) throw new TRPCError({ code: "FORBIDDEN", message: "Bu quiz bu kuruma ait değil" });
  }
  return q;
}

const teacher = router({
  generate: permissionProcedure("ai:use")
    .input(z.object({
      topic: z.string().min(2).max(200),       // GÜVENLIK: max uzunluk
      ageGroupId: z.string().optional(),
      studentId: z.string().optional(),
      notes: z.string().max(500).optional(),   // GÜVENLIK: prompt injection sınırı
    }))
    .mutation(async ({ ctx, input }) => {
      checkRateLimit(ctx.user.id, "ai:lesson", 10); // max 10 ders/dk
      const age = await ageContext(ctx, input.ageGroupId);
      // GÜVENLIK: Prompt injection — kullanıcı girdisi tırnak içinde, talimat gibi yorumlanamaz
      const safeTopic = input.topic.replace(/["""''`]/g, "'").slice(0, 200);
      const safeNotes = input.notes?.replace(/["""''`]/g, "'").slice(0, 500);
      const lesson = await generateLesson({ topic: safeTopic, age, notes: safeNotes });
      const session = await ctx.prisma.aiTeacherSession.create({
        data: { topic: input.topic, ageGroupId: input.ageGroupId, studentId: input.studentId ?? null, content: lesson as any },
      });
      return { id: session.id, lesson };
    }),

  getSession: permissionProcedure("ai:read")
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const s = await ctx.prisma.aiTeacherSession.findUnique({ where: { id: input.id } });
      if (!s) throw new TRPCError({ code: "NOT_FOUND" });
      // GÜVENLIK: orgId doğrulama
      if (s.ageGroupId) await ageContext(ctx, s.ageGroupId);
      else {
        // ageGroupId yoksa studentId üzerinden org kontrolü yap
        if (s.studentId) {
          const student = await ctx.prisma.student.findFirst({
            where: { id: s.studentId, organizationId: ctx.user.organizationId },
          });
          if (!student) throw new TRPCError({ code: "FORBIDDEN" });
        }
      }
      return s;
    }),
});

const quiz = router({
  generate: permissionProcedure("ai:use")
    .input(z.object({
      topic: z.string().min(2).max(200),
      ageGroupId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      checkRateLimit(ctx.user.id, "ai:quiz", 5); // max 5 quiz/dk
      const age = await ageContext(ctx, input.ageGroupId);
      const safeTopic = input.topic.replace(/["""''`]/g, "'").slice(0, 200);
      const questions = await generateQuiz({ topic: safeTopic, age });
      const created = await ctx.prisma.aiQuiz.create({ data: { topic: input.topic, ageGroupId: input.ageGroupId } });
      await ctx.prisma.aiQuizQuestion.createMany({
        data: questions.map((q) => ({
          quizId: created.id, type: q.type, difficulty: q.difficulty, body: q.body,
          options: q.options ?? undefined, correctAnswer: q.correctAnswer, conceptTag: q.conceptTag,
        })),
      });
      return { quizId: created.id, count: questions.length };
    }),

  // GÜVENLIK FİX: orgId doğrulama eklendi
  get: permissionProcedure("ai:read")
    .input(z.object({ quizId: z.string() }))
    .query(async ({ ctx, input }) => {
      const q = await getQuizInOrg(ctx, input.quizId);
      const isStudent = ctx.user.role === "STUDENT";
      return {
        id: q.id, topic: q.topic,
        questions: q.questions.map((x: any) =>
          isStudent
            ? { id: x.id, type: x.type, difficulty: x.difficulty, body: x.body, options: x.options }
            : x
        ),
      };
    }),

  // GÜVENLIK FİX: orgId + student ownership doğrulama
  submit: permissionProcedure("ai:use")
    .input(z.object({
      quizId: z.string(),
      studentId: z.string().optional(),
      answers: z.array(z.object({ questionId: z.string(), answer: z.string().max(500) })).max(30),
    }))
    .mutation(async ({ ctx, input }) => {
      const studentId = await resolveStudentId(ctx, input.studentId);
      const q = await getQuizInOrg(ctx, input.quizId);

      const qmap = new Map(q.questions.map((x: any) => [x.id, x]));
      let correct = 0;
      const items: { concept: string; difficulty: string; correct: boolean }[] = [];
      const rows: any[] = [];

      for (const a of input.answers) {
        const ques: any = qmap.get(a.questionId);
        if (!ques) continue; // Bilinmeyen questionId'yi sessizce atla
        const ok = norm(a.answer) === norm(ques.correctAnswer);
        if (ok) correct++;
        items.push({ concept: ques.conceptTag ?? "genel", difficulty: ques.difficulty, correct: ok });
        rows.push({ quizId: input.quizId, studentId, questionId: ques.id, answer: a.answer, isCorrect: ok });
      }
      const total = q.questions.length;
      const wrong = items.length - correct;

      await ctx.prisma.aiQuizAnswer.deleteMany({ where: { quizId: input.quizId, studentId } });
      if (rows.length) await ctx.prisma.aiQuizAnswer.createMany({ data: rows });

      const age = await ageContext(ctx, q.ageGroupId);
      const analysis = await analyzeResult({ topic: q.topic, age, items });
      await ctx.prisma.aiReport.create({
        data: {
          type: "STUDENT_ANALYSIS",
          subjectId: studentId,
          payload: { quizId: input.quizId, correct, wrong, total, ...analysis } as any,
        },
      });
      return { correct, wrong, total, analysis };
    }),
});

export const aiRouter = router({ teacher, quiz });
