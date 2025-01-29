import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ApiDashboard.css';


const Tooltip = ({ children, text }) => (
    <div className="tooltip-container">
        {children}
        <span className="tooltip-text">{text}</span>
    </div>
);


const ApiDashboard = () => {
    const [apiData, setApiData] = useState([]);
    const [lastUpdated, setLastUpdated] = useState('');

    useEffect(() => {
        const fetchApiData = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_S3_BUCKET_URL);
                setApiData(response.data);

                // Obtiene el último campo checkedAt para mostrarlo en el header
                if (response.data.length > 0) {
                    const latestCheckedAt = response.data[0].checkedAt;
                    setLastUpdated(latestCheckedAt);
                }
            } catch (error) {
                console.error('Error fetching API data:', error);
            }
        };

        fetchApiData();
        const interval = setInterval(fetchApiData, 2 * 60 * 1000); // Actualizar cada 2 minutos
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="header-left">
                    <h1>Monitoreo APIs DataPower</h1>
                </div>
                <div className="header-right">
                    <p>Last updated: <span>{lastUpdated}</span></p>
                </div>
            </header>
            <main className="api-list">
                {apiData.map((api, index) => (
                    <Tooltip key={index} text={api.path}>
                        <div className="api-card">
                            <div className="api-details">
                                <h2>{api.id}</h2>
                                <h3>{api.cu}</h3>
                            </div>
                            <div className={`status ${api.status === 'UP' ? 'status-up' : 'status-down'}`}>
                                {api.status} <span className="status-circle"></span>
                            </div>
                        </div>
                    </Tooltip>
                ))}
            </main>
            <footer>
                <p>Build by oM</p>
            </footer>
        </div>
    );
};

export default ApiDashboard;
