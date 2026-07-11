import { z } from "zod";
import { router, permissionProcedure } from "../trpc";

export const inventoryRouter = router({
  list: permissionProcedure("class:read")
    .query(async ({ ctx }) => {
      return ctx.prisma.$queryRaw<any[]>`
        SELECT i.*,
          COALESCE(SUM(a.qty) FILTER (WHERE a."returnedAt" IS NULL), 0) as "assignedQty",
          json_agg(
            json_build_object('id', a.id, 'classId', a."classId", 'className', c.name, 'qty', a.qty, 'assignedAt', a."assignedAt")
            ORDER BY a."assignedAt" DESC
          ) FILTER (WHERE a.id IS NOT NULL AND a."returnedAt" IS NULL) as assignments
        FROM inventory_items i
        LEFT JOIN inventory_assignments a ON a."itemId" = i.id AND a."returnedAt" IS NULL
        LEFT JOIN classes c ON c.id = a."classId"
        WHERE i."organizationId" = ${ctx.user.organizationId}
        GROUP BY i.id
        ORDER BY i.name
      `;
    }),

  create: permissionProcedure("class:manage")
    .input(z.object({
      name:     z.string().min(2),
      category: z.string().optional(),
      totalQty: z.number().int().min(0),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.$executeRaw`
        INSERT INTO inventory_items (id, "organizationId", name, category, "totalQty")
        VALUES (gen_random_uuid()::text, ${ctx.user.organizationId}, ${input.name}, ${input.category ?? null}, ${input.totalQty})
      `;
    }),

  update: permissionProcedure("class:manage")
    .input(z.object({
      id:       z.string(),
      name:     z.string().optional(),
      category: z.string().optional(),
      totalQty: z.number().int().min(0).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.$executeRaw`
        UPDATE inventory_items SET
          name     = COALESCE(${input.name ?? null}, name),
          category = COALESCE(${input.category ?? null}, category),
          "totalQty" = COALESCE(${input.totalQty ?? null}, "totalQty"),
          "updatedAt" = now()
        WHERE id = ${input.id} AND "organizationId" = ${ctx.user.organizationId}
      `;
    }),

  delete: permissionProcedure("class:manage")
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.$executeRaw`DELETE FROM inventory_items WHERE id = ${input.id}`;
    }),

  // Sınıfa ata
  assign: permissionProcedure("class:manage")
    .input(z.object({
      itemId:  z.string(),
      classId: z.string().optional(),
      qty:     z.number().int().min(1),
      note:    z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.$executeRaw`
        INSERT INTO inventory_assignments (id, "itemId", "classId", qty, note)
        VALUES (gen_random_uuid()::text, ${input.itemId}, ${input.classId ?? null}, ${input.qty}, ${input.note ?? null})
      `;
    }),

  // İade et
  returnItem: permissionProcedure("class:manage")
    .input(z.object({ assignmentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.$executeRaw`
        UPDATE inventory_assignments SET "returnedAt" = now() WHERE id = ${input.assignmentId}
      `;
    }),
});
