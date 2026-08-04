import { Navigate } from "react-router-dom";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./layout/Layout";

import Profile from "./pages/Profile";

// Authentication
import AuthRoutes from "./routes/authRoutes";

import ProtectedRoute from "./routes/ProtectedRoute";

// Main pages
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Home from "./pages/Homepage";
import Calendar from "./pages/Calendar";
import Wellness from "./pages/Wellness";
import NewsCirculus from "./pages/NewsCirculus";
import ProgramsUnits from "./pages/ProgramsUnits";
import StaffDirectory from "./pages/StaffDirectory";
import KnowledgeCenter from "./pages/KnowledgeCenter";
import FAQ from "./pages/FAQ";
import Policies from "./pages/Policies";

function App() {
  return (
  <BrowserRouter basename="/Dedat-Intranet">
      <Routes>
        {/* Authentication Routes */}
        {AuthRoutes()}

        {/* Main Intranet Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          
            <Route path="/home" element={<Home />} />

            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/about" element={<About />} />

            <Route path="/profile" element={<Profile />} />

            <Route path="/wellness" element={<Wellness />} />

            <Route path="/calendar" element={<Calendar />} />

            <Route path="/news-circulus" element={<NewsCirculus />} />

            <Route path="/programs-units" element={<ProgramsUnits />} />

            <Route path="/staff-directory" element={<StaffDirectory />} />

            <Route path="/knowledge-center" element={<KnowledgeCenter />} />

            <Route path="/faq" element={<FAQ />} />

            <Route path="/policies" element={<Policies />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
