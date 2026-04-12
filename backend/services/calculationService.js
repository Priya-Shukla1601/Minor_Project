// ======================================
// Smart CarbonTrack Calculation Engine
// ======================================

// --- Conversion constants ---
const FACTORS = {
  // electricity → kg CO2 per kWh
  GRID_CO2: 0.82,

  // fuels → kg CO2 per unit
  LPG_CO2: 3.0,
  HSD_CO2: 2.68,
  PNG_CO2: 2.1,
  FURNACE_CO2: 3.1,

  // energy conversion to MJ
  KWH_TO_MJ: 3.6,
  LPG_TO_MJ: 46,
  HSD_TO_MJ: 38,
  PNG_TO_MJ: 35,
  FURNACE_TO_MJ: 40
};


// ======================================
// MAIN KPI FUNCTION
// ======================================

exports.calculateKPIs = (data) => {

  // --- normalize inputs ---


const grid = +data.powerConsumption?.gridPowerKWh || 0;
const renewable = +data.powerConsumption?.renewablePowerKWh || 0;
const solar = +data.powerConsumption?.solarPowerKWh || 0;

const lpg = +data.fuelConsumption?.lpgKg || 0;
const furnace = +data.fuelConsumption?.furnaceOilLitre || 0;
const png = +data.fuelConsumption?.pngSCM || 0;
const hsd = +data.fuelConsumption?.hsdLitre || 0;
const biomass = +data.fuelConsumption?.biomassMJ || 0;

const production = +data.beverageProduction || 1;


  // ======================================
  // ENERGY CALCULATIONS (MJ)
  // ======================================

  const energyMJ =

    (grid + renewable + solar) * FACTORS.KWH_TO_MJ +

    lpg * FACTORS.LPG_TO_MJ +
    furnace * FACTORS.FURNACE_TO_MJ +
    png * FACTORS.PNG_TO_MJ +
    hsd * FACTORS.HSD_TO_MJ +

    biomass;


  // ======================================
  // CARBON EMISSIONS (kg CO2)
  // ======================================

  const carbonKG =

    grid * FACTORS.GRID_CO2 +

    lpg * FACTORS.LPG_CO2 +
    furnace * FACTORS.FURNACE_CO2 +
    png * FACTORS.PNG_CO2 +
    hsd * FACTORS.HSD_CO2;


  // ======================================
  // KPI METRICS
  // ======================================

  const renewablePercent =
    ((renewable + solar) / (grid + renewable + solar || 1)) * 100;

  const greenFuelPercent =
    (biomass / (lpg + furnace + png + hsd + biomass || 1)) * 100;

  const energyRatio =
    energyMJ / production;

  const carbonFootprint =
    carbonKG / 1000; // metric tons

  const carbonIntensity =
    carbonKG / production;


  // ======================================
  // RETURN KPI OBJECT
  // ======================================

  return {

    totalEnergyMJ: +energyMJ.toFixed(2),

    totalCarbonMT: +carbonFootprint.toFixed(3),

    carbonIntensity: +carbonIntensity.toFixed(3),

    renewablePercent: +renewablePercent.toFixed(2),

    greenFuelPercent: +greenFuelPercent.toFixed(2),

    energyRatio: +energyRatio.toFixed(2)
  };
};

