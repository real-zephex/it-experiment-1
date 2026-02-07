import { v } from "convex/values";

export const UserObject = v.object({
  clerk_user_id: v.string(),
  role: v.union(v.literal("user"), v.literal("admin")),
  email: v.string(),
  status: v.union(v.literal("active"), v.literal("pending")),
  name: v.string(),
});

export const BlogObject = v.object({
  title: v.string(),
  description: v.string(),
  content: v.string(),
  author: v.id("users"),
  hidden: v.boolean(),
  status: v.union(v.literal("halted"), v.literal("public")),
});
