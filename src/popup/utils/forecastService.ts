import axios from 'axios';
import { ForecastData, HourlyForecast, Forecast, ApiError } from '../../types';

const API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast';

const getDayOfWeek = (dateStr: string): string => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
};

export const fetchForecast = async (city: string): Promise<Forecast> => {
  try {
    const response = await axios.get(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
    const data = response.data;
    
    // Process the forecast data into our desired format
    const processedData: Forecast = {
      daily: [],
      hourly: []
    };
    
    // Group forecast items by day
    const dailyMap = new Map<string, any[]>();
    
    data.list.forEach((item: any) => {
      const date = item.dt_txt.split(' ')[0];
      if (!dailyMap.has(date)) {
        dailyMap.set(date, []);
      }
      dailyMap.get(date)?.push(item);
    });
    
    // Process daily forecast
    dailyMap.forEach((items, date) => {
      // Calculate high and low temps for the day
      const temps = items.map(item => item.main.temp);
      const high = Math.max(...temps);
      const low = Math.min(...temps);
      
      // Get the weather from noon if available, otherwise from the first entry
      const midDayWeather = items.find(item => item.dt_txt.includes('12:00:00')) || items[0];
      
      const forecastData: ForecastData = {
        date,
        dayOfWeek: getDayOfWeek(date),
        high,
        low,
        description: midDayWeather.weather[0].description,
        icon: `http://openweathermap.org/img/wn/${midDayWeather.weather[0].icon}@2x.png`,
        precipitation: items.reduce((sum, item) => sum + (item.pop || 0), 0) / items.length * 100
      };
      
      processedData.daily.push(forecastData);
    });
    
    // Process hourly forecast for the next 24 hours
    const next24Hours = data.list.slice(0, 8); // 3-hour intervals for 24 hours
    
    processedData.hourly = next24Hours.map((item: any) => {
      const time = new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      return {
        time,
        temperature: item.main.temp,
        description: item.weather[0].description,
        icon: `http://openweathermap.org/img/wn/${item.weather[0].icon}.png`
      } as HourlyForecast;
    });
    
    return processedData;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw {
        message: error.response.data.message || 'Failed to fetch forecast data',
        code: error.response.status
      } as ApiError;
    }
    throw {
      message: 'Network error occurred',
      code: 0
    } as ApiError;
  }
};