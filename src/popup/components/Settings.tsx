import React from 'react';
import { useSettings } from '../context/SettingsContext';
import '../styles/Settings.css';

const Settings: React.FC = () => {
  const { settings, updateSettings } = useSettings();

  const handleTemperatureUnitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as 'celsius' | 'fahrenheit';
    updateSettings({ ...settings, temperatureUnit: value });
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'light' | 'dark' | 'system';
    updateSettings({ ...settings, theme: value });
  };

  const handleNotificationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ ...settings, notificationsEnabled: e.target.checked });
  };

  return (
    <div className="settings-container">
      <h2 className="settings-title">Settings</h2>
      
      <div className="settings-section">
        <h3 className="section-title">Temperature Unit</h3>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="temperatureUnit"
              value="celsius"
              checked={settings.temperatureUnit === 'celsius'}
              onChange={handleTemperatureUnitChange}
            />
            Celsius (°C)
          </label>
          
          <label className="radio-label">
            <input
              type="radio"
              name="temperatureUnit"
              value="fahrenheit"
              checked={settings.temperatureUnit === 'fahrenheit'}
              onChange={handleTemperatureUnitChange}
            />
            Fahrenheit (°F)
          </label>
        </div>
      </div>
      
      <div className="settings-section">
        <h3 className="section-title">Theme</h3>
        <select 
          className="select-input"
          value={settings.theme}
          onChange={handleThemeChange}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System Default</option>
        </select>
      </div>
      
      <div className="settings-section">
        <h3 className="section-title">Notifications</h3>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={settings.notificationsEnabled}
            onChange={handleNotificationsChange}
          />
          Enable weather notifications
        </label>
        
        <p className="settings-description">
          Receive alerts for severe weather conditions and daily forecasts.
        </p>
      </div>
    </div>
  );
};

export default Settings;