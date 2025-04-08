import React, { useState } from 'react';
import Header from './Header';
import WeatherCard from './WeatherCard';
import SearchBar from './SearchBar';
import { WeatherProvider, useWeather } from '../context/WeatherContext';
import '../styles/index.css';

// This is a wrapper component that uses the context
const WeatherDisplay: React.FC = () => {
    const { weatherData, loading, error, fetchWeatherForCity } = useWeather();

    const handleSearch = (query: string) => {
        fetchWeatherForCity(query);
    };

    return (
        <div className="app">
            <Header />
            <main className="main-content">
                <SearchBar onSearch={handleSearch} />
                
                {loading && <div className="loading">Loading weather data...</div>}
                
                {error && <div className="error-message">
                    Error: {error.message} (Code: {error.code})
                </div>}
                
                {weatherData && (
                    <WeatherCard 
                        city={`${weatherData.location.city}, ${weatherData.location.country}`}
                        temperature={weatherData.current.temperature}
                        description={weatherData.current.description}
                        icon={weatherData.current.icon}
                    />
                )}
            </main>
        </div>
    );
};

// The main App component that provides the context
const App: React.FC = () => {
    return (
        <WeatherProvider>
            <WeatherDisplay />
        </WeatherProvider>
    );
};

export default App;