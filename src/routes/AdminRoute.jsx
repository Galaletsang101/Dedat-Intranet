import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser } from "../services/authService";

export default function AdminRoute() {
  const user = getCurrentUser();
  return user?.role?.toLowerCase() === "admin"
    ? <Outlet />
    : <Navigate to="/home" replace />;
}
