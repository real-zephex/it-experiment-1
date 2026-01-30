import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const AuthPage = () => {
  return (
    <div className="bg-amber-100/50 w-screen h-screen flex flex-col items-center justify-center">
      <div className="max-w-5xl w-full">
        <Card>
          <CardHeader>
            <CardTitle>Authenticate Yourself !</CardTitle>
            <CardDescription>
              In order to access this page, you need to authenticate yourself.
            </CardDescription>
            <CardAction>
              <AlertCircleIcon />
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-row gap-2">
            <SignedOut>
              <SignInButton>
                <Button variant={"outline"}>Sign In</Button>
              </SignInButton>
              <SignUpButton>
                <Button>Sign Up</Button>
              </SignUpButton>
            </SignedOut>
          </CardContent>
          <CardFooter>
            <p className="text-sm font-mono">IT Experiment - 1</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
