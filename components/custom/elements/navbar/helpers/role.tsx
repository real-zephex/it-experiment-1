"use client"

import { Badge } from "@/components/ui/badge";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

const RolePreview = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  const query = useQuery(
    api.functions.query.getUserStatus,
    user?.id ? { clerkUserId: user.id } : "skip"
  );

  if (!isLoaded || !isSignedIn || !query?.status) {
    return null;
  }

  return (
    <Badge variant="outline" className="capitalize">
      {query.data && query.data.role}
    </Badge>
  );
};

export default RolePreview;
