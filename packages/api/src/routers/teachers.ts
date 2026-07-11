import { z } from "zod";
import { router, permissionProcedure } from "../trpc";

export const teachersRouter = router({
  list: permissionProcedure("teacher:read")
    .query(({ ctx }) =>
      ctx.prisma.teacher.findMany({
        where:   { organizationId: ctx.user.organizationId },
        include: { classesMain: { select: { id: true, name: true } } },
        orderBy: { fullName: "asc" },
      })
    ),

  // Eğitmen bilgilerini getir (userId ile)
  getByUserId: permissionProcedure("teacher:read")
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) =>
      ctx.prisma.teacher.findFirst({
        where:   { userId: input.userId, organizationId: ctx.user.organizationId },
        include: { classesMain: { select: { id: true, name: true } } },
      })
    ),
});
