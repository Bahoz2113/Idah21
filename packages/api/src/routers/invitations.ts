import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, permissionProcedure, publicProcedure } from "../trpc";
import { createServiceClient } from "@cezeri/auth";

const ORG = "org_cezeri";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

function makeToken() {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

// Davet oluştur
export const invitationsRouter = router({

  // Eğitmen daveti oluştur → WhatsApp linki döndür
  createTeacher: permissionProcedure("user:manage")
    .input(z.object({
      firstName: z.string().min(2),
      lastName:  z.string().min(2),
      phone:     z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const token = makeToken();
      const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 saat

      await ctx.prisma.$executeRaw`
        INSERT INTO invitations (id, "organizationId", token, type, role, "firstName", "lastName", phone, "expiresAt", "createdBy")
        VALUES (gen_random_uuid()::text, ${ORG}, ${token}, 'teacher', 'TEACHER', ${input.firstName}, ${input.lastName}, ${input.phone ?? null}, ${expiresAt}, ${ctx.user.id})
      `;

      const link = `${APP_URL}/davet/${token}`;
      const waMsg = encodeURIComponent(
        `Merhaba ${input.firstName} Hoca,\n\nCEZERİ ROBOTECH eğitim platformuna davet edildiniz! 🎓\n\nHesabınızı oluşturmak için aşağıdaki linke tıklayın (48 saat geçerli):\n${link}\n\nCEZERİ ROBOTECH Yönetimi`
      );
      const waUrl = input.phone
        ? `https://wa.me/${input.phone.replace(/\D/g, "")}?text=${waMsg}`
        : `https://wa.me/?text=${waMsg}`;

      return { token, link, waUrl };
    }),

  // Veli daveti oluştur (öğrenci profilinden)
  createParent: permissionProcedure("user:manage")
    .input(z.object({
      firstName: z.string().min(2),
      lastName:  z.string().min(2),
      phone:     z.string().optional(),
      studentId: z.string(),
      studentName: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const token = makeToken();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 gün

      await ctx.prisma.$executeRaw`
        INSERT INTO invitations (id, "organizationId", token, type, role, "firstName", "lastName", phone, "studentId", "expiresAt", "createdBy")
        VALUES (gen_random_uuid()::text, ${ORG}, ${token}, 'parent', 'PARENT', ${input.firstName}, ${input.lastName}, ${input.phone ?? null}, ${input.studentId}, ${expiresAt}, ${ctx.user.id})
      `;

      const link = `${APP_URL}/davet/${token}`;
      const waMsg = encodeURIComponent(
        `Merhaba ${input.firstName} Hanım/Bey,\n\n${input.studentName} için CEZERİ ROBOTECH öğrenci takip sistemine davet edildiniz! 🤖\n\nÇocuğunuzun gelişimini, devam durumunu ve değerlendirmelerini takip edebilmek için hesabınızı oluşturun:\n${link}\n\n(Link 7 gün geçerlidir)\n\nCEZERİ ROBOTECH`
      );
      const waUrl = input.phone
        ? `https://wa.me/${input.phone.replace(/\D/g, "")}?text=${waMsg}`
        : `https://wa.me/?text=${waMsg}`;

      return { token, link, waUrl };
    }),

  // Şifre sıfırlama daveti (admin → eğitmen)
  resetPassword: permissionProcedure("user:manage")
    .input(z.object({
      userId:    z.string(),
      firstName: z.string(),
      phone:     z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const token = makeToken();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 saat

      await ctx.prisma.$executeRaw`
        INSERT INTO invitations (id, "organizationId", token, type, role, "firstName", "lastName", phone, "expiresAt", "createdBy")
        VALUES (gen_random_uuid()::text, ${ORG}, ${token}, 'reset', 'TEACHER', ${input.firstName}, '', ${input.phone ?? null}, ${expiresAt}, ${ctx.user.id})
      `;

      const link = `${APP_URL}/davet/${token}`;
      const waMsg = encodeURIComponent(
        `Merhaba ${input.firstName} Hoca,\n\nCEZERİ ROBOTECH şifre sıfırlama talebiniz alındı.\n\nYeni şifrenizi belirlemek için:\n${link}\n\n(Link 24 saat geçerlidir)`
      );
      const waUrl = input.phone
        ? `https://wa.me/${input.phone.replace(/\D/g, "")}?text=${waMsg}`
        : `https://wa.me/?text=${waMsg}`;

      return { token, link, waUrl };
    }),

  // Token bilgisini getir (davet sayfası için — public)
  getByToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ ctx, input }) => {
      const rows = await ctx.prisma.$queryRaw<any[]>`
        SELECT * FROM invitations WHERE token = ${input.token} AND "usedAt" IS NULL AND "expiresAt" > now()
      `;
      if (!rows.length) throw new TRPCError({ code: "NOT_FOUND", message: "Davet linki geçersiz veya süresi dolmuş." });
      return rows[0];
    }),

  // Daveti kullan → hesap oluştur
  accept: publicProcedure
    .input(z.object({
      token:    z.string(),
      phone:    z.string().min(10),
      password: z.string().min(8),
    }))
    .mutation(async ({ ctx, input }) => {
      // Token kontrol
      const rows = await ctx.prisma.$queryRaw<any[]>`
        SELECT * FROM invitations WHERE token = ${input.token} AND "usedAt" IS NULL AND "expiresAt" > now()
      `;
      if (!rows.length) throw new TRPCError({ code: "NOT_FOUND", message: "Davet linki geçersiz veya süresi dolmuş." });
      const inv = rows[0];

      const phone = input.phone.replace(/\D/g, "");
      const normalizedPhone = phone.startsWith("90") ? `+${phone}` : phone.startsWith("0") ? `+90${phone.slice(1)}` : `+90${phone}`;
      const email = `${normalizedPhone.replace("+", "")}@cezeri.local`;

      const sb = createServiceClient();

      // Şifre sıfırlama mı, yoksa yeni hesap mı?
      if (inv.type === "reset") {
        // Kullanıcıyı telefon ile bul
        const user = await ctx.prisma.user.findFirst({ where: { phone: normalizedPhone } });
        if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "Kullanıcı bulunamadı." });
        await sb.auth.admin.updateUserById(user.id, { password: input.password });
      } else {
        // Yeni hesap oluştur
        const username = `${inv.firstName.toLowerCase().replace(/\s/g, "")}${Math.floor(Math.random()*1000)}`;
        const { data, error } = await sb.auth.admin.createUser({
          email,
          password: input.password,
          phone: normalizedPhone,
          email_confirm: true,
          phone_confirm: true,
          user_metadata: {
            firstName: inv.firstName, lastName: inv.lastName,
            username, phone: normalizedPhone,
            role: inv.role, organizationId: ORG,
          },
        });
        if (error) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });

        await ctx.prisma.user.create({
          data: {
            id: data.user!.id,
            organizationId: ORG,
            email, phone: normalizedPhone,
            firstName: inv.firstName, lastName: inv.lastName,
            username, role: inv.role as any,
          },
        });

        // Veli ise öğrenciyle ilişkilendir
        if (inv.role === "PARENT" && inv.studentId) {
          const parent = await ctx.prisma.parent.create({
            data: { organizationId: ORG, userId: data.user!.id, phone: normalizedPhone },
          });
          await ctx.prisma.studentParent.create({
            data: { studentId: inv.studentId, parentId: parent.id },
          });
        }
      }

      // Token'ı kullanıldı olarak işaretle
      await ctx.prisma.$executeRaw`UPDATE invitations SET "usedAt" = now() WHERE token = ${input.token}`;

      return { success: true, role: inv.role };
    }),
});
