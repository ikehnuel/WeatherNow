import React, { useState, useEffect } from 'react';
import Header from './Header';
import WeatherCard from './WeatherCard';
import LocationSearch from './LocationSearch';
import SavedLocations from './SavedLocations';
import FiveDayForecast from './FiveDayForecast';
import Settings from './Settings';
import TrendChart from './TrendChart';
import AirQuality from './AirQuality';
import AnimatedWeatherIcon from './AnimatedWeatherIcon';
import WeatherMap from './WeatherMap';
import { WeatherProvider, useWeather } from '../context/WeatherContext';
import { LocationProvider, useLocation } from '../context/LocationContext';
import { SettingsProvider, useSettings } from '../context/SettingsContext';
import { applyTheme, listenForThemeChanges } from '../services/themeService';
import { API_KEY } from '../../constants';
import '../styles/App.css';

// Tabs for navigation
enum Tab {
  Weather = 'weather',
  Forecast = 'forecast',
  Map = 'map',
  Settings = 'settings'
}

// Weather display component
const WeatherDisplay: React.FC = () => {
  const { weatherData, loading, error, fetchWeatherForCity, refreshWeather } = useWeather();
  const { currentLocation, detectLocation, isLoading: locationLoading } = useLocation();
  const { settings } = useSettings();
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Weather);
  const [hourlyData, setHourlyData] = useState<any[]>([]);
  
  // Try to detect location on mount
  useEffect(() => {
    detectLocation().catch(console.error);
  }, [detectLocation]);
  
  // Fetch weather when location is detected
  useEffect(() => {
    if (currentLocation) {
      fetchWeatherForCity(currentLocation.city);
    }
  }, [currentLocation, fetchWeatherForCity]);
  
  // Apply theme changes when settings change
  useEffect(() => {
    applyTheme(settings.theme);
    
    // Listen for system theme changes if using system theme
    if (settings.theme === 'system') {
      listenForThemeChanges((isDark) => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      });
    }
  }, [settings.theme]);
  
  const handleRefresh = () => {
    refreshWeather();
  };
  
  const renderContent = () => {
    if (activeTab === Tab.Settings) {
      return <Settings />;
    }
    
    if (!weatherData) {
      return (
        <>
          <LocationSearch />
          
          {(loading || locationLoading) && (
            <div className="loading">Loading weather data...</div>
          )}
          
          {error && (
            <div className="error-message">
              Error: {error.message} (Code: {error.code})
            </div>
          )}
        </>
      );
    }
    
    if (activeTab === Tab.Weather) {
      return (
        <>
          <LocationSearch />
          <SavedLocations />
          
          {(loading || locationLoading) ? (
            <div className="loading">Loading weather data...</div>
          ) : (
            <>
              <div className="weather-overview">
                <div className="animated-icon-container">
                  <AnimatedWeatherIcon 
                    condition={weatherData.current.description}
                    timeOfDay={isDayTime(weatherData.sys?.sunrise, weatherData.sys?.sunset) ? 'day' : 'night'}
                    size="large"
                  />
                </div>
                
                <WeatherCard 
                  city={`${weatherData.location.city}, ${weatherData.location.country}`}
                  temperature={weatherData.current.temperature}
                  description={weatherData.current.description}
                  icon={weatherData.current.icon}
                  details={{
                    feelsLike: weatherData.current.feelsLike,
                    humidity: weatherData.current.humidity,
                    windSpeed: weatherData.current.windSpeed,
                    pressure: weatherData.current.pressure
                  }}
                  sunrise={weatherData.sys?.sunrise}
                  sunset={weatherData.sys?.sunset}
                  lastUpdated={weatherData.lastUpdated}
                />
              </div>
              
              {weatherData.location.lat && weatherData.location.lon && (
                <AirQuality 
                  lat={weatherData.location.lat} 
                  lon={weatherData.location.lon} 
                />
              )}
            </>
          )}
        </>
      );
    }
    
    if (activeTab === Tab.Forecast) {
      return (
        <>
          <LocationSearch />
          
          {(loading || locationLoading) ? (
            <div className="loading">Loading forecast data...</div>
          ) : (
            <>
              <div className="location-title">
                {weatherData.location.city}, {weatherData.location.country}
              </div>
              
              <FiveDayForecast city={weatherData.location.city} />
              
              {hourlyData.length > 0 && <TrendChart hourlyData={hourlyData} />}
            </>
          )}
        </>
      );
    }
    
    if (activeTab === Tab.Map) {
      return (
        <>
          <LocationSearch />
          
          {(loading || locationLoading) ? (
            <div className="loading">Loading map data...</div>
          ) : weatherData.location.lat && weatherData.location.lon ? (
            <WeatherMap 
              location={weatherData.location}
              apiKey={API_KEY}
            />
          ) : (
            <div className="error-message">
              Location coordinates not available for map view
            </div>
          )}
        </>
      );
    }
    
    return null;
  };
  
  // Helper function to determine if it's daytime
  const isDayTime = (sunrise?: number, sunset?: number): boolean => {
    if (!sunrise || !sunset) return true;
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    return now >= sunrise && now <= sunset;
  };
  
  return (
    <div className="app">
      <Header 
        onTabChange={(tab) => setActiveTab(tab as Tab)} 
        activeTab={activeTab}
        onRefresh={handleRefresh}
        isLoading={loading}
      />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
};

// Main App component with all providers
const App: React.FC = () => {
  return (
    <SettingsProvider>
      <LocationProvider>
        <WeatherProvider>
          <WeatherDisplay />
        </WeatherProvider>
      </LocationProvider>
    </SettingsProvider>
  );
};

export default App;