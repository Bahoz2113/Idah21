import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

// ══════════════════════════════════════════════════════════════
// Twilio/SMS tabanlı kayıt+2FA akışı (registerSendOTP, loginSend2FA vb.)
// tamamen kaldırıldı. Yeni e-posta+şifre+kod akışı Next.js Route Handler'ları
// olarak /api/auth/login, /api/auth/login/verify, /api/auth/setup/* ve
// /api/auth/password-reset/* altında uygulanıyor (httpOnly cookie set etmeleri
// gerektiği için tRPC yerine düz route handler kullanıldı).
// Admin tarafından yeni kullanıcı ön kaydı: adminUsersRouter.precreate
// ══════════════════════════════════════════════════════════════
export const authRouter = router({
  // ---- Kullanıcı adı müsaitlik kontrolü (opsiyonel profil alanı) ----
  checkUsername: publicProcedure
    .input(z.object({ username: z.string().min(3) }))
    .query(async ({ ctx, input }) => {
      const taken = await ctx.prisma.user.findFirst({
        where: { username: input.username.toLowerCase() },
        select: { id: true },
      });
      return { available: !taken };
    }),

  // ---- Giriş yapmış kullanıcının kendi profili ----
  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: { id: ctx.user.id },
      select: { id: true, firstName: true, lastName: true, username: true, phone: true, role: true, email: true },
    });
  }),
});
