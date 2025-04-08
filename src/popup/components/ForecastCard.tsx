import React, { useState } from 'react';
import { ForecastData, HourlyForecast } from '../../types';
import '../styles/ForecastCard.css';

interface ForecastCardProps {
  forecast: ForecastData;
  hourlyData?: HourlyForecast[];
}

const ForecastCard: React.FC<ForecastCardProps> = ({ forecast, hourlyData }) => {
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  
  return (
    <div className={`forecast-card ${expanded ? 'expanded' : ''}`}>
      <div className="forecast-card-header" onClick={toggleExpand}>
        <div className="day-info">
          <span className="day">{forecast.dayOfWeek}</span>
          <span className="date">{new Date(forecast.date).toLocaleDateString()}</span>
        </div>
        
        <div className="forecast-summary">
          <img 
            src={forecast.icon} 
            alt={forecast.description} 
            className="forecast-icon"
          />
          <div className="temp-range">
            <span className="high">{Math.round(forecast.high)}°</span>
            <span className="low">{Math.round(forecast.low)}°</span>
          </div>
        </div>
        
        <div className="precipitation">
          <span>{Math.round(forecast.precipitation)}% rain</span>
        </div>
        
        <span className={`expand-arrow ${expanded ? 'up' : 'down'}`}>
          {expanded ? '▲' : '▼'}
        </span>
      </div>
      
      {expanded && hourlyData && (
        <div className="hourly-forecast">
          <h4>Hourly Forecast</h4>
          <div className="hourly-list">
            {hourlyData.map((hour, index) => (
              <div key={index} className="hourly-item">
                <span className="time">{hour.time}</span>
                <img 
                  src={hour.icon} 
                  alt={hour.description} 
                  className="hourly-icon"
                />
                <span className="temp">{Math.round(hour.temperature)}°</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ForecastCard;