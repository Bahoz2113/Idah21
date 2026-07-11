import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const notificationsRouter = router({
  list: protectedProcedure.query(({ ctx }) =>
    ctx.prisma.notification.findMany({ where: { userId: ctx.user.id }, orderBy: { createdAt: "desc" }, take: 50 })
  ),
  unreadCount: protectedProcedure.query(({ ctx }) =>
    ctx.prisma.notification.count({ where: { userId: ctx.user.id, readAt: null } })
  ),
  markRead: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ ctx, input }) =>
    ctx.prisma.notification.updateMany({ where: { id: input.id, userId: ctx.user.id }, data: { readAt: new Date() } })
  ),
  markAllRead: protectedProcedure.mutation(({ ctx }) =>
    ctx.prisma.notification.updateMany({ where: { userId: ctx.user.id, readAt: null }, data: { readAt: new Date() } })
  ),
});
