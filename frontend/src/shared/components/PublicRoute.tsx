import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/shared/hooks/store/useAuthStore";

export function PublicRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
