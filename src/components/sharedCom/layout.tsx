import AppSidebar from "./AppSidebar";
import { withAuth } from "./withAuth";

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <AppSidebar />
      <div className="">
        <header></header>
        <main>{children}</main>
      </div>
    </div>
  );
}

const AdminLayoutWithAuth = withAuth(AdminLayout);
export default AdminLayoutWithAuth;
