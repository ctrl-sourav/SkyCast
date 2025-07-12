import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ForecastData } from '../types/weather';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface WeeklyChartProps {
  forecast: ForecastData;
}

const WeeklyChart: React.FC<WeeklyChartProps> = ({ forecast }) => {
  const getDailyData = () => {
    const dailyData: {
      [key: string]: { max: number; min: number; temps: number[]; dt: number };
    } = {};

    forecast.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toISOString().split('T')[0]; // "YYYY-MM-DD"
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = {
          max: item.main.temp_max,
          min: item.main.temp_min,
          temps: [],
          dt: item.dt,
        };
      }
      dailyData[dateKey].temps.push(item.main.temp);
      dailyData[dateKey].max = Math.max(dailyData[dateKey].max, item.main.temp_max);
      dailyData[dateKey].min = Math.min(dailyData[dateKey].min, item.main.temp_min);
    });

    const entries = Object.entries(dailyData).slice(0, 7);

    const labels = entries.map(([_, day]) =>
      new Date(day.dt * 1000).toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
    );

    const maxTemps = entries.map(([_, day]) => Math.round(day.max));
    const minTemps = entries.map(([_, day]) => Math.round(day.min));

    return { labels, maxTemps, minTemps };
  };

  const { labels, maxTemps, minTemps } = getDailyData();

  const data = {
    labels,
    datasets: [
      {
        label: 'Max Temperature',
        data: maxTemps,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: '+1',
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'Min Temperature',
        data: minTemps,
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        fill: 'origin',
        tension: 0.4,
        pointBackgroundColor: 'rgb(147, 51, 234)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'white',
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 10,
        displayColors: true,
        callbacks: {
          label: function (context: any) {
            return `${context.dataset.label}: ${context.parsed.y}°C`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
          callback: function (value: any) {
            return value + '°C';
          },
        },
      },
    },
    elements: {
      point: {
        hoverBackgroundColor: 'white',
      },
    },
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
      <div className="h-80">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default WeeklyChart;
