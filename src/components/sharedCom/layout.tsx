import AppSidebar from "./AppSidebar";
import { withAuth } from "./withAuth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1">
          <header className="border-2 border-green-600">
            <SidebarTrigger />
            header
          </header>
          <main>{children}</main>
        </div>
      </SidebarProvider>
    </div>
  );
}

const AdminLayoutWithAuth = withAuth(AdminLayout);
export default AdminLayoutWithAuth;
