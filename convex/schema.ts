import { defineSchema, defineTable } from "convex/server";
import { UserObject } from "./types";

export default defineSchema({
  users: defineTable(UserObject).index("by_clerk", ["clerk_user_id"]),
});
