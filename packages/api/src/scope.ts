import type { Context } from "./context";

// Giriş yapan kullanıcının teacher kaydının id'si
export async function teacherIdFor(ctx: Context): Promise<string | null> {
  if (!ctx.user) return null;
  const t = await ctx.prisma.teacher.findFirst({
    where: { userId: ctx.user.id }, select: { id: true },
  });
  return t?.id ?? null;
}

// Öğrenci sorguları için rol bazlı WHERE (multi-tenant + sahiplik)
export async function scopedStudentWhere(ctx: Context) {
  const u = ctx.user!;
  const where: any = { organizationId: u.organizationId };
  if (u.role === "PARENT") where.parents = { some: { parent: { userId: u.id } } };
  else if (u.role === "STUDENT") where.userId = u.id;
  else if (u.role === "TEACHER") {
    const tid = await teacherIdFor(ctx);
    where.class = { OR: [{ teacherId: tid }, { assistantTeacherId: tid }] };
  }
  return where;
}

// Sınıf sorguları için rol bazlı WHERE
export async function scopedClassWhere(ctx: Context) {
  const u = ctx.user!;
  const where: any = { organizationId: u.organizationId };
  if (u.role === "TEACHER") {
    const tid = await teacherIdFor(ctx);
    where.OR = [{ teacherId: tid }, { assistantTeacherId: tid }];
  }
  return where;
}
