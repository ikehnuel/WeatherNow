import React from 'react';
import '../styles/Header.css';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  onTabChange, 
  onRefresh,
  isLoading = false
}) => {
  return (
    <header className="header">
      <div className="header-top">
        <h1 className="header-title">WeatherNow</h1>
        
        {onRefresh && (
          <button 
            className={`refresh-button ${isLoading ? 'loading' : ''}`} 
            onClick={onRefresh}
            disabled={isLoading}
            aria-label="Refresh weather data"
          >
            ↻
          </button>
        )}
      </div>
      
      <nav className="header-nav">
        <a 
          href="#weather" 
          className={activeTab === 'weather' ? 'active' : ''} 
          onClick={(e) => {
            e.preventDefault();
            onTabChange('weather');
          }}
        >
          Current
        </a>
        <a 
          href="#forecast" 
          className={activeTab === 'forecast' ? 'active' : ''} 
          onClick={(e) => {
            e.preventDefault();
            onTabChange('forecast');
          }}
        >
          Forecast
        </a>
        <a 
          href="#map" 
          className={activeTab === 'map' ? 'active' : ''} 
          onClick={(e) => {
            e.preventDefault();
            onTabChange('map');
          }}
        >
          Map
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