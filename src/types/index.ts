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
    sys?: {
        sunrise: number;
        sunset: number;
    }
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
    precipitation?: number; // Probability of precipitation in %
    humidity?: number;
    windSpeed?: number;
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

export interface NotificationSettings {
    dailyForecast: boolean;
    dailyForecastTime: string;
    severeWeatherAlerts: boolean;
    precipitationAlerts: boolean;
}