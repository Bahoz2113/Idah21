import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, permissionProcedure } from "../trpc";
import { scopedStudentWhere } from "../scope";

const STATUS = z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]);
const PART = z.enum(["ACTIVE", "PASSIVE", "NONE"]);

export const attendanceRouter = router({
  // Bir dersin yoklama ekranı: sınıf öğrencileri + mevcut kayıtlar
  byLesson: permissionProcedure("attendance:read")
    .input(z.object({ lessonId: z.string() }))
    .query(async ({ ctx, input }) => {
      const lesson = await ctx.prisma.lesson.findFirst({
        where: { id: input.lessonId, class: { organizationId: ctx.user.organizationId } },
        include: { class: true },
      });
      if (!lesson) throw new TRPCError({ code: "NOT_FOUND" });

      const [students, records] = await Promise.all([
        ctx.prisma.student.findMany({ where: { classId: lesson.classId }, orderBy: { fullName: "asc" } }),
        ctx.prisma.attendance.findMany({ where: { lessonId: lesson.id } }),
      ]);
      return { lesson, students, records };
    }),

  // Toplu kaydet (upsert)
  take: permissionProcedure("attendance:write")
    .input(z.object({
      lessonId: z.string(),
      records: z.array(z.object({
        studentId: z.string(),
        status: STATUS,
        participation: PART.default("NONE"),
        homeworkDone: z.boolean().optional(),
      })),
    }))
    .mutation(async ({ ctx, input }) => {
      const lesson = await ctx.prisma.lesson.findFirst({
        where: { id: input.lessonId, class: { organizationId: ctx.user.organizationId } },
        select: { id: true },
      });
      if (!lesson) throw new TRPCError({ code: "NOT_FOUND" });

      await ctx.prisma.$transaction(
        input.records.map((r) =>
          ctx.prisma.attendance.upsert({
            where: { lessonId_studentId: { lessonId: input.lessonId, studentId: r.studentId } },
            update: { status: r.status, participation: r.participation, homeworkDone: r.homeworkDone },
            create: { lessonId: input.lessonId, studentId: r.studentId, status: r.status, participation: r.participation, homeworkDone: r.homeworkDone },
          })
        )
      );
      return { saved: input.records.length };
    }),

  // Veli/öğrenci: öğrencinin tüm yoklama geçmişi
  byStudent: permissionProcedure("attendance:read")
    .input(z.object({ studentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const where = await scopedStudentWhere(ctx);
      const student = await ctx.prisma.student.findFirst({ where: { ...where, id: input.studentId } });
      if (!student) throw new TRPCError({ code: "FORBIDDEN" });
      return ctx.prisma.attendance.findMany({
        where: { studentId: input.studentId },
        include: { lesson: { select: { date: true, topic: true } } },
        orderBy: { lesson: { date: "desc" } },
        take: 100,
      });
    }),
});