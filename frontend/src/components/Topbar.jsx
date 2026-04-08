import { useNavigate } from "react-router-dom";

export default function Topbar({ plant, page }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("plant");
    navigate("/");
  }; 

  return (
    <div
      style={{
        background: "#c7e9ff",
        color: "Teal",
        padding: "14px 24px",
        borderBottom: "1px solid #ddd",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <div>
        <h2 style={{ margin: 0 }}>{plant}</h2>
        <p
          style={{
            margin: 0,
            opacity: 0.7,
            textTransform: "capitalize"
          }}
        >
          {page}
        </p>
      </div>

      <button
        onClick={handleLogout}
        style={{
          background: "#0f766e",
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "bold"
        }} 

        
        
      >
        Logout
      </button>
    </div>
  );
}

