
import React from 'react';
import { ForecastData } from '../types/weather';

interface HourlyForecastProps {
  forecast: ForecastData;
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ forecast }) => {
  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const formatHour = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { 
      hour: 'numeric'
    });
  };

  const next24Hours = forecast.list.slice(0, 8);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
      <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-hide">
        {next24Hours.map((hour, index) => (
          <div
            key={hour.dt}
            className="flex-shrink-0 bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center min-w-[100px] hover:bg-white/15 transition-all duration-300 hover:scale-105"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="text-sm text-gray-400 mb-2">
              {index === 0 ? 'Now' : formatHour(hour.dt)}
            </div>
            <div className="mb-2">
              <img 
                src={getWeatherIcon(hour.weather[0].icon)} 
                alt={hour.weather[0].description}
                className="w-12 h-12 mx-auto"
              />
            </div>
            <div className="text-white font-semibold text-lg">
              {Math.round(hour.main.temp)}°
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {Math.round(hour.pop * 100)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;
