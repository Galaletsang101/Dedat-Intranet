import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../layout/AuthLayout";
import AuthCard from "../components/auth/AuthCard";
import AuthButton from "../components/auth/AuthButton";
import AuthInput from "../components/auth/AuthInput";

import { registerUser } from "../services/authService";
import { validateGovernmentEmail } from "../services/validation";


function Signup(){

  const navigate = useNavigate();


  const [formData, setFormData] = useState({

    firstName:"",
    surname:"",
    employeeNumber:"",
    programme:"",
    position:"",
    email:"",
    password:"",
    confirmPassword:""

  });


  const [error,setError] = useState("");



  function handleChange(e){

    setFormData({

      ...formData,

      [e.target.name]: e.target.value

    });

  }



  async function handleSignup(e){

    e.preventDefault();


    setError("");



    if(!validateGovernmentEmail(formData.email)){

      setError(
        "Please use your @ncdedat.gov.za email address."
      );

      return;

    }



    if(formData.password !== formData.confirmPassword){

      setError(
        "Passwords do not match."
      );

      return;

    }



    try{


      await registerUser(

        formData.email,

        formData.password,

        {

          firstName: formData.firstName,

          surname: formData.surname,

          employeeNumber: formData.employeeNumber,

          programme: formData.programme,

          position: formData.position

        }

      );


      navigate("/");



    }catch(error){


      console.log(error);

      setError(error.message);


    }


  }




  return (

    <AuthLayout>


      <AuthCard>


        <div className="form-header">

          <h1>
            Create Account
          </h1>


          <p>
            Register your DeDAaT account
          </p>

        </div>



        <form onSubmit={handleSignup}>


          <AuthInput
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />


          <AuthInput
            label="Surname"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
          />


          <AuthInput
            label="Employee Number"
            name="employeeNumber"
            value={formData.employeeNumber}
            onChange={handleChange}
          />


          <AuthInput
            label="Programme"
            name="programme"
            value={formData.programme}
            onChange={handleChange}
          />


          <AuthInput
            label="Position"
            name="position"
            value={formData.position}
            onChange={handleChange}
          />


          <AuthInput
            label="Government Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />


          <AuthInput
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />


          <AuthInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />



          {
            error && (

              <p className="error-message">
                {error}
              </p>

            )
          }



          <AuthButton
            text="Create Account"
          />


        </form>



        <div className="auth-links">

          <p>

            Already have an account?

            <a href="/">
              Login
            </a>

          </p>


        </div>


      </AuthCard>


    </AuthLayout>

  );


}


export default Signup;