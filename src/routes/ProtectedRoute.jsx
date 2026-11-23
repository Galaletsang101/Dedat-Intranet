import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isLoggedIn } from "../services/authService";


function ProtectedRoute() {

    // useLocation() ties this check to the current route, not just the
    // first render - so a route change always re-evaluates auth state
    // instead of a stale check lingering across navigations.
    const location = useLocation();

    if (!isLoggedIn()) {

        return <Navigate to="/" replace state={{ from: location }} />;

    }


    return <Outlet />;

}


export default ProtectedRoute;