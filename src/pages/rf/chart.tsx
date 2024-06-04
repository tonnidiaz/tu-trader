import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

// Sample OHLC data
const ohlcData = [
  { open: 100, high: 105, low: 95, close: 102 },
  { open: 102, high: 110, low: 100, close: 108 },
  // Add more data as needed
];

// Function to calculate Heikin-Ashi data
const calculateHeikinAshi = (data) => {
  let haData = [];
  let previousHA = null;

  data.forEach((d, i) => {
    const haClose = (d.open + d.high + d.low + d.close) / 4;
    const haOpen = previousHA ? (previousHA.open + previousHA.close) / 2 : d.open;
    const haHigh = Math.max(d.high, haOpen, haClose);
    const haLow = Math.min(d.low, haOpen, haClose);

    const haCandle = {
      open: haOpen,
      high: haHigh,
      low: haLow,
      close: haClose,
    };

    haData.push(haCandle);
    previousHA = haCandle;
  });

  return haData;
};

const HeikinAshiChart = () => {
  const haData = calculateHeikinAshi(ohlcData);

  const chartData = {
    labels: haData.map((_, index) => index + 1), // X-axis labels
    datasets: [
      {
        label: 'Heikin-Ashi',
        data: haData.map(d => ({ x: d.open, y: d.close })),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        type: 'line',
        fill: false,
        borderWidth: 2,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        display: true,
      },
      y: {
        display: true,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default HeikinAshiChart;
