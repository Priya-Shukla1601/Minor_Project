import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/landing-bg.png"; // make sure file exists

export default function Landing() {

  const navigate = useNavigate();
  const [plant, setPlant] = useState("");

  const handleStart = () => {

    if (!plant.trim()) {
      alert("Enter plant name");
      return;
    }

    localStorage.setItem("plant", plant);
    navigate("/app/home");
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

        {/* Glass input box */}

        <div style={styles.inputBox}>

          <input
            type="text"
            placeholder="Enter Plant Name"
            value={plant}
            onChange={(e) => setPlant(e.target.value)}
            style={styles.input}
          />

          <button
            onClick={handleStart}
            style={styles.button}
          >
            Get Started
          </button>

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
  background: `
    linear-gradient(
      rgba(34,139,34,0.35),
      rgba(0,80,0,0.45)
    ),
    rgba(0,0,0,0.35)
  `,
  backdropFilter: "blur(4px)",
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

inputBox: {
  display: "flex",
  gap: "12px",
  padding: "14px",
  borderRadius: "14px",
  background: "rgba(255,255,255,0.25)",
  backdropFilter: "blur(12px)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.35)"
},

input: {
  padding: "14px",
  width: "260px",
  borderRadius: "8px",
  border: "none",
  fontSize: "16px",
  background: "white",
  color: "black",
  outline: "none",
  fontWeight: "500"
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
    animation: "heartbeat 1.6s infinite"
  }
};


