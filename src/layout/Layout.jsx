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
    <>
      <TopNav 
  toggleMenu={toggleMenu}
  menuOpen={menuOpen}
/>


<BottomNav 
  menuOpen={menuOpen}
  closeMenu={closeMenu}
/>

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );

}


export default Layout;