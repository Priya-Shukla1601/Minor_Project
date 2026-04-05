import { useEffect, useState, useRef, memo } from "react";
import ApexCharts from "apexcharts";
import { FiSun, FiWind, FiSettings, FiActivity, FiTarget, FiZap } from "react-icons/fi";

/* ---------- chart types ---------- */

const chartTypes = [
  "bar","line","area","pie","donut",
  "scatter","bubble","heatmap",
  "treemap","boxPlot"
];

const chartCardGradient =
  "linear-gradient(135deg,#f8fafc,#eef2f7)";

const dropdownStyle = {
  padding: 10,
  borderRadius: 8,
  border: "1px solid #d1d5db",
  background: "#f3f4f6",
  color: "#000",
  fontSize: 14,
  minWidth: 150
};

/* ---------- KPI CARD ---------- */

const gradients = [
  "linear-gradient(135deg, rgba(204, 251, 241, 0.9), rgba(153, 246, 228, 0.9))",
  "linear-gradient(135deg, rgba(204, 251, 241, 0.9), rgba(153, 246, 228, 0.9))",
  "linear-gradient(135deg, rgba(204, 251, 241, 0.9), rgba(153, 246, 228, 0.9))",
  "linear-gradient(135deg, rgba(224, 242, 254, 0.9), rgba(186, 230, 253, 0.9))",
  "linear-gradient(135deg, rgba(224, 242, 254, 0.9), rgba(186, 230, 253, 0.9))",
  "linear-gradient(135deg, rgba(224, 242, 254, 0.9), rgba(186, 230, 253, 0.9))"
];

const KpiCard = ({ title, value, index, icon }) => (
  <div 
    style={{
      background: gradients[index],
      padding: "20px 24px",
      borderRadius: 16,
      boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
      display: "flex",
      alignItems: "center",
      gap: "16px",
      transition: "all 0.3s ease",
      border: "1px solid rgba(255,255,255,0.6)",
      backdropFilter: "blur(8px)"
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.08)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.03)";
    }}
  >
    <div style={{
      width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.65)",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#0f766e", fontSize: 26, flexShrink: 0,
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    }}>
      {icon}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <h4 style={{
        fontSize: 14,
        color: "#065f46",
        marginBottom: 6,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }}>{title}</h4>

      <p style={{
        fontSize: 28,
        margin: 0,
        fontWeight: 900,
        color: "#064e3b"
      }}>{value ?? 0}</p>
    </div>
  </div>
);

/* ---------- DATA HELPERS ---------- */

const flattenInputs = inputs => ({
  grid: inputs?.powerConsumption?.gridPowerKWh ?? 0,
  renewable: inputs?.powerConsumption?.renewablePowerKWh ?? 0,
  solar: inputs?.powerConsumption?.solarPowerKWh ?? 0,
  lpg: inputs?.fuelConsumption?.lpgKg ?? 0,
  furnace: inputs?.fuelConsumption?.furnaceOilLitre ?? 0,
  png: inputs?.fuelConsumption?.pngSCM ?? 0,
  hsd: inputs?.fuelConsumption?.hsdLitre ?? 0,
  biomass: inputs?.fuelConsumption?.biomassMJ ?? 0,
  production: inputs?.beverageProduction ?? 0
});

/* ---------- PIE DATA ---------- */

const buildPieDataset = (flat, source) => {

  const power = {
    labels:["Grid","Renewable","Solar","Production"],
    values:[flat.grid,flat.renewable,flat.solar,flat.production]
  };

  const fuel = {
    labels:["LPG","Furnace","PNG","HSD","Biomass","Production"],
    values:[flat.lpg,flat.furnace,flat.png,flat.hsd,flat.biomass,flat.production]
  };

  if(source==="Power") return power;
  if(source==="Fuel") return fuel;

  return {
    labels:[
      "Grid","Renewable","Solar",
      "LPG","Furnace","PNG",
      "HSD","Biomass","Production"
    ],
    values:Object.values(flat)
  };
};

/* ---------- ADVANCED SERIES ---------- */

const buildAdvancedSeries = (flat,type)=>{

  const values = Object.values(flat);
  const labels = Object.keys(flat);

  if(type==="bubble"){
    return [{data:values.map((v,i)=>({x:i,y:v,z:v/10+1}))}];
  }

  if(type==="heatmap"){
    return labels.map((l,i)=>({name:l,data:[{x:l,y:values[i]}]}));
  }

  if(type==="treemap"){
    return [{data:labels.map((l,i)=>({x:l,y:values[i]}))}];
  }

  if(type==="boxPlot"){
    return [{
      data:labels.map((l,i)=>({
        x:l,
        y:[
          values[i]*0.7,
          values[i]*0.9,
          values[i],
          values[i]*1.1,
          values[i]*1.3
        ]
      }))
    }];
  }

  return [{name:"Data",data:values}];
};

/* ---------- CHART CARD ---------- */

const ChartCard = memo(({ chart, index, inputs, updateChart }) => {

  const ref = useRef(null);
  const instance = useRef(null);
  const flat = flattenInputs(inputs);

  useEffect(() => {

    if (!ref.current) return;
    if (instance.current) instance.current.destroy();

    const nativeCharts = ["pie","donut","area","bar","scatter","line"];
    const useNative = nativeCharts.includes(chart.type);

    const common = {
  chart:{type:chart.type,height:320,toolbar:{show:false}},

  tooltip:{
    enabled:true,
    shared:false,
    intersect:true,
    custom: function({ series, seriesIndex, dataPointIndex }) {
      const value = series?.[seriesIndex]?.[dataPointIndex];

      if (value === undefined || value === null) return "";

      return `
        <div style="
          padding:8px 12px;
          background:#e0fdfa;
          border-radius:8px;
          color:#0f766e;
          font-weight:700;
          font-size:14px;
        ">
          ${Number(value).toLocaleString()}
        </div>
      `;
    }
  },

  markers:{size:6,hover:{size:12}},
  states:{hover:{filter:{type:"lighten",value:0.2}}},
  dataLabels:{enabled:chart.type==="pie"||chart.type==="donut"|| chart.type==="bar"||chart.type==="line"||chart.type==="treemap"||chart.type==="heatmap"}
};

    let options;

    if(chart.type==="pie"||chart.type==="donut"){
      const pie=buildPieDataset(flat,chart.source);
      options={...common,series:pie.values,labels:pie.labels,legend:{position:"bottom"}};
    }else{
      options={
        ...common,
        series:buildAdvancedSeries(flat,chart.type),
        xaxis:{categories:Object.keys(flat)}
      };
    }

    instance.current=new ApexCharts(ref.current,options);
    instance.current.render();

    return ()=>instance.current?.destroy();

  },[chart.type,chart.source,JSON.stringify(flat)]);

  const isPie=chart.type==="pie"||chart.type==="donut";

  return (
    <div style={{
      background: chartCardGradient,
      padding: 24,
      borderRadius: 16,
      boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
      border: "1px solid #e2e8f0"
    }}>
      <div style={{marginBottom:16}}>
        <select
          style={dropdownStyle}
          value={chart.type}
          onChange={e=>updateChart(index,"type",e.target.value)}
        >
          {chartTypes.map(t=><option key={t}>{t}</option>)}
        </select>

        {isPie&&(
          <select
            style={{...dropdownStyle,marginTop:8}}
            value={chart.source}
            onChange={e=>updateChart(index,"source",e.target.value)}
          >
            <option>Power</option>
            <option>Fuel</option>
            <option>Both</option>
          </select>
        )}
      </div>

      <div ref={ref} style={{height:320}}/>
    </div>
  );
});

/* ---------- DASHBOARD ---------- */

export default function Dashboard(){

  const plant = localStorage.getItem("plant");

  if (!plant) {
    return <h2 style={{ padding: 30 }}>No plant selected</h2>;
  }

  const today=new Date();
  const [year,setYear]=useState(today.getFullYear());
  const [month,setMonth]=useState(today.getMonth());
  const [showCal,setShowCal]=useState(false);
  const [data,setData]=useState(null);

  const [charts,setCharts]=useState([
    {type:"bar",source:"Both"},
    {type:"line",source:"Both"},
    {type:"pie",source:"Both"},
    {type:"donut",source:"Both"}
  ]);

  useEffect(()=>{
    fetch(`${import.meta.env.VITE_API_BASE_URL}/carbon/dashboard/${plant}/${month+1}/${year}`)
      .then(res=>res.json())
      .then(d=>setData(d))
      .catch(()=>setData(null));
  },[year,month,plant]);

  /*  SAFE FALLBACK — THIS IS THE KEY CHANGE */

  const safeData = data?.inputs && data?.kpis
    ? data
    : {
        inputs: {},
        kpis: {
          renewablePercent: 0,
          greenFuelPercent: 0,
          energyRatio: 0,
          totalCarbonMT: 0,
          carbonIntensity: 0,
          totalEnergyMJ: 0
        }
      };

  const updateChart=(i,key,value)=>{
    setCharts(prev=>{
      const copy=[...prev];
      copy[i]={...copy[i],[key]:value};
      return copy;
    });
  };

  const arrowStyle={
    background:"#14b8a6",
    color:"#fff",
    border:"none",
    borderRadius:8,
    width:36,
    height:36,
    cursor:"pointer",
    fontSize:16,
    display:"flex",
    alignItems:"center",
    justifyContent:"center"
  };

  const kpis=safeData.kpis;

  return(
    <div style={{
      padding: "32px 40px",
      minHeight:"100vh",
      background:"linear-gradient(135deg,#e0f2fe,#ccfbf1,#dcfce7)",
      fontFamily: "'Inter', sans-serif"
    }}>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 30 }}>
        <h1 style={{
          fontWeight: 900,
          fontSize: 46,
          margin: 0,
          color: "#0f768e",
          textShadow: "0 1px 2px rgba(0,0,0,0.05)"
        }}>
          Dashboard
        </h1>
        <p style={{ margin: "10px 0 0 0", color: "#475569", fontSize: 18, fontWeight: 500 }}>
          Comprehensive analysis and key performance indicators.
        </p>
      </div>

      <div style={{position:"relative",marginBottom:40, textAlign: "right"}}>

        <button
          onClick={()=>setShowCal(v=>!v)}
          style={{
            fontSize:18,
            padding:"12px 20px",
            borderRadius:12,
            border:"none",
            background:"#ffffff",
            color:"#0f766e",
            cursor:"pointer",
            boxShadow:"0 4px 6px rgba(0,0,0,0.05)",
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            gap: 8
          }}
        >
          📅 {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][month]} {year}
        </button>

        {showCal && (
          <div style={{
            position:"absolute",
            top:55,
            right:0,
            background:"rgba(255,255,255,0.98)",
            backdropFilter:"blur(8px)",
            borderRadius:12,
            padding:16,
            boxShadow:"0 10px 30px rgba(0,0,0,0.15)",
            zIndex: 50,
            width: 260,
            border: "1px solid #ccfbf1"
          }}>

            <div style={{display:"flex",justifyContent:"space-between",marginBottom:16, alignItems: "center"}}>
              <button onClick={()=>setYear(y=>y-1)} style={arrowStyle}>{"<"}</button>
              <b style={{color:"#0f766e", fontSize: 18}}>{year}</b>
              <button onClick={()=>setYear(y=>y+1)} style={arrowStyle}>{">"}</button>
            </div>

            <div style={{
              display:"grid",
              gridTemplateColumns:"repeat(4,1fr)",
              gap:8
            }}>
              {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m,i)=>(
                <button
                  key={m}
                  onClick={()=>{setMonth(i);setShowCal(false);}}
                  style={{
                    padding:"8px 0",
                    borderRadius:8,
                    border:"none",
                    background:i===month?"#14b8a6":"transparent",
                    color:i===month?"#fff":"#475569",
                    cursor:"pointer",
                    fontSize:13,
                    fontWeight:600,
                    transition:"all 0.2s"
                  }}
                >
                  {m}
                </button>
              ))}
            </div>

          </div>
        )}

      </div>

      {/* Strict 3x2 KPI Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 24,
        marginBottom: 40
      }}>
        <KpiCard index={0} title="Total RE %" value={kpis.renewablePercent} icon={<FiSun />} />
        <KpiCard index={1} title="Total Green Fuel %" value={kpis.greenFuelPercent} icon={<FiWind />} />
        <KpiCard index={2} title="Energy Usage Ratio" value={kpis.energyRatio} icon={<FiSettings />} />
        <KpiCard index={3} title="Carbon Footprint (MT)" value={kpis.totalCarbonMT} icon={<FiActivity />} />
        <KpiCard index={4} title="Carbon Intensity" value={kpis.carbonIntensity} icon={<FiTarget />} />
        <KpiCard index={5} title="Total Energy (MJ)" value={kpis.totalEnergyMJ} icon={<FiZap />} />
      </div>

      {/* Strict 2x2 Charts Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 24
      }}>
        {charts.map((chart,i)=>(
          <ChartCard
            key={i}
            chart={chart}
            index={i}
            inputs={safeData.inputs}
            updateChart={updateChart}
          />
        ))}
      </div>

    </div>
  );
}