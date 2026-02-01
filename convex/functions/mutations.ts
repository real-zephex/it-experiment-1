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

export const updateUserRole = mutation({
  args: { id: v.id("users"), role: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db.get("users", args.id);
    if (user?.role === "admin") {
      throw new Error("Cannot change role of an admin user.");
    }

    await ctx.db.patch("users", args.id, { role: args.role });
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
