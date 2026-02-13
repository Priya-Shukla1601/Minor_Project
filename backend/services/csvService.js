const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const { parse } = require('csv-parse');

const DATA_FILE = path.join(__dirname, '../data.csv');

// Ensure file exists with headers
const initFile = () => {
    if (!fs.existsSync(DATA_FILE)) {
        const headers = [
            'userId', 'month',
            'diesel', 'biomass', 'lpg', 'png', 'fo',
            'gridPower', 'rePpa', 'solar', 'production',
            'totalEmissions', 'totalEnergy',
            'carbonIntensity', 'rePercentage', 'energyRatio',
            'timestamp'
        ].join(',') + '\n';
        fs.writeFileSync(DATA_FILE, headers);
    }
};

const writeEntry = async (data) => {
    initFile();
    const timestamp = new Date().toISOString();
    const row = { ...data, timestamp };

    // Append to file
    // Simple append string as it's just one line and avoiding heavy locking for now (MVP)
    const rowString = [
        row.userId, row.month,
        row.diesel, row.biomass, row.lpg, row.png, row.fo,
        row.gridPower, row.rePpa, row.solar, row.production,
        row.totalEmissions, row.totalEnergy,
        row.carbonIntensity, row.rePercentage, row.energyRatio,
        row.timestamp
    ].join(',') + '\n';

    fs.appendFileSync(DATA_FILE, rowString);
    return row;
};

const getEntries = (userId) => {
    initFile();
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(DATA_FILE)
            .pipe(parse({ columns: true, trim: true }))
            .on('data', (data) => {
                if (data.userId === userId) {
                    results.push(data);
                }
            })
            .on('error', (err) => reject(err))
            .on('end', () => resolve(results));
    });
};

module.exports = { writeEntry, getEntries };
