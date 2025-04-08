import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserPreferences } from '../../types';

interface SettingsContextType {
  settings: UserPreferences;
  updateSettings: (newSettings: UserPreferences) => void;
}

const defaultSettings: UserPreferences = {
  temperatureUnit: 'celsius',
  theme: 'light',
  notificationsEnabled: false
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<UserPreferences>(defaultSettings);

  // Load settings from storage on mount
  useEffect(() => {
    chrome.storage.local.get(['userSettings'], (result) => {
      if (result.userSettings) {
        setSettings(JSON.parse(result.userSettings));
      }
    });
  }, []);

  // Apply theme when settings change
  useEffect(() => {
    let theme = settings.theme;
    
    // Handle system preference
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = prefersDark ? 'dark' : 'light';
    }
    
    document.documentElement.setAttribute('data-theme', theme);
  }, [settings.theme]);

  const updateSettings = (newSettings: UserPreferences): void => {
    setSettings(newSettings);
    chrome.storage.local.set({ userSettings: JSON.stringify(newSettings) });
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};