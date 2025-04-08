import React from 'react';
import { useLocation } from '../context/LocationContext';
import '../styles/SavedLocations.css';

const SavedLocations: React.FC = () => {
  const { savedLocations, setCurrentLocation, removeLocation } = useLocation();
  
  // If there are no saved locations, don't render anything
  if (!savedLocations || savedLocations.length === 0) {
    return null;
  }
  
  return (
    <div className="saved-locations">
      <h3 className="locations-title">Saved Locations</h3>
      <div className="locations-list">
        {savedLocations.map((location, index) => (
          <div 
            key={`${location.city}-${location.country}-${index}`}
            className="location-item"
          >
            <div 
              className="location-name"
              onClick={() => setCurrentLocation(location)}
            >
              <span className="city">{location.city}</span>
              <span className="country">{location.country}</span>
            </div>
            <button 
              className="remove-button"
              onClick={() => removeLocation(`${location.city}-${location.country}`)}
              aria-label={`Remove ${location.city}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedLocations;