import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, permissionProcedure } from "../trpc";
import { createServiceClient } from "@cezeri/auth";

const BUCKET = "materials";
const MATERIAL_TYPE = z.enum(["PDF","PPT","ARDUINO_CODE","CIRCUIT","MODEL_3D","STL","NOTE","LINK"]);

async function assertLessonInOrg(ctx: any, lessonId: string) {
  const lesson = await ctx.prisma.lesson.findFirst({
    where: { id: lessonId, class: { organizationId: ctx.user.organizationId } },
    select: { id: true },
  });
  if (!lesson) throw new TRPCError({ code: "NOT_FOUND", message: "Ders bulunamadı" });
}

// GÜVENLIK: Yalnızca DB'de kayıtlı ve bu org'a ait materyal ID'lerini imzala
async function assertMaterialInOrg(ctx: any, materialId: string) {
  const m = await ctx.prisma.lessonMaterial.findFirst({
    where: { id: materialId, lesson: { class: { organizationId: ctx.user.organizationId } } },
    select: { id: true, url: true, type: true },
  });
  if (!m) throw new TRPCError({ code: "FORBIDDEN", message: "Materyal erişim izni yok" });
  return m;
}

export const materialsRouter = router({
  requestUpload: permissionProcedure("lesson:write")
    .input(z.object({ lessonId: z.string(), fileName: z.string().max(200) }))
    .mutation(async ({ ctx, input }) => {
      await assertLessonInOrg(ctx, input.lessonId);
      // Dosya adında güvenli karakter kontrolü
      const safe = input.fileName.replace(/[^\w.\-]/g, "_").slice(0, 100);
      const path = `${ctx.user.organizationId}/${input.lessonId}/${Date.now()}-${safe}`;
      const { data, error } = await createServiceClient().storage.from(BUCKET).createSignedUploadUrl(path);
      if (error || !data) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error?.message });
      return { path, token: data.token };
    }),

  confirm: permissionProcedure("lesson:write")
    .input(z.object({ lessonId: z.string(), type: MATERIAL_TYPE, url: z.string().max(1000), title: z.string().max(200).optional() }))
    .mutation(async ({ ctx, input }) => {
      await assertLessonInOrg(ctx, input.lessonId);
      return ctx.prisma.lessonMaterial.create({
        data: { lessonId: input.lessonId, type: input.type, url: input.url, title: input.title },
      });
    }),

  listByLesson: permissionProcedure("lesson:read")
    .input(z.object({ lessonId: z.string() }))
    .query(async ({ ctx, input }) => {
      await assertLessonInOrg(ctx, input.lessonId);
      return ctx.prisma.lessonMaterial.findMany({ where: { lessonId: input.lessonId } });
    }),

  // GÜVENLIK FİX: Artık raw path değil, materyal ID'si alıyoruz
  // DB'den path çekip onayladıktan sonra imzalıyoruz (path traversal kapalı)
  signedUrl: permissionProcedure("lesson:read")
    .input(z.object({ materialId: z.string() }))
    .query(async ({ ctx, input }) => {
      const m = await assertMaterialInOrg(ctx, input.materialId);
      if (m.type === "LINK") return { url: m.url }; // harici link zaten URL
      const { data, error } = await createServiceClient().storage.from(BUCKET).createSignedUrl(m.url, 3600);
      if (error || !data) throw new TRPCError({ code: "NOT_FOUND" });
      return { url: data.signedUrl };
    }),

  remove: permissionProcedure("lesson:write")
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const m = await assertMaterialInOrg(ctx, input.id);
      if (m.type !== "LINK") {
        await createServiceClient().storage.from(BUCKET).remove([m.url]);
      }
      return ctx.prisma.lessonMaterial.delete({ where: { id: m.id } });
    }),
});
