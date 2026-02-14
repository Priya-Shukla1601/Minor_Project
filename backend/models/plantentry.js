const mongoose = require("mongoose");

const schema = new mongoose.Schema({

  plant: String,
  month: String,

  inputs: Object,
  kpis: Object,

  timestamp: { type: Date, default: Date.now }

});

module.exports = mongoose.model("PlantEntry", schema);
