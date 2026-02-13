const calculateFeatures = (data) => {
    // 1. Parse Inputs (default to 0)
    const diesel = parseFloat(data.diesel) || 0;
    const biomass = parseFloat(data.biomass) || 0;
    const lpg = parseFloat(data.lpg) || 0;
    const png = parseFloat(data.png) || 0;
    const fo = parseFloat(data.fo) || 0;
    const gridPower = parseFloat(data.gridPower) || 0;
    const rePpa = parseFloat(data.rePpa) || 0;
    const solar = parseFloat(data.solar) || 0;
    const production = parseFloat(data.production) || 0;

    // 2. Emission Factors
    const FACTORS = {
        grid: 0.735,
        hsd: 2.754,
        fo: 3.083,
        png: 1.885,
        lpg: 2.920,
        biomass: 0.0018
    };

    // 3. Energy Conversion (to MJ)
    const CONVERSION = {
        kwh: 3.6,
        diesel: 38.2, // Mega Joules per Liter
        png: 39.0,    // MJ per SCM
        lpg: 46.0,    // MJ per Kg
        biomass: 1    // Assuming input is already in MJ or roughly equivalent for this context? 
        // *Correction based on flowchart*: Biomass input is MJ. So no conversion needed if input is MJ.
    };

    // *Note on Biomass*: Input says "Biomass (MJ)", so we take it as is for energy. 
    // Emission factor is likely kg CO2 per MJ or similar unit. 
    // Flowchart says "Biomass * 0.0018". We assume input is MJ.

    // 4. Calculate Emissions (kg CO2)
    const emissions = {
        grid: gridPower * FACTORS.grid,
        diesel: diesel * FACTORS.hsd,
        fo: fo * FACTORS.fo,
        png: png * FACTORS.png,
        lpg: lpg * FACTORS.lpg,
        biomass: biomass * FACTORS.biomass
    };

    const totalEmissions = Object.values(emissions).reduce((a, b) => a + b, 0);

    // 5. Calculate Energy (MJ)
    const energy = {
        grid: gridPower * CONVERSION.kwh,
        rePpa: rePpa * CONVERSION.kwh,
        solar: solar * CONVERSION.kwh,
        diesel: diesel * CONVERSION.diesel,
        png: png * CONVERSION.png,
        lpg: lpg * CONVERSION.lpg,
        biomass: biomass // Input is MJ
        // HSD (Diesel) and FO (Furnace Oil)?
        // Flowchart "Energy Converter" lists: kWh, Diesel, PNG, LPG, Biomass. FO is missing from Energy Converter in the chart text provided, 
        // but typically FO has high energy content (~40 MJ/L). 
        // I will exclude FO from Total Energy if strictly following "Step 2: Backend Logic" box in flowchart, 
        // BUT "Furnace Oil (Liters)" points to "Energy Converter" in the visual lines (though text inside box doesn't list it).
        // I will assume FO should be converted. Common value ~40.5 MJ/L. 
        // *Strictly following text in box*: "kWh * 3.6, Diesel * 38.2, PNG * 39.0, LPG * 46.0, Biomass (No Change)".
        // I will follow the text in the box to be safe, so NO FO in Total Energy unless user specified. 
        // actually looking at the lines, FO -> Energy Converter IS connected.
        // I'll add a standard factor for FO just in case, or leave it out if not essential? 
        // Let's stick to the text in the box "Energy Converter (Convert to MJ)" which lists specific items.
    };

    // Recalculate Total Energy based on component sums
    // Total Energy = Sum of converted outputs.
    // Flowchart Step 3 totals: Total Energy (MJ).
    // Let's include everything that contributes to energy.
    // If FO is combustion, it produces energy. I'll add FO ~40 MJ/L to be realistic, or 0 if strict.
    // Let's stick to the EXPLICIT list in the box to avoid "hallucinating" requirements. 
    // Text: "kWh * 3.6, Diesel * 38.2, PNG * 39.0, LPG * 46.0, Biomass (No Change)"

    // Wait, "Grid Power", "RE PPA", "Solar Rooftop" all carry kWh. So they all use * 3.6.

    const totalEnergy =
        (gridPower + rePpa + solar) * CONVERSION.kwh +
        diesel * CONVERSION.diesel +
        png * CONVERSION.png +
        lpg * CONVERSION.lpg +
        biomass;

    // 6. Final KPIs
    // Carbon Intensity (Kg CO2 / Ltr)
    const carbonIntensity = production > 0 ? (totalEmissions / production) : 0;

    // RE %
    // Text: "RE %" -> Flowlines from RE PPA and Solar Rooftop.
    // Formula in box: "RE %" <- RE PPA, Solar Rooftop, Total Energy.
    // Typically: (Renewable Energy in MJ / Total Energy) * 100
    const reEnergyMJ = (rePpa + solar) * CONVERSION.kwh;
    const rePercentage = totalEnergy > 0 ? ((reEnergyMJ / totalEnergy) * 100) : 0;

    // Energy Ratio (EUR) (MJ / Ltr)
    const energyRatio = production > 0 ? (totalEnergy / production) : 0;

    return {
        ...data,
        totalEmissions: parseFloat(totalEmissions.toFixed(2)),
        totalEnergy: parseFloat(totalEnergy.toFixed(2)),
        carbonIntensity: parseFloat(carbonIntensity.toFixed(2)),
        rePercentage: parseFloat(rePercentage.toFixed(2)),
        energyRatio: parseFloat(energyRatio.toFixed(2))
    };
};

module.exports = { calculateFeatures };
