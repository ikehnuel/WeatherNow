import React, { useEffect, useRef, useState } from 'react';
import { Location } from '../../types';
import { useSettings } from '../context/SettingsContext';
import '../styles/WeatherMap.css';

interface WeatherMapProps {
  location: Location;
  apiKey: string;
}

type MapType = 'precipitation' | 'temperature' | 'clouds' | 'wind' | 'pressure';

const WeatherMap: React.FC<WeatherMapProps> = ({ location, apiKey }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapType, setMapType] = useState<MapType>('precipitation');
  const { settings } = useSettings();
  
  // Get the appropriate layer based on map type
  const getMapLayer = (): string => {
    switch (mapType) {
      case 'precipitation': return 'precipitation_new';
      case 'temperature': return 'temp_new';
      case 'clouds': return 'clouds_new';
      case 'wind': return 'wind_new';
      case 'pressure': return 'pressure_new';
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
        
        setMapLoaded(false);
        setError(null);
        
        // Check if the map container exists
        if (!mapContainerRef.current) return;
        
        // Create map image URL - using OpenWeatherMap tile API
        const layer = getMapLayer();
        const zoom = 8;
        const mapUrl = `https://tile.openweathermap.org/map/${layer}/${zoom}/${Math.floor(location.lon)}/${Math.floor(location.lat)}.png?appid=${apiKey}`;
        
        // Create background map - for a real application, you'd use a proper mapping API like Leaflet or Google Maps
        // This is a simplified approach for demonstration purposes
        const backgroundMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lon}&zoom=8&size=600x400&maptype=roadmap&key=YOUR_GOOGLE_MAPS_API_KEY`;
        
        // For demo purposes, we're using a placeholder background
        const isDarkMode = settings.theme === 'dark' || 
          (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        const mapBg = isDarkMode ? '#1a2035' : '#e8eaed';
        
        // Set background color
        mapContainerRef.current.style.backgroundColor = mapBg;
        
        // Create overlay element for weather layer
        const overlay = document.createElement('div');
        overlay.className = 'weather-overlay';
        overlay.style.opacity = '0';
        
        // Load the weather layer
        const img = new Image();
        img.onload = () => {
          overlay.style.backgroundImage = `url(${mapUrl})`;
          overlay.style.opacity = '0.7';
          setMapLoaded(true);
        };
        img.onerror = () => {
          setError('Failed to load weather map layer');
        };
        img.src = mapUrl;
        
        // Clear previous overlays
        mapContainerRef.current.innerHTML = '';
        mapContainerRef.current.appendChild(overlay);
        
        // Add location marker
        const marker = document.createElement('div');
        marker.className = 'location-marker';
        marker.style.left = '50%';
        marker.style.top = '50%';
        mapContainerRef.current.appendChild(marker);
        
        // Add location label
        const label = document.createElement('div');
        label.className = 'location-label';
        label.textContent = `${location.city}, ${location.country}`;
        label.style.left = '50%';
        label.style.top = 'calc(50% + 15px)';
        mapContainerRef.current.appendChild(label);
      } catch (err) {
        console.error('Error loading weather map:', err);
        setError('Failed to load weather map');
      }
    };
    
    if (location) {
      loadMap();
    }
  }, [location, mapType, apiKey, settings.theme]);

  return (
    <div className="weather-map-container">
      <h3>Weather Map</h3>
      
      <div className="map-type-selector">
        <button 
          className={mapType === 'precipitation' ? 'active' : ''} 
          onClick={() => setMapType('precipitation')}
        >
          Precipitation
        </button>
        <button 
          className={mapType === 'temperature' ? 'active' : ''} 
          onClick={() => setMapType('temperature')}
        >
          Temperature
        </button>
        <button 
          className={mapType === 'clouds' ? 'active' : ''} 
          onClick={() => setMapType('clouds')}
        >
          Clouds
        </button>
        <button 
          className={mapType === 'wind' ? 'active' : ''} 
          onClick={() => setMapType('wind')}
        >
          Wind
        </button>
        <button 
          className={mapType === 'pressure' ? 'active' : ''} 
          onClick={() => setMapType('pressure')}
        >
          Pressure
        </button>
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
        
        {mapType === 'pressure' && (
          <div className="legend-gradient pressure-legend">
            <span>950 hPa</span>
            <span>1050 hPa</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherMap;