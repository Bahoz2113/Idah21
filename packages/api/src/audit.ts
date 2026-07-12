import type { PrismaClient } from "@cezeri/database";

type AuditAction =
  | "student.create" | "student.update" | "student.delete" | "student.addQuizResult"
  | "evaluation.submit" | "report.generate" | "attendance.take"
  | "material.upload" | "material.delete" | "ai.lesson" | "ai.quiz";

export async function auditLog(
  prisma: PrismaClient,
  userId: string,
  action: AuditAction,
  entityId?: string,
  meta?: Record<string, unknown>
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity: entityId ?? "",
        // meta JSON olarak sakla — KVKK gerekliliği
      },
    });
  } catch {
    // Audit log yazma hatası ana işlemi engellemez ama loglanır
    console.error("[AUDIT] Log yazılamadı:", action, entityId);
  }
}
