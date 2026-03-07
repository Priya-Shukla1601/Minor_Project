import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";


export default function AnalyticsPage() {

  const [selectedMonth, setSelectedMonth] = useState("2026-01");
  const [comparisonType, setComparisonType] = useState("mom");

  return (
    <div
      style={{
        padding: 40,
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #e0f2fe, #ccfbf1, #dcfce7)"
      }}
    >

      {/* ===== HEADER ===== */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h1
          style={{
            fontSize: "55px",
            fontWeight: "800",
            color: "#0f766e",
            marginBottom: 10
          }}
        >
          Analytics & Insights
        </h1>

        <p
          style={{
            fontSize: "20px",
            color: "#14b8a6",
            fontWeight: "500",
            maxWidth: "750px",
            margin: "0 auto"
          }}
        >
          Explore trends, comparisons, and drivers of energy usage and carbon emissions.
        </p>
      </div>

      {/* ===== CONTROLS PANEL ===== */}
      <div
        style={{
          display: "flex",
          gap: 40,
          marginBottom: 40,
          flexWrap: "wrap",
          background: "#ffffff",
          padding: 25,
          borderRadius: 16,
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          justifyContent: "center",
          alignItems: "center"
        }}
      >

        <Control label="Comparison">
          <select
            value={comparisonType}
            onChange={e => setComparisonType(e.target.value)}
            style={{
              marginTop: 8,
              padding: "10px 16px",
              borderRadius: 10,
              border: "2px solid #14b8a6",
              backgroundColor: "#ffffff",
              color: "#0f766e",
              fontWeight: "600",
              fontSize: "15px",
              cursor: "pointer",
              outline: "none"
            }}
          >
            <option value="mom">Month-over-Month</option>
            <option value="yoy">Year-over-Year</option>
            <option value="qoq">Quarter-over-Quarter</option>
          </select>
        </Control>

        <MonthSelector
          selectedMonth={selectedMonth}
          onChange={setSelectedMonth}
        />

      </div>

      {/* ===== SECTIONS ===== */}

      <Section title="📈 Emissions Trend Analysis">
        <p>Trend charts will appear here.</p>
      </Section>

      <Section title="⚡ Energy Consumption Analysis">
        <p>Energy consumption analysis will appear here.</p>
      </Section>

      <Section title="🛢️ Fuel Mix & Green Fuel Analysis">
        <p>Fuel mix insights will appear here.</p>
      </Section>

      <Section title="🌍 Carbon Intensity Analysis">
        <p>Carbon intensity metrics will appear here.</p>
      </Section>

      <Section title="🏭 Energy Efficiency Analysis">
        <p>Energy efficiency indicators will appear here.</p>
      </Section>

      <Section title="🔥 Source Contribution (Hotspot Analysis)">
        <HotspotChart
          plant="plant1"
          selectedMonth={selectedMonth}
        />
      </Section>

      <Section title="🧪 Scenario & What-If Analysis">
        <p>Scenario modelling tools will appear here.</p>
      </Section>

      <Section title="🎯 Reduction Opportunity Insights">
        <p>Reduction opportunity insights will appear here.</p>
      </Section>

      
    </div>
  );
}

/* ================= MONTH SELECTOR ================= */

function MonthSelector({ selectedMonth, onChange }) {

  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(selectedMonth.split("-")[0]);

  const months = [
    "Jan","Feb","Mar","Apr",
    "May","Jun","Jul","Aug",
    "Sep","Oct","Nov","Dec"
  ];

  const handleMonthClick = (index) => {
    const monthNumber = String(index + 1).padStart(2, "0");
    onChange(`${year}-${monthNumber}`);
    setOpen(false);
  };

  return (
    <div style={{ position: "relative" }}>

      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "#14b8a6",
          border: "none",
          padding: "12px 18px",
          borderRadius: 10,
          color: "white",
          fontWeight: "600",
          cursor: "pointer"
        }}
      >
        📅 Select Month
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: 60,
            right: 0,
            background: "#ffffff",
            padding: 20,
            borderRadius: 14,
            boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
            width: 260,
            zIndex: 10
          }}
        >

          {/* Year Navigation */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 15
            }}
          >
            <button
              onClick={() => setYear(prev => String(Number(prev) - 1))}
              style={yearBtn}
            >
              {"<"}
            </button>

            <strong style={{ color: "#0f766e" }}>{year}</strong>

            <button
              onClick={() => setYear(prev => String(Number(prev) + 1))}
              style={yearBtn}
            >
              {">"}
            </button>
          </div>

          {/* Month Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 10
            }}
          >
            {months.map((m, i) => (
              <button
                key={m}
                onClick={() => handleMonthClick(i)}
                style={{
                  padding: "8px 0",
                  borderRadius: 8,
                  border: "1px solid #14b8a6",
                  background:
                    selectedMonth ===
                    `${year}-${String(i + 1).padStart(2, "0")}`
                      ? "#14b8a6"
                      : "white",
                  color:
                    selectedMonth ===
                    `${year}-${String(i + 1).padStart(2, "0")}`
                      ? "white"
                      : "#0f766e",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                {m}
              </button>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}

const yearBtn = {
  background: "#14b8a6",
  border: "none",
  color: "white",
  borderRadius: 8,
  padding: "4px 10px",
  cursor: "pointer"
};

/* ================= HOTSPOT + INSIGHTS ================= */

function HotspotChart({ plant, selectedMonth }) {

  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!selectedMonth) return;

    const [year, month] = selectedMonth.split("-");

    fetch(
      `http://localhost:5000/api/analytics/hotspots/${plant}/${month}/${year}`
    )
      .then(res => res.json())
      .then(data => {
  console.log("Hotspot API response:", data);

  if (data?.sources?.length) {
    setChartData(data);
  } else {
    console.warn("No hotspot data returned");
  }
      })
.catch(err => {
  console.error("Hotspot fetch error:", err);
});


  }, [plant, selectedMonth]);

  if (!chartData) {
  return (
    <p style={{color:"#ef4444"}}>
      No hotspot data found for this month.
    </p>
  );
}


  const allSources = [
    "Grid Power","Renewable Power","Solar Power",
    "LPG","PNG","HSD","Furnace Oil","Biomass"
  ];

  const sourceMap = {};
  chartData.sources.forEach(s => {
    sourceMap[s.name] = s.value;
  });

  const values = allSources.map(s => sourceMap[s] || 0);

  const series = [{
    name: "Emissions (MT CO₂e)",
    data: values
  }];

  const options = {
    chart: {
    type: "bar",
    toolbar: { show: false }
  },
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 6
    }
  },
  colors: ["#14b8a6"],
  dataLabels: { enabled: false },
  xaxis: { categories: allSources },

  tooltip: {
    enabled: true,
    theme: "light",
    style: {
      fontSize: "14px",
      fontWeight: 600,
      color: "#0f766e" // Turquoise text
    },
    y: {
      formatter: function (val) {
        return `${val} MT CO₂e`;
      }
    },
    marker: {
      show: true
    }
  }
};
  return (
    <div>

      <InsightCards
        data={{
          ...chartData,
          sources: allSources.map((l,i)=>({name:l,value:values[i]}))
        }}
      />

      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={400}
      />

    </div>
  );
}

