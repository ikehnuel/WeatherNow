import React, { useRef, useEffect } from 'react';
import { HourlyForecast } from '../../types';
import { useSettings } from '../context/SettingsContext';
import '../styles/TrendChart.css';

interface TrendChartProps {
  hourlyData: HourlyForecast[];
}

const TrendChart: React.FC<TrendChartProps> = ({ hourlyData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { settings } = useSettings();
  
  // Convert temperature based on user preference
  const convertTemperature = (temp: number): number => {
    if (settings.temperatureUnit === 'fahrenheit') {
      return (temp * 9/5) + 32;
    }
    return temp;
  };

  useEffect(() => {
    if (!canvasRef.current || hourlyData.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Extract temperature data and convert if necessary
    const temperatures = hourlyData.map(hour => convertTemperature(hour.temperature));
    const times = hourlyData.map(hour => hour.time);
    
    // Find min and max for scaling
    const minTemp = Math.min(...temperatures) - 2;
    const maxTemp = Math.max(...temperatures) + 2;
    
    // Set chart dimensions
    const chartWidth = canvas.width - 40;
    const chartHeight = canvas.height - 40;
    const padding = 20;
    
    // Draw chart background
    ctx.fillStyle = 'rgba(240, 248, 255, 0.8)';
    ctx.fillRect(padding, padding, chartWidth, chartHeight);
    
    // Draw axes
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + chartHeight);
    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.stroke();
    
    // Draw temperature line
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    temperatures.forEach((temp, i) => {
      const x = padding + (i / (temperatures.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((temp - minTemp) / (maxTemp - minTemp)) * chartHeight;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      
      // Draw temperature points
      ctx.fillStyle = '#ff6b6b';
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw temperature labels
      ctx.fillStyle = '#333';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${Math.round(temp)}°`, x, y - 10);
      
      // Draw time labels
      if (i % 2 === 0) {
        ctx.fillText(times[i], x, padding + chartHeight + 15);
      }
    });
    
    ctx.stroke();
    
  }, [hourlyData, settings.temperatureUnit]);

  return (
    <div className="trend-chart">
      <h3 className="chart-title">Temperature Trend (24 Hours)</h3>
      <canvas 
        ref={canvasRef} 
        width={300} 
        height={200} 
        className="temperature-canvas"
      />
    </div>
  );
};

export default TrendChart;