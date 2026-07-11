import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, permissionProcedure } from "../trpc";
import { scopedStudentWhere } from "../scope";

export const teacherNotesRouter = router({
  add: permissionProcedure("lesson:write")
    .input(z.object({
      studentId: z.string(),
      note: z.string().min(2).max(1000),
      visibleToParent: z.boolean().default(true),
    }))
    .mutation(async ({ ctx, input }) => {
      const where = await scopedStudentWhere(ctx);
      const student = await ctx.prisma.student.findFirst({ where: { ...where, id: input.studentId } });
      if (!student) throw new TRPCError({ code: "FORBIDDEN" });
      const teacher = await ctx.prisma.teacher.findFirst({ where: { userId: ctx.user.id } });
      return ctx.prisma.teacherNote.create({
        data: { studentId: input.studentId, teacherId: teacher?.id ?? "", note: input.note, visibleToParent: input.visibleToParent },
      });
    }),

  list: permissionProcedure("lesson:read")
    .input(z.object({ studentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const where = await scopedStudentWhere(ctx);
      const student = await ctx.prisma.student.findFirst({ where: { ...where, id: input.studentId } });
      if (!student) throw new TRPCError({ code: "FORBIDDEN" });
      // Veli rolü sadece görünür notları görür
      const visFilter = ctx.user.role === "PARENT" ? { visibleToParent: true } : {};
      return ctx.prisma.teacherNote.findMany({
        where: { studentId: input.studentId, ...visFilter },
        orderBy: { createdAt: "desc" },
        take: 50,
      });
    }),
});
