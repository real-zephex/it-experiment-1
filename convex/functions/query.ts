import { query } from "../_generated/server";
import { v } from "convex/values";

export const getUserStatus = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    try {
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerk", (q) => q.eq("clerk_user_id", args.clerkUserId))
        .first();

      if (!user) {
        return {
          status: false,
          data: null,
        };
      } else {
        return {
          status: true,
          data: user,
        };
      }
    } catch (error) {
      console.error(
        `Error fetching user with clerkUserId ${args.clerkUserId}:`,
        error,
      );
      return {
        status: false,
        data: null,
      };
    }
  },
});

export const getAllUsers = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users;
  },
});