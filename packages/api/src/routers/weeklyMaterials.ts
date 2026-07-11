import { z } from "zod";
import { router, permissionProcedure } from "../trpc";

export const weeklyMaterialsRouter = router({
  // Sınıfın haftalık materyallerini getir
  list: permissionProcedure("class:read")
    .input(z.object({ classId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.$queryRaw<any[]>`
        SELECT * FROM weekly_materials WHERE "classId" = ${input.classId} ORDER BY "weekLabel" DESC
      `;
    }),

  // Haftalık materyal kaydet/güncelle
  upsert: permissionProcedure("lesson:manage")
    .input(z.object({
      classId:   z.string(),
      weekLabel: z.string(), // "2026-W26"
      topic:     z.string().optional(),
      materials: z.array(z.string()).optional(), // ["Arduino Uno", "LED", "Breadboard"]
    }))
    .mutation(async ({ ctx, input }) => {
      const materialsJson = JSON.stringify(input.materials ?? []);
      return ctx.prisma.$executeRaw`
        INSERT INTO weekly_materials (id, "classId", "weekLabel", topic, materials)
        VALUES (gen_random_uuid()::text, ${input.classId}, ${input.weekLabel}, ${input.topic ?? null}, ${materialsJson})
        ON CONFLICT ("classId", "weekLabel") DO UPDATE SET
          topic = EXCLUDED.topic,
          materials = EXCLUDED.materials
      `;
    }),

  delete: permissionProcedure("lesson:manage")
    .input(z.object({ classId: z.string(), weekLabel: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.$executeRaw`
        DELETE FROM weekly_materials WHERE "classId" = ${input.classId} AND "weekLabel" = ${input.weekLabel}
      `;
    }),
});
