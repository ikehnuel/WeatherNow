import React, { useState, useEffect } from 'react';
import Header from './Header';
import WeatherCard from './WeatherCard';
import FiveDayForecast from './FiveDayForecast';
import Settings from './Settings';
import TrendChart from './TrendChart';
import LocationSearch from './LocationSearch';
import SavedLocations from './SavedLocations';
import AnimatedWeatherIcon from './AnimatedWeatherIcon';
import AirQualityIndex from './AirQualityIndex';
import { WeatherProvider, useWeather } from '../context/WeatherContext';
import { LocationProvider, useLocation } from '../context/LocationContext';
import { SettingsProvider, useSettings } from '../context/SettingsContext';
import { applyTheme, listenForThemeChanges } from '../services/themeService';
import { requestNotificationPermission } from '../services/notificationService';
import '../styles/App.css';

// Tabs for navigation
enum Tab {
  Weather = 'weather',
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
  
  // Request notification permission if enabled
  useEffect(() => {
    if (settings.notificationsEnabled) {
      requestNotificationPermission();
    }
  }, [settings.notificationsEnabled]);
  
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
                    condition={weatherData.current.icon.split('@')[0].split('/').pop() || '01d'}
                    size="large" 
                    isDayTime={true} // You could determine day/night based on sunrise/sunset times
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
                
                {/* Air Quality Index */}
                {weatherData.location.lat && weatherData.location.lon && (
                  <AirQualityIndex 
                    lat={weatherData.location.lat} 
                    lon={weatherData.location.lon} 
                  />
                )}
                
                <FiveDayForecast city={weatherData.location.city} />
                
                {/* We'll add the trend chart when there's hourly data */}
                {hourlyData.length > 0 && <TrendChart hourlyData={hourlyData} />}
              </div>
              
              <div className="refresh-info">
                <button className="refresh-button-large" onClick={handleRefresh} disabled={loading}>
                  Refresh Data
                </button>
                <div className="last-updated-time">
                  {weatherData.lastUpdated && (
                    <span>
                      Last updated: {new Date(weatherData.lastUpdated).toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      );
    }
    
    return null;
  };
  
  return (
    <div className="app">
      <Header onTabChange={(tab) => setActiveTab(tab as Tab)} activeTab={activeTab} />
      <main className="main-content">
        {renderContent()}
      </main>
      <footer className="app-footer">
        <div className="footer-content">
          <span>WeatherNow v1.0</span>
          <span>Powered by OpenWeather</span>
        </div>
      </footer>
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