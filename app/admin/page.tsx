import ManageBlogs from "@/components/custom/elements/admin/blogsTable/page";
import UserTable from "@/components/custom/elements/admin/usersTable/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Management portal for users and blog posts.",
};

export default function AdminPage() {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col gap-4">
        <UserTable />
        <ManageBlogs />
      </div>
    </div>
  );
}