import { z } from "zod";
import { router, permissionProcedure, protectedProcedure } from "../trpc";

export const lookupRouter = router({
  // Dashboard KPI özeti (öğrenci/sınıf/eğitmen sayıları)
  overview: protectedProcedure.query(async ({ ctx }) => {
    const orgId = ctx.user.organizationId;
    const [students, classes, teachers, activeStudents] = await Promise.all([
      ctx.prisma.student.count({ where: { organizationId: orgId } }),
      ctx.prisma.class.count({ where: { organizationId: orgId } }),
      ctx.prisma.teacher.count({ where: { organizationId: orgId } }),
      ctx.prisma.student.count({ where: { organizationId: orgId, status: "ACTIVE" } }),
    ]);
    return { students, classes, teachers, activeStudents };
  }),

  // Sınıflar
  classes: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.class.findMany({
      where: { organizationId: ctx.user.organizationId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
  }),

  // Yaş grupları
  ageGroups: permissionProcedure("class:read").query(({ ctx }) =>
    ctx.prisma.ageGroup.findMany({
      where: { organizationId: ctx.user.organizationId },
      orderBy: { minAge: "asc" },
    })
  ),

  // Öğrenciler (sınıf bazlı)
  studentsByClass: permissionProcedure("student:read")
    .input(z.object({ classId: z.string() }))
    .query(({ ctx, input }) =>
      ctx.prisma.student.findMany({
        where: { classId: input.classId, organizationId: ctx.user.organizationId },
        orderBy: { fullName: "asc" },
      })
    ),
});
