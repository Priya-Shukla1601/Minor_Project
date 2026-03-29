const analyticsService = require("../services/analyticsService");
/*
========================================
EMISSIONS TREND
========================================
*/

exports.getTrend = async (req, res) => {
  try {
    const { plant } = req.params;
    const data = await analyticsService.getTrendData(plant):
    res.json(data);
  } catch (error) {
    console.error("Trend Error:", error);
    res.status(500).json({ error: "Failed to fetch trend data" });
  }
};
/*
========================================
COMPARISON (MoM / YoY / QoQ)
=========================================
*/
exports.getComparison = async (req, res) => {
  try {
    const { plant } = req.params;
    const { type = "mom" } = req.query;

    const data = await analyticsService.getComparisonData(plant, type);

    if (!data) {
      return res.status(404).json({ error: "Not enough comparison data" });
    }

    res.json(data);
  } catch (error) {
    console.error("Comparison Error:", error);
    res.status(500).json({ error: "Failed to fetch comparison data" });
  }
};

/*
========================================
HOTSPOT ANALYSIS
==========================================
*/
exports.getHotspots = async (req, res) => {
  try {
    const { plant, month, year } = req.params;

    const data = await analyticsService.getHotspotData(
      plant,
      Number(month),
      Number(year)
    );

    if (!data) {
      return res.status(404).json({ error: "No hotspot data found" });
    }

    res.json(data);
  } catch (error) {
    console.error("Hotspot Error:", error);
    res.status(500).json({ error: "Failed to fetch hotspot data" });
  }
};

/*
========================================
SCENARIO ANALYSIS
========================================
*/
exports.runScenario = async (req, res) => {
  try {
    const data = await analyticsService.runScenarioAnalysis(req.body);
    res.json(data);
  } catch (error) {
    console.error("Scenario Error:", error);
    res.status(500).json({ error: "Failed to run scenario analysis" });
  }
};
