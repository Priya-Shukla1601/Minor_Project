import React, { useState } from 'react';
import axios from 'axios';

const InputForm = () => {
    const [formData, setFormData] = useState({
        userId: 'default_user', // Hardcoded as per request (simulating logged in user)
        month: '',
        diesel: '',
        biomass: '',
        lpg: '',
        png: '',
        fo: '',
        gridPower: '',
        rePpa: '',
        solar: '',
        production: ''
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!formData.month) {
            setError('Month is required');
            return;
        }

        // Treat empty fields as 0
        const submissionData = { ...formData };
        Object.keys(submissionData).forEach(key => {
            if (submissionData[key] === '') {
                submissionData[key] = '0';
            }
        });

        try {
            const response = await axios.post('http://localhost:5000/api/carbon/submit', submissionData);
            setMessage('Data submitted successfully!');
            // Reset form but keep user ID
            setFormData({ ...formData, month: '', diesel: '', biomass: '', lpg: '', png: '', fo: '', gridPower: '', rePpa: '', solar: '', production: '' });
        } catch (err) {
            console.error(err);
            setError('Failed to submit data. Please try again.');
        }
    };

    return (
        <div className="container" style={{ width: '100%', maxWidth: '100%' }}>
            <div className="form-container">
                <h2>Submit Monthly Data</h2>
                {message && <div style={{ color: 'green', marginBottom: '10px' }}>{message}</div>}
                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label>Month *</label>
                            <input type="month" name="month" value={formData.month} onChange={handleChange} className="form-control" />
                        </div>
                    </div>

                    <h3>Energy Inputs</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Diesel (HSD) (Liters)</label>
                            <input type="number" step="0.01" name="diesel" value={formData.diesel} onChange={handleChange} className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Biomass (MJ)</label>
                            <input type="number" step="0.01" name="biomass" value={formData.biomass} onChange={handleChange} className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>LPG (Kg)</label>
                            <input type="number" step="0.01" name="lpg" value={formData.lpg} onChange={handleChange} className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>PNG (SCM)</label>
                            <input type="number" step="0.01" name="png" value={formData.png} onChange={handleChange} className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Furnace Oil (Liters)</label>
                            <input type="number" step="0.01" name="fo" value={formData.fo} onChange={handleChange} className="form-control" />
                        </div>
                    </div>

                    <h3>Power Inputs</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Grid Power (kWh)</label>
                            <input type="number" step="0.01" name="gridPower" value={formData.gridPower} onChange={handleChange} className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>RE PPA (kWh)</label>
                            <input type="number" step="0.01" name="rePpa" value={formData.rePpa} onChange={handleChange} className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Solar Rooftop (kWh)</label>
                            <input type="number" step="0.01" name="solar" value={formData.solar} onChange={handleChange} className="form-control" />
                        </div>
                    </div>

                    <h3>Production</h3>
                    <div className="form-group full-width">
                        <label>Production (Liters)</label>
                        <input type="number" step="0.01" name="production" value={formData.production} onChange={handleChange} className="form-control" />
                    </div>

                    <button type="submit" className="btn-primary mt-4">Submit Data</button>
                </form>
            </div>
        </div>
    );
};

export default InputForm;
