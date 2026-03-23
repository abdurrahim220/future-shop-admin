import AppSidebar from "./AppSidebar";
import { withAuth } from "./withAuth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "./mode-toggle";
import { useLocation, Outlet } from "react-router";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logout } from "@/features/auth/authSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";

function AdminLayout({ children }: { children?: React.ReactNode }) {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const formatPathname = (pathname: string) => {
    if (pathname === "/" || pathname === "/dashboard") return "Dashboard";
    const path = pathname.replace("/", "");
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background px-6 shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="h-6 w-px bg-border hidden sm:block" />
              <h1 className="text-xl font-semibold tracking-tight capitalize">
                {formatPathname(location.pathname)}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <ModeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.role === "admin" ? "Admin User" : "User"}
                      </p>
                      {user?.id && (
                        <p className="text-xs leading-none text-muted-foreground mt-1">
                          ID: {user.id}
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600 focus:bg-red-100 dark:focus:bg-red-950/50 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6 bg-muted/20">
            {children || <Outlet />}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}

const AdminLayoutWithAuth = withAuth(AdminLayout);
export default AdminLayoutWithAuth;
