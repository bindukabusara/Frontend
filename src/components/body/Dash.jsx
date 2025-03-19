import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './dash.css';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [medicationData, setMedicationData] = useState([]);
  const [topMedications, setTopMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch medication data and top-selling medications
  useEffect(() => {
    const fetchData = async () => {
      try {
        const medsResponse = await axios.get('http://localhost:5009/api/medications');
        const topMedsResponse = await axios.get('http://localhost:5009/api/top-medications');

        setMedicationData(medsResponse.data);
        setTopMedications(topMedsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching medication data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Prepare chart data for medication analysis
  const chartData = {
    labels: medicationData.map((med) => med.name),
    datasets: [
      {
        label: 'Quantity Sold',
        data: medicationData.map((med) => med.quantitySold),
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
        tension: 0.1,
      },
    ],
  };

  // Side bar component
  const Sidebar = () => {
    return (
      <div className="sidebar">
        <ul>
          <li>Dashboard</li>
          <li>Medications</li>
          <li>Sales Analysis</li>
          <li>Settings</li>
        </ul>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="content">
        <h2>Dashboard</h2>
        {loading ? (
          <p>Loading data...</p>
        ) : (
          <>
            <div className="medication-analysis">
              <h3>Medication Sales Analysis</h3>
              <Line data={chartData} />
            </div>

            <div className="top-medications">
              <h3>Top Selling Medications</h3>
              <ul>
                {topMedications.map((med) => (
                  <li key={med.name}>
                    <strong>{med.name}</strong> - {med.quantitySold} sold
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
