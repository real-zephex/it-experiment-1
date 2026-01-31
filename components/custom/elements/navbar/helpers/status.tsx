"use client"

import { Badge } from "@/components/ui/badge";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

const UserStatus = () => {
  const { user } = useUser();
  const userRecord = useQuery(api.functions.query.getUserStatus, {
    clerkUserId: user?.id ?? "skip",
  });
  if (userRecord === undefined) {
    return (
      <Badge variant="outline">
        loading...
      </Badge>
    )
  }

  return (
    <Badge>
      {userRecord?.data?.status ?? "unknown"}
    </Badge>
  )
}

export default UserStatus;