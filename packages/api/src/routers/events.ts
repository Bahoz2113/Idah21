import { z } from "zod";
import { router, permissionProcedure } from "../trpc";

export const eventsRouter = router({
  list: permissionProcedure("event:read")
    .query(({ ctx }) =>
      ctx.prisma.event.findMany({
        where: { organizationId: ctx.user.organizationId },
        orderBy: { date: "asc" },
        take: 50,
      })
    ),

  create: permissionProcedure("event:write")
    .input(z.object({
      title: z.string().min(2).max(200),
      date: z.string().datetime(),
      description: z.string().max(1000).optional(),
    }))
    .mutation(({ ctx, input }) =>
      ctx.prisma.event.create({
        data: {
          organizationId: ctx.user.organizationId,
          title: input.title,
          date: new Date(input.date),
          description: input.description,
        },
      })
    ),

  delete: permissionProcedure("event:write")
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.event.deleteMany({
        where: { id: input.id, organizationId: ctx.user.organizationId },
      });
    }),
});
