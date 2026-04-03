import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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

        {/* Landing */}
        <Route path="/" element={<Landing />} />

        {/* Main Dashboard Routes */}
        <Route path="/app" element={<AppLayout />}>

          {/* default route */}
          <Route index element={<Navigate to="home" />} />

          <Route path="home" element={<Home />} />

          <Route
            path="data-entry"
            element={<InputForm setDashboardData={setDashboardData} />}
          />

          <Route
            path="dashboard"
            element={<Dashboard data={dashboardData} />}
          />

          <Route path="analytics" element={<Analytics />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />

        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/"/>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;


