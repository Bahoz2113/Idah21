import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, permissionProcedure } from "../trpc";
import { randomUUID } from "crypto";

// ══════════════════════════════════════════════════════════════
// Kullanıcı yönetimi — özel e-posta+şifre+kod auth sistemi.
// Artık Supabase Auth'a bağımlı DEĞİL; users tablosu tek gerçek kaynak.
// Yeni tablolar (login_sessions, security_events vb.) schema.prisma'da
// modellenmedi — Prisma engine build zincirini bozmamak için TÜMÜ
// raw SQL ($queryRaw/$executeRaw) ile erişiliyor (curriculum.ts, meetings.ts
// ile aynı, kanıtlanmış desen).
// ══════════════════════════════════════════════════════════════

export const adminUsersRouter = router({
  // ---- Tüm kullanıcıları listele ----
  list: permissionProcedure("user:manage")
    .input(z.object({ role: z.enum(["ADMIN","TEACHER","PARENT","STUDENT"]).optional() }).optional())
    .query(async ({ ctx, input }) => {
      if (input?.role) {
        return ctx.prisma.$queryRaw<any[]>`
          SELECT id, "firstName", "lastName", email, role, status,
                 "emailVerifiedAt", "lastLoginAt", "createdAt",
                 (CASE WHEN "passwordHash" IS NULL THEN false ELSE true END) AS "setupComplete"
          FROM users
          WHERE "organizationId" = ${ctx.user.organizationId} AND role = ${input.role}::"UserRole"
          ORDER BY "createdAt" DESC
        `;
      }
      return ctx.prisma.$queryRaw<any[]>`
        SELECT id, "firstName", "lastName", email, role, status,
               "emailVerifiedAt", "lastLoginAt", "createdAt",
               (CASE WHEN "passwordHash" IS NULL THEN false ELSE true END) AS "setupComplete"
        FROM users
        WHERE "organizationId" = ${ctx.user.organizationId}
        ORDER BY "createdAt" DESC
      `;
    }),

  // ---- Yeni admin/eğitmen ÖN KAYDI (spec: "İlk kurulum akışı" adım 1-2) ----
  // Şifre YOK — kullanıcı /ilk-kurulum ekranından kendi şifresini belirleyecek.
  precreate: permissionProcedure("user:manage")
    .input(z.object({
      firstName: z.string().min(2, "Ad en az 2 karakter"),
      lastName:  z.string().min(2, "Soyad en az 2 karakter"),
      email:     z.string().email("Geçerli bir e-posta girin"),
      role:      z.enum(["ADMIN", "TEACHER"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const email = input.email.trim().toLowerCase();

      const existing = await ctx.prisma.$queryRaw<any[]>`
        SELECT id FROM users WHERE lower(email) = ${email} LIMIT 1
      `;
      if (existing.length > 0) {
        throw new TRPCError({ code: "CONFLICT", message: "Bu e-posta adresi zaten kayıtlı." });
      }

      const id = randomUUID();
      await ctx.prisma.$executeRaw`
        INSERT INTO users (id, "organizationId", email, "firstName", "lastName", role, status, "createdAt")
        VALUES (${id}, ${ctx.user.organizationId}, ${email}, ${input.firstName}, ${input.lastName}, ${input.role}::"UserRole", 'PENDING'::"UserStatus", now())
      `;
      await ctx.prisma.$executeRaw`
        INSERT INTO audit_logs (id, "userId", action, entity, "entityId", meta, "createdAt")
        VALUES (${randomUUID()}, ${ctx.user.id}, 'USER_PRECREATED', 'user', ${id},
                ${JSON.stringify({ email, role: input.role, by: ctx.user.email })}::jsonb, now())
      `;
      return { id, email };
    }),

  // ---- Rol değiştir ----
  changeRole: permissionProcedure("user:manage")
    .input(z.object({ userId: z.string(), role: z.enum(["ADMIN","TEACHER","PARENT","STUDENT"]) }))
    .mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.user.id && input.role !== "ADMIN") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Kendi rolünüzü değiştiremezsiniz." });
      }
      return ctx.prisma.user.update({ where: { id: input.userId }, data: { role: input.role } });
    }),

  // ---- Hesabı pasife al: DB durumu + tüm oturumları iptal et (anında etkili) ----
  deactivate: permissionProcedure("user:manage")
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.user.id) throw new TRPCError({ code: "FORBIDDEN", message: "Kendi hesabınızı pasife alamazsınız." });
      await ctx.prisma.$executeRaw`
        UPDATE login_sessions SET "revokedAt" = now()
        WHERE "userId" = ${input.userId} AND "revokedAt" IS NULL
      `;
      await ctx.prisma.$executeRaw`
        INSERT INTO audit_logs (id, "userId", action, entity, "entityId", meta, "createdAt")
        VALUES (${randomUUID()}, ${ctx.user.id}, 'USER_DEACTIVATED', 'user', ${input.userId}, '{}'::jsonb, now())
      `;
      return ctx.prisma.user.update({ where: { id: input.userId }, data: { status: "PASSIVE" } });
    }),

  activate: permissionProcedure("user:manage")
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.$executeRaw`
        INSERT INTO audit_logs (id, "userId", action, entity, "entityId", meta, "createdAt")
        VALUES (${randomUUID()}, ${ctx.user.id}, 'USER_ACTIVATED_BY_ADMIN', 'user', ${input.userId}, '{}'::jsonb, now())
      `;
      return ctx.prisma.user.update({ where: { id: input.userId }, data: { status: "ACTIVE" } });
    }),

  // ---- Hesabı tamamen sil ----
  delete: permissionProcedure("user:manage")
    .input(z.object({ userId: z.string(), confirm: z.literal(true) }))
    .mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.user.id) throw new TRPCError({ code: "FORBIDDEN", message: "Kendi hesabınızı silemezsiniz." });
      await ctx.prisma.user.delete({ where: { id: input.userId } });
      return { deleted: true };
    }),

  // ---- Admin şifre sıfırlama başlatır: passwordHash temizlenir, kullanıcı
  //      bir sonraki girişte /ilk-kurulum akışından yeni şifre belirler ----
  forcePasswordReset: permissionProcedure("user:manage")
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.$executeRaw`
        UPDATE users SET "passwordHash" = NULL, "failedLoginAttempts" = 0, "lockedUntil" = NULL
        WHERE id = ${input.userId} AND "organizationId" = ${ctx.user.organizationId}
      `;
      await ctx.prisma.$executeRaw`
        UPDATE login_sessions SET "revokedAt" = now()
        WHERE "userId" = ${input.userId} AND "revokedAt" IS NULL
      `;
      await ctx.prisma.$executeRaw`
        INSERT INTO audit_logs (id, "userId", action, entity, "entityId", meta, "createdAt")
        VALUES (${randomUUID()}, ${ctx.user.id}, 'ADMIN_FORCED_PASSWORD_RESET', 'user', ${input.userId}, '{}'::jsonb, now())
      `;
      return { ok: true };
    }),

  // ---- Kilidi manuel aç (5 başarısız denemeden kilitlenen kullanıcı için) ----
  unlockAccount: permissionProcedure("user:manage")
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.$executeRaw`
        UPDATE users SET "failedLoginAttempts" = 0, "lockedUntil" = NULL WHERE id = ${input.userId}
      `;
      return { ok: true };
    }),

  // ---- Güvenlik logları: audit_logs + security_events birlikte, sayfalanmış ----
  securityLogs: permissionProcedure("user:manage")
    .input(z.object({ limit: z.number().min(1).max(200).default(50) }))
    .query(async ({ ctx, input }) => {
      const events = await ctx.prisma.$queryRaw<any[]>`
        SELECT se.id, se."eventType", se.email, se."ipAddress", se."userAgent", se.meta, se."createdAt",
               u."firstName", u."lastName"
        FROM security_events se
        LEFT JOIN users u ON u.id = se."userId"
        LEFT JOIN users owner ON owner.id = se."userId"
        WHERE se."userId" IS NULL OR se."userId" IN (SELECT id FROM users WHERE "organizationId" = ${ctx.user.organizationId})
        ORDER BY se."createdAt" DESC LIMIT ${input.limit}
      `;
      const audits = await ctx.prisma.$queryRaw<any[]>`
        SELECT a.id, a.action, a.entity, a."entityId", a.meta, a."createdAt",
               u."firstName", u."lastName"
        FROM audit_logs a
        LEFT JOIN users u ON u.id = a."userId"
        WHERE a."userId" IN (SELECT id FROM users WHERE "organizationId" = ${ctx.user.organizationId})
        ORDER BY a."createdAt" DESC LIMIT ${input.limit}
      `;
      return { events, audits };
    }),

  // ---- Bir kullanıcının aktif oturumları (cihaz/IP/son kullanım) ----
  sessions: permissionProcedure("user:manage")
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.$queryRaw<any[]>`
        SELECT id, "userAgent", "ipAddress", "createdAt", "lastUsedAt", "expiresAt"
        FROM login_sessions
        WHERE "userId" = ${input.userId} AND "revokedAt" IS NULL AND "expiresAt" > now()
        ORDER BY "lastUsedAt" DESC
      `;
    }),

  // ---- Öğrenciye kullanıcı hesabı bağla ----
  linkStudentUser: permissionProcedure("user:manage")
    .input(z.object({ studentId: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.student.update({
        where: { id: input.studentId, organizationId: ctx.user.organizationId },
        data:  { userId: input.userId },
      });
    }),
});
