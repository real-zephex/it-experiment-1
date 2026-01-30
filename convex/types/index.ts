import { v, Infer } from "convex/values";

export const UserObject = v.object({
  clerk_user_id: v.string(),
  role: v.string(),
  email: v.string(),
  status: v.string(),
});

type UserObjectType = Infer<typeof UserObject>;