/* ================= INSIGHT CARDS ================= */

function InsightCards({ data }) {

  const total = data.sources.reduce((sum,s)=>sum+s.value,0);

  const highest = data.sources.reduce((max,s)=>
    s.value>max.value?s:max
  , data.sources[0]);

  const cleanSources = ["Renewable Power","Solar Power","Biomass"];

  const cleanTotal = data.sources
    .filter(s=>cleanSources.includes(s.name))
    .reduce((sum,s)=>sum+s.value,0);

  const cleanPercent = total
    ? ((cleanTotal/total)*100).toFixed(1)
    : 0;

  return (
    <div
      style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",
        gap:20,
        marginBottom:30
      }}
    >
      <Card title="🔥 Highest Source"
        value={highest.name}
        sub={`${highest.value} MT CO₂e`}
      />

      <Card title="📊 Total Emissions"
        value={`${total.toFixed(2)} MT`}
        sub="Current Month"
      />

      <Card title="⚡ Clean Energy Share"
        value={`${cleanPercent}%`}
        sub="Renewable Contribution"
      />

      <Card title="📉 Top 3 Contribution"
        value={`${data.top3Percent || 0}%`}
        sub="Emission Concentration"
      />
    </div>
  );
}

function Card({ title, value, sub }) {
  return (
    <div
      style={{
        background:"white",
        padding:20,
        borderRadius:16,
        boxShadow:"0 8px 20px rgba(0,0,0,0.06)",
        textAlign:"center"
      }}
    >
      <h4 style={{fontSize:14,color:"#0f766e"}}>
        {title}
      </h4>

      <div style={{
        fontSize:18,
        fontWeight:"700",
        color:"#065f46"
      }}>
        {value}
      </div>

      <div style={{
        fontSize:13,
        color:"#374151",
        marginTop:5
      }}>
        {sub}
      </div>
    </div>
  );
}

/* ================= REUSABLE ================= */

function Control({ label, children }) {
  return (
    <div style={{ minWidth:180 }}>
      <label style={{
        fontWeight:"600",
        color:"#0f766e",
        fontSize:"23px"
      }}>
        {label}
      </label>
      <br/>
      {children}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div
      style={{
        background:"#ffffff",
        padding:30,
        borderRadius:18,
        marginBottom:35,
        boxShadow:"0 10px 25px rgba(0,0,0,0.08)"
      }}
    >
      <h2 style={{
        fontSize:"25px",
        fontWeight:"700",
        color:"#0f766e",
        marginBottom:20
      }}>
        {title}
      </h2>
       <div
        style={{
          fontSize: "16px",
          color: "#374151",  // dark gray (visible on white)
          lineHeight: 1.6
        }}
      >
        {children}
      </div>
    </div>
  );
}