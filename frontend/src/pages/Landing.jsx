import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/landing-bg.png"; // make sure file exists

export default function Landing() {
  const navigate = useNavigate();
  const [role, setRole] = useState("manager"); // "manager" or "admin"
  
  // Manager State
  const [plant, setPlant] = useState("");
  const [managerPassword, setManagerPassword] = useState("");

  // Admin State
  const [adminId, setAdminId] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const handleLogin = () => {
    if (role === "manager") {
      if (!plant.trim() || !managerPassword.trim()) {
        alert("Enter Plant ID and Password");
        return;
      }
      // Mock validation
      if (managerPassword === "password123") {
        localStorage.setItem("userRole", "manager");
        localStorage.setItem("plant", plant);
        navigate("/app/home");
      } else {
        alert("Invalid Password");
      }
    } else {
      if (!adminId.trim() || !adminPassword.trim()) {
        alert("Enter User ID and Password");
        return;
      }
      // Mock validation
      if (adminId === "admin" && adminPassword === "password123") {
        localStorage.setItem("userRole", "admin");
        navigate("/admin/dashboard");
      } else {
        alert("Invalid Credentials");
      }
    }
  };

  return (
    <div
      style={{
        ...styles.container,
        backgroundImage: `url(${bg})`
      }}
    >
      <div style={styles.overlay}>
        <h1 style={styles.title}>
          Smart CarbonTrack
        </h1>

        <p style={styles.subtitle}>
          Optimize Carbon Footprint in Manufacturing
        </p>

        {/* Auth Box */}
        <div style={styles.authContainer}>
          
          {/* Tabs */}
          <div style={styles.tabs}>
            <button
              style={{
                ...styles.tab,
                ...(role === "manager" ? styles.activeTab : {})
              }}
              onClick={() => setRole("manager")}
            >
              Plant Manager
            </button>
            <button
              style={{
                ...styles.tab,
                ...(role === "admin" ? styles.activeTab : {})
              }}
              onClick={() => setRole("admin")}
            >
              Admin
            </button>
          </div>

          <div style={styles.inputBox}>
            {role === "manager" ? (
              <>
                <input
                  type="text"
                  placeholder="Plant ID (e.g., Bhopal)"
                  value={plant}
                  onChange={(e) => setPlant(e.target.value)}
                  style={styles.input}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={managerPassword}
                  onChange={(e) => setManagerPassword(e.target.value)}
                  style={styles.input}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Admin User ID"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  style={styles.input}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  style={styles.input}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
              </>
            )}

            <button
              onClick={handleLogin}
              style={styles.button}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  overlay: {
    background: "", // Kept empty as per original code
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    color: "white",
    padding: "20px"
  },
  title: {
    fontSize: "96px",
    fontWeight: "900",
    letterSpacing: "2px",
    marginBottom: "10px",
    textShadow: "0 4px 20px rgba(0,0,0,0.5)"
  },
  subtitle: {
    fontSize: "30px",
    fontWeight: "600",
    marginBottom: "40px",
    opacity: 0.95,
    textShadow: "0 2px 8px rgba(0,0,0,0.5)"
  },
  authContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    background: "rgba(255,255,255,0.25)",
    backdropFilter: "blur(12px)",
    padding: "20px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    maxWidth: "340px",
    width: "100%"
  },
  tabs: {
    display: "flex",
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "8px",
    background: "rgba(255,255,255,0.2)"
  },
  tab: {
    flex: 1,
    padding: "10px",
    border: "none",
    background: "transparent",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.3s ease"
  },
  activeTab: {
    background: "rgba(255,255,255,0.4)",
    textShadow: "0 1px 2px rgba(0,0,0,0.3)"
  },
  inputBox: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "14px",
    width: "100%",
    boxSizing: "border-box",
    borderRadius: "8px",
    border: "none",
    fontSize: "16px",
    background: "white",
    color: "black",
    outline: "none",
    fontWeight: "500",
    textAlign: "center"
  },
  button: {
    padding: "14px 22px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#1e7f43",
    background: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    animation: "heartbeat 1.6s infinite",
    marginTop: "8px"
  }
};
