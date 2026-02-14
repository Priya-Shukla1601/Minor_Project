import { useState } from "react";

export default function InputForm({ setDashboard }) {

  const [formData, setFormData] = useState({
    reportingMonth: "",
    gridPower: "",
    renewablePower: "",
    solarPower: "",
    lpg: "",
    furnaceOil: "",
    png: "",
    hsd: "",
    biomass: "",
    production: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {

  e.preventDefault();
  const plant = localStorage.getItem("plant");
  if (!plant) {
  alert("Plant not set.");
  return;
}
  const payload = {

    userId: plant, 
    month: Number(formData.reportingMonth),

    gridPower: Number(formData.gridPower),
    renewablePower: Number(formData.renewablePower),
    solarPower: Number(formData.solarPower),

    lpg: Number(formData.lpg),
    furnaceOil: Number(formData.furnaceOil),
    png: Number(formData.png),
    hsd: Number(formData.hsd),
    biomass: Number(formData.biomass),

    production: Number(formData.production)
  };

  try {

    const response = await fetch(
      "http://localhost:5000/api/carbon/entry",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    const result = await response.json();

    console.log("Dashboard response:", result);

    // send dashboard data to parent
    if (setDashboard)
      setDashboard(result.dashboard);

    alert("Data submitted & KPIs calculated!");

  } catch (error) {

    console.error("Submit error:", error);

    alert("Submission failed");

  }
};

  return (
    <div>

      <h1>Data Entry</h1>

      <form onSubmit={handleSubmit}>

        {/* Reporting Month */}

        <h3>Reporting Month</h3>

        <input
          type="month"
          name="reportingMonth"
          value={formData.reportingMonth}
          onChange={handleChange}
          required
        />

        {/* Power Section */}

        <h3>Power Consumption (kWh)</h3>

        <input
          type="number"
          placeholder="Grid Power"
          name="gridPower"
          value={formData.gridPower}
          onChange={handleChange}
        />

        <input
          type="number"
          placeholder="Renewable Power"
          name="renewablePower"
          value={formData.renewablePower}
          onChange={handleChange}
        />

        <input
          type="number"
          placeholder="Solar Power"
          name="solarPower"
          value={formData.solarPower}
          onChange={handleChange}
        />

        {/* Fuel Section */}

        <h3>Fuel Consumption</h3>

        <input
          type="number"
          placeholder="LPG (kg)"
          name="lpg"
          value={formData.lpg}
          onChange={handleChange}
        />

        <input
          type="number"
          placeholder="Furnace Oil (litre)"
          name="furnaceOil"
          value={formData.furnaceOil}
          onChange={handleChange}
        />

        <input
          type="number"
          placeholder="PNG (SCM)"
          name="png"
          value={formData.png}
          onChange={handleChange}
        />

        <input
          type="number"
          placeholder="HSD (litre)"
          name="hsd"
          value={formData.hsd}
          onChange={handleChange}
        />

        <input
          type="number"
          placeholder="Biomass (MJ)"
          name="biomass"
          value={formData.biomass}
          onChange={handleChange}
        />

        {/* Production */}

        <h3>Production</h3>

        <input
          type="number"
          placeholder="Production Volume (litres)"
          name="production"
          value={formData.production}
          onChange={handleChange}
        />

        {/* Submit */}

        <br /><br />

        <button type="submit">
          Submit Data
        </button>

      </form>

    </div>
  );
}

