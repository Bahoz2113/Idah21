/**
 * Demo kullanıcılarını Supabase Auth + DB'ye kaydeder
 * Çalıştır: pnpm db:demo
 */
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const prisma = new PrismaClient();

const DEMOS = [
  {
    email:     "905000000001@cezeri.local",
    phone:     "+905000000001",
    password:  "Cezeri2026!",
    role:      "ADMIN",
    firstName: "Admin",
    lastName:  "CEZERİ",
    username:  "admin",
  },
  {
    email:     "905000000002@cezeri.local",
    phone:     "+905000000002",
    password:  "Cezeri2026!",
    role:      "TEACHER",
    firstName: "Metin",
    lastName:  "Öğretmen",
    username:  "ogretmen",
  },
  {
    email:     "905000000003@cezeri.local",
    phone:     "+905000000003",
    password:  "Cezeri2026!",
    role:      "PARENT",
    firstName: "Mehmet",
    lastName:  "Yılmaz",
    username:  "veli",
  },
  {
    email:     "905000000004@cezeri.local",
    phone:     "+905000000004",
    password:  "Cezeri2026!",
    role:      "STUDENT",
    firstName: "Ahmet",
    lastName:  "Yılmaz",
    username:  "ogrenci",
  },
];

async function main() {
  console.log("🚀 Demo kullanıcılar oluşturuluyor...\n");

  const { data: existing } = await sb.auth.admin.listUsers();
  const existingEmails = new Set(existing?.users?.map((u: any) => u.email) ?? []);

  for (const u of DEMOS) {
    const alreadyExists = existingEmails.has(u.email);
    let authId: string;

    if (alreadyExists) {
      const authUser = existing?.users?.find((au: any) => au.email === u.email);
      authId = authUser!.id;
      await sb.auth.admin.updateUserById(authId, {
        password: u.password,
        user_metadata: {
          firstName: u.firstName, lastName: u.lastName,
          username: u.username, phone: u.phone,
          role: u.role, organizationId: "org_cezeri",
        },
      });
      console.log(`  ↺  Güncellendi: ${u.email} (${u.role})`);
    } else {
      const { data, error } = await sb.auth.admin.createUser({
        email: u.email,
        password: u.password,
        phone: u.phone,
        email_confirm: true,
        phone_confirm: true,
        user_metadata: {
          firstName: u.firstName, lastName: u.lastName,
          username: u.username, phone: u.phone,
          role: u.role, organizationId: "org_cezeri",
        },
      });
      if (error) { console.error(`  ✗ Hata (${u.email}):`, error.message); continue; }
      authId = data.user!.id;
      console.log(`  ✓  Oluşturuldu: ${u.email} (${u.role})`);
    }

    // DB upsert
    await prisma.user.upsert({
      where:  { id: authId },
      update: { role: u.role as any, status: "ACTIVE", phone: u.phone },
      create: {
        id:             authId,
        organizationId: "org_cezeri",
        email:          u.email,
        phone:          u.phone,
        firstName:      u.firstName,
        lastName:       u.lastName,
        username:       u.username,
        role:           u.role as any,
        status:         "ACTIVE",
      },
    });
  }

  console.log("\n✅ Demo kullanıcılar hazır!\n");
  console.log("Giriş için (şifre: Cezeri2026!):");
  console.log("  📱 +905000000001  →  Admin Paneli");
  console.log("  📱 +905000000002  →  Öğretmen Paneli");
  console.log("  📱 +905000000003  →  Veli Paneli");
  console.log("  📱 +905000000004  →  Öğrenci Paneli");

  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
