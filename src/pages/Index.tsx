
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Wind, Droplets, Eye, Gauge } from 'lucide-react';
import WeatherCard from '../components/WeatherCard';
import HourlyForecast from '../components/HourlyForecast';
import WeeklyChart from '../components/WeeklyChart';
import SearchBar from '../components/SearchBar';
import { WeatherData, ForecastData } from '../types/weather';
import { fetchWeatherData, fetchForecastData } from '../services/weatherService';
import { toast } from 'sonner';

const Index = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<string>('');

  useEffect(() => {
    getCurrentLocationWeather();
  }, []);

  const getCurrentLocationWeather = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            await fetchWeatherByCoords(latitude, longitude);
          } catch (error) {
            console.error('Error fetching weather by location:', error);
            toast.error('Failed to fetch weather for your location');
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLoading(false);
          toast.error('Location access denied. Please search for a city.');
        }
      );
    } else {
      setLoading(false);
      toast.error('Geolocation not supported by this browser');
    }
  };

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    try {
      const [weather, forecast] = await Promise.all([
        fetchWeatherData(lat, lon),
        fetchForecastData(lat, lon)
      ]);
      setWeatherData(weather);
      setForecastData(forecast);
      setLocation(`${weather.name}, ${weather.sys.country}`);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      toast.error('Failed to fetch weather data');
    }
  };

  const handleCitySearch = async (city: string) => {
    setLoading(true);
    try {
      const [weather, forecast] = await Promise.all([
        fetchWeatherData(city),
        fetchForecastData(city)
      ]);
      setWeatherData(weather);
      setForecastData(forecast);
      setLocation(`${weather.name}, ${weather.sys.country}`);
      toast.success(`Weather updated for ${weather.name}`);
    } catch (error) {
      console.error('Error searching city:', error);
      const errorMessage = error instanceof Error ? error.message : 'City not found. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherGradient = (condition: string) => {
    const conditions: { [key: string]: string } = {
      'clear': 'from-blue-900 via-blue-800 to-purple-900',
      'clouds': 'from-gray-800 via-gray-700 to-blue-900',
      'rain': 'from-gray-900 via-blue-900 to-gray-800',
      'snow': 'from-blue-900 via-indigo-800 to-purple-900',
      'thunderstorm': 'from-gray-900 via-purple-900 to-black',
      'default': 'from-slate-900 via-purple-900 to-slate-900'
    };
    
    return conditions[condition.toLowerCase()] || conditions.default;
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${weatherData ? getWeatherGradient(weatherData.weather[0].main) : 'from-slate-900 via-purple-900 to-slate-900'} transition-all duration-1000`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Weather Dashboard
          </h1>
          <p className="text-gray-300 text-lg">Your personal weather companion</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <SearchBar onSearch={handleCitySearch} loading={loading} />
        </div>

        {/* Current Location Button */}
        <div className="text-center mb-8">
          <button
            onClick={getCurrentLocationWeather}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MapPin className="w-5 h-5" />
            Use Current Location
          </button>
        </div>

        {loading && (
          <div className="text-center mb-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="text-white mt-2">Loading weather data...</p>
          </div>
        )}

        {weatherData && forecastData && (
          <div className="space-y-8 animate-fade-in">
            {/* Current Weather */}
            <div className="text-center mb-6">
              <h2 className="text-xl text-white/80 mb-2 flex items-center justify-center gap-2">
                <MapPin className="w-5 h-5" />
                {location}
              </h2>
            </div>

            <WeatherCard weather={weatherData} />

            {/* Hourly Forecast */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">Hourly Forecast</h3>
              <HourlyForecast forecast={forecastData} />
            </div>

            {/* Weekly Chart */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">7-Day Temperature Trend</h3>
              <WeeklyChart forecast={forecastData} />
            </div>
          </div>
        )}

        {!weatherData && !loading && (
          <div className="text-center py-16">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md mx-auto border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Welcome to Weather Dashboard</h3>
              <p className="text-gray-300 mb-6">
                Allow location access or search for a city to get started with real-time weather updates.
              </p>
              <button
                onClick={getCurrentLocationWeather}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-full transition-all duration-300 hover:scale-105"
              >
                Get Weather Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
