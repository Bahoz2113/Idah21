import { router } from "./trpc";
import { authRouter }               from "./routers/auth";
import { adminUsersRouter }         from "./routers/adminUsers";
import { studentsRouter }           from "./routers/students";
import { classesRouter }            from "./routers/classes";
import { teachersRouter }           from "./routers/teachers";
import { attendanceRouter }         from "./routers/attendance";
import { lessonsRouter }            from "./routers/lessons";
import { materialsRouter }          from "./routers/materials";
import { evaluationsRouter }        from "./routers/evaluations";
import { teacherNotesRouter }       from "./routers/teacherNotes";
import { reportsRouter }            from "./routers/reports";
import { notificationsRouter }      from "./routers/notifications";
import { eventsRouter }             from "./routers/events";
import { aiRouter }                 from "./routers/ai";
import { aiTeacherRouter }          from "./routers/aiTeacher";
import { lookupRouter }             from "./routers/lookup";
import { invitationsRouter }        from "./routers/invitations";
import { institutionProjectsRouter } from "./routers/projects";
import { inventoryRouter }          from "./routers/inventory";
import { meetingsRouter } from "./routers/meetings";
import { curriculumRouter }        from "./routers/curriculum";
import { weeklyMaterialsRouter }    from "./routers/weeklyMaterials";

export const appRouter = router({
  auth:               authRouter,
  adminUsers:         adminUsersRouter,
  students:           studentsRouter,
  classes:            classesRouter,
  teachers:           teachersRouter,
  attendance:         attendanceRouter,
  lessons:            lessonsRouter,
  materials:          materialsRouter,
  evaluations:        evaluationsRouter,
  teacherNotes:       teacherNotesRouter,
  reports:            reportsRouter,
  notifications:      notificationsRouter,
  events:             eventsRouter,
  ai:                 aiRouter,
  aiTeacher:          aiTeacherRouter,
  lookup:             lookupRouter,
  invitations:        invitationsRouter,
  institutionProjects: institutionProjectsRouter,
  inventory:          inventoryRouter,
  weeklyMaterials:    weeklyMaterialsRouter,
  meetings:           meetingsRouter,
  curriculum:         curriculumRouter,
});

export type AppRouter = typeof appRouter;
