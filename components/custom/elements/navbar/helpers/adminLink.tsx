"use client";

import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminLink = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const pathname = usePathname();

  const query = useQuery(
    api.functions.query.getUserStatus,
    user?.id ? { clerkUserId: user.id } : "skip",
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

  const isActive = pathname.startsWith("/admin");

  return (
    <Link
      href="/admin"
      className={cn(
        "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
        "hover:bg-accent/70 hover:text-foreground",
        isActive && "bg-accent/70 text-foreground shadow-sm",
      )}
    >
      <Shield className="h-4 w-4" />
      Admin
    </Link>
  );
};

export default AdminLink;
