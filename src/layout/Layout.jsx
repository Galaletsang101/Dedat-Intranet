import { Outlet } from "react-router-dom";

import TopNav from "../components/TopNav";
import BottomNav from "../components/BottomNav";
import Footer from "../components/Footer";


function Layout() {
  return (
    <>
      <TopNav />

      <BottomNav />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default Layout;