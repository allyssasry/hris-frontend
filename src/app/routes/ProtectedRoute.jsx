// src/app/routes/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/app/store/authStore";

export default function ProtectedRoute() {
  const token = useAuth((s) => s.token);
  const loading = useAuth((s) => s.loading);

  // Jika sedang loading (fetchMe), jangan pindah2
  if (loading) return <div>Loading...</div>;

  // Jika tidak ada token -> redirect login
  if (!token) return <Navigate to="/auth/sign-in" replace />;

  // Jika ada token -> boleh masuk
  return <Outlet />;
}
