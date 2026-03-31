const express = require("express");
const router = express.Router();

const {
  getEmissionsTrend,
  getEnergy,
  getFuelMix
} = require("../controllers/analyticsController");

// 📊 Emissions Trend
router.get("/emissions-trend/:plantId", getEmissionsTrend);

// ⚡ Energy Data
router.get("/energy/:plantId/:month/:year", getEnergy);

// 🔥 Fuel Mix
router.get("/fuel-mix/:plantId/:month/:year", getFuelMix);

module.exports = router;