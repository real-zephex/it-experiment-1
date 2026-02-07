"use client"

import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import Link from "next/link";
import { Shield } from "lucide-react";

const AdminLink = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  const query = useQuery(
    api.functions.query.getUserStatus,
    user?.id ? { clerkUserId: user.id } : "skip"
  );

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  if (query === undefined || !query.data) {
    return null;
  }

  const isAdmin = query.data.role === "admin";

  if (!isAdmin) {
    return null;
  }

  return (
    <Link href="/admin" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
      <Shield className="h-4 w-4" />
      Admin
    </Link>
  );
};

export default AdminLink;
