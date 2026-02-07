import { GemIcon } from "lucide-react";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import RolePreview from "./helpers/role";
import UserStatus from "./helpers/status";
import AdminLink from "./helpers/adminLink";
import Link from "next/link";
import NavLinks from "./helpers/navLinks";

const Navbar = async () => {
  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full border-b",
        "bg-background/80 backdrop-blur-xl",
        "supports-backdrop-filter:bg-background/60",
      )}
    >
      <div className="absolute inset-0 bg-editorial-glow opacity-80" />
      <div className="container mx-auto px-4 flex h-16 items-center justify-between relative">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-85 transition-opacity"
          >
            <div className="bg-primary/90 p-2 rounded-xl shadow-sm">
              <GemIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-lg font-semibold tracking-tight font-display">
                IT Experiment <span className="text-primary">1</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Editorial Lab
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-1">
            <NavLinks />
            <AdminLink />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 mr-2 text-xs text-muted-foreground">
            <UserStatus />
            <RolePreview />
          </div>

          <div className="flex items-center gap-2 border-l border-border/60 pl-4">
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
