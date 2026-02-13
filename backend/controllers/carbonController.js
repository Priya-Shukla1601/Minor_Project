const calculationService = require('../services/calculationService');
const csvService = require('../services/csvService');

const submitData = async (req, res) => {
    try {
        const rawData = req.body;

        // Basic Validation
        if (!rawData.userId || !rawData.month) {
            return res.status(400).json({ error: "User ID and Month are required" });
        }

        // Calculate
        const processedData = calculationService.calculateFeatures(rawData);

        // Store
        await csvService.writeEntry(processedData);

        res.json({ message: "Data submitted successfully", data: processedData });
    } catch (error) {
        console.error("Error submitting data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getData = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const data = await csvService.getEntries(userId);
        res.json(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { submitData, getData };
