import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, permissionProcedure } from "../trpc";
import { auditLog } from "../audit";
import { scopedStudentWhere } from "../scope";

const PERIOD = z.string().regex(/^\d{4}-\d{2}$/, "Dönem YYYY-MM olmalı");

async function assertStudentAccess(ctx: any, studentId: string) {
  const where = await scopedStudentWhere(ctx);
  const s = await ctx.prisma.student.findFirst({ where: { ...where, id: studentId }, select: { id: true } });
  if (!s) throw new TRPCError({ code: "FORBIDDEN" });
}

export const evaluationsRouter = router({
  submit: permissionProcedure("evaluation:write")
    .input(z.object({
      studentId: z.string(),
      period: PERIOD,
      scores: z.record(z.number().int().min(1).max(10)),
      notes: z.record(z.string().max(1000)).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await assertStudentAccess(ctx, input.studentId);
      return ctx.prisma.studentEvaluation.upsert({
        where: { studentId_period: { studentId: input.studentId, period: input.period } },
        update: { scores: input.scores, notes: input.notes ?? undefined },
        create: { studentId: input.studentId, period: input.period, scores: input.scores, notes: input.notes ?? undefined },
      });
    }),

  forStudent: permissionProcedure("evaluation:read")
    .input(z.object({ studentId: z.string() }))
    .query(async ({ ctx, input }) => {
      await assertStudentAccess(ctx, input.studentId);
      return ctx.prisma.studentEvaluation.findMany({ where: { studentId: input.studentId }, orderBy: { period: "asc" } });
    }),

  // Aylık gelişim grafiği: dönem -> ortalama
  graph: permissionProcedure("evaluation:read")
    .input(z.object({ studentId: z.string() }))
    .query(async ({ ctx, input }) => {
      await assertStudentAccess(ctx, input.studentId);
      const evals = await ctx.prisma.studentEvaluation.findMany({ where: { studentId: input.studentId }, orderBy: { period: "asc" } });
      return evals.map((e) => {
        const vals = Object.values(e.scores as Record<string, number>);
        const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
        return { period: e.period, average: Math.round(avg * 10) / 10 };
      });
    }),
});
