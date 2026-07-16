import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./layout/Layout";

import Profile from "./pages/Profile";

// Authentication
import AuthRoutes from "./routes/authRoutes";

import ProtectedRoute from "./routes/ProtectedRoute";

// Main pages
import Dashboard from "./pages/dashboard";
import About from "./pages/about";
import Home from "./pages/home";
import Calendar from "./pages/Calendar";
import NewsCirculus from "./pages/NewsCirculus";
import ProgramsUnits from "./pages/ProgramsUnits";
import StaffDirectory from "./pages/StaffDirectory";
import KnowledgeCenter from "./pages/KnowledgeCenter";


function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Authentication Routes */}
        {AuthRoutes()}


        {/* Main Intranet Routes */}
   <Route element={<ProtectedRoute />}>

    <Route element={<Layout />}>

 <Route 
            path="/home" 
            element={<Home />} 
          />


          <Route 
            path="/dashboard" 
            element={<Dashboard />} 
          />

         

          <Route 
            path="/about" 
            element={<About />} 
          />

          <Route 
    path="/profile" 
    element={<Profile />} 
/>

          <Route 
            path="/calendar" 
            element={<Calendar />} 
          />

          <Route 
            path="/news-circulus" 
            element={<NewsCirculus />} 
          />

          <Route 
            path="/programs-units" 
            element={<ProgramsUnits />} 
          />

          <Route 
            path="/staff-directory" 
            element={<StaffDirectory />} 
          />

          <Route 
            path="/knowledge-center" 
            element={<KnowledgeCenter />} />

        </Route>

      </Route>

      </Routes>

    </BrowserRouter>

  );

}


export default App;