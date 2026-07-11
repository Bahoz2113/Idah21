import { z } from "zod";
import { router, permissionProcedure } from "../trpc";

const ORG = "org_cezeri";

export const meetingsRouter = router({

  // Ay bazlı listele
  list: permissionProcedure("class:read")
    .input(z.object({ year: z.number(), month: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.$queryRaw<any[]>`
        SELECT * FROM corporate_meetings
        WHERE "organizationId" = ${ctx.user.organizationId}
          AND EXTRACT(YEAR  FROM "meetingDate") = ${input.year}
          AND EXTRACT(MONTH FROM "meetingDate") = ${input.month}
          AND "deletedAt" IS NULL
        ORDER BY "meetingDate" ASC
      `;
    }),

  // Yaklaşan görüşmeler (bildirim için)
  upcoming: permissionProcedure("class:read")
    .query(async ({ ctx }) => {
      return ctx.prisma.$queryRaw<any[]>`
        SELECT * FROM corporate_meetings
        WHERE "organizationId" = ${ctx.user.organizationId}
          AND "deletedAt" IS NULL
          AND status = 'planned'
          AND "meetingDate" >= CURRENT_DATE
          AND "meetingDate" <= CURRENT_DATE + INTERVAL '7 days'
        ORDER BY "meetingDate" ASC
      `;
    }),

  create: permissionProcedure("class:manage")
    .input(z.object({
      meetingDate:  z.string(),
      personName:   z.string().min(2),
      institution:  z.string().optional(),
      subject:      z.string().min(2),
      notes:        z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.$executeRaw`
        INSERT INTO corporate_meetings
          (id, "organizationId", "meetingDate", "personName", institution, subject, notes, "createdBy")
        VALUES (
          gen_random_uuid()::text, ${ctx.user.organizationId},
          ${new Date(input.meetingDate)}, ${input.personName},
          ${input.institution ?? null}, ${input.subject},
          ${input.notes ?? null}, ${ctx.user.id}
        )
      `;
    }),

  update: permissionProcedure("class:manage")
    .input(z.object({
      id:          z.string(),
      personName:  z.string().optional(),
      institution: z.string().optional(),
      subject:     z.string().optional(),
      notes:       z.string().optional(),
      status:      z.enum(["planned","completed","cancelled"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.$executeRaw`
        UPDATE corporate_meetings SET
          "personName"  = COALESCE(${input.personName  ?? null}, "personName"),
          institution   = COALESCE(${input.institution ?? null}, institution),
          subject       = COALESCE(${input.subject     ?? null}, subject),
          notes         = COALESCE(${input.notes       ?? null}, notes),
          status        = COALESCE(${input.status      ?? null}, status),
          "updatedAt"   = now()
        WHERE id = ${input.id} AND "organizationId" = ${ctx.user.organizationId}
      `;
    }),

  // Soft delete
  delete: permissionProcedure("class:manage")
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.$executeRaw`
        UPDATE corporate_meetings SET "deletedAt" = now()
        WHERE id = ${input.id} AND "organizationId" = ${ctx.user.organizationId}
      `;
    }),
});
