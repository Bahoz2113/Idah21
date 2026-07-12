import type { Role } from "@cezeri/config";
// İzin = "kaynak:eylem". Sahiplik kapsamı (veli sadece kendi çocuğu,
// eğitmen sadece kendi sınıfı) statik matriste DEĞİL — tRPC resolver'larında
// ctx.user.orgId + sahiplik filtresiyle uygulanır.
export type Permission =
  | "org:manage" | "branch:manage" | "user:manage"
  | "student:read" | "student:write" | "student:create" | "student:update" | "student:delete"
  | "teacher:read" | "teacher:write"
  | "class:read" | "class:write" | "class:manage"
  | "curriculum:read" | "curriculum:write"
  | "lesson:read" | "lesson:write" | "lesson:manage"
  | "attendance:read" | "attendance:write"
  | "evaluation:read" | "evaluation:write"
  | "ai:use" | "ai:read"
  | "report:read"
  | "event:read" | "event:write"
  | "certificate:read" | "certificate:write"
  | "badge:read" | "badge:write"
  | "notification:read"
  | "project:read" | "project:write";
const ALL = "*" as const;
export const ROLE_PERMISSIONS: Record<Role, readonly (Permission | typeof ALL)[]> = {
  ADMIN: [ALL],
  TEACHER: [
    "student:read", "student:write", "student:create", "student:update", "teacher:read",
    "class:read", "curriculum:read", "curriculum:write",
    "lesson:read", "lesson:write", "lesson:manage",
    "attendance:read", "attendance:write",
    "evaluation:read", "evaluation:write",
    "ai:use", "ai:read", "report:read",
    "certificate:read", "badge:write", "notification:read",
  ],
  PARENT: [
    "student:read", "lesson:read", "attendance:read",
    "evaluation:read", "report:read", 
    "event:read", "certificate:read", "notification:read",
  ],
  STUDENT: [
    "lesson:read", "ai:use", "ai:read", "report:read",
    "certificate:read", "badge:read", "notification:read",
    "project:read", "project:write",
  ],
};
export function can(role: Role, permission: Permission): boolean {
  const perms = ROLE_PERMISSIONS[role];
  return perms.includes(ALL) || perms.includes(permission);
}