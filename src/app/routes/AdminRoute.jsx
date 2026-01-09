// src/app/routes/AdminRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/app/store/authStore";

export default function AdminRoute() {
  const user = useAuth((s) => s.user);

  if (!user) return <Navigate to="/auth/sign-in" replace />;

  // CHECK ADMIN BENAR DI SINI
  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
