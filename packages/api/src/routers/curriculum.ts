import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, permissionProcedure } from "../trpc";

/**
 * MÜFREDAT (Curriculum)
 *  - topics : müfredat konu havuzu. Ekle/düzenle/sil yalnız ADMIN (curriculum:write).
 *             Okuma ADMIN + TEACHER (curriculum:read).
 *  - plan   : sınıf + tarih + konu eşlemesi (aylık takvim).
 *             Ekleme/silme eğitmen + admin (lesson:write). Okuma curriculum:read.
 *  Hepsi raw SQL + organizationId kapsamı + soft delete (meetings router ile aynı desen).
 */
export const curriculumRouter = router({

  // ───────────────────────── KONU HAVUZU ─────────────────────────

  // Tüm aktif konular (kategori + sıra)
  listTopics: permissionProcedure("curriculum:read")
    .query(async ({ ctx }) => {
      return ctx.prisma.$queryRaw<any[]>`
        SELECT * FROM curriculum_topics
        WHERE "organizationId" = ${ctx.user.organizationId}
          AND "deletedAt" IS NULL
        ORDER BY category NULLS LAST, "orderIndex" ASC, "createdAt" ASC
      `;
    }),

  createTopic: permissionProcedure("curriculum:write")
    .input(z.object({
      title:       z.string().min(2, "Başlık en az 2 karakter"),
      description: z.string().optional(),
      category:    z.enum(["Elektronik", "Yazılım"]),
      ageGroup:    z.string().optional(),
      orderIndex:  z.number().int().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.$executeRaw`
        INSERT INTO curriculum_topics
          (id, "organizationId", title, description, category, "ageGroup", "orderIndex", "createdBy")
        VALUES (
          gen_random_uuid()::text, ${ctx.user.organizationId},
          ${input.title}, ${input.description ?? null}, ${input.category},
          ${input.ageGroup ?? null}, ${input.orderIndex ?? 0}, ${ctx.user.id}
        )
      `;
    }),

  updateTopic: permissionProcedure("curriculum:write")
    .input(z.object({
      id:          z.string(),
      title:       z.string().min(2).optional(),
      description: z.string().optional(),
      category:    z.enum(["Elektronik", "Yazılım"]).optional(),
      ageGroup:    z.string().optional(),
      orderIndex:  z.number().int().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.$executeRaw`
        UPDATE curriculum_topics SET
          title        = COALESCE(${input.title       ?? null}, title),
          description  = COALESCE(${input.description ?? null}, description),
          category     = COALESCE(${input.category    ?? null}, category),
          "ageGroup"   = COALESCE(${input.ageGroup    ?? null}, "ageGroup"),
          "orderIndex" = COALESCE(${input.orderIndex  ?? null}, "orderIndex"),
          "updatedAt"  = now()
        WHERE id = ${input.id} AND "organizationId" = ${ctx.user.organizationId}
      `;
    }),

  deleteTopic: permissionProcedure("curriculum:write")
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Konu silinince o konuya bağlı plan kayıtları da arşivlenir
      await ctx.prisma.$executeRaw`
        UPDATE curriculum_plan SET "deletedAt" = now()
        WHERE "topicId" = ${input.id} AND "organizationId" = ${ctx.user.organizationId}
          AND "deletedAt" IS NULL
      `;
      return ctx.prisma.$executeRaw`
        UPDATE curriculum_topics SET "deletedAt" = now()
        WHERE id = ${input.id} AND "organizationId" = ${ctx.user.organizationId}
      `;
    }),

  // ───────────────────────── AYLIK PLAN (TAKVİM) ─────────────────────────

  // Bir sınıfın belirli aydaki planı (konu başlığı + kategori JOIN'li)
  listPlan: permissionProcedure("curriculum:read")
    .input(z.object({
      classId: z.string(),
      year:    z.number(),
      month:   z.number(),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.$queryRaw<any[]>`
        SELECT
          p.id, p."planDate", p."topicId", p.notes, p."teacherId",
          t.title    AS "topicTitle",
          t.category AS "topicCategory"
        FROM curriculum_plan p
        JOIN curriculum_topics t ON t.id = p."topicId"
        WHERE p."organizationId" = ${ctx.user.organizationId}
          AND p."classId" = ${input.classId}
          AND p."deletedAt" IS NULL
          AND EXTRACT(YEAR  FROM p."planDate") = ${input.year}
          AND EXTRACT(MONTH FROM p."planDate") = ${input.month}
        ORDER BY p."planDate" ASC, t."orderIndex" ASC
      `;
    }),

  // Bir tarihe bir veya birden çok konu ekle
  createPlan: permissionProcedure("lesson:write")
    .input(z.object({
      classId:  z.string(),
      planDate: z.string(),                 // ISO "YYYY-MM-DD"
      topicIds: z.array(z.string()).min(1), // birden çok konu
      notes:    z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      let inserted = 0;
      for (const topicId of input.topicIds) {
        // Aynı sınıf+tarih+konu zaten varsa tekrar ekleme (mükerrer engeli)
        const exists = await ctx.prisma.$queryRaw<any[]>`
          SELECT 1 FROM curriculum_plan
          WHERE "organizationId" = ${ctx.user.organizationId}
            AND "classId" = ${input.classId}
            AND "planDate" = ${input.planDate}::date
            AND "topicId" = ${topicId}
            AND "deletedAt" IS NULL
          LIMIT 1
        `;
        if (exists.length > 0) continue;
        await ctx.prisma.$executeRaw`
          INSERT INTO curriculum_plan
            (id, "organizationId", "classId", "planDate", "topicId", "teacherId", notes, "createdBy")
          VALUES (
            gen_random_uuid()::text, ${ctx.user.organizationId},
            ${input.classId}, ${input.planDate}::date, ${topicId},
            ${ctx.user.id}, ${input.notes ?? null}, ${ctx.user.id}
          )
        `;
        inserted++;
      }
      return { inserted };
    }),

  // Plandan tek konu kaldır (soft delete)
  deletePlan: permissionProcedure("lesson:write")
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.$executeRaw`
        UPDATE curriculum_plan SET "deletedAt" = now()
        WHERE id = ${input.id} AND "organizationId" = ${ctx.user.organizationId}
      `;
    }),

  // ═══════════ AYLIK MÜFREDAT (sınıf detayı — hafta hafta konu) ═══════════
  // MonthlyCurriculum + WeeklyTopic: ay seç → 4 haftaya konu yaz. Sınıf detayı için basit akış.
  monthPlan: permissionProcedure("curriculum:read")
    .input(z.object({ classId: z.string(), year: z.number(), month: z.number() }))
    .query(async ({ ctx, input }) => {
      const cls = await ctx.prisma.class.findFirst({
        where: { id: input.classId, organizationId: ctx.user.organizationId }, select: { id: true },
      });
      if (!cls) throw new TRPCError({ code: "FORBIDDEN", message: "Sınıf erişim izni yok" });
      const mc = await ctx.prisma.monthlyCurriculum.findUnique({
        where: { classId_year_month: { classId: input.classId, year: input.year, month: input.month } },
        include: { weeklyTopics: { orderBy: { weekNo: "asc" } } },
      });
      return mc?.weeklyTopics ?? [];
    }),

  addWeeklyTopic: permissionProcedure("curriculum:write")
    .input(z.object({
      classId: z.string(), year: z.number(), month: z.number(),
      weekNo: z.number().int().min(1).max(4),
      topic: z.string().min(1).max(200),
      description: z.string().max(1000).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const cls = await ctx.prisma.class.findFirst({
        where: { id: input.classId, organizationId: ctx.user.organizationId }, select: { id: true },
      });
      if (!cls) throw new TRPCError({ code: "FORBIDDEN", message: "Sınıf erişim izni yok" });
      const mc = await ctx.prisma.monthlyCurriculum.upsert({
        where: { classId_year_month: { classId: input.classId, year: input.year, month: input.month } },
        update: {},
        create: { classId: input.classId, year: input.year, month: input.month },
      });
      return ctx.prisma.weeklyTopic.create({
        data: {
          monthlyCurriculumId: mc.id, weekNo: input.weekNo,
          topic: input.topic.trim(), description: input.description?.trim() || null,
        },
      });
    }),

  deleteWeeklyTopic: permissionProcedure("curriculum:write")
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const wt = await ctx.prisma.weeklyTopic.findUnique({
        where: { id: input.id },
        include: { monthlyCurriculum: { include: { class: { select: { organizationId: true } } } } },
      });
      if (!wt || wt.monthlyCurriculum.class.organizationId !== ctx.user.organizationId)
        throw new TRPCError({ code: "FORBIDDEN" });
      await ctx.prisma.weeklyTopic.delete({ where: { id: input.id } });
      return { ok: true };
    }),
});
