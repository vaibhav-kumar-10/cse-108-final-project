import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StockChart = ({ symbol }) => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = 'lu139SXD8pwQNDYjEtqt1NYLHIfxAZpG'; // Should be hidden
  const BASE_URL = `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}?apiKey=${API_KEY}`);
        setStockData(response.data.results);
        setLoading(false);
        console.log('Succesfully fetched stock data');
        console.log(response.data.results);
      } catch (error) {
        console.error('Error fetching stock data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [symbol]);

  // Prepare data for chart
  const chartData = {
    labels: stockData.map((item) => item.timestamp), // X-axis: timestamps
    datasets: [
      {
        label: `${symbol} Stock Price`,
        data: stockData.map((item) => item.close), // Y-axis: closing prices
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Line data={chartData} />
      )}
    </div>
  );
};

export default StockChart;
