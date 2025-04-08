import React, { useState, useEffect } from 'react';
import ForecastCard from './ForecastCard';
import { fetchForecast } from '../utils/forecastService';
import { Forecast, ApiError } from '../../types';
import '../styles/FiveDayForecast.css';

interface FiveDayForecastProps {
  city: string;
}

const FiveDayForecast: React.FC<FiveDayForecastProps> = ({ city }) => {
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    if (city) {
      setLoading(true);
      setError(null);

      fetchForecast(city)
        .then(data => {
          setForecast(data);
        })
        .catch(err => {
          setError(err);
          console.error('Error fetching forecast:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [city]);

  if (loading) {
    return <div className="forecast-loading">Loading forecast...</div>;
  }

  if (error) {
    return (
      <div className="forecast-error">
        Error loading forecast: {error.message}
      </div>
    );
  }

  if (!forecast) {
    return <div className="forecast-empty">No forecast data available</div>;
  }

  return (
    <div className="five-day-forecast">
      <h3 className="forecast-title">5-Day Forecast</h3>
      <div className="forecast-cards">
        {forecast.daily.map((day, index) => (
          <ForecastCard 
            key={day.date} 
            forecast={day} 
            hourlyData={index === 0 ? forecast.hourly : undefined} 
          />
        ))}
      </div>
    </div>
  );
};

export default FiveDayForecast;