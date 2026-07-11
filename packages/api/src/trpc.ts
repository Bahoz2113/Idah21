import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { can, type Permission } from "@cezeri/auth";
import type { Context } from "./context";

const t = initTRPC.context<Context>().create({ transformer: superjson });

export const router = t.router;
export const publicProcedure = t.procedure;

// Oturum zorunlu
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next({ ctx: { ...ctx, user: ctx.user } });
});

// İzin zorunlu (RBAC). Sahiplik kapsamı resolver içinde orgId ile uygulanır.
export const permissionProcedure = (permission: Permission) =>
  protectedProcedure.use(({ ctx, next }) => {
    if (!can(ctx.user.role, permission))
      throw new TRPCError({ code: "FORBIDDEN", message: `İzin yok: ${permission}` });
    return next();
  });
