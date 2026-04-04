const mongoose = require("mongoose");
 
const plantEntrySchema = new mongoose.Schema({
  plant: {
    type: String,
    required: true
  }, 
  month: {
    type: Number,   // 1 to 12
    required: true
  },
  year: {
    type: Number,   // 2006, 2009
    required: true
  },
  inputs: {
    type: Object,
    required: true
  },
  kpis: {
    type: Object,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

//prevents duplicates
plantEntrySchema.index({ plant: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model("PlantEntry", plantEntrySchema);
