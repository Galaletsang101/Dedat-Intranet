import { Route } from "react-router-dom";

import Login from "../pages/login";
import Signup from "../pages/Signup";
import ForgotPassword from "../pages/ForgotPassword";


function AuthRoutes() {

    return (

        <>
            <Route 
                path="/" 
                element={<Login />} 
            />

            <Route 
                path="/signup" 
                element={<Signup />} 
            />

            <Route 
                path="/forgot-password" 
                element={<ForgotPassword />} 
            />

        </>

    );

}


export default AuthRoutes;