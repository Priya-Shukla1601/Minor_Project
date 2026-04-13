const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const carbonRoutes = require("./routes/carbonRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());

app.use("/api/carbon", carbonRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Backend!" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
