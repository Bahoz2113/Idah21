import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, permissionProcedure } from "../trpc";
import { scopedStudentWhere } from "../scope";
import { auditLog } from "../audit";

// İsim normalize: küçük harf, aksanları kaldır, fazla boşlukları temizle
function normName(s: string) {
  return s.trim()
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/\s+/g, " ");
}

// Levenshtein mesafesi — iki ismin ne kadar benzer olduğunu ölçer
function levenshtein(a: string, b: string) {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}

export const studentsRouter = router({
  list: permissionProcedure("student:read")
    .input(z.object({ classId: z.string().optional(), includeArchived: z.boolean().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const where = await scopedStudentWhere(ctx);
      if (input?.classId) where.classId = input.classId;
      // Arşivlenen (soft-delete = PASSIVE) öğrencileri varsayılan olarak gizle
      if (!input?.includeArchived) where.status = "ACTIVE";
      return ctx.prisma.student.findMany({ where, orderBy: { fullName: "asc" }, include: { ageGroup: true, class: true } });
    }),

  get: permissionProcedure("student:read")
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const where = await scopedStudentWhere(ctx);
      const s = await ctx.prisma.student.findFirst({
        where: { ...where, id: input.id },
        include: { ageGroup: true, class: true, parents: { include: { parent: true } }, mediaConsent: true },
      });
      if (!s) throw new TRPCError({ code: "NOT_FOUND" });

      // Alt sorgular birbirinden bağımsız → sıralı await yerine PARALEL çalıştır.
      // (Uzak Postgres'e 4 ayrı round-trip'i tek turda yapar; geçiş süresini domine eden maliyeti düşürür.)
      const [evaluations, quizReports, teacherNotes, attendanceRows] = await Promise.all([
        // Değerlendirmeler (18 kriter + açıklamalar) — dönem sırasıyla
        ctx.prisma.studentEvaluation.findMany({
          where: { studentId: s.id }, orderBy: { period: "asc" },
        }),
        // Sınav sonuçları (AI quiz raporları)
        ctx.prisma.aiReport.findMany({
          where: { type: "STUDENT_ANALYSIS", subjectId: s.id },
          orderBy: { createdAt: "desc" }, take: 20,
        }),
        // Öğretmen notları
        ctx.prisma.teacherNote.findMany({
          where: { studentId: s.id }, orderBy: { createdAt: "desc" }, take: 30,
          include: { teacher: { include: { user: { select: { firstName: true, lastName: true } } } } },
        }),
        // Devam kayıtları
        ctx.prisma.attendance.findMany({
          where: { studentId: s.id }, select: { status: true },
        }),
      ]);

      // Devam özeti
      const attendanceSummary = attendanceRows.reduce((acc: Record<string, number>, r) => {
        acc[r.status] = (acc[r.status] ?? 0) + 1; return acc;
      }, {});

      return { ...s, evaluations, quizReports, teacherNotes, attendanceSummary };
    }),

  /**
   * Tekrar öğrenci kontrolü:
   * 1) Normalize isim birebir eşleşme → hata ver
   * 2) Levenshtein ≤ 2 (yakın isim) → potansiyel adayları döndür, karar kullanıcıya bırak
   * 3) Aynı isim + aynı sınıf → kesinlikle engelle (force:true bile geçmez)
   */
  checkDuplicate: permissionProcedure("student:create")
    .input(z.object({ fullName: z.string().min(2), classId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const orgId = ctx.user.organizationId;
      const all = await ctx.prisma.student.findMany({
        where: { organizationId: orgId },
        select: { id: true, fullName: true, classId: true, class: { select: { name: true } },
                  parents: { include: { parent: { select: { fatherName: true, motherName: true, phone: true } } } } },
      });
      const qNorm = normName(input.fullName);
      const exact: typeof all = [];
      const similar: typeof all = [];
      for (const s of all) {
        const dist = levenshtein(normName(s.fullName), qNorm);
        if (dist === 0) exact.push(s);
        else if (dist <= 2) similar.push(s);
      }
      // Aynı isim + aynı sınıf = kesinlikle tekrar
      const sameClass = exact.filter((s) => s.classId && s.classId === input.classId);
      return { exact, similar, sameClass, blocked: sameClass.length > 0 };
    }),

  create: permissionProcedure("student:create")
    .input(z.object({
      fullName: z.string().min(2),
      classId: z.string().optional(),
      ageGroupId: z.string().optional(),
      birthDate: z.string().optional(),
      school: z.string().optional(),
      schoolGrade: z.string().optional(),
      allergyNotes: z.string().optional(),
      force: z.boolean().default(false), // kullanıcı "yine de ekle" dediyse
    }))
    .mutation(async ({ ctx, input }) => {
      const orgId = ctx.user.organizationId;

      // Aynı isim + aynı sınıf → hiçbir zaman izin verme
      if (input.classId) {
        const hardBlock = await ctx.prisma.student.findFirst({
          where: { organizationId: orgId, classId: input.classId,
                   fullName: { equals: input.fullName, mode: "insensitive" } },
        });
        if (hardBlock) throw new TRPCError({ code: "CONFLICT",
          message: `"${input.fullName}" bu sınıfta zaten kayıtlı. Farklı bir öğrenciyse önce eski kaydı kontrol edin.` });
      }

      // Genel birebir eşleşme — force:true ile geçebilir (farklı sınıf, farklı dönem vb.)
      if (!input.force) {
        const nameBlock = await ctx.prisma.student.findFirst({
          where: { organizationId: orgId, fullName: { equals: input.fullName, mode: "insensitive" } },
        });
        if (nameBlock) throw new TRPCError({ code: "CONFLICT",
          message: `"${input.fullName}" adında başka bir öğrenci zaten var (${nameBlock.id}). Farklı bir kişiyse "Yine de Ekle" butonunu kullanın.` });
      }

      const branchId = await ctx.prisma.branch.findFirst({ where: { organizationId: orgId }, select: { id: true } })
        .then((b) => b?.id);
      const newStudent = await ctx.prisma.student.create({
        data: { organizationId: orgId, branchId, fullName: input.fullName, classId: input.classId,
                ageGroupId: input.ageGroupId, birthDate: input.birthDate ? new Date(input.birthDate) : undefined,
                school: input.school, schoolGrade: input.schoolGrade, allergyNotes: input.allergyNotes },
      });
      await auditLog(ctx.prisma, ctx.user.id, "student.create", newStudent.id);
      return newStudent;
    }),

  update: permissionProcedure("student:update")
    .input(z.object({
      id: z.string(), fullName: z.string().optional(), classId: z.string().optional(),
      ageGroupId: z.string().optional(), school: z.string().optional(), schoolGrade: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const where = await scopedStudentWhere(ctx);
      const ex = await ctx.prisma.student.findFirst({ where: { ...where, id } });
      if (!ex) throw new TRPCError({ code: "FORBIDDEN" });
      return ctx.prisma.student.update({ where: { id }, data });
    }),
  // Soft delete
  softDelete: permissionProcedure("student:delete")
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Kapsam kontrolü + arşivle (status=PASSIVE). "students" tablosunda deletedAt kolonu yok.
      const where = await scopedStudentWhere(ctx);
      const ex = await ctx.prisma.student.findFirst({ where: { ...where, id: input.id } });
      if (!ex) throw new TRPCError({ code: "FORBIDDEN" });
      return ctx.prisma.student.update({ where: { id: input.id }, data: { status: "PASSIVE" } });
    }),

  // Sınıf değiştir
  changeClass: permissionProcedure("student:create")
    .input(z.object({ studentId: z.string(), classId: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.student.update({
        where: { id: input.studentId },
        data:  { classId: input.classId ?? null },
      });
    }),

  // Elle sınav/test sonucu ekle — Sınavlar sekmesindeki quizReports (aiReport) listesine yazar.
  addQuizResult: permissionProcedure("evaluation:write")
    .input(z.object({
      studentId: z.string(),
      topic: z.string().min(1).max(120),
      correct: z.number().int().min(0).max(1000),
      wrong: z.number().int().min(0).max(1000),
      zorlanilanKonu: z.string().max(200).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Kapsam kontrolü: öğrenci bu kullanıcının erişebildiği bir öğrenci mi?
      const where = await scopedStudentWhere(ctx);
      const student = await ctx.prisma.student.findFirst({ where: { ...where, id: input.studentId } });
      if (!student) throw new TRPCError({ code: "FORBIDDEN" });

      const total = input.correct + input.wrong;
      if (total === 0) throw new TRPCError({ code: "BAD_REQUEST", message: "Doğru + yanlış toplamı 0 olamaz." });

      const report = await ctx.prisma.aiReport.create({
        data: {
          type: "STUDENT_ANALYSIS",
          subjectId: input.studentId,
          payload: {
            topic: input.topic,
            correct: input.correct,
            wrong: input.wrong,
            total,
            "zorlanılanKonu": input.zorlanilanKonu || undefined,
            manual: true,
          } as any,
        },
      });
      await auditLog(ctx.prisma, ctx.user.id, "student.addQuizResult", input.studentId);
      return report;
    }),
});
