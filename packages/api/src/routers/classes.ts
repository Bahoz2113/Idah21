import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, permissionProcedure } from "../trpc";
import { scopedClassWhere } from "../scope";

export const classesRouter = router({
  list: permissionProcedure("class:read").query(async ({ ctx }) => {
    return ctx.prisma.class.findMany({
      where: await scopedClassWhere(ctx),
      include: { ageGroup: true, teacher: true, _count: { select: { students: true } } },
      orderBy: { name: "asc" },
    });
  }),

  get: permissionProcedure("class:read")
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const where = await scopedClassWhere(ctx);
      const cls = await ctx.prisma.class.findFirst({
        where: { ...where, id: input.id },
        include: {
          ageGroup: true,
          teacher: true,
          students: { orderBy: { fullName: "asc" } },
        },
      });
      if (!cls) throw new TRPCError({ code: "NOT_FOUND" });

      // Son işlenen dersler (konu geçmişi)
      const lessons = await ctx.prisma.lesson.findMany({
        where: { classId: cls.id },
        orderBy: { date: "desc" }, take: 20,
        include: { materials: { select: { id: true, type: true, title: true, url: true } } },
      });

      return { ...cls, lessons };
    }),

  create: permissionProcedure("class:write")
    .input(z.object({
      name: z.string().min(2),
      ageGroupId: z.string().optional(),
      teacherId: z.string().optional(),
      level: z.string().optional(),
      day: z.string().optional(),
      time: z.string().optional(),
      capacity: z.number().int().min(0).default(0),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.class.create({
        data: { ...input, organizationId: ctx.user.organizationId },
      });
    }),
});
