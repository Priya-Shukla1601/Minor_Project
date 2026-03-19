const calculationService = require("../services/calculationService");
const PlantEntry = require("../models/plantentry");

exports.submitData = async (req, res) => 
  
{
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
    // -----------------------------

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
