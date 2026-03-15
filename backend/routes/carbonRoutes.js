const express = require('express');
const router = express.Router();

const carbonController =
  require('../controllers/carbonController');

// Save plant entry
router.post('/entry', carbonController.submitData);

// Fetch dashboard data
router.get(
  '/dashboard/:plant/:month/:year',
  carbonController.getDashboard
);
module.exports = router;
