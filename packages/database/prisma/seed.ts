import "./load-env";
import { prisma } from "../src";
import { createServiceClient } from "@cezeri/auth";
import { AGE_GROUPS } from "@cezeri/config";

const DEMO_PASSWORD = "Cezeri2026!";

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("⚠️  .env içinde SUPABASE_SERVICE_ROLE_KEY ve NEXT_PUBLIC_SUPABASE_URL dolu olmalı.");
  process.exit(1);
}

// Supabase Auth kullanıcısını oluştur/bul (idempotent)
async function upsertAuthUser(email: string, role: string): Promise<string> {
  const supabase = createServiceClient();
  const { data: list } = await supabase.auth.admin.listUsers();
  const existing = list?.users.find((u) => u.email === email);
  if (existing) return existing.id;
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: DEMO_PASSWORD,
    email_confirm: true,
    user_metadata: { role },
  });
  if (error) throw error;
  return data.user!.id;
}

async function main() {
  // 1) Kurum (slug benzersiz -> upsert)
  const org = await prisma.organization.upsert({
    where: { slug: "cezeri" },
    update: {},
    create: { name: "CEZERİ ROBOTECH", slug: "cezeri", plan: "standard" },
  });

  // 2) Şube
  let branch = await prisma.branch.findFirst({ where: { organizationId: org.id, name: "Merkez" } });
  if (!branch) branch = await prisma.branch.create({ data: { organizationId: org.id, name: "Merkez", address: "Batman" } });

  // 3) Yaş grupları
  const ag: Record<string, string> = {};
  for (const g of AGE_GROUPS) {
    let row = await prisma.ageGroup.findFirst({ where: { organizationId: org.id, name: g.name } });
    if (!row) row = await prisma.ageGroup.create({
      data: { organizationId: org.id, name: g.name, minAge: g.minAge, maxAge: g.maxAge, tone: g.tone },
    });
    ag[g.key] = row.id;
  }

  // 4) Demo kullanıcılar (Supabase Auth + users aynası)
  async function makeUser(email: string, role: "ADMIN" | "TEACHER" | "PARENT" | "STUDENT") {
    const id = await upsertAuthUser(email, role);
    await prisma.user.upsert({
      where: { id },
      update: { role, organizationId: org.id, email },
      create: { id, organizationId: org.id, email, role },
    });
    return id;
  }
  await makeUser("admin@cezeri.local", "ADMIN");
  const teacherUserId = await makeUser("ogretmen@cezeri.local", "TEACHER");
  const parentUserId = await makeUser("veli@cezeri.local", "PARENT");
  const studentUserId = await makeUser("ogrenci@cezeri.local", "STUDENT");

  // 5) Eğitmen
  const teacher = await prisma.teacher.upsert({
    where: { userId: teacherUserId },
    update: {},
    create: { organizationId: org.id, branchId: branch.id, userId: teacherUserId, fullName: "Metin Öğretmen", specialty: "Robotik & Arduino" },
  });

  // 6) Veli
  const parent = await prisma.parent.upsert({
    where: { userId: parentUserId },
    update: {},
    create: { organizationId: org.id, userId: parentUserId, fatherName: "Mehmet Yılmaz", phone: "+90 500 000 00 00", whatsapp: "+90 500 000 00 00" },
  });

  // 7) Sınıflar
  const classDefs = [
    { name: "Minikler Robotik 1", ag: "minikler" },
    { name: "Yıldızlar Arduino 1", ag: "yildizlar" },
    { name: "Kaşifler 3D Tasarım", ag: "kasifler" },
    { name: "Mühendisler Yapay Zeka", ag: "muhendisler" },
  ];
  const classes: Record<string, string> = {};
  for (const c of classDefs) {
    let row = await prisma.class.findFirst({ where: { organizationId: org.id, name: c.name } });
    if (!row) row = await prisma.class.create({
      data: { organizationId: org.id, branchId: branch.id, name: c.name, ageGroupId: ag[c.ag], teacherId: teacher.id, capacity: 12, day: "Cumartesi", time: "10:00" },
    });
    classes[c.name] = row.id;
  }
  const miniklerId = classes["Minikler Robotik 1"];

  // 8) Öğrenci: Ahmet Yılmaz (8 yaş, Minikler)
  const student = await prisma.student.upsert({
    where: { userId: studentUserId },
    update: {},
    create: { organizationId: org.id, branchId: branch.id, userId: studentUserId, fullName: "Ahmet Yılmaz", birthDate: new Date("2018-03-15"), school: "Batman İlkokulu", schoolGrade: "3", ageGroupId: ag["minikler"], classId: miniklerId },
  });

  // 9) Veli-öğrenci bağı
  const existsLink = await prisma.studentParent.findUnique({ where: { studentId_parentId: { studentId: student.id, parentId: parent.id } } });
  if (!existsLink) await prisma.studentParent.create({ data: { studentId: student.id, parentId: parent.id, relation: "baba", canPickup: true } });

  // 10) Medya izni (varsayılan kapalı — çocuk görseli barındırılmaz)
  await prisma.mediaConsent.upsert({ where: { studentId: student.id }, update: {}, create: { studentId: student.id } });

  // 11) Aylık müfredat + haftalık konular (LED Yakma örneği)
  const now = new Date();
  const curriculum = await prisma.monthlyCurriculum.upsert({
    where: { classId_year_month: { classId: miniklerId, year: now.getFullYear(), month: now.getMonth() + 1 } },
    update: {},
    create: { classId: miniklerId, year: now.getFullYear(), month: now.getMonth() + 1 },
  });
  const weeks = [
    { weekNo: 1, topic: "LED Yakma", description: "Pil, kablo, direnç, LED ve elektrik akışı" },
    { weekNo: 2, topic: "Buton Kullanımı", description: "Devreye buton ekleme" },
    { weekNo: 3, topic: "Servo Motor", description: "Hareket ve açı kontrolü" },
    { weekNo: 4, topic: "Mini Proje", description: "Öğrenilenlerin birleştirilmesi" },
  ];
  for (const w of weeks) {
    const ex = await prisma.weeklyTopic.findFirst({ where: { monthlyCurriculumId: curriculum.id, weekNo: w.weekNo } });
    if (!ex) await prisma.weeklyTopic.create({ data: { monthlyCurriculumId: curriculum.id, ...w } });
  }

  // 12) İlk ders (LED Yakma)
  const lessonEx = await prisma.lesson.findFirst({ where: { classId: miniklerId, topic: "LED Yakma" } });
  if (!lessonEx) await prisma.lesson.create({
    data: { classId: miniklerId, teacherId: teacher.id, date: now, topic: "LED Yakma", nextTopic: "Buton Kullanımı", lessonNote: "Temel devre kuruldu", homework: "Evde LED'in iki bacağını incele" },
  });

  // 13) Rozetler
  const badges = [
    { name: "İlk LED'imi Yaktım", icon: "💡", criteria: "İlk LED devresini tamamla" },
    { name: "Kodlama Kaşifi", icon: "🧭", criteria: "İlk kodunu yaz" },
    { name: "Robotik Ustası", icon: "🤖", criteria: "Bir robot projesi bitir" },
  ];
  for (const b of badges) {
    const ex = await prisma.badge.findFirst({ where: { name: b.name } });
    if (!ex) await prisma.badge.create({ data: b });
  }

  // 14) GERÇEK CEZERİ SINIFLARI (yüklenen PDF listelerinden)
  const REAL_CLASSES: { name: string; ag: string; day: string; time: string; level: string; students: string[] }[] = [
    { name: "Üreticiler (6-8)", ag: "minikler", day: "Perşembe / Cumartesi", time: "15.45-17.30", level: "Atölye + Kodlama",
      students: ["Yiğit Ali Özdemir","M.Aras Gidiş","Yusuf Aslan","Musab Ocakhanoğlu","Kerem Atalay","Mehmet İnağ","Ali Miran Yaman","Emre Padir","Said Günaydın"] },
    { name: "Mucitler (6-8)", ag: "minikler", day: "Perşembe / Cumartesi", time: "13.30-15.45 / 11.30-13.15", level: "Atölye + Kodlama",
      students: ["Hasan Ali Ekin","Ahmet Sefa Eren","Yusuf Eymen Ateş","Aras Düz","Ali Asaf Ezer","Efe Aytimur","Zeyd Bekir Epekinci","M.Taha Yılmaz","Muhammed Ali"] },
    { name: "Kaşifler (6-8)", ag: "minikler", day: "Perşembe / Cumartesi", time: "11.30-13.15", level: "Atölye + Kodlama",
      students: ["Jir Armanç Süme","Ali Fırat Süme","Ali Turgut","Yusuf Ege Bişmiş","Kevser Ergün","Zehra Ateş","Zeynep Okumuş","Rüzgar Rodi Üner","Alp Aslan"] },
    { name: "Geliştiriciler (9-11)", ag: "yildizlar", day: "Salı / Cumartesi", time: "11.30-13.15", level: "Atölye + Kodlama",
      students: ["Şervan Selimoğlu","Emir Yasin Özkılıç","Eymen Kara","Hamza Yardımcı","C.Miran Aslan","Hamza Özen","Hamza Çanak","Aram Yıldız","M.Eymen Lale"] },
    { name: "Kodlayıcılar (11-13)", ag: "kasifler", day: "Salı / Cumartesi", time: "15.45-17.30", level: "Atölye + Kodlama",
      students: ["Azra Eylül Onat","Ferzan Bal","Roni Taşkıran","Cengiz Altun","Bilal İpekyüz"] },
    { name: "Mühendisler (12-14)", ag: "kasifler", day: "Salı / Cuma", time: "12.15-13.45 / 14.30-15.45", level: "Yazılım",
      students: ["Berat Özerdem","Mirza Özbek","Baver Kaya","Mustafa Yakut","Ahmet Erçin","B.Ayaz Sarıkaya","E. Efe Demirci","Ahmet Akbaş","Akif Gönül","Taha Aslan","Mustafa Tarhan"] },
    { name: "Öncüler (14-16)", ag: "muhendisler", day: "Salı / Cuma", time: "15.45-17.30 / 16.00-17.45", level: "Yazılım",
      students: ["Ali Tansık","Musab Tansık","A.Yasin Sevim","Musab Çevik","Hamza Özmen","Mustafa Çelik","Yusuf Atayan","Eymen Levent","Emin Duman","Muhammed"] },
    { name: "İcatçılar (14-16)", ag: "muhendisler", day: "Pazar", time: "12.00-17.00", level: "Yazılım",
      students: ["Salih Aslan","Mustafa Tansık","Celal Kılıç","Ebubekir Levent"] },
  ];

  let realCls = 0, realStu = 0;
  for (const c of REAL_CLASSES) {
    let cls = await prisma.class.findFirst({ where: { organizationId: org.id, name: c.name } });
    if (!cls) {
      cls = await prisma.class.create({
        data: { organizationId: org.id, branchId: branch.id, name: c.name, ageGroupId: ag[c.ag],
                teacherId: teacher.id, capacity: 14, day: c.day, time: c.time, level: c.level },
      });
      realCls++;
    }
    for (const name of c.students) {
      const ex = await prisma.student.findFirst({ where: { organizationId: org.id, classId: cls.id, fullName: name } });
      if (!ex) {
        await prisma.student.create({
          data: { organizationId: org.id, branchId: branch.id, fullName: name, ageGroupId: ag[c.ag], classId: cls.id },
        });
        realStu++;
      }
    }
  }
  console.log(`📚 Gerçek sınıflar: +${realCls} sınıf, +${realStu} öğrenci (toplam 8 sınıf / 66 kayıt)`);

  console.log("\n✅ Seed tamam.");
  console.log(`Demo girişler (şifre: ${DEMO_PASSWORD})`);
  console.log("  admin@cezeri.local      → ADMIN");
  console.log("  ogretmen@cezeri.local   → TEACHER (Metin)");
  console.log("  veli@cezeri.local       → PARENT (Mehmet Yılmaz)");
  console.log("  ogrenci@cezeri.local    → STUDENT (Ahmet Yılmaz, Minikler)");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
