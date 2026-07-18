import { useState } from "react";

import AuthLayout from "../layout/AuthLayout";
import AuthCard from "../components/auth/AuthCard";
import AuthInput from "../components/auth/AuthInput";
import AuthButton from "../components/auth/AuthButton";

import { resetPassword } from "../services/authService";
import { validateGovernmentEmail } from "../services/validation";


function ForgotPassword(){

    const [email, setEmail] = useState("");

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");



    async function handleReset(e){

        e.preventDefault();


        setMessage("");

        setError("");



        if(!validateGovernmentEmail(email)){

            setError(
                "Please use your @ncdedat.gov.za email address."
            );

            return;

        }



        try{

            await resetPassword(email);


            setMessage(
                "Password reset email sent. Please check your inbox."
            );


        }
        catch(error){

            setError(
                error.message
            );

        }


    }



    return (

        <AuthLayout>


            <AuthCard>


                <h1>
                    Forgot Password
                </h1>


                <p>
                    Enter your government email to reset your password.
                </p>



                <form onSubmit={handleReset}>


                    <AuthInput

                        label="Government Email"

                        type="email"

                        value={email}

                        onChange={(e)=>setEmail(e.target.value)}

                    />



                    {
                        error &&

                        <p className="error-message">
                            {error}
                        </p>
                    }



                    {
                        message &&

                        <p className="success-message">
                            {message}
                        </p>
                    }



                    <AuthButton
                        text="Send Reset Link"
                    />


                </form>



                <div className="auth-links">

                    <a href="/">
                        Back to Login
                    </a>

                </div>


            </AuthCard>


        </AuthLayout>

    );

}


export default ForgotPassword;