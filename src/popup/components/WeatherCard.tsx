import React from 'react';
import { useSettings } from '../context/SettingsContext';
import CurrentWeatherDetails from './CurrentWeatherDetails';
import '../styles/WeatherCard.css';

interface WeatherCardProps {
    city: string;
    temperature: number;
    description: string;
    icon: string;
    details?: {
        feelsLike?: number;
        humidity?: number;
        windSpeed?: number;
        pressure?: number;
    };
    sunrise?: number;
    sunset?: number;
    lastUpdated?: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ 
    city, 
    temperature, 
    description, 
    icon,
    details,
    sunrise,
    sunset,
    lastUpdated
}) => {
    const { settings } = useSettings();
    
    // Format temperature based on user preference
    const formatTemp = (temp: number): string => {
        if (settings.temperatureUnit === 'fahrenheit') {
            return `${Math.round((temp * 9/5) + 32)}°F`;
        }
        return `${Math.round(temp)}°C`;
    };

    return (
        <div className="weather-card">
            <h2>{city}</h2>
            <div className="weather-primary">
                <img src={icon} alt={description} className="icon" />
                <p className="temperature">{formatTemp(temperature)}</p>
            </div>
            <p className="description">{description}</p>
            
            {details && (
                <CurrentWeatherDetails 
                    data={{
                        temperature,
                        description,
                        icon,
                        ...details
                    }}
                    sunrise={sunrise}
                    sunset={sunset}
                    lastUpdated={lastUpdated}
                />
            )}
        </div>
    );
};

export default WeatherCard;