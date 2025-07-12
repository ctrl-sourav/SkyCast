
import { WeatherData, ForecastData } from '../types/weather';

// You need to get your API key from https://openweathermap.org/api
// Replace 'YOUR_API_KEY_HERE' with your actual API key
const API_KEY = '44afccfc1e3ee0761420e320fb56cb24';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const fetchWeatherData = async (query: string | number, lon?: number): Promise<WeatherData> => {
  try {
    let url: string;
    
    if (typeof query === 'string') {
      // Search by city name
      url = `${BASE_URL}/weather?q=${encodeURIComponent(query)}&appid=${API_KEY}&units=metric`;
    } else {
      // Search by coordinates
      url = `${BASE_URL}/weather?lat=${query}&lon=${lon}&appid=${API_KEY}&units=metric`;
    }
    
    console.log('Fetching weather data from:', url.replace(API_KEY, 'API_KEY_HIDDEN'));
    
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
      } else if (response.status === 404) {
        throw new Error('City not found. Please check the city name and try again.');
      } else {
        throw new Error(`Weather API error: ${response.status} - ${response.statusText}`);
      }
    }
    
    const data: WeatherData = await response.json();
    console.log('Weather data received:', data);
    return data;
    
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export const fetchForecastData = async (query: string | number, lon?: number): Promise<ForecastData> => {
  try {
    let url: string;
    
    if (typeof query === 'string') {
      // Search by city name
      url = `${BASE_URL}/forecast?q=${encodeURIComponent(query)}&appid=${API_KEY}&units=metric`;
    } else {
      // Search by coordinates
      url = `${BASE_URL}/forecast?lat=${query}&lon=${lon}&appid=${API_KEY}&units=metric`;
    }
    
    console.log('Fetching forecast data from:', url.replace(API_KEY, 'API_KEY_HIDDEN'));
    
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
      } else if (response.status === 404) {
        throw new Error('City not found. Please check the city name and try again.');
      } else {
        throw new Error(`Forecast API error: ${response.status} - ${response.statusText}`);
      }
    }
    
    const data: ForecastData = await response.json();
    console.log('Forecast data received:', data);
    return data;
    
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    throw error;
  }
};
