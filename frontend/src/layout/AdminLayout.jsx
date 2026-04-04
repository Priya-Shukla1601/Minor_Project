import { Outlet, useLocation, useParams } from "react-router-dom";
import Topbar from "../components/Topbar";

export default function AdminLayout() {
  const location = useLocation();
  const { plantId } = useParams();

  // Determine topbar values
  let pageName = "Dashboard";
  let topbarTitle = "Admin Panel";

  if (location.pathname.includes("plant/") && plantId) {
    pageName = "Plant Detail";
    topbarTitle = plantId;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* NO SIDEBAR */}

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar plant={topbarTitle} page={pageName} />

        <main
          style={{
            flex: 1,
            padding: "40px",
            background:
              "linear-gradient(135deg,#e0f2fe,#ccfbf1,#dcfce7)"
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
