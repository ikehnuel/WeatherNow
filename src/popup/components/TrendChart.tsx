import React, { useRef, useEffect, useState } from 'react';
import { HourlyForecast } from '../../types';
import { useSettings } from '../context/SettingsContext';
import '../styles/TrendChart.css';

interface TrendChartProps {
  hourlyData: HourlyForecast[];
}

type ChartType = 'temperature' | 'precipitation' | 'humidity' | 'wind';

const TrendChart: React.FC<TrendChartProps> = ({ hourlyData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { settings } = useSettings();
  const [chartType, setChartType] = useState<ChartType>('temperature');
  
  // Convert temperature based on user preference
  const convertTemperature = (temp: number): number => {
    if (settings.temperatureUnit === 'fahrenheit') {
      return (temp * 9/5) + 32;
    }
    return temp;
  };
  
  // Get chart data based on selected type
  const getChartData = (): { values: number[], color: string, unit: string, label: string } => {
    switch (chartType) {
      case 'temperature':
        return {
          values: hourlyData.map(hour => convertTemperature(hour.temperature)),
          color: '#ff6b6b',
          unit: settings.temperatureUnit === 'fahrenheit' ? '°F' : '°C',
          label: 'Temperature'
        };
      case 'precipitation':
        return {
          values: hourlyData.map(hour => hour.precipitation || 0),
          color: '#4dabf7',
          unit: '%',
          label: 'Precipitation'
        };
      case 'humidity':
        return {
          values: hourlyData.map(hour => hour.humidity || 0),
          color: '#74c0fc',
          unit: '%',
          label: 'Humidity'
        };
      case 'wind':
        return {
          values: hourlyData.map(hour => hour.windSpeed || 0),
          color: '#20c997',
          unit: 'm/s',
          label: 'Wind Speed'
        };
    }
  };

  useEffect(() => {
    if (!canvasRef.current || hourlyData.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Get chart configuration
    const chartData = getChartData();
    const values = chartData.values;
    const chartColor = chartData.color;
    const unit = chartData.unit;
    const times = hourlyData.map(hour => hour.time);
    
    // Find min and max for scaling
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue > 0 ? maxValue - minValue : 1;
    
    // Add padding to min/max
    const paddedMin = minValue - (valueRange * 0.1);
    const paddedMax = maxValue + (valueRange * 0.1);
    
    // Set chart dimensions
    const chartWidth = canvas.width - 40;
    const chartHeight = canvas.height - 40;
    const padding = 20;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Check theme
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    
    // Draw chart background
    ctx.fillStyle = isDarkMode ? 'rgba(49, 55, 74, 0.8)' : 'rgba(240, 248, 255, 0.8)';
    ctx.fillRect(padding, padding, chartWidth, chartHeight);
    
    // Draw grid lines
    ctx.strokeStyle = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    const horizontalLines = 5;
    for (let i = 0; i <= horizontalLines; i++) {
      const y = padding + (i / horizontalLines) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + chartWidth, y);
      ctx.stroke();
      
      // Add value labels to y axis
      const value = paddedMax - (i / horizontalLines) * (paddedMax - paddedMin);
      ctx.fillStyle = isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.5)';
      ctx.font = '10px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(`${Math.round(value * 10) / 10}${unit}`, padding - 5, y + 4);
    }
    
    // Vertical grid lines
    for (let i = 0; i < values.length; i++) {
      const x = padding + (i / (values.length - 1)) * chartWidth;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, padding + chartHeight);
      ctx.stroke();
    }
    
    // Draw data line
    ctx.strokeStyle = chartColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    values.forEach((value, i) => {
      const x = padding + (i / (values.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((value - paddedMin) / (paddedMax - paddedMin)) * chartHeight;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      
      // Draw data points
      ctx.fillStyle = chartColor;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw value labels
      ctx.fillStyle = isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.7)';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${Math.round(value * 10) / 10}${unit}`, x, y - 10);
      
      // Draw time labels
      ctx.fillText(times[i], x, padding + chartHeight + 15);
    });
    
    ctx.stroke();
    
    // Add chart title
    ctx.fillStyle = isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.7)';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(chartData.label, canvas.width / 2, 14);
    
  }, [hourlyData, settings.temperatureUnit, chartType]);

  return (
    <div className="trend-chart">
      <div className="chart-type-selector">
        <button 
          className={chartType === 'temperature' ? 'active' : ''} 
          onClick={() => setChartType('temperature')}
        >
          Temperature
        </button>
        <button 
          className={chartType === 'precipitation' ? 'active' : ''} 
          onClick={() => setChartType('precipitation')}
        >
          Precipitation
        </button>
        <button 
          className={chartType === 'humidity' ? 'active' : ''} 
          onClick={() => setChartType('humidity')}
        >
          Humidity
        </button>
        <button 
          className={chartType === 'wind' ? 'active' : ''} 
          onClick={() => setChartType('wind')}
        >
          Wind
        </button>
      </div>
      <canvas 
        ref={canvasRef} 
        width={500} 
        height={300} 
        className="temperature-canvas"
      />
      <div className="chart-footer">
        Hourly forecast for the next 24 hours
      </div>
    </div>
  );
};

export default TrendChart;