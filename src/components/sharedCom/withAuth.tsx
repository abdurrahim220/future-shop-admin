import React from "react";
import { useAppSelector } from "@/app/hooks";
import { Navigate, useLocation } from "react-router";

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
) {
  const Wrapper = (props: P) => {
    const { isAuthenticated, user, isLoading } = useAppSelector(
      (state) => state.auth,
    );
    const location = useLocation();

    if (isLoading) {
      return <div>Loading session...</div>;
    }

    if (!isAuthenticated || user?.role !== "admin") {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <WrappedComponent {...props} />;
  };

  Wrapper.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;
  return Wrapper;
}

const AdminGuardContent = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const AdminAuthGuard = withAuth(AdminGuardContent);

export default AdminAuthGuard;
