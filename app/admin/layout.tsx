import AdminRoleValidator from "@/lib/AdminRoleValidator";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <AdminRoleValidator>
        {children}
      </AdminRoleValidator>
    </div>
  )
}

export default AdminLayout;