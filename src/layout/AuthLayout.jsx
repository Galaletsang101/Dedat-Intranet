import "../styles/auth.css";

import logo from "../assets/logos/dedat-logo.png";


function AuthLayout({ children }) {

  return (

    <div className="auth-layout">


      <div className="auth-left">

        <div className="branding">

          <img
            src={logo}
            alt="DeDAaT Logo"
            className="auth-logo"
          />


          <h1>
            Internal Website
          </h1>


          <p>
            Northern Cape Department of Economic Development
            and Tourism
          </p>


        </div>


      </div>



      <div className="auth-right">

        {children}

      </div>


    </div>

  );

}


export default AuthLayout;