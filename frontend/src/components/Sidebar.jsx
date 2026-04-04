import { NavLink } from "react-router-dom"; 
import {
  FaHome,
  FaEdit,
  FaChartBar,
  FaChartLine,
  FaFileAlt,
  FaCog
} from "react-icons/fa";
 
const links = [
  { path: "home", label: "Home", icon: <FaHome /> },
  { path: "data-entry", label: "Data Entry", icon: <FaEdit /> },
  { path: "dashboard", label: "Dashboard", icon: <FaChartBar /> },
  { path: "analytics", label: "Analytics", icon: <FaChartLine /> },
  { path: "reports", label: "Reports", icon: <FaFileAlt /> },
  { path: "settings", label: "Settings", icon: <FaCog /> }
];

export default function Sidebar() {
  return (
    <div style={styles.sidebar}>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.logo}>CarbonTrack</h1>
        <p style={styles.subtitle}>Sustainability Portal</p>
      </div>

      {/* Navigation */}
      {links.map(link => (
        <NavLink
          key={link.path}
          to={`/app/${link.path}`}
          style={({ isActive }) => ({
            ...styles.link,
            background: isActive
              ? "rgba(255,255,255,0.25)"
              : "transparent",
            boxShadow: isActive
              ? "0 0 14px rgba(255,255,255,0.35)"
              : "none"
          })}
        >
          <span style={styles.icon}>{link.icon}</span>
          {link.label}
        </NavLink>
      ))}

    </div>
  );
}

const styles = {
  sidebar: {
    width: "260px",
    flexShrink: 0,
    background: "#0f766e",
    color: "white",
    padding: "20px 16px",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    boxSizing: "border-box"
  },

  header: {
    marginBottom: "24px",
    paddingLeft: "8px"
  },

  logo: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "900"
  },

  subtitle: {
    margin: 0,
    marginTop: "4px",
    fontSize: "12px",
    opacity: 0.85
  },

  link: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 14px",
    marginBottom: "6px",
    borderRadius: "10px",
    textDecoration: "none",
    color: "white",
    fontSize: "15px",
    fontWeight: "600",
    transition: "all 0.25s ease",
  },

  icon: {
    fontSize: "16px"
  }
};

/* Hover glow using CSS injection */
const styleSheet = document.createElement("style");
styleSheet.innerText = `
a:hover {
  transform: translateX(4px);
  box-shadow: 0 0 18px rgba(255,255,255,0.45);
  background: rgba(255,255,255,0.18) !important;
}
`;
document.head.appendChild(styleSheet);
