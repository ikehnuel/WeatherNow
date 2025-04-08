import axios from 'axios';
import { ApiError } from '../../types';

const API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const fetchWeather = async (city: string) => {
    try {
        const response = await axios.get(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
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