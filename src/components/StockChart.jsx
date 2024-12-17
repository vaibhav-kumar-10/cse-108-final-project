import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StockChart = ({ symbol, timeDuration }) => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = process.env.REACT_APP_POLYGON_API_KEY;
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 10);
  const formattedStartDate = startDate.toISOString().split('T')[0];
  const timeDurationString = {"1d": "1day", "1w": "1week", "6m": "6months", "1y": "1year", "5y": "5years"}[timeDuration];

  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const BASE_URL = `${backendUrl}/stocks/stock/${symbol}`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const authToken = localStorage.getItem('access_token');
        const response = await fetch(BASE_URL, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ time: timeDurationString}),
        });

        if (response.ok)
          console.log(response.json);
        else throw new Error("Failed to fetch stock data");
        const data = await response.json(); // Assuming the API returns an array of stock objects
        setStockData(data); // Update the stocks state with the fetched data
      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, timeDuration]);

  const chartData = {
    labels: stockData.map((item) => new Date(item.t).toLocaleDateString()),
    datasets: [
      {
        label: `${symbol} Stock Price`,
        data: stockData.map((item) => item.c),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : stockData.length > 0 ? (
        <Line data={chartData} />
      ) : (
        <p>No data available for {symbol}</p>
      )}
    </div>
  );
};

export default StockChart;