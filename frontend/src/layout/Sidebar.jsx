import { Link } from "react-router-dom";
 
export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>CarbonTrack</h2>

      <nav>
        <Link to="/app/home">Home</Link>
        <Link to="/app/data-entry">Data Entry</Link>
        <Link to="/app/dashboard">Dashboard</Link>
        <Link to="/app/analytics">Analytics</Link>
        <Link to="/app/reports">Reports</Link>
        <Link to="/app/settings">Settings</Link>
      </nav>
    </div>
  );
}
