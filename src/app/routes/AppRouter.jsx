// // src/app/routes/AppRouter.jsx
// import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
// import { useEffect } from "react";

// import SignUp from "@/features/auth/pages/SignUp.jsx";
// import SignIn from "@/features/auth/pages/SignIn.jsx";
// import ProtectedRoute from "@/app/routes/ProtectedRoute.jsx";
// import UserDashboard from "@/features/dashboard/pages/UserDashboard.jsx";
// import CheckclockOverview from "@/features/checkclock/CheckclockOverview.jsx";
// import CheckclockPage from "@/features/checkclock/CheckclockPage.jsx";

// // Update <title> tiap ganti halaman
// function PageTitle() {
//   const location = useLocation();
//   useEffect(() => {
//     const path = location.pathname;
//     let title = "HRIS";
//     if (path === "/auth/sign-up")      title = "Sign Up | HRIS";
//     else if (path === "/auth/sign-in") title = "Sign In | HRIS";
//     else if (path.startsWith("/dashboard")) title = "Dashboard | HRIS";
//     document.title = title;
//   }, [location.pathname]);
//   return null;
// }

// export default function AppRouter() {
//   return (
//     <BrowserRouter>
//       <PageTitle />
//       <Routes>
//         {/* Default: arahkan ke Sign In */}
//         <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />

//         {/* Public routes */}
//         <Route path="/auth/sign-in" element={<SignIn />} />
//         <Route path="/auth/sign-up" element={<SignUp />} />

//         {/* Protected routes (ProtectedRoute harus merender <Outlet /> di dalamnya) */}
//         <Route element={<ProtectedRoute />}>
//           <Route path="/dashboard" element={<UserDashboard />} />
//           {/* tambah route lain yang butuh login di sini */}
//            <Route path="/checkclock" element={<CheckclockOverview />} />
//         <Route path="/checkclock/new" element={<CheckclockPage />} />
//         <Route path="*" element={<Navigate to="/checkclock" />} />
//         </Route>

//         {/* Fallback */}
//         <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }
