import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";

import AuthLayout from "../layout/AuthLayout";
import AuthCard from "../components/auth/AuthCard";
import AuthButton from "../components/auth/AuthButton";

import { loginUser } from "../services/authService";
import { validateGovernmentEmail } from "../services/validation";


function Login() {

  const navigate = useNavigate();


  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");



  async function handleLogin(e){

    e.preventDefault();


    setError("");



    if(!validateGovernmentEmail(email)){

      setError(
        "Please use your @ncdedat.gov.za email address."
      );

      return;

    }



    try {


      await loginUser(
        email,
        password
      );


      navigate("/home");


    } catch(error){


      setError(
        "Invalid email or password."
      );


    }

  }



  return (

    <AuthLayout>


      <AuthCard>


        <div className="form-header">

          <h1>
            Welcome Back
          </h1>


          <p>
            Sign in to access the DeDAaT Internal Website
          </p>

        </div>



        <form onSubmit={handleLogin}>


          <div className="input-group">

            <label>
              Government Email
            </label>


            <div className="input-icon">


              <FaEnvelope />


              <input

                type="email"

                placeholder="name@ncdedat.gov.za"

                value={email}

                onChange={(e)=>setEmail(e.target.value)}

              />


            </div>


          </div>




          <div className="input-group">

            <label>
              Password
            </label>


            <div className="input-icon">


              <FaLock />


              <input

                type="password"

                placeholder="Enter password"

                value={password}

                onChange={(e)=>setPassword(e.target.value)}

              />


            </div>


          </div>



          {
            error && (

              <p className="error-message">

                {error}

              </p>

            )
          }



          <AuthButton
            text="Login"
          />



        </form>



        <div className="auth-links">


        <Link to="/forgot-password">
  Forgot Password?
</Link>


          <p>

            Don't have an account?

            <Link to="/signup">
  Sign Up
</Link>

          </p>


        </div>



      </AuthCard>


    </AuthLayout>

  );

}


export default Login;