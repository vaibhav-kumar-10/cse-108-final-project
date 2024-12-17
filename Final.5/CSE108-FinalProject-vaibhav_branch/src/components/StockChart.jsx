import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StockChart = ({ symbol }) => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = process.env.REACT_APP_POLYGON_API_KEY;
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 10);
  const formattedStartDate = startDate.toISOString().split('T')[0];

  const BASE_URL = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${formattedStartDate}/${endDate}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Request URL:", `${BASE_URL}?apiKey=${API_KEY}`);
        console.log('apikey: ', `${API_KEY}`)
        const response = await axios.get(`${BASE_URL}?apiKey=${API_KEY}`);
        if (response.data && response.data.results) {
          setStockData(response.data.results);
        } else {
          console.error('No data available for this ticker.');
          setStockData([]);
        }
      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

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
