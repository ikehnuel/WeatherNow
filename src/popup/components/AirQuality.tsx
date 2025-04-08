import React, { useEffect, useState } from 'react';
import { fetchAirQuality } from '../utils/api';
import { AQI_LEVELS } from '../../constants';
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
  
  useEffect(() => {
    const getAirQuality = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchAirQuality(lat, lon);
        setAirQualityData(data.list[0]);
      } catch (err) {
        console.error('Error fetching air quality:', err);
        setError('Could not load air quality information');
      } finally {
        setLoading(false);
      }
    };
    
    if (lat && lon) {
      getAirQuality();
    }
  }, [lat, lon]);
  
  if (loading) {
    return <div className="air-quality-loader">Loading air quality data...</div>;
  }
  
  if (error || !airQualityData) {
    return <div className="air-quality-error">{error || 'No air quality data available'}</div>;
  }

  const { aqi, components } = airQualityData;
  const aqiInfo = AQI_LEVELS[aqi as keyof typeof AQI_LEVELS];

  return (
    <div className="air-quality-container">
      <h3 className="air-quality-title">Air Quality</h3>
      
      <div className="aqi-indicator" style={{ backgroundColor: aqiInfo.color }}>
        <span className="aqi-value">{aqi}</span>
        <span className="aqi-description">{aqiInfo.name}</span>
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
        <p className="air-quality-tip">{aqiInfo.description}</p>
      </div>
    </div>
  );
};

export default AirQuality;