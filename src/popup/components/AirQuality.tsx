import React, { useEffect, useState } from 'react';
import '../styles/AirQuality.css';

interface AirQualityProps {
  lat: number;
  lon: number;
}

interface AirQualityData {
  aqi: number;
  components: {
    co: number;
    no: number;
    no2: number;
    o3: number;
    so2: number;
    pm2_5: number;
    pm10: number;
    nh3: number;
  };
}

const AirQuality: React.FC<AirQualityProps> = ({ lat, lon }) => {
  const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const API_KEY = 'YOUR_API_KEY'; // Replace with your OpenWeather API key
  
  // Get air quality description based on index
  const getAirQualityDescription = (aqi: number): string => {
    switch(aqi) {
      case 1: return 'Good';
      case 2: return 'Fair';
      case 3: return 'Moderate';
      case 4: return 'Poor';
      case 5: return 'Very Poor';
      default: return 'Unknown';
    }
  };
  
  // Get color based on air quality index
  const getAirQualityColor = (aqi: number): string => {
    switch(aqi) {
      case 1: return '#8BC34A'; // Green
      case 2: return '#CDDC39'; // Lime
      case 3: return '#FFC107'; // Amber
      case 4: return '#FF9800'; // Orange
      case 5: return '#F44336'; // Red
      default: return '#9E9E9E'; // Grey
    }
  };
  
  useEffect(() => {
    const fetchAirQuality = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch air quality data');
        }
        
        const data = await response.json();
        setAirQualityData(data.list[0]);
      } catch (err) {
        console.error('Error fetching air quality:', err);
        setError('Could not load air quality information');
      } finally {
        setLoading(false);
      }
    };
    
    if (lat && lon) {
      fetchAirQuality();
    }
  }, [lat, lon]);
  
  if (loading) {
    return <div className="air-quality-loader">Loading air quality data...</div>;
  }
  
  if (error || !airQualityData) {
    return <div className="air-quality-error">{error || 'No air quality data available'}</div>;
  }

  const { aqi, components } = airQualityData;
  const aqiDescription = getAirQualityDescription(aqi);
  const aqiColor = getAirQualityColor(aqi);

  return (
    <div className="air-quality-container">
      <h3 className="air-quality-title">Air Quality</h3>
      
      <div className="aqi-indicator" style={{ backgroundColor: aqiColor }}>
        <span className="aqi-value">{aqi}</span>
        <span className="aqi-description">{aqiDescription}</span>
      </div>
      
      <div className="pollutants-grid">
        <div className="pollutant">
          <div className="pollutant-name">PM2.5</div>
          <div className="pollutant-value">{components.pm2_5.toFixed(1)} µg/m³</div>
        </div>
        
        <div className="pollutant">
          <div className="pollutant-name">PM10</div>
          <div className="pollutant-value">{components.pm10.toFixed(1)} µg/m³</div>
        </div>
        
        <div className="pollutant">
          <div className="pollutant-name">O₃</div>
          <div className="pollutant-value">{components.o3.toFixed(1)} µg/m³</div>
        </div>
        
        <div className="pollutant">
          <div className="pollutant-name">NO₂</div>
          <div className="pollutant-value">{components.no2.toFixed(1)} µg/m³</div>
        </div>
      </div>
      
      <div className="air-quality-info">
        <p className="air-quality-tip">
          {aqi <= 2 ? (
            'The air quality is good. Enjoy outdoor activities!'
          ) : aqi === 3 ? (
            'Moderate air quality. Consider reducing outdoor exercise if you experience symptoms.'
          ) : (
            'Poor air quality. Consider limiting outdoor activities.'
          )}
        </p>
      </div>
    </div>
  );
};

export default AirQuality;