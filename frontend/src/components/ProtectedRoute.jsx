import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles }) {
  const userRole = localStorage.getItem("userRole");

  if (!userRole) {
    // Not logged in
    return <Navigate to="/" replace />;
  }
 
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Logged in but wrong role. Redirect logically based on role.
    return <Navigate to={userRole === "admin" ? "/admin/dashboard" : "/app/home"} replace />;
  }

  // Render child routes
  return <Outlet />;
}

