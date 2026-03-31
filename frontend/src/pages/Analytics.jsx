import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from "recharts";

export default function AnalyticsPage() {
  const [selectedMonth, setSelectedMonth] = useState("2026-03");
  const [emissionsData, setEmissionsData] = useState([]);
  const [months, setMonths] = useState([]);
  const [energyData, setEnergyData] = useState({});
  const [fuelMix, setFuelMix] = useState([]);

  const plantId = "plant1";

  useEffect(() => {
    fetch(`http://localhost:5000/api/analytics/emissions-trend/${plantId}`)
      .then(res => res.json())
      .then(data => {
        setMonths(data.months);
        setEmissionsData(data.emissions);
      });

    const [year, month] = selectedMonth.split("-");

    fetch(`http://localhost:5000/api/analytics/energy/${plantId}/${month}/${year}`)
      .then(res => res.json())
      .then(setEnergyData);

    fetch(`http://localhost:5000/api/analytics/fuel-mix/${plantId}/${month}/${year}`)
      .then(res => res.json())
      .then(data => setFuelMix(data.fuels));
  }, [selectedMonth]);

  // 📊 Baseline
  const baseline =
    emissionsData.length >= 3
      ? (emissionsData[0] + emissionsData[1] + emissionsData[2]) / 3
      : 0;

  const latest = emissionsData[emissionsData.length - 1] || 0;

  const changePercent =
    baseline !== 0 ? ((latest - baseline) / baseline) * 100 : 0;

  const totalEmissions = emissionsData.reduce((a, b) => a + b, 0);
  const totalEnergy = energyData?.total || 0;

  const lineData = months.map((m, i) => ({
    name: m,
    emissions: emissionsData[i]
  }));

  const barData = [
    { name: "Electricity", value: energyData.electricity || 0 },
    { name: "Fuel", value: energyData.fuel || 0 }
  ];

  const COLORS = ["#14b8a6", "#0ea5e9", "#22c55e", "#f97316"];

  return (
    <div style={{ padding: 20 }}>

      {/* HEADER (UNCHANGED) */}
      <div style={{
        textAlign: "center",
        padding: 30,
        borderRadius: 20,
        background: "linear-gradient(135deg, #e0f2fe, #ccfbf1, #dcfce7)",
        marginBottom: 30
      }}>
        <h1 style={{ color: "#0f766e" }}>Analytics & Insights</h1>
        <p>Explore trends, comparisons, and drivers of energy usage and carbon emissions.</p>
      </div>

      {/* CONTROLS */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 30 }}>
        <MonthSelector selectedMonth={selectedMonth} onChange={setSelectedMonth} />
      </div>

      {/* KPI CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
        <Card title="Total Emissions" value={totalEmissions} />
        <Card title="Total Energy" value={totalEnergy} />
        <Card title="Baseline" value={baseline.toFixed(2)} />
        <Card title="Change %" value={`${changePercent.toFixed(2)}%`} />
      </div>

      {/* LINE CHART */}
      <Section title="Emissions Trend">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="emissions" stroke="#14b8a6" />
          </LineChart>
        </ResponsiveContainer>
      </Section>

      {/* 2 COLUMN */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>

        <Section title="Energy Breakdown">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </Section>

        <Section title="Fuel Mix">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={fuelMix}
                dataKey="value"
                nameKey="type"
                outerRadius={100}
              >
                {fuelMix.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Section>

      </div>

      {/* INSIGHTS */}
      <Section title="Insights">
        {changePercent > 0
          ? "⚠️ Emissions are increasing compared to baseline"
          : "✅ Emissions reduced compared to baseline"}
      </Section>

    </div>
  );
}

// 🔹 Reusable Components

function Card({ title, value }) {
  return (
    <div style={{
      background: "#fff",
      padding: 20,
      borderRadius: 15,
      boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
    }}>
      <h4 style={{ color: "#0f766e" }}>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{
      background: "#fff",
      padding: 25,
      borderRadius: 15,
      marginTop: 30
    }}>
      <h3 style={{ color: "#0f766e" }}>{title}</h3>
      {children}
    </div>
  );
}

function MonthSelector({ selectedMonth, onChange }) {
  return (
    <input
      type="month"
      value={selectedMonth}
      onChange={(e) => onChange(e.target.value)}
      style={{ padding: 10, borderRadius: 10 }}
    />
  );
}