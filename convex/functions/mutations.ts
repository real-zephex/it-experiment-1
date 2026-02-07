import { mutation, MutationCtx } from "../_generated/server";
import { v } from "convex/values";

import { BlogObject, UserObject } from "../types";

type CreateUserReturnProps = {
  status: boolean;
  id: string | null;
};

// Authorization helper functions
async function getCaller(ctx: MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  return await ctx.db
    .query("users")
    .withIndex("by_clerk", (q) => q.eq("clerk_user_id", identity.subject))
    .first();
}

async function requireAuth(ctx: MutationCtx) {
  const caller = await getCaller(ctx);
  if (!caller) {
    throw new Error("Unauthorized: Authentication required");
  }
  return caller;
}

async function requireAdmin(ctx: MutationCtx) {
  const caller = await getCaller(ctx);
  if (!caller) {
    throw new Error("Unauthorized: Authentication required");
  }
  if (caller.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }
  return caller;
}

export const createUser = mutation({
  args: UserObject,
  handler: async (ctx, args): Promise<CreateUserReturnProps> => {
    try {
      // Only admins can create users directly (webhook can bypass via system token)
      await requireAdmin(ctx);

      const id = await ctx.db.insert("users", args);
      return {
        status: true,
        id,
      };
    } catch (error) {
      console.error(`Error while adding user: ${error} `);
      return {
        status: false,
        id: null,
      };
    }
  },
});

export const updateUserStatus = mutation({
  args: {
    id: v.id("users"),
    status: v.union(v.literal("active"), v.literal("pending")),
  },
  handler: async (ctx, args) => {
    // Only admins can change user status
    await requireAdmin(ctx);

    await ctx.db.patch("users", args.id, { status: args.status });
  },
});

type UpdateUserRoleReturnProps = {
  message: string;
  status: boolean;
};
export const updateUserRole = mutation({
  args: {
    id: v.id("users"),
    role: v.union(v.literal("user"), v.literal("admin")),
  },
  handler: async (ctx, args): Promise<UpdateUserRoleReturnProps> => {
    try {
      // Only admins can update user roles
      await requireAdmin(ctx);

      const user = await ctx.db.get("users", args.id);
      if (user?.role === "admin") {
        throw new Error("Cannot change role of an admin user.");
      }

      await ctx.db.patch("users", args.id, { role: args.role });
      return {
        message: "User role updated successfully.",
        status: true,
      };
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error(`Error while updating user role: ${error}`);
      return {
        message: errorMessage,
        status: false,
      };
    }
  },
});

export const deleteUser = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    // Only admins can delete users
    await requireAdmin(ctx);

    await ctx.db.delete(args.id);
  },
});

export const addPost = mutation({
  args: BlogObject,
  handler: async (ctx, args) => {
    try {
      // Require authentication and active account status
      const caller = await requireAuth(ctx);

      if (caller.status !== "active") {
        return {
          status: false,
          id: null,
        };
      }

      const id = await ctx.db.insert("blogs", args);
      return {
        status: true,
        id,
      };
    } catch (error) {
      console.error(`Error while adding blog post: ${error} `);
      return {
        status: false,
        id: null,
      };
    }
  },
});

export const updatePostStatus = mutation({
  args: {
    id: v.id("blogs"),
    status: v.union(v.literal("halted"), v.literal("public")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch("blogs", args.id, { status: args.status });
  },
});

export const deletePost = mutation({
  args: { id: v.id("blogs") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const togglePostVisibility = mutation({
  args: { id: v.id("blogs"), hidden: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch("blogs", args.id, { hidden: args.hidden });
  },
});
