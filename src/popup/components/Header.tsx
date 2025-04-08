import React from 'react';
import '../styles/Header.css';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <header className="header">
      <h1 className="header-title">WeatherNow</h1>
      <nav className="header-nav">
        <a 
          href="#weather" 
          className={activeTab === 'weather' ? 'active' : ''} 
          onClick={(e) => {
            e.preventDefault();
            onTabChange('weather');
          }}
        >
          Home
        </a>
        <a 
          href="#settings" 
          className={activeTab === 'settings' ? 'active' : ''} 
          onClick={(e) => {
            e.preventDefault();
            onTabChange('settings');
          }}
        >
          Settings
        </a>
      </nav>
    </header>
  );
};

export default Header;