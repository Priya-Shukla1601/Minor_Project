const Entry = require("../models/plantentry");

// 📊 Emissions Trend (Monthly Aggregation)
console.log("🔥 NEW ANALYTICS CONTROLLER ACTIVE");
exports.getEmissionsTrend = async (req, res) => {
    console.log("✅ NEW CONTROLLER RUNNING");
  const { plantId } = req.params;
  
  try {
    const data = await Entry.aggregate([
      { $match: { plantId } },

      {
        $group: {
          _id: { year: "$year", month: "$month" },
          totalEmissions: { $sum: "$emissions" }
        }
      },

      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const monthNames = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    const months = data.map(d =>
      `${monthNames[d._id.month - 1]} ${d._id.year}`
    );

    const emissions = data.map(d => d.totalEmissions);

   res.json({ months, emissions });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ⚡ Energy Consumption
exports.getEnergy = async (req, res) => {
  const { plantId, month, year } = req.params;

  try {
    const data = await Entry.aggregate([
      {
        $match: {
          plantId,
          month: Number(month),
          year: Number(year)
        }
      },
      {
        $group: {
          _id: null,
          electricity: { $sum: "$electricity" },
          fuel: { $sum: "$fuel" }
        }
      }
    ]);

    const result = data[0] || { electricity: 0, fuel: 0 };

    res.json({
      electricity: result.electricity,
      fuel: result.fuel,
      total: result.electricity + result.fuel
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 🔥 Fuel Mix Breakdown
exports.getFuelMix = async (req, res) => {
  const { plantId, month, year } = req.params;

  try {
    const data = await Entry.aggregate([
      {
        $match: {
          plantId,
          month: Number(month),
          year: Number(year)
        }
      },
      {
        $group: {
          _id: "$fuelType",
          value: { $sum: "$fuelAmount" }
        }
      }
    ]);

    const fuels = data.map(d => ({
      type: d._id || "Unknown",
      value: d.value
    }));

    res.json({ fuels });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
