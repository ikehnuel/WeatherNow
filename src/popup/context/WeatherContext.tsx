import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WeatherResponse, ApiError } from '../../types';
import { fetchWeather } from '../utils/api';
import { checkWeatherAlerts } from '../services/notificationService';
import { useSettings } from './SettingsContext';

interface WeatherContextType {
    weatherData: WeatherResponse | null;
    loading: boolean;
    error: ApiError | null;
    fetchWeatherForCity: (city: string) => Promise<void>;
    refreshWeather: () => Promise<void>;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiError | null>(null);
    const { settings } = useSettings();
    
    // Refresh current weather data
    const refreshWeather = async (): Promise<void> => {
        if (!weatherData?.location.city) {
            return;
        }
        
        return fetchWeatherForCity(weatherData.location.city);
    };

    const fetchWeatherForCity = async (city: string): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchWeather(city);
            
            // Transform the data to match our interface with more details
            const transformedData: WeatherResponse = {
                location: {
                    city: data.name,
                    country: data.sys.country,
                    lat: data.coord.lat,
                    lon: data.coord.lon
                },
                current: {
                    temperature: data.main.temp,
                    feelsLike: data.main.feels_like,
                    description: data.weather[0].description,
                    humidity: data.main.humidity,
                    pressure: data.main.pressure,
                    windSpeed: data.wind.speed,
                    icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
                },
                lastUpdated: new Date().toISOString(),
                sys: {
                    sunrise: data.sys.sunrise,
                    sunset: data.sys.sunset
                }
            };
            
            setWeatherData(transformedData);
            
            // Check for weather alerts if enabled
            if (settings.notificationsEnabled) {
                checkWeatherAlerts(transformedData);
            }
        } catch (err) {
            setError({
                message: 'Failed to fetch weather data',
                code: 500
            });
            console.error('Error fetching weather:', err);
        } finally {
            setLoading(false);
        }
    };
    
    // Set up periodic weather refresh
    useEffect(() => {
        // Initial load - check if we have any saved data
        chrome.storage.local.get(['lastWeatherData'], (result) => {
            if (result.lastWeatherData) {
                setWeatherData(JSON.parse(result.lastWeatherData));
            }
        });
        
        // Refresh interval (every 30 minutes)
        const refreshInterval = setInterval(() => {
            if (weatherData) {
                refreshWeather();
            }
        }, 30 * 60 * 1000); // 30 minutes
        
        return () => clearInterval(refreshInterval);
    }, [weatherData]);
    
    // Save weather data to storage when it changes
    useEffect(() => {
        if (weatherData) {
            chrome.storage.local.set({ 
                lastWeatherData: JSON.stringify(weatherData) 
            });
        }
    }, [weatherData]);

    return (
        <WeatherContext.Provider value={{ 
            weatherData, 
            loading, 
            error, 
            fetchWeatherForCity,
            refreshWeather
        }}>
            {children}
        </WeatherContext.Provider>
    );
};

export const useWeather = (): WeatherContextType => {
    const context = useContext(WeatherContext);
    if (context === undefined) {
        throw new Error('useWeather must be used within a WeatherProvider');
    }
    return context;
};