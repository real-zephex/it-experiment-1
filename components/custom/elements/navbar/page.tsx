import { GemIcon, LayoutDashboard, Globe, Settings, Bell } from "lucide-react";
import { SignedIn, UserButton } from "@clerk/nextjs";
import RolePreview from "./helpers/role";
import UserStatus from "./helpers/status";
import Link from "next/link";

const Navbar = async () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-primary p-1.5 rounded-lg">
              <GemIcon className="h-6 w-6 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-bold tracking-tight hidden sm:block">
              IT Experiment <span className="text-primary">1</span>
            </h2>
          </Link>

          <div className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link href="/" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            {/* <Link href="#" className="flex items-center gap-2 px-4 py-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
              <Globe className="h-4 w-4" />
              Feed
            </Link> */}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 mr-2">
            <UserStatus />
            <RolePreview />
          </div>

          <div className="flex items-center gap-2 border-l pl-4">
            {/* <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Settings className="h-5 w-5" />
            </Button> */}
            <SignedIn>
              {/* <div className="ml-2 ring-2 ring-primary/20 rounded-full p-0.5"> */}
              <UserButton />
              {/* </div> */}
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
