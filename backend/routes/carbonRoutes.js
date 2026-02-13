const express = require('express');
const router = express.Router();
const carbonController = require('../controllers/carbonController');

router.post('/submit', carbonController.submitData);
router.get('/entries/:userId', carbonController.getData);

module.exports = router;
