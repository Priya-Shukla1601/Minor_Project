import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function AppLayout() {
  const plant = localStorage.getItem("plant") || "Not Selected";
  const location = useLocation();

  const pageName =
    location.pathname.split("/").pop() || "home";

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Topbar plant={plant} page={pageName} />

        <main
          style={{
            flex: 1,
            padding: "40px",
            background: "linear-gradient(135deg,#e6f6ff,#e0fff3,#dff6ff)",
            overflowY: "auto"
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}


