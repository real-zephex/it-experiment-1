import { mutation } from "../_generated/server";
import { v } from "convex/values";

import { BlogObject, UserObject } from "../types";

type CreateUserReturnProps = {
  status: boolean;
  id: string | null;
};

export const createUser = mutation({
  args: UserObject,
  handler: async (ctx, args): Promise<CreateUserReturnProps> => {
    try {
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
  args: { id: v.id("users"), status: v.string() },
  handler: async (ctx, args) => {
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
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error("Not authenticated");

      const caller = await ctx.db
        .query("users")
        .withIndex("by_clerk", (q) => q.eq("clerk_user_id", identity.subject))
        .first();

      if (!caller) {
        return {
          message: "Caller user record not found.",
          status: false,
        };
      }

      if (caller.role !== "admin") {
        return {
          message: "Unauthorized: Only admins can update user roles.",
          status: false,
        };
      }

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
    await ctx.db.delete(args.id);
  },
});

export const addPost = mutation({
  args: BlogObject,
  handler: async (ctx, args) => {
    try {
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
  args: { id: v.id("blogs"), status: v.string() },
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
