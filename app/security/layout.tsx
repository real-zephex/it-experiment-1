import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security Principles",
  description: "Learn about the security foundations and principles that protect your data in IT Experiment - 1.",
};

export default function SecurityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
