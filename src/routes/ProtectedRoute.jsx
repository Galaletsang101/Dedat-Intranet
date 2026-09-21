import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn } from "../services/authService";


function ProtectedRoute() {

    if (!isLoggedIn()) {

        return <Navigate to="/" replace />;

    }


    return <Outlet />;

}


export default ProtectedRoute;