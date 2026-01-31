import { query } from "../_generated/server";
import { v } from "convex/values";

const POST_INTERVAL = 10 * 60 * 1000;

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

export const getLastPostTime = query({
  args: { authorId: v.id("users") },
  handler: async (ctx, args) => {
    try {
      const lastPost = await ctx.db
        .query("blogs")
        .withIndex("by_author", (q) => q.eq("author", args.authorId))
        .collect();
      const requiredPost = lastPost.sort((a, b) => {
        return b._creationTime - a._creationTime;
      })[0];
      if (
        Date.now() - new Date(requiredPost._creationTime).getTime() <
        POST_INTERVAL
      ) {
        return {
          canPost: false,
          nextAllowedPostTime:
            new Date(requiredPost._creationTime).getTime() + POST_INTERVAL,
        };
      } else {
        return {
          canPost: true,
          nextAllowedPostTime: Date.now(),
        };
      }
    } catch (error) {
      console.error(
        `Error fetching last post time for author ${args.authorId}:`,
        error,
      );
      return {
        canPost: true,
        nextAllowedPostTime: Date.now(),
      };
    }
  },
});

export const getAllPostsOfUser = query({
  args: { authorId: v.string() },
  handler: async (ctx, args) => {
    try {
      const posts = await ctx.db
        .query("blogs")
        .withIndex("by_author", (q) => q.eq("author", args.authorId))
        .order("desc")
        .collect();
      return posts;
    } catch (error) {
      console.error(`Error fetching posts for author ${args.authorId}:`, error);
      return [];
    }
  },
});

export const GetAllPosts = query({
  handler: async (ctx) => {
    try {
      const posts = await ctx.db
        .query("blogs")
        .withIndex("by_creation_time")
        .collect();
      return posts;
    } catch (error) {
      console.error(`Error fetching all posts: ${error}`);
      return [];
    }
  },
});
