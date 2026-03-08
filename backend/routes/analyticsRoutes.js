const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");

router.get("/trend/:plant", analyticsController.getTrend);
router.get("/comparison/:plant", analyticsController.getComparison);
router.get("/hotspots/:plant/:month/:year", analyticsController.getHotspots);
router.post("/scenario", analyticsController.runScenario);

module.exports = router; 
