import type { PrismaClient } from "@cezeri/database";

export async function notify(prisma: PrismaClient, userId: string, type: string, title: string, body?: string) {
  return prisma.notification.create({ data: { userId, type, title, body } });
}
