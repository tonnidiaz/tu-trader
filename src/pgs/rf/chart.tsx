/* import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
//import 'chartjs-chart-financial';
import { ChartData, ChartOptions } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  CandlestickController,
  CandlestickElement,
  Title,
  Tooltip,
  Legend
);

interface CandlestickDataPoint {
  t: Date;
  o: number;
  h: number;
  l: number; 
  c: number;
}

// Sample candlestick data
const candlestickData: CandlestickDataPoint[] = [
  { t: new Date(2023, 0, 1), o: 100, h: 105, l: 95, c: 102 },
  { t: new Date(2023, 0, 2), o: 102, h: 110, l: 100, c: 108 },
  // Add more data as needed
];

const data: ChartData<'candlestick', CandlestickDataPoint[]> = {
  datasets: [
    {
      label: 'Candlestick',
      data: candlestickData,
      borderColor: 'rgba(0, 0, 0, 1)',
    /*   color: {
        up: 'rgba(0, 200, 0, 1)',
        down: 'rgba(200, 0, 0, 1)',
        unchanged: 'rgba(0, 0, 0, 1)',
      }, 
    },
  ],
};

const options: ChartOptions<'candlestick'> = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Candlestick Chart',
    },
    tooltip: {
      mode: 'index',
      intersect: false,
    },
  },
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'day',
      },
      title: {
        display: true,
        text: 'Date',
      },
    },
    y: {
      title: {
        display: true,
        text: 'Price',
      },
    },
  },
};

const CandlestickChart: React.FC = () => {
    return <Chart type='candlestick' data={data} options={options} />;
  };
  
  export default CandlestickChart; */

  const Page = ( )=> <div></div>
  export default Page