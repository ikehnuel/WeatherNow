import React from 'react';
import { render, screen } from '@testing-library/react';
import WeatherCard from '../popup/components/WeatherCard';
import { SettingsProvider } from '../popup/context/SettingsContext';

// Mock the SettingsContext since WeatherCard depends on it
jest.mock('../popup/context/SettingsContext', () => ({
  useSettings: () => ({
    settings: {
      temperatureUnit: 'celsius',
      theme: 'light',
      notificationsEnabled: false
    }
  }),
  SettingsProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

describe('WeatherCard Component', () => {
  const mockProps = {
    city: 'London, GB',
    temperature: 15,
    description: 'Cloudy',
    icon: 'http://openweathermap.org/img/wn/04d@2x.png'
  };

  test('renders city name correctly', () => {
    render(<WeatherCard {...mockProps} />);
    expect(screen.getByText('London, GB')).toBeInTheDocument();
  });

  test('renders temperature correctly', () => {
    render(<WeatherCard {...mockProps} />);
    expect(screen.getByText('15°C')).toBeInTheDocument();
  });

  test('renders weather description', () => {
    render(<WeatherCard {...mockProps} />);
    expect(screen.getByText('Cloudy')).toBeInTheDocument();
  });

  test('renders weather icon', () => {
    render(<WeatherCard {...mockProps} />);
    const image = screen.getByAltText('Cloudy');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'http://openweathermap.org/img/wn/04d@2x.png');
  });

  test('renders additional details when provided', () => {
    const propsWithDetails = {
      ...mockProps,
      details: {
        feelsLike: 14,
        humidity: 78,
        windSpeed: 5.2,
        pressure: 1012
      },
      sunrise: 1616835072,
      sunset: 1616878030,
      lastUpdated: '2023-04-08T10:00:00Z'
    };
    
    render(<WeatherCard {...propsWithDetails} />);
    expect(screen.getByText('Feels Like')).toBeInTheDocument();
    expect(screen.getByText('Humidity')).toBeInTheDocument();
    expect(screen.getByText('Wind')).toBeInTheDocument();
    expect(screen.getByText('Pressure')).toBeInTheDocument();
  });
});