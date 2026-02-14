import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {

  const [plant, setPlant] = useState("");
  const navigate = useNavigate();

  const handleEnter = () => {

    if (!plant) {
      alert("Enter plant name");
      return;
    }

    // store plant globally
    localStorage.setItem("plant", plant);

    navigate("/app/dashboard");
  };

  return (

    <div>

      <h1>Smart CarbonTrack</h1>

      <input
        placeholder="Enter Plant Name"
        value={plant}
        onChange={(e) => setPlant(e.target.value)}
      />

      <button onClick={handleEnter}>
        Enter Dashboard
      </button>

    </div>
  );
}
