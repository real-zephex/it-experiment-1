import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  clerk_user_id: text("clerk_user_id").notNull(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  transaction_time: text("transaction_time").notNull(),
  transaction_type: text("transaction_type").notNull(),
  affected_table: text("affected_table").notNull(),
  affected_user_id: text("affected_user_id"),
});
