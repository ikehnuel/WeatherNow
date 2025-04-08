import React, { useState, useEffect } from 'react';
import Header from './Header';
import WeatherCard from './WeatherCard';
import SearchBar from './SearchBar';
import FiveDayForecast from './FiveDayForecast';
import Settings from './Settings';
import TrendChart from './TrendChart';
import { WeatherProvider, useWeather } from '../context/WeatherContext';
import { LocationProvider, useLocation } from '../context/LocationContext';
import { SettingsProvider, useSettings } from '../context/SettingsContext';
import { applyTheme, listenForThemeChanges } from '../services/themeService';
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
  
  const handleSearch = (query: string) => {
    fetchWeatherForCity(query);
  };

  const handleRefresh = () => {
    refreshWeather();
  };
  
  const renderContent = () => {
    if (activeTab === Tab.Settings) {
      return <Settings />;
    }
    
    return (
      <>
        <div className="search-container">
          <SearchBar onSearch={handleSearch} />
          <button className="refresh-button" onClick={handleRefresh} disabled={loading}>
            ↻
          </button>
        </div>
        
        {(loading || locationLoading) && (
          <div className="loading">Loading weather data...</div>
        )}
        
        {error && (
          <div className="error-message">
            Error: {error.message} (Code: {error.code})
          </div>
        )}
        
        {weatherData && (
          <>
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
            
            <FiveDayForecast city={weatherData.location.city} />
            
            {/* We'll add the trend chart when there's hourly data */}
            {hourlyData.length > 0 && <TrendChart hourlyData={hourlyData} />}
          </>
        )}
      </>
    );
  };
  
  return (
    <div className="app">
      <Header onTabChange={(tab) => setActiveTab(tab as Tab)} activeTab={activeTab} />
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