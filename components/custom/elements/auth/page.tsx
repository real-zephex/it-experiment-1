import {
  SignInButton,
  SignUpButton,
  SignedOut,
} from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldCheck, ArrowRight, GemIcon, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const AuthPage = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-black p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="max-w-md w-full relative">
        <div className="flex justify-center mb-8">
          <div className="bg-primary p-3 rounded-2xl shadow-lg shadow-primary/20 animate-in fade-in zoom-in duration-500">
            <GemIcon className="h-10 w-10 text-primary-foreground" />
          </div>
        </div>

        <Card className="border-none shadow-2xl bg-white/80 dark:bg-black/40 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
                <ShieldCheck className="h-3 w-3" />
                Secure Access
              </div>
            </div>
            <CardTitle className="text-3xl font-extrabold tracking-tight">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Please authenticate to access your personal dashboard and global feed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Secure encryption for all data</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Instant access to global community</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button size="lg" className="w-full group shadow-lg shadow-primary/20">
                    Sign In to Continue
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button variant="outline" size="lg" className="w-full bg-transparent hover:bg-black/5 dark:hover:bg-white/5">
                    Create New Account
                  </Button>
                </SignUpButton>
              </SignedOut>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t bg-black/[0.02] dark:bg-white/[0.02] pt-6 rounded-b-xl">
            <div className="flex justify-between items-center w-full text-xs text-muted-foreground font-medium uppercase tracking-widest">
              <span>IT Experiment 1</span>
              <span>v1.0.4</span>
            </div>
          </CardFooter>
        </Card>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          By signing in, you agree to our <span className="underline underline-offset-4 hover:text-primary cursor-pointer">Terms of Service</span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
