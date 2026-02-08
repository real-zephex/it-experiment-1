"use server";

import { db } from "..";
import { users } from "../schema";

type UserEntryObject = typeof users.$inferInsert;

type InsertLogResponse = {
  status: boolean;
  message: string;
};

export type LogActionParams = {
  clerk_user_id: string;
  email: string;
  name: string;
  transaction_time?: string;
  transaction_type: string;
  affected_table: string;
  affected_user_id?: string;
};

export const logAction = async (
  params: LogActionParams,
): Promise<InsertLogResponse> => {
  const data: UserEntryObject = {
    clerk_user_id: params.clerk_user_id,
    email: params.email,
    name: params.name,
    transaction_time: params.transaction_time ?? new Date().toISOString(),
    transaction_type: params.transaction_type,
    affected_table: params.affected_table,
    affected_user_id: params.affected_user_id ?? null,
  } as unknown as UserEntryObject;

  try {
    const res = await db.insert(users).values(data);
    console.info(`${res.rowsAffected} affected!`);
    return {
      status: true,
      message: "Log created successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      status: false,
      message: "Failed to create log",
    };
  }
};

// Backwards-compatible wrapper for existing callsites that pass a `data` object
export const InsertLog = async ({
  data,
}: {
  data: UserEntryObject;
}): Promise<InsertLogResponse> => {
  return logAction({
    clerk_user_id: data.clerk_user_id,
    email: data.email,
    name: data.name,
    transaction_time: data.transaction_time,
    transaction_type: data.transaction_type,
    affected_table: data.affected_table,
    affected_user_id: data.affected_user_id ?? undefined,
  });
};
