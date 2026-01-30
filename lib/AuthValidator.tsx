"use client";

import { ReactNode } from "react";
import AuthPage from "@/components/custom/elements/auth/page";
import { useAuth } from "@clerk/nextjs";

const AuthValidation = ({ children }: { children: ReactNode }) => {
  const { isLoaded, isSignedIn } = useAuth();

  if (isLoaded && !isSignedIn) {
    return <AuthPage />;
  } else {
    return children;
  }
};

export default AuthValidation;
