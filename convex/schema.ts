import { defineSchema, defineTable } from "convex/server";
import { BlogObject, UserObject } from "./types";

export default defineSchema({
  users: defineTable(UserObject).index("by_clerk", ["clerk_user_id"]),
  blogs: defineTable(BlogObject).index("by_author", ["author"]),
});
