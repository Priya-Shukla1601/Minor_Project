const calculationService = require("../services/calculationService");
const PlantEntry = require("../models/plantentry");
 
exports.submitData = async (req, res) => {
  try {
 
    const plantData = req.body;

    // -----------------------------
    // 1. Basic validation
    // -----------------------------

    if (!plantData.userId || !plantData.month || !plantData.year) {
      return res.status(400).json({
        error: "Plant ID , month and year required"
      });
    }

    // -----------------------------
    // 2. Calculate KPIs
    // -----------------------------

    const kpis =
      calculationService.calculateKPIs(plantData);

    // -----------------------------
    // 3. Combine input + KPIs
    // --------------------------------

    const dashboardData = {
      ...plantData,
      kpis,
      timestamp: new Date()
    };

    // -----------------------------
    // 4. Save or Update entry
    // -----------------------------

    const updatedEntry = await PlantEntry.findOneAndUpdate(
  {
    plant: plantData.userId,
    month: plantData.month,
    year: plantData.year
  },
  {
    plant: plantData.userId,
    month: plantData.month,
    year: plantData.year,
    inputs: plantData,
    kpis,
    timestamp: new Date()
  },
  {
    new: true,
    upsert: true
  }
);

    // -----------------------------
    // 5. Return dashboard payload
    // -----------------------------

    res.json({
      message: "Plant data saved",
      dashboard: updatedEntry
    });

  } catch (error) {

    console.error("Controller error:", error);

    res.status(500).json({
      error: "Internal Server Error"
    });

  }
};


// Fetch stored data
exports.getData = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        error: "User ID required"
      });
    }

    const data = await PlantEntry.find({plant: userId });

    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error"
    });
  }
};

// Aggregated Reports Data
exports.getReportsData = async (req, res) => {
  try {
    let { plant, year } = req.params;
    let { months } = req.query; // e.g. "1,2,3" for Q1

    year = Number(year);
    if (!months) {
      months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    } else {
      months = months.split(',').map(Number);
    }

    const data = await PlantEntry.find({
      plant: plant,
      year: year,
      month: { $in: months }
    });

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "No data found for the selected period" });
    }

    // Aggregate inputs
    const aggregatedInputs = {
      powerConsumption: {
        gridPowerKWh: 0,
        renewablePowerKWh: 0,
        solarPowerKWh: 0
      },
      fuelConsumption: {
        lpgKg: 0,
        furnaceOilLitre: 0,
        pngSCM: 0,
        hsdLitre: 0,
        biomassMJ: 0
      },
      beverageProduction: 0
    };

    data.forEach(entry => {
      const inp = entry.inputs;
      aggregatedInputs.powerConsumption.gridPowerKWh += +inp.powerConsumption?.gridPowerKWh || 0;
      aggregatedInputs.powerConsumption.renewablePowerKWh += +inp.powerConsumption?.renewablePowerKWh || 0;
      aggregatedInputs.powerConsumption.solarPowerKWh += +inp.powerConsumption?.solarPowerKWh || 0;

      aggregatedInputs.fuelConsumption.lpgKg += +inp.fuelConsumption?.lpgKg || 0;
      aggregatedInputs.fuelConsumption.furnaceOilLitre += +inp.fuelConsumption?.furnaceOilLitre || 0;
      aggregatedInputs.fuelConsumption.pngSCM += +inp.fuelConsumption?.pngSCM || 0;
      aggregatedInputs.fuelConsumption.hsdLitre += +inp.fuelConsumption?.hsdLitre || 0;
      aggregatedInputs.fuelConsumption.biomassMJ += +inp.fuelConsumption?.biomassMJ || 0;

      aggregatedInputs.beverageProduction += +inp.beverageProduction || 0;
    });

    // Recalculate KPIs for the whole period
    const kpis = calculationService.calculateKPIs(aggregatedInputs);

    res.json({
      plant,
      year,
      months,
      inputs: aggregatedInputs,
      kpis,
      entriesCount: data.length,
      timestamp: new Date()
    });

  } catch (error) {
    console.error("Reports controller error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getDashboard = async (req, res) => {
  try {
    let { plant, month, year } = req.params;

    // Convert month & year to Number (VERY IMPORTANT)
    month = Number(month);
    year = Number(year);

    const data = await PlantEntry.findOne({
      plant,
      month,
      year
    });

    if (!data) {
      return res.status(404).json({
        error: "No dashboard data found"
      });
    }

    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error"
    });
  }
};
