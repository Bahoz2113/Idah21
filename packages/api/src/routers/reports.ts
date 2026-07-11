import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, permissionProcedure } from "../trpc";
import { scopedStudentWhere } from "../scope";
import { notify } from "../notify";
import { generateParentReport, generateTeacherReport, type AgeContext } from "@cezeri/ai";

const PERIOD = z.string().regex(/^\d{4}-\d{2}$/, "YYYY-MM");

async function getScopedStudent(ctx: any, studentId: string) {
  const where = await scopedStudentWhere(ctx);
  const s = await ctx.prisma.student.findFirst({ where: { ...where, id: studentId }, include: { ageGroup: true } });
  if (!s) throw new TRPCError({ code: "FORBIDDEN" });
  return s;
}

function ageFrom(s: any): AgeContext {
  return s.ageGroup
    ? { name: s.ageGroup.name, minAge: s.ageGroup.minAge, maxAge: s.ageGroup.maxAge, tone: s.ageGroup.tone ?? "sade" }
    : { name: "Genel", minAge: 6, maxAge: 18, tone: "sade" };
}

// Bir öğrencinin dönem verisini topla
async function gather(ctx: any, studentId: string, period: string) {
  const start = new Date(`${period}-01T00:00:00Z`);
  const end = new Date(start); end.setUTCMonth(end.getUTCMonth() + 1);

  const atts = await ctx.prisma.attendance.findMany({
    where: { studentId, lesson: { date: { gte: start, lt: end } } },
    include: { lesson: { select: { topic: true } } },
  });
  const attendance = { present: 0, absent: 0, late: 0, excused: 0 };
  for (const a of atts) {
    if (a.status === "PRESENT") attendance.present++;
    else if (a.status === "ABSENT") attendance.absent++;
    else if (a.status === "LATE") attendance.late++;
    else if (a.status === "EXCUSED") attendance.excused++;
  }
  const topics = [...new Set(atts.map((a: any) => a.lesson.topic).filter(Boolean))] as string[];

  const evalRow = await ctx.prisma.studentEvaluation.findUnique({ where: { studentId_period: { studentId, period } } });
  let evaluationAvg: number | undefined;
  if (evalRow) {
    const vals = Object.values(evalRow.scores as Record<string, number>);
    evaluationAvg = vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10 : undefined;
  }

  const analysis = await ctx.prisma.aiReport.findFirst({
    where: { subjectId: studentId, type: "STUDENT_ANALYSIS" }, orderBy: { createdAt: "desc" },
  });
  const payload = (analysis?.payload as any) ?? {};

  const note = await ctx.prisma.teacherNote.findFirst({
    where: { studentId, visibleToParent: true }, orderBy: { createdAt: "desc" },
  });

  return {
    topics, attendance, evaluationAvg,
    weakConcepts: payload.weakConcepts as string[] | undefined,
    strongConcepts: payload.strongConcepts as string[] | undefined,
    teacherNote: note?.note as string | undefined,
  };
}

export const reportsRouter = router({
  // Veli aylık raporu üret (AI) + sakla + veliyi bilgilendir
  parentMonthly: permissionProcedure("ai:use")
    .input(z.object({ studentId: z.string(), period: PERIOD }))
    .mutation(async ({ ctx, input }) => {
      const student = await getScopedStudent(ctx, input.studentId);
      const data = await gather(ctx, input.studentId, input.period);
      const content = await generateParentReport({
        studentName: student.fullName, age: ageFrom(student), period: input.period, ...data,
      });
      const report = await ctx.prisma.parentReport.create({
        data: { studentId: input.studentId, period: input.period, content: content as any },
      });
      // velilere bildirim
      const links = await ctx.prisma.studentParent.findMany({
        where: { studentId: input.studentId }, include: { parent: { select: { userId: true } } },
      });
      for (const l of links) {
        if (l.parent.userId) await notify(ctx.prisma, l.parent.userId, "report_ready", "Yeni aylık rapor hazır", `${student.fullName} · ${input.period}`);
      }
      return { id: report.id, content };
    }),

  parentList: permissionProcedure("report:read")
    .input(z.object({ studentId: z.string() }))
    .query(async ({ ctx, input }) => {
      await getScopedStudent(ctx, input.studentId);
      return ctx.prisma.parentReport.findMany({ where: { studentId: input.studentId }, orderBy: { period: "desc" } });
    }),

  // Öğretmen haftalık/dönemlik raporu üret (AI)
  teacherWeekly: permissionProcedure("ai:use")
    .input(z.object({ studentId: z.string(), period: PERIOD }))
    .mutation(async ({ ctx, input }) => {
      const student = await getScopedStudent(ctx, input.studentId);
      const data = await gather(ctx, input.studentId, input.period);
      const content = await generateTeacherReport({
        studentName: student.fullName, age: ageFrom(student), scope: input.period,
        topics: data.topics, weakConcepts: data.weakConcepts, strongConcepts: data.strongConcepts, evaluationAvg: data.evaluationAvg,
      });
      const teacher = await ctx.prisma.teacher.findFirst({ where: { userId: ctx.user.id }, select: { id: true } });
      const report = await ctx.prisma.teacherReport.create({
        data: { studentId: input.studentId, teacherId: teacher?.id ?? "", week: input.period, content: content as any },
      });
      return { id: report.id, content };
    }),
});
