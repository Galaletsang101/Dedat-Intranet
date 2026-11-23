import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isLoggedIn, isAdmin } from "../services/authService";

// UI-level gate only - every admin API endpoint re-checks the role itself,
// so this just keeps non-admins from seeing admin screens they can't use.
function AdminRoute() {
  // useLocation() ties this check to the current route so it always
  // re-evaluates on navigation rather than reusing a stale render.
  useLocation();

  if (!isLoggedIn()) {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin()) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;
