import React from 'react';
import { Wind, Droplets, Eye, Gauge } from 'lucide-react';
import { WeatherData } from '../types/weather';

interface WeatherCardProps {
  weather: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
  const mainWeather = weather.weather[0].main.toLowerCase();

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Determine animation class
  const getWeatherAnimation = () => {
    if (mainWeather.includes('rain')) return 'rain-animation';
    if (mainWeather.includes('thunderstorm')) return 'thunderstorm-animation';
    if (mainWeather.includes('cloud')) return 'cloudy-animation';
    if (mainWeather.includes('clear')) return 'sunny-animation';
    return '';
  };

  return (
    <div className={`relative overflow-hidden rounded-3xl shadow-2xl ${getWeatherAnimation()}`}>
      {/* Overlay animation layer */}
      <div className="absolute inset-0 pointer-events-none z-0"></div>

      {/* Weather Card Content */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md p-8 border border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-105">
        {/* Weather Icon and Temp */}
        <div className="text-center mb-8">
          <img src={iconUrl} alt={weather.weather[0].description} className="w-24 h-24 mx-auto animate-pulse" />
          <div className="text-6xl md:text-8xl font-bold text-white mb-2">{Math.round(weather.main.temp)}°</div>
          <div className="text-xl text-gray-300 capitalize mb-2">{weather.weather[0].description}</div>
          <div className="text-lg text-gray-400">Feels like {Math.round(weather.main.feels_like)}°</div>
        </div>

        {/* Grid Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Wind */}
          <div className="bg-white/5 rounded-2xl p-4 text-center hover:bg-white/10 transition-all duration-300">
            <Wind className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-sm text-gray-400">Wind</div>
            <div className="text-white font-semibold">{weather.wind.speed} m/s</div>
          </div>

          {/* Humidity */}
          <div className="bg-white/5 rounded-2xl p-4 text-center hover:bg-white/10 transition-all duration-300">
            <Droplets className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-sm text-gray-400">Humidity</div>
            <div className="text-white font-semibold">{weather.main.humidity}%</div>
          </div>

          {/* Visibility */}
          <div className="bg-white/5 rounded-2xl p-4 text-center hover:bg-white/10 transition-all duration-300">
            <Eye className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-sm text-gray-400">Visibility</div>
            <div className="text-white font-semibold">{(weather.visibility / 1000).toFixed(1)} km</div>
          </div>

          {/* Pressure */}
          <div className="bg-white/5 rounded-2xl p-4 text-center hover:bg-white/10 transition-all duration-300">
            <Gauge className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-sm text-gray-400">Pressure</div>
            <div className="text-white font-semibold">{weather.main.pressure} hPa</div>
          </div>
        </div>

        {/* Min / Max */}
        <div className="flex justify-center space-x-8 mb-6">
          <div className="text-center">
            <div className="text-sm text-gray-400">Min</div>
            <div className="text-xl text-white font-semibold">{Math.round(weather.main.temp_min)}°</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400">Max</div>
            <div className="text-xl text-white font-semibold">{Math.round(weather.main.temp_max)}°</div>
          </div>
        </div>

        {/* Sunrise / Sunset */}
        <div className="flex justify-center space-x-8">
          <div className="text-center">
            <div className="text-sm text-gray-400">Sunrise</div>
            <div className="text-white font-semibold">{formatTime(weather.sys.sunrise)}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400">Sunset</div>
            <div className="text-white font-semibold">{formatTime(weather.sys.sunset)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
