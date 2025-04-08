import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_KEY } from '../../constants';

export interface Location {
  city: string;
  country: string;
  lat?: number;
  lon?: number;
}

interface LocationContextType {
  currentLocation: Location | null;
  savedLocations: Location[];
  isLoading: boolean;
  error: string | null;
  detectLocation: () => Promise<void>;
  addLocation: (location: Location) => void;
  removeLocation: (locationId: string) => void;
  setCurrentLocation: (location: Location) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const GEOCODING_API = 'https://api.openweathermap.org/geo/1.0';

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [savedLocations, setSavedLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved locations from Chrome storage on mount
  useEffect(() => {
    chrome.storage.local.get(['savedLocations', 'currentLocation'], (result) => {
      if (result.savedLocations) {
        setSavedLocations(JSON.parse(result.savedLocations));
      }
      if (result.currentLocation) {
        setCurrentLocation(JSON.parse(result.currentLocation));
      }
    });
  }, []);

  // Save locations to Chrome storage when they change
  useEffect(() => {
    if (savedLocations.length > 0) {
      chrome.storage.local.set({ savedLocations: JSON.stringify(savedLocations) });
    }
  }, [savedLocations]);

  // Save current location when it changes
  useEffect(() => {
    if (currentLocation) {
      chrome.storage.local.set({ currentLocation: JSON.stringify(currentLocation) });
    }
  }, [currentLocation]);

  const detectLocation = async (): Promise<void> => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });
      
      const { latitude, longitude } = position.coords;
      
      // Reverse geocoding to get city and country
      const response = await fetch(
        `${GEOCODING_API}/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to get location data');
      }
      
      const data = await response.json();
      if (data && data[0]) {
        const newLocation: Location = {
          city: data[0].name,
          country: data[0].country,
          lat: latitude,
          lon: longitude
        };
        
        setCurrentLocation(newLocation);
        // Automatically add to saved locations if not already there
        addLocation(newLocation);
      } else {
        throw new Error('No location data returned');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error detecting location:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addLocation = (location: Location): void => {
    setSavedLocations(prev => {
      // Check if location already exists to avoid duplicates
      if (!prev.some(loc => 
        loc.city === location.city && 
        loc.country === location.country
      )) {
        return [...prev, location];
      }
      return prev;
    });
  };

  const removeLocation = (locationId: string): void => {
    setSavedLocations(prev => prev.filter(loc => `${loc.city}-${loc.country}` !== locationId));
  };

  const updateCurrentLocation = (location: Location): void => {
    setCurrentLocation(location);
  };

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        savedLocations,
        isLoading,
        error,
        detectLocation,
        addLocation,
        removeLocation,
        setCurrentLocation: updateCurrentLocation
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};