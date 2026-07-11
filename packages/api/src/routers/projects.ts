import { z } from "zod";
import { router, permissionProcedure } from "../trpc";

export const institutionProjectsRouter = router({
  list: permissionProcedure("class:read")
    .query(async ({ ctx }) => {
      return ctx.prisma.$queryRaw<any[]>`
        SELECT p.*, 
          json_agg(t.* ORDER BY t."createdAt") FILTER (WHERE t.id IS NOT NULL) as tasks
        FROM institution_projects p
        LEFT JOIN institution_project_tasks t ON t."projectId" = p.id
        WHERE p."organizationId" = ${ctx.user.organizationId}
        GROUP BY p.id
        ORDER BY p."createdAt" DESC
      `;
    }),

  create: permissionProcedure("class:manage")
    .input(z.object({
      name:        z.string().min(2),
      description: z.string().optional(),
      startDate:   z.string().optional(),
      endDate:     z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.$executeRaw`
        INSERT INTO institution_projects (id, "organizationId", name, description, "startDate", "endDate")
        VALUES (gen_random_uuid()::text, ${ctx.user.organizationId}, ${input.name}, ${input.description ?? null},
          ${input.startDate ? new Date(input.startDate) : null},
          ${input.endDate   ? new Date(input.endDate)   : null})
      `;
    }),

  update: permissionProcedure("class:manage")
    .input(z.object({
      id:          z.string(),
      name:        z.string().min(2).optional(),
      description: z.string().optional(),
      startDate:   z.string().optional(),
      endDate:     z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.$executeRaw`
        UPDATE institution_projects SET
          name = COALESCE(${input.name ?? null}, name),
          description = COALESCE(${input.description ?? null}, description),
          "startDate" = COALESCE(${input.startDate ? new Date(input.startDate) : null}, "startDate"),
          "endDate"   = COALESCE(${input.endDate   ? new Date(input.endDate)   : null}, "endDate"),
          "updatedAt" = now()
        WHERE id = ${input.id} AND "organizationId" = ${ctx.user.organizationId}
      `;
    }),

  delete: permissionProcedure("class:manage")
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.$executeRaw`
        DELETE FROM institution_projects WHERE id = ${input.id} AND "organizationId" = ${ctx.user.organizationId}
      `;
    }),

  // Görev ekle
  addTask: permissionProcedure("class:manage")
    .input(z.object({ projectId: z.string(), title: z.string().min(2) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.$executeRaw`
        INSERT INTO institution_project_tasks (id, "projectId", title)
        VALUES (gen_random_uuid()::text, ${input.projectId}, ${input.title})
      `;
    }),

  // Görev tik/tik-kaldır
  toggleTask: permissionProcedure("class:manage")
    .input(z.object({ taskId: z.string(), done: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.$executeRaw`
        UPDATE institution_project_tasks SET done = ${input.done} WHERE id = ${input.taskId}
      `;
    }),

  deleteTask: permissionProcedure("class:manage")
    .input(z.object({ taskId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.$executeRaw`DELETE FROM institution_project_tasks WHERE id = ${input.taskId}`;
    }),
});
