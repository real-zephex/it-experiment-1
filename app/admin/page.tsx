import UserTable from "@/components/custom/elements/admin/usersTable/page";

export default function AdminPage() {
  return (
    <div className="container mx-auto">
      <div className="my-4">
        <h2 className="font-semibold text-2xl">
          Admin Dashboard
        </h2>
        <p>Manage users and settings</p>
      </div>
      <UserTable />
    </div>
  );
}