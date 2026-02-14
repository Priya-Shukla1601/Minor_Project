import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Home from "./pages/Home";
import InputForm from "./pages/InputForm";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

import AppLayout from "./layout/AppLayout";

function App() {
  const [dashboardData, setDashboardData] = useState(null);

  return (
    <BrowserRouter>

      <Routes>

        {/* Landing page */}
        <Route path="/" element={<Landing />} />

        {/* Main app layout */}
        <Route path="/app" element={<AppLayout />}>

          <Route path="home" element={<Home />} />
          <Route path="data-entry" element={<InputForm setDashboard={setDashboardData} />} />
          <Route path="dashboard" element={<Dashboard data={dashboardData} />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;


