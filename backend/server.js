const express = require('express');
const cors = require('cors');
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

const carbonRoutes = require('./routes/carbonRoutes');
connectDB();
app.use(cors());
app.use(express.json());

app.use('/api/carbon', carbonRoutes);

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from Backend!' });
});
const mongoose = require("mongoose");

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
