import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./layout/Layout";

import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import About from "./pages/about";
import Home from "./pages/Homepage";
import Calendar from "./pages/Calendar";  
import NewsCirculus from "./pages/NewsCirculus";
import ProgramsUnits from "./pages/ProgramsUnits";
import StaffDirectory from "./pages/StaffDirectory";
import KnowledgeCenter from "./pages/KnowledgeCenter";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route element={<Layout />}>

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/home" element={<Home />} />

          <Route path="/about" element={<About />} />

          <Route path="/calendar" element={<Calendar />} />

          <Route path="/news-circulus" element={<NewsCirculus />} />

          <Route path="/programs-units" element={<ProgramsUnits />} />

          <Route path="/staff-directory" element={<StaffDirectory />} />

          <Route path="/knowledge-center" element={<KnowledgeCenter />} />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;