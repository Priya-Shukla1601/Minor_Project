import { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const KpiCard = ({ title, value }) => (

  <div style={{
    background: "#f4f6f8",
    padding: "15px",
    borderRadius: "8px",
    textAlign: "center"
  }}>

    <h4>{title}</h4>
    <p style={{ fontSize: "20px", fontWeight: "bold" }}>
      {value ?? "--"}
    </p>

  </div>
);

export default function Dashboard({data}) {
    const plant = localStorage.getItem("plant");
const month = "January"; // later dynamic

const [data, setData] = useState(null);

useEffect(() => {

  fetch(`http://localhost:5000/api/carbon/dashboard/${plant}/${month}`)
    .then(res => res.json())
    .then(setData)
    .catch(console.error);

}, []);

  // Chart state (4 independent charts)
  const [charts, setCharts] = useState([
    { type: "bar", x: "labels", y: "gridPower" },
    { type: "line", x: "labels", y: "solar" },
    { type: "pie", x: "labels", y: "fuel" },
    { type: "area", x: "labels", y: "gridPower" }
  ]);
  const kpis = data?.kpis || {};

  const updateChart = (index, key, value) => {
    const updated = [...charts];
    updated[index][key] = value;
    setCharts(updated);
  };

  const chartFields = ["gridPower", "solar", "fuel"];

  return (
    <div>

      <h1>Dashboard</h1>
      {/* KPI CARDS */}

<div style={{
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "15px",
  margin: "20px 0"
}}>

  <KpiCard title="Total Energy (MJ)" value={kpis.totalEnergyMJ} />
  <KpiCard title="Carbon Footprint (MT)" value={kpis.totalCarbonMT} />
  <KpiCard title="Carbon Intensity" value={kpis.carbonIntensity} />
  <KpiCard title="Renewable %" value={kpis.renewablePercent} />
  <KpiCard title="Green Fuel %" value={kpis.greenFuelPercent} />
  <KpiCard title="Energy Ratio" value={kpis.energyRatio} />

</div>

      {/* Month Selector */}
      <select>
        <option>January</option>
        <option>February</option>
        <option>March</option>
      </select>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

        {charts.map((chart, i) => {

          const series = [{
            name: chart.y,
            data: data[chart.y]
          }];

          const options = {
            chart: { type: chart.type },
            xaxis: { categories: data.labels }
          };

          return (
            <div key={i} className="chart-card">

              <h3>Chart {i + 1}</h3>

              {/* Controls */}

              <select
                value={chart.type}
                onChange={e => updateChart(i, "type", e.target.value)}
              >
                <option value="bar">Bar</option>
                <option value="line">Line</option>
                <option value="area">Area</option>
                <option value="pie">Pie</option>
              </select>

              <select
                value={chart.y}
                onChange={e => updateChart(i, "y", e.target.value)}
              >
                {chartFields.map(field => (
                  <option key={field}>{field}</option>
                ))}
              </select>

              {/* Chart */}

              <Chart
                options={options}
                series={chart.type === "pie"
                  ? data[chart.y]
                  : series}
                type={chart.type}
                height={280}
              />

            </div>
          );
        })}

      </div>

    </div>
  );
}


