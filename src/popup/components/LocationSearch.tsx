import React, { useState, useEffect, useRef } from 'react';
import { Location } from '../../types';
import { useLocation } from '../context/LocationContext';
import '../styles/LocationSearch.css';

interface LocationSuggestion {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

const LocationSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { addLocation, setCurrentLocation } = useLocation();
  const suggestionContainerRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const API_KEY = 'YOUR_API_KEY'; // Replace with your OpenWeather API key
  
  // Handle user input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Only search if query is at least 3 characters
    if (query.trim().length >= 3) {
      setIsLoading(true);
      
      // Debounce API call
      searchTimeoutRef.current = setTimeout(() => {
        fetchLocationSuggestions(query);
      }, 500);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };
  
  // Fetch location suggestions
  const fetchLocationSuggestions = async (query: string) => {
    try {
      const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch location suggestions');
      }
      
      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle suggestion selection
  const handleSelectLocation = (suggestion: LocationSuggestion) => {
    const selectedLocation: Location = {
      city: suggestion.name,
      country: suggestion.country,
      lat: suggestion.lat,
      lon: suggestion.lon
    };
    
    setCurrentLocation(selectedLocation);
    addLocation(selectedLocation);
    
    setSearchQuery(`${suggestion.name}, ${suggestion.country}`);
    setShowSuggestions(false);
  };
  
  // Close suggestions when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionContainerRef.current && 
        !suggestionContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="location-search">
      <div className="search-input-container" ref={suggestionContainerRef}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search for a location..."
          className="location-input"
        />
        
        {isLoading && <div className="loader"></div>}
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestion-list">
            {suggestions.map((suggestion, index) => (
              <div 
                key={index}
                className="suggestion-item"
                onClick={() => handleSelectLocation(suggestion)}
              >
                <span className="city-name">{suggestion.name}</span>
                <span className="country-name">
                  {suggestion.state ? `${suggestion.state}, ` : ''}
                  {suggestion.country}
                </span>
              </div>
            ))}
          </div>
        )}
        
        {showSuggestions && suggestions.length === 0 && !isLoading && (
          <div className="no-results">No locations found</div>
        )}
      </div>
    </div>
  );
};

export default LocationSearch;