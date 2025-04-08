import axios from 'axios';
import { ApiError } from '../../types';
import { API_KEY, API_BASE_URL } from '../../constants';

// Cache for API responses
const cache: Record<string, { data: any, timestamp: number }> = {};
const CACHE_TIMEOUT = 10 * 60 * 1000; // 10 minutes

/**
 * Fetch weather data with caching
 */
export const fetchWeather = async (city: string) => {
    const cacheKey = `weather_${city.toLowerCase()}`;
    const cached = cache[cacheKey];
    
    // Return cached data if valid and not expired
    if (cached && (Date.now() - cached.timestamp < CACHE_TIMEOUT)) {
        return cached.data;
    }
    
    try {
        const response = await axios.get(`${API_BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`);
        
        // Cache the response
        cache[cacheKey] = {
            data: response.data,
            timestamp: Date.now()
        };
        
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const apiError: ApiError = {
                message: error.response.data.message || 'Failed to fetch weather data',
                code: error.response.status
            };
            throw apiError;
        }
        throw {
            message: 'Network error occurred',
            code: 0
        } as ApiError;
    }
};

/**
 * Fetch weather by coordinates
 */
export const fetchWeatherByCoordinates = async (lat: number, lon: number) => {
    const cacheKey = `weather_coord_${lat.toFixed(2)}_${lon.toFixed(2)}`;
    const cached = cache[cacheKey];
    
    if (cached && (Date.now() - cached.timestamp < CACHE_TIMEOUT)) {
        return cached.data;
    }
    
    try {
        const response = await axios.get(
            `${API_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        
        cache[cacheKey] = {
            data: response.data,
            timestamp: Date.now()
        };
        
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw {
                message: error.response.data.message || 'Failed to fetch weather data',
                code: error.response.status
            } as ApiError;
        }
        throw {
            message: 'Network error occurred',
            code: 0
        } as ApiError;
    }
};

/**
 * Fetch air quality data
 */
export const fetchAirQuality = async (lat: number, lon: number) => {
    const cacheKey = `air_${lat.toFixed(2)}_${lon.toFixed(2)}`;
    const cached = cache[cacheKey];
    
    if (cached && (Date.now() - cached.timestamp < CACHE_TIMEOUT)) {
        return cached.data;
    }
    
    try {
        const response = await axios.get(
            `${API_BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );
        
        cache[cacheKey] = {
            data: response.data,
            timestamp: Date.now()
        };
        
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw {
                message: error.response.data.message || 'Failed to fetch air quality data',
                code: error.response.status
            } as ApiError;
        }
        throw {
            message: 'Network error occurred',
            code: 0
        } as ApiError;
    }
};

/**
 * Clear all cached data
 */
export const clearCache = () => {
    Object.keys(cache).forEach(key => {
        delete cache[key];
    });
};