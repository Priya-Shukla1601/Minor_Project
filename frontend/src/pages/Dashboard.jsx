import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const userId = 'default_user'; // Hardcoded default user

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/carbon/entries/${userId}`);
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data", error);
        }
        setLoading(false);
    };

    return (
        <div className="container" style={{ width: '100%', maxWidth: '100%' }}>
            <h1 className="dashboard-title">Dashboard</h1>

            {/* Removed manual input form */}

            {loading && <p>Loading...</p>}

            {data.length > 0 && (
                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Month</th>
                                <th>Total Emissions (Kg CO2)</th>
                                <th>Total Energy (MJ)</th>
                                <th>Carbon Intensity (Kg/Ltr)</th>
                                <th>RE %</th>
                                <th>Energy Ratio (MJ/Ltr)</th>
                                <th>Production (Liters)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.month}</td>
                                    <td>{row.totalEmissions}</td>
                                    <td>{row.totalEnergy}</td>
                                    <td>{row.carbonIntensity}</td>
                                    <td>{row.rePercentage}%</td>
                                    <td>{row.energyRatio}</td>
                                    <td>{row.production}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!loading && data.length === 0 && (
                <p>No records found.</p>
            )}
        </div>
    );
};

export default Dashboard; // dashboard generated

