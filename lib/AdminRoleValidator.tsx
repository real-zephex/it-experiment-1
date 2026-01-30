"use client"

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { ReactNode } from "react";
import { LockKeyhole } from "lucide-react";

const AdminRoleValidator = ({ children }: { children: ReactNode }) => {
  const { isLoaded, isSignedIn, user } = useUser();

  const query = useQuery(api.functions.query.getUserStatus, { clerkUserId: user?.id ?? "skip" });

  if (!isLoaded || !isSignedIn) return (
    <div className="flex gap-4 items-center justify-center min-h-screen">
      <LockKeyhole className="w-16 h-16 text-gray-400 mb-4" />
      <div>
        <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
        <p className="text-gray-600 mb-6">You need to be logged in to access this page.</p>
      </div>
    </div>
  )

  const isAdmin = query?.data?.role === "admin";

  if (!isAdmin) return (
    <div className="flex gap-4 items-center justify-center min-h-[94dvh]">
      <LockKeyhole className="w-16 h-16 text-gray-400 mb-4" />
      <div className="">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">You do not have the necessary permissions to view this page.</p>
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