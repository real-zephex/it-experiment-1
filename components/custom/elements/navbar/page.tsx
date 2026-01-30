import { GemIcon } from "lucide-react";
import { SignedIn, UserButton } from "@clerk/nextjs";
import RolePreview from "./helpers/role";

const Navbar = async () => {


  return (
    <div className="bg-amber-50 p-4 flex flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-2">
        <GemIcon />
        <h2 className="text-xl font-semibold">IT experiment - 1</h2>
      </div>

      <div className="flex flex-row gap-2">
        <RolePreview />
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Navbar;
