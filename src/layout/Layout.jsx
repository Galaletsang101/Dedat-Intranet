import { useState } from "react";
import { Outlet } from "react-router-dom";

import TopNav from "../components/TopNav";
import BottomNav from "../components/BottomNav";
import Footer from "../components/Footer";

import "../styles/layout.css";


function Layout() {

  const [menuOpen, setMenuOpen] = useState(false);


  function toggleMenu(){
    setMenuOpen(!menuOpen);
  }


  function closeMenu(){
    setMenuOpen(false);
  }


  return (
    <div className="app-layout">

      <TopNav 
        toggleMenu={toggleMenu}
        menuOpen={menuOpen}
      />

      <BottomNav 
        menuOpen={menuOpen}
        closeMenu={closeMenu}
      />


      <main className="main-content">

        <div className="content-wrapper">
          <Outlet />
        </div>

      </main>


      <Footer />

    </div>
  );

}


export default Layout;