import { useState } from "react";

export default function Settings() {

  const [settings, setSettings] = useState({
    plantName: localStorage.getItem("plant") || "",
    theme: "light",
    notifications: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSave = () => {

    // Example persistence
    localStorage.setItem("plant", settings.plantName);

    alert("Settings saved!");
  };

  const handleReset = () => {
    setSettings({
      plantName: "",
      theme: "light",
      notifications: true
    });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>

      <h1>Settings</h1>

      {/* Plant Info */}

      <h3>Plant Configuration</h3>

      <input
        type="text"
        name="plantName"
        placeholder="Plant Name / ID"
        value={settings.plantName}
        onChange={handleChange}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      {/* Preferences */}

      <h3>Preferences</h3>

      <label>
        Theme:
        <select
          name="theme"
          value={settings.theme}
          onChange={handleChange}
          style={{ marginLeft: "10px" }}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>

      <br /><br />

      <label>
        <input
          type="checkbox"
          name="notifications"
          checked={settings.notifications}
          onChange={handleChange}
        />
        Enable notifications
      </label>

      {/* Actions */}

      <br /><br />

      <button onClick={handleSave}>
        Save Settings
      </button>

      <button
        onClick={handleReset}
        style={{ marginLeft: "10px" }}
      >
        Reset
      </button>

    </div>
  );
}
