import React, { useEffect, useRef, useState } from 'react';
import { Location } from '../../types';
import '../styles/WeatherMap.css';

interface WeatherMapProps {
  location: Location;
  mapType?: 'precipitation' | 'temperature' | 'clouds' | 'wind';
}

const WeatherMap: React.FC<WeatherMapProps> = ({ 
  location,
  mapType = 'precipitation'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const API_KEY = 'YOUR_API_KEY'; // Replace with your OpenWeather API key
  
  // Get the appropriate layer based on map type
  const getMapLayer = (): string => {
    switch (mapType) {
      case 'precipitation': return 'precipitation_new';
      case 'temperature': return 'temp_new';
      case 'clouds': return 'clouds_new';
      case 'wind': return 'wind_new';
      default: return 'precipitation_new';
    }
  };
  
  useEffect(() => {
    const loadMap = async () => {
      try {
        if (!location.lat || !location.lon) {
          setError('Location coordinates not available');
          return;
        }
        
        // Check if the map container exists
        if (!mapContainerRef.current) return;
        
        // Create map image URL
        const mapUrl = `https://tile.openweathermap.org/map/${getMapLayer()}/1/${location.lon}/${location.lat}.png?appid=${API_KEY}`;
        
        // Create background map image
        const backgroundMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lon}&zoom=10&size=400x300&maptype=roadmap&key=YOUR_GOOGLE_MAPS_API_KEY`;
        
        // Set the map image as background
        mapContainerRef.current.style.backgroundImage = `url(${backgroundMapUrl})`;
        
        // Create overlay element for weather layer
        const overlay = document.createElement('div');
        overlay.className = 'weather-overlay';
        overlay.style.backgroundImage = `url(${mapUrl})`;
        
        // Clear previous overlays
        mapContainerRef.current.innerHTML = '';
        mapContainerRef.current.appendChild(overlay);
        
        setMapLoaded(true);
      } catch (err) {
        console.error('Error loading weather map:', err);
        setError('Failed to load weather map');
      }
    };
    
    if (location) {
      loadMap();
    }
  }, [location, mapType]);

  return (
    <div className="weather-map-container">
      <h3>Weather Map: {mapType.charAt(0).toUpperCase() + mapType.slice(1)}</h3>
      
      <div className="map-type-selector">
        <button className={mapType === 'precipitation' ? 'active' : ''}>Precipitation</button>
        <button className={mapType === 'temperature' ? 'active' : ''}>Temperature</button>
        <button className={mapType === 'clouds' ? 'active' : ''}>Clouds</button>
        <button className={mapType === 'wind' ? 'active' : ''}>Wind</button>
      </div>
      
      <div ref={mapContainerRef} className="map-container">
        {!mapLoaded && !error && <div className="map-loading">Loading map...</div>}
        {error && <div className="map-error">{error}</div>}
      </div>
      
      <div className="map-legend">
        {mapType === 'precipitation' && (
          <div className="legend-gradient precipitation-legend">
            <span>0 mm</span>
            <span>20+ mm</span>
          </div>
        )}
        
        {mapType === 'temperature' && (
          <div className="legend-gradient temperature-legend">
            <span>-20°C</span>
            <span>0°C</span>
            <span>20°C</span>
            <span>40°C</span>
          </div>
        )}
        
        {mapType === 'clouds' && (
          <div className="legend-gradient clouds-legend">
            <span>0%</span>
            <span>100%</span>
          </div>
        )}
        
        {mapType === 'wind' && (
          <div className="legend-gradient wind-legend">
            <span>0 m/s</span>
            <span>30+ m/s</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherMap;