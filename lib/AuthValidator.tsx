"use client";

import { ReactNode, useEffect, useState } from "react";
import AuthPage from "@/components/custom/elements/auth/page";
import { useAuth } from "@clerk/nextjs";
import { WifiOff } from "lucide-react";

const AuthValidation = ({ children }: { children: ReactNode }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const [isOffline, setIsOffline] = useState<boolean>(false);

  useEffect(() => {
    window.addEventListener("offline", () => setIsOffline(true));

    return () => window.addEventListener("online", () => setIsOffline(false));
  }, []);

  if (isOffline) {
    return (
      <main className="w-dvw h-dvh flex flex-row items-center justify-center gap-4">
        <WifiOff />
        <p className="text-sm">
          You need internet in order to access this webpage!
        </p>
      </main>
    );
  } else {
    if (isLoaded && !isSignedIn) {
      return <AuthPage />;
    } else {
      return children;
    }
  }
};

export default AuthValidation;
