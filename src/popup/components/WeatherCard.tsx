import React from 'react';
import '../styles/WeatherCard.css';

interface WeatherCardProps {
    city: string;
    temperature: number;
    description: string;
    icon: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ city, temperature, description, icon }) => {
    return (
        <div className="weather-card">
            <h2>{city}</h2>
            <img src={icon} alt={description} className="icon" />
            <p className="temperature">{temperature}°C</p>
            <p>{description}</p>
        </div>
    );
};

export default WeatherCard;