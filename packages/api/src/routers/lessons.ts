import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, permissionProcedure } from "../trpc";

const orgLessonWhere = (orgId: string, id: string) => ({ id, class: { organizationId: orgId } });

export const lessonsRouter = router({
  listByClass: permissionProcedure("lesson:read")
    .input(z.object({ classId: z.string() }))
    .query(({ ctx, input }) =>
      ctx.prisma.lesson.findMany({
        where: { classId: input.classId, class: { organizationId: ctx.user.organizationId } },
        orderBy: { date: "desc" },
      })
    ),

  get: permissionProcedure("lesson:read")
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const lesson = await ctx.prisma.lesson.findFirst({
        where: orgLessonWhere(ctx.user.organizationId, input.id),
        include: { materials: true, class: true },
      });
      if (!lesson) throw new TRPCError({ code: "NOT_FOUND" });
      return lesson;
    }),

  create: permissionProcedure("lesson:write")
    .input(z.object({
      classId: z.string(),
      date: z.coerce.date(),
      topic: z.string().optional(),
      nextTopic: z.string().optional(),
      lessonNote: z.string().optional(),
      homework: z.string().optional(),
    }))
    .mutation(({ ctx, input }) => ctx.prisma.lesson.create({ data: input })),

  update: permissionProcedure("lesson:write")
    .input(z.object({
      id: z.string(),
      topic: z.string().optional(),
      nextTopic: z.string().optional(),
      lessonNote: z.string().optional(),
      homework: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const ex = await ctx.prisma.lesson.findFirst({ where: orgLessonWhere(ctx.user.organizationId, id), select: { id: true } });
      if (!ex) throw new TRPCError({ code: "NOT_FOUND" });
      return ctx.prisma.lesson.update({ where: { id }, data });
    }),

  // Öğrenci: kendi sınıfının dersleri
  myLessons: permissionProcedure("lesson:read")
    .query(async ({ ctx }) => {
      if (ctx.user.role !== "STUDENT") return [];
      const student = await ctx.prisma.student.findFirst({
        where: { userId: ctx.user.id, organizationId: ctx.user.organizationId },
        select: { classId: true },
      });
      if (!student?.classId) return [];
      return ctx.prisma.lesson.findMany({
        where: { classId: student.classId },
        orderBy: { date: "desc" },
        take: 50,
        include: { materials: { select: { id: true, type: true, title: true } } },
      });
    }),
});