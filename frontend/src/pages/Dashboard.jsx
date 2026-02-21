import { useEffect, useState, useRef, memo } from "react";
import ApexCharts from "apexcharts";

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
  "linear-gradient(135deg,#ccfbf1,#99f6e4)",
  "linear-gradient(135deg,#ccfbf1,#99f6e4)",
  "linear-gradient(135deg,#ccfbf1,#99f6e4)",
  "linear-gradient(135deg,#e0f2fe,#bae6fd)",
  "linear-gradient(135deg,#e0f2fe,#bae6fd)",
  "linear-gradient(135deg,#e0f2fe,#bae6fd)"
];

const KpiCard = ({ title, value, index }) => (
  <div style={{
    background: gradients[index],
    padding: 26,
    borderRadius: 16,
    textAlign: "center",
    boxShadow: "0 10px 20px rgba(0,0,0,0.12)"
  }}>
    <h4 style={{
      fontSize: 28,
      color: "#065f46",
      marginBottom: 10,
      fontWeight: 700
    }}>{title}</h4>

    <p style={{
      fontSize: 40,
      fontWeight: 900,
      color: "#064e3b"
    }}>{value ?? 0}</p>
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
      padding: 20,
      borderRadius: 14,
      boxShadow: "0 6px 14px rgba(0,0,0,0.08)"
    }}>
      <div style={{marginBottom:12}}>
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
    fetch(`http://localhost:5000/api/carbon/dashboard/${plant}/${month+1}/${year}`)
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
    fontSize:16
  };

  const kpis=safeData.kpis;

  return(
    <div style={{
      padding:30,
      minHeight:"100vh",
      background:"linear-gradient(135deg,#e0f2fe,#ccfbf1,#dcfce7)"
    }}>

      <h1 style={{
        textAlign:"center",
        fontSize:58,
        fontWeight:900,
        marginBottom:20,
        color:"#0f768e"
      }}>
        Dashboard
      </h1>

      <div style={{position:"relative",marginBottom:30}}>

        <button
          onClick={()=>setShowCal(v=>!v)}
          style={{
            fontSize:28,
            padding:"10px 14px",
            borderRadius:12,
            border:"none",
            background:"#14b8a6",
            color:"#fff",
            cursor:"pointer"
          }}
        >
          📅
        </button>

        {showCal && (
          <div style={{
            position:"absolute",
            top:60,
            left:0,
            background:"#fff",
            borderRadius:12,
            padding:16,
            boxShadow:"0 10px 25px rgba(0,0,0,0.15)"
          }}>

            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <button onClick={()=>setYear(y=>y-1)} style={arrowStyle}>{"<"}</button>
              <b style={{color:"#14b8a6"}}>{year}</b>
              <button onClick={()=>setYear(y=>y+1)} style={arrowStyle}>{">"}</button>
            </div>

            <div style={{
              display:"grid",
              gridTemplateColumns:"repeat(4,1fr)",
              gap:6
            }}>
              {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m,i)=>(
                <button
                  key={m}
                  onClick={()=>{setMonth(i);setShowCal(false);}}
                  style={{
                    padding:8,
                    borderRadius:6,
                    border:"1px solid #14b8a6",
                    background:i===month?"#14b8a6":"#fff",
                    color:i===month?"#fff":"#14b8a6",
                    cursor:"pointer"
                  }}
                >
                  {m}
                </button>
              ))}
            </div>

          </div>
        )}

      </div>

      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(3,1fr)",
        gap:24,
        marginBottom:50
      }}>
        <KpiCard index={0} title="Total RE %" value={kpis.renewablePercent}/>
        <KpiCard index={1} title="Total Green Fuel %" value={kpis.greenFuelPercent}/>
        <KpiCard index={2} title="Energy Usage Ratio" value={kpis.energyRatio}/>
        <KpiCard index={3} title="Carbon Footprint (MT)" value={kpis.totalCarbonMT}/>
        <KpiCard index={4} title="Carbon Intensity" value={kpis.carbonIntensity}/>
        <KpiCard index={5} title="Total Energy (MJ)" value={kpis.totalEnergyMJ}/>
      </div>

      <div style={{
        display:"grid",
        gridTemplateColumns:"1fr 1fr",
        gap:30
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