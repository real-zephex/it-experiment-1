"use server";

import { db } from "..";
import { users } from "../schema";

type UserEntryObject = typeof users.$inferSelect;

type ReadLogsResponse<T> = {
  status: boolean;
  message: string;
  data: T[];
};

export const readLogs = async ({
  limit,
}: {
  limit: number;
}): Promise<ReadLogsResponse<UserEntryObject>> => {
  try {
    const res = await db.select().from(users).limit(limit);
    return {
      status: true,
      message: "Logs fetched successfully",
      data: res,
    };
  } catch (error) {
    console.error(error);
    return {
      status: false,
      message: "Failed to fetch logs",
      data: [],
    };
  }
};
