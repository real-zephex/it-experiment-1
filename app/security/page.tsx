"use client";

import React from "react";
// ... (rest of imports)

// Since this is a "use client" file, we should export metadata from a separate layout or use a different approach.
// But for now, I'll just keep it simple.
import {
  ShieldCheck,
  ShieldAlert,
  Layers,
  Lock,
  GlobeLock,
  LogIn,
  TextCursorInput,
  EyeOff,
  UserCheck,
  Key,
  Shield,
  Zap,
  Timer,
  History,
  Activity,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const principles = [
  {
    title: "Access Control",
    description: "Restricting resource access to authorized users only.",
    icon: ShieldCheck,
    userValue: "Ensures that your personal data and posts are only accessible by you or authorized administrators.",
    techDetail: "Utilizes Clerk JWT session tokens for stateless authentication. Every request is intercepted by Next.js Middleware to verify the session before reaching the page or API.",
    techStack: ["Clerk", "Next.js Middleware"],
    implementation: "Clerk Auth + Middleware",
  },
  {
    title: "Least Privilege",
    description: "Providing the minimum level of access required for a task.",
    icon: ShieldAlert,
    userValue: "Standard users cannot access system settings or other users' private drafts, reducing the impact of potential account compromises.",
    techDetail: "Implements tiered authorization levels (User/Admin). Database access is restricted at the query level based on the authenticated user's assigned role.",
    techStack: ["Convex", "TypeScript"],
    implementation: "Role-based Logic",
  },
  {
    title: "Anti-Spam Rate Limiting",
    description: "Enforcing cooldowns to prevent automated abuse.",
    icon: Timer,
    userValue: "Protects the community feed from being flooded by bots or automated scripts.",
    techDetail: "Uses a 10-minute 'POST_INTERVAL' cooldown. The backend queries the last post timestamp for the author before allowing new entries to be inserted.",
    techStack: ["Convex", "Server-side Logic"],
    implementation: "10m Cooldown",
  },
  {
    title: "User Verification",
    description: "Tiered account status for enhanced trust.",
    icon: UserCheck,
    userValue: "New accounts start in a 'pending' state, requiring a manual or automated check before they can publish to the global feed.",
    techDetail: "Status-based gating (Pending/Active) is enforced in both the UI and the 'addPost' mutation logic to ensure content quality.",
    techStack: ["Convex Schema", "React"],
    implementation: "Status Gating",
  },
  {
    title: "Fail Secure",
    description: "Defaulting to access denied on system failure.",
    icon: Lock,
    userValue: "If the authentication system goes down or errors, the app automatically locks down instead of accidentally granting access.",
    techDetail: "Uses 'skip' patterns in Convex queries and catch-all auth guards that return false if identity cannot be definitively proven.",
    techStack: ["Convex", "Auth Guards"],
    implementation: "Auth Guards",
  },
  {
    title: "Input Validation",
    description: "Sanitizing and verifying all user-provided data.",
    icon: TextCursorInput,
    userValue: "Prevents malicious code or broken data from entering the system, keeping the interface stable for everyone.",
    techDetail: "Employs Zod for client-side schema enforcement and Convex's strict 'v' validation for server-side type safety and sanitization.",
    techStack: ["Zod", "Convex Values"],
    implementation: "Zod + Convex Schema",
  },
  {
    title: "Audit Trail",
    description: "Cryptographic logging of all system actions.",
    icon: History,
    userValue: "Provides full transparency on who created or modified content, ensuring accountability across the platform.",
    techDetail: "Leverages Convex's immutable '_creationTime' and mandatory 'author' ID indexing for every record, creating a permanent audit log.",
    techStack: ["Convex Indexing"],
    implementation: "Immutable Logs",
  },
  {
    title: "Data Masking",
    description: "Protecting sensitive identifiers in the UI.",
    icon: EyeOff,
    userValue: "Your internal system IDs and technical identifiers are hidden or masked to prevent tracking by third-party scrapers.",
    techDetail: "Implements UI-level truncation (e.g., Clerk ID slicing) and selective field projection in queries to avoid over-fetching PII.",
    techStack: ["React", "Data Projection"],
    implementation: "ID Truncation",
  },
  {
    title: "Emergency Moderation",
    description: "Real-time content and account control.",
    icon: Zap,
    userValue: "Administrators can instantly hide problematic content or halt post visibility without deleting data permanently.",
    techDetail: "Uses reactive 'patch' operations in Convex to toggle 'hidden' or 'status' flags, which propagate to all clients instantly via websockets.",
    techStack: ["Convex Mutations", "Websockets"],
    implementation: "Reactive Toggles",
  },
];

export default function SecurityPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <div className="flex flex-col items-center mb-16 text-center">
        <div className="bg-primary/10 p-4 rounded-3xl mb-6 animate-pulse">
          <Shield className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-5xl font-black tracking-tighter mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Security Foundation
        </h1>
        <p className="text-muted-foreground max-w-2xl text-xl leading-relaxed">
          We combine industry-standard protocols with custom-built defense layers to ensure your digital footprint remains secure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {principles.map((principle, index) => (
          <Dialog key={index}>
            <DialogTrigger asChild>
              <Card className="hover:border-primary transition-all duration-300 cursor-pointer group hover:shadow-2xl border-2 bg-card/50 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                   <Activity className="h-4 w-4 text-primary" />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 rounded-xl bg-accent group-hover:bg-primary/10 transition-all group-hover:scale-110">
                      <principle.icon className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">{principle.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base font-medium leading-snug">
                    {principle.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {principle.techStack.slice(0, 2).map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-[10px] uppercase font-black tracking-widest bg-primary/5">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden border-none shadow-2xl">
              <DialogTitle className="sr-only">{principle.title}</DialogTitle>
              <div className="bg-primary/5 p-8 border-b border-primary/10">
                <div className="flex items-center gap-6">
                  <div className="p-4 rounded-2xl bg-background shadow-sm">
                    <principle.icon className="h-10 w-10 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tight">{principle.title}</h2>
                    <div className="flex gap-2">
                      {principle.techStack.map((tech) => (
                        <Badge key={tech} variant="outline" className="bg-primary/5 border-primary/20 text-[10px] font-bold">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <ScrollArea className="max-h-[60vh]">
                <div className="p-8 space-y-8">
                  <section className="space-y-3">
                    <h3 className="text-xs uppercase font-black tracking-[0.2em] text-primary/70 flex items-center gap-2">
                      <span className="h-1 w-4 bg-primary rounded-full" />
                      User Benefit
                    </h3>
                    <p className="text-xl text-foreground font-medium leading-relaxed">
                      {principle.userValue}
                    </p>
                  </section>

                  <Separator className="opacity-50" />

                  <section className="space-y-3">
                    <h3 className="text-xs uppercase font-black tracking-[0.2em] text-primary/70 flex items-center gap-2">
                      <span className="h-1 w-4 bg-primary rounded-full" />
                      Technical Implementation
                    </h3>
                    <div className="bg-muted/50 p-6 rounded-2xl border border-muted-foreground/10">
                      <p className="text-base text-muted-foreground leading-relaxed font-mono">
                        {principle.techDetail}
                      </p>
                    </div>
                  </section>
                </div>
              </ScrollArea>
              
              <div className="p-6 bg-muted/30 border-t flex justify-between items-center">
                 <p className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                   <ShieldCheck className="h-3 w-3 text-primary" /> Verified Protection Layer
                 </p>
                 <Badge variant="outline" className="text-[10px] font-bold tracking-tighter uppercase">
                   {principle.implementation}
                 </Badge>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>

      <div className="mt-24 p-12 rounded-[3rem] bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 h-64 w-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
           <div className="space-y-4 text-center md:text-left">
              <h2 className="text-3xl font-black tracking-tight">Standard Compliance</h2>
              <p className="text-muted-foreground text-lg max-w-md">
                Our infrastructure adheres to modern security standards including 
                <span className="text-foreground font-bold"> TLS 1.3</span>, 
                <span className="text-foreground font-bold"> SOC2 Type II </span> (via Clerk), and 
                <span className="text-foreground font-bold"> AES-256 </span> encryption at rest.
              </p>
           </div>
           <div className="grid grid-cols-2 gap-4">
              {["Secure Sessions", "Encrypted Data", "Auto-Auditing", "Schema Safety"].map((item) => (
                <div key={item} className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-background border shadow-sm">
                   <div className="h-2 w-2 rounded-full bg-primary" />
                   <span className="text-sm font-bold uppercase tracking-tighter">{item}</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
