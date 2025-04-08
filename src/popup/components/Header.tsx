import React from 'react';
import '../styles/Header.css';

const Header: React.FC = () => {
    return (
        <header className="header">
            <h1 className="header-title">WeatherNow</h1>
            <nav className="header-nav">
                <a href="#home">Home</a>
                <a href="#settings">Settings</a>
                <a href="#about">About</a>
            </nav>
        </header>
    );
};

export default Header;