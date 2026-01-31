"use client"

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { ReactNode } from "react";
import { LockKeyhole } from "lucide-react";

const AdminRoleValidator = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();

  const query = useQuery(api.functions.query.getUserStatus, { clerkUserId: user?.id ?? "skip" });

  const isAdmin = query?.data?.role === "admin";

  if (!isAdmin) return (
    <div className="flex gap-2 items-center justify-center min-h-[94dvh]">
      <LockKeyhole className="w-16 h-16 text-gray-400" />
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-gray-600">You do not have the necessary permissions to view this page.</p>
      </div>
    </div>
  )

  return (
    <>
      {children}
    </>
  )
}

export default AdminRoleValidator;