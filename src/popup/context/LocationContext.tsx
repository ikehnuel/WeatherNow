import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Location {
  city: string;
  country: string;
  lat: number;
  lon: number;
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

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [savedLocations, setSavedLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved locations from Chrome storage on mount
  useEffect(() => {
    chrome.storage.local.get(['savedLocations'], (result) => {
      if (result.savedLocations) {
        setSavedLocations(JSON.parse(result.savedLocations));
      }
    });
  }, []);

  // Save locations to Chrome storage when they change
  useEffect(() => {
    if (savedLocations.length > 0) {
      chrome.storage.local.set({ savedLocations: JSON.stringify(savedLocations) });
    }
  }, [savedLocations]);

  const detectLocation = async (): Promise<void> => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      const { latitude, longitude } = position.coords;
      
      // Reverse geocoding to get city and country
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=YOUR_API_KEY`
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
      if (!prev.some(loc => loc.city === location.city && loc.country === location.country)) {
        return [...prev, location];
      }
      return prev;
    });
  };

  const removeLocation = (locationId: string): void => {
    setSavedLocations(prev => prev.filter(loc => `${loc.city}-${loc.country}` !== locationId));
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
        setCurrentLocation
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