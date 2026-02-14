const calculationService = require("../services/calculationService");
const csvService = require("../services/csvService");

exports.submitData = async (req, res) => {
  try {

    const plantData = req.body;

    // -----------------------------
    // 1. Basic validation
    // -----------------------------

    if (!plantData.userId || !plantData.month) {
      return res.status(400).json({
        error: "Plant ID and month required"
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
    // 4. Save entry
    // -----------------------------

    await csvService.writeEntry(dashboardData);

    // -----------------------------
    // 5. Return dashboard payload
    // -----------------------------

    res.json({
      message: "Plant data saved",
      dashboard: dashboardData
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

    const data = await csvService.getEntries(userId);

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

    const { plant, month } = req.params;

    const entries =
      await csvService.getEntries(plant);

    const record = entries.find(
      e => e.month === month
    );

    if (!record) {
      return res.status(404).json({
        error: "No dashboard data found"
      });
    }

    res.json(record);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Internal Server Error"
    });

  }
};


