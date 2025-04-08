import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WeatherResponse, ApiError } from '../../types';
import { fetchWeather } from '../utils/api';

interface WeatherContextType {
    weatherData: WeatherResponse | null;
    loading: boolean;
    error: ApiError | null;
    fetchWeatherForCity: (city: string) => Promise<void>;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiError | null>(null);

    const fetchWeatherForCity = async (city: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchWeather(city);
            
            // Transform the data to match our interface
            const transformedData: WeatherResponse = {
                location: {
                    city: data.name,
                    country: data.sys.country
                },
                current: {
                    temperature: data.main.temp,
                    description: data.weather[0].description,
                    icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
                }
            };
            
            setWeatherData(transformedData);
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

    return (
        <WeatherContext.Provider value={{ weatherData, loading, error, fetchWeatherForCity }}>
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