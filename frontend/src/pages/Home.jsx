import React from 'react';

const Home = () => {
    return (
        <div className="container">
            <div className="hero">
                <h1>Carbon Credit Monitoring Platform</h1>
                <p>Track your energy consumption, calculate emissions, and monitor your carbon footprint efficiently.</p>

                <div className="info-cards">
                    <div className="card">
                        <h3>Input Data</h3>
                        <p>Submit your monthly raw data for Diesel, LPG, PNG, Grid Power, and more.</p>
                    </div>
                    <div className="card">
                        <h3>Automated Calculations</h3>
                        <p>Our system automatically converts units to Energy (MJ) and calculates CO2 emissions.</p>
                    </div>
                    <div className="card">
                        <h3>Track KPIs</h3>
                        <p>Monitor Carbon Intensity, Renewable Energy %, and Energy Ratios through our interactive dashboard.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
