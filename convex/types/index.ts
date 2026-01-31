import { v, Infer } from "convex/values";

export const UserObject = v.object({
  clerk_user_id: v.string(),
  role: v.string(),
  email: v.string(),
  status: v.string(),
  name: v.string(),
});

type UserObjectType = Infer<typeof UserObject>;

export const BlogObject = v.object({
  title: v.string(),
  description: v.string(),
  content: v.string(),
  author: v.id("users"),
  hidden: v.boolean(),
  status: v.string(), // halted, confirmed
});
