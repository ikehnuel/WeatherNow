import React from 'react';
import { WeatherData } from '../../types';
import { useSettings } from '../context/SettingsContext';
import '../styles/CurrentWeatherDetails.css';

interface CurrentWeatherDetailsProps {
  data: WeatherData;
  sunrise?: number;
  sunset?: number;
  lastUpdated?: string;
}

const CurrentWeatherDetails: React.FC<CurrentWeatherDetailsProps> = ({ 
  data, 
  sunrise, 
  sunset, 
  lastUpdated 
}) => {
  const { settings } = useSettings();
  
  // Convert temperature based on user preference
  const formatTemperature = (temp: number): string => {
    if (settings.temperatureUnit === 'fahrenheit') {
      return `${Math.round((temp * 9/5) + 32)}°F`;
    }
    return `${Math.round(temp)}°C`;
  };
  
  // Format time from UNIX timestamp
  const formatTime = (timestamp?: number): string => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="weather-details">
      <div className="details-grid">
        <div className="detail-item">
          <span className="detail-label">Feels Like</span>
          <span className="detail-value">{data.feelsLike ? formatTemperature(data.feelsLike) : 'N/A'}</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Humidity</span>
          <span className="detail-value">{data.humidity ? `${data.humidity}%` : 'N/A'}</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Wind</span>
          <span className="detail-value">
            {data.windSpeed ? `${data.windSpeed} m/s` : 'N/A'}
          </span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Pressure</span>
          <span className="detail-value">{data.pressure ? `${data.pressure} hPa` : 'N/A'}</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Sunrise</span>
          <span className="detail-value">{formatTime(sunrise)}</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Sunset</span>
          <span className="detail-value">{formatTime(sunset)}</span>
        </div>
      </div>
      
      {lastUpdated && (
        <div className="last-updated">
          Last updated: {new Date(lastUpdated).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default CurrentWeatherDetails;