export interface WeatherData {
    temperature: number;
    description: string;
    icon: string;
    humidity?: number;
    windSpeed?: number;
    pressure?: number;
    feelsLike?: number;
}

export interface Location {
    city: string;
    country: string;
    lat?: number;
    lon?: number;
}

export interface WeatherResponse {
    location: Location;
    current: WeatherData;
    lastUpdated?: string;
}

export interface ForecastData {
    date: string;
    dayOfWeek: string;
    high: number;
    low: number;
    description: string;
    icon: string;
    precipitation: number;
}

export interface Forecast {
    daily: ForecastData[];
    hourly?: HourlyForecast[];
}

export interface HourlyForecast {
    time: string;
    temperature: number;
    description: string;
    icon: string;
}

export interface ApiError {
    message: string;
    code: number;
}

export interface UserPreferences {
    temperatureUnit: 'celsius' | 'fahrenheit';
    theme: 'light' | 'dark' | 'system';
    notificationsEnabled: boolean;
}