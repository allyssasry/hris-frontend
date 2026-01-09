// src/app/routes/AppRouter.jsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

import SignUp from "@/features/auth/pages/SignUp.jsx";
import SignIn from "@/features/auth/pages/SignIn.jsx";
import ForgotPassword from "@/features/auth/pages/ForgotPassword";
import CheckEmail from "@/features/auth/pages/CheckEmail";
import ResetPassword from "@/features/auth/pages/ResetPassword";
// import ProfileSettings from "@/features/auth/pages/ProfileSettings.jsx";
// import SettingsPage from "./features/settings/pages/SettingsPage";  
import ProtectedRoute from "@/app/routes/ProtectedRoute.jsx";
import AdminRoute from "@/app/routes/AdminRoute.jsx";

import UserDashboard from "@/features/dashboard/UserDashboard.jsx";
import AdminDashboard from "@/features/admin/AdminDashboard.jsx";
import AdminEmployeeDatabase from "@/features/admin/AdminEmployeeDatabase.jsx";

import UserCheckclockOverview from "@/features/checkclock/UserCheckclockOverview.jsx";
import UserCheckclockPage from "@/features/checkclock/UserCheckclockPage.jsx";
import EmployeeCreatePage from "@/features/admin/EmployeeCreatePage.jsx";
import EmployeeSignIn from "./features/auth/pages/EmployeeSIgnIn";
import CheckclockAdmin from "@/features/admin/checkclock/CheckclockAdmin.jsx";
import AddCheckclockAdmin from "@/features/admin/checkclock/AddCheckclockAdmin.jsx";
import SetupCompanyPage from "@/features/auth/pages/SetupCompanyPage.jsx";

function PageTitle() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let title = "HRIS";

    if (path === "/auth/sign-up") title = "Sign Up | HRIS";
    else if (path === "/auth/sign-in") title = "Sign In | HRIS";
    else if (path.startsWith("/admin")) title = "Admin Dashboard | HRIS";
    else if (path.startsWith("/dashboard")) title = "Dashboard | HRIS";
    else if (path.startsWith("/checkclock")) title = "Checkclock | HRIS";

    document.title = title;
  }, [location.pathname]);

  return null;
}

export default function AppRouter() {
  return (
    <>
      <PageTitle />

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />
        <Route path="/auth/sign-in" element={<SignIn />} />
        <Route path="/auth/sign-up" element={<SignUp />} />
         <Route path="/employee/signin" element={<EmployeeSignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/check-email" element={<CheckEmail />} />
<Route path="/reset-password" element={<ResetPassword />} />
{/* <Route path="/profile/settings" element={<ProfileSettings />} />
<Route path="/settings" element={<SettingsPage />} /> */}

        {/* USER ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/checkclock" element={<UserCheckclockOverview />} />
          <Route path="/checkclock/new" element={<UserCheckclockPage />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/employees" element={<AdminEmployeeDatabase />} />
          <Route path="/admin/employees/new" element={<EmployeeCreatePage />} />
          <Route path="/admin/employees/:id/edit" element={<EmployeeCreatePage />} />

          <Route path="/admin/checkclock" element={<CheckclockAdmin />} />
          <Route path="/admin/checkclock/add" element={<AddCheckclockAdmin />} />
        </Route>

        <Route path="/setup-company" element={<SetupCompanyPage />} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
      </Routes>
    </>
  );
}
