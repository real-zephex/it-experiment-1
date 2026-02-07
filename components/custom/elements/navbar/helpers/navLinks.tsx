"use client";

import { cn } from "@/lib/utils";
import { LayoutDashboard, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    href: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/security",
    label: "Security",
    icon: ShieldCheck,
  },
];

const NavLinks = () => {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex items-center gap-1 text-sm font-medium">
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 transition-all",
              "hover:bg-accent/70 hover:text-foreground",
              isActive && "bg-accent/70 text-foreground shadow-sm",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
};

export default NavLinks;
