import React, { useEffect, useRef } from 'react';
import '../styles/AnimatedWeatherIcon.css';

interface AnimatedWeatherIconProps {
  condition: string;
  timeOfDay?: 'day' | 'night';
  size?: 'small' | 'medium' | 'large';
}

const AnimatedWeatherIcon: React.FC<AnimatedWeatherIconProps> = ({ 
  condition, 
  timeOfDay = 'day', 
  size = 'medium' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Normalize the weather condition to match our animation types
  const getNormalizedCondition = (): string => {
    const lowerCondition = condition.toLowerCase();
    
    if (lowerCondition.includes('clear')) return 'clear';
    if (lowerCondition.includes('cloud') && !lowerCondition.includes('scattered')) return 'partly-cloudy';
    if (lowerCondition.includes('scattered') || lowerCondition.includes('broken')) return 'cloudy';
    if (lowerCondition.includes('overcast')) return 'overcast';
    if (lowerCondition.includes('rain') && lowerCondition.includes('light')) return 'light-rain';
    if (lowerCondition.includes('rain')) return 'rain';
    if (lowerCondition.includes('storm') || lowerCondition.includes('thunder')) return 'thunderstorm';
    if (lowerCondition.includes('snow') && lowerCondition.includes('light')) return 'light-snow';
    if (lowerCondition.includes('snow')) return 'snow';
    if (lowerCondition.includes('mist') || lowerCondition.includes('fog')) return 'fog';
    
    return 'clear'; // Default fallback
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set up animation variables
    let animationFrameId: number;
    let particles: any[] = [];
    
    const normalizedCondition = getNormalizedCondition();
    const isDayTime = timeOfDay === 'day';
    
    // Set background color based on time of day
    const bgColor = isDayTime ? '#87CEEB' : '#1C2331';
    
    // Draw the base sky
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw the sun or moon
    if (normalizedCondition === 'clear' || normalizedCondition === 'partly-cloudy') {
      if (isDayTime) {
        // Sun
        ctx.fillStyle = '#FDB813';
        ctx.beginPath();
        ctx.arc(canvas.width * 0.75, canvas.height * 0.25, canvas.width * 0.15, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Moon
        ctx.fillStyle = '#FFFACD';
        ctx.beginPath();
        ctx.arc(canvas.width * 0.75, canvas.height * 0.25, canvas.width * 0.12, 0, Math.PI * 2);
        ctx.fill();
        
        // Moon craters
        ctx.fillStyle = '#E0E0D1';
        ctx.beginPath();
        ctx.arc(canvas.width * 0.78, canvas.height * 0.2, canvas.width * 0.03, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(canvas.width * 0.7, canvas.height * 0.29, canvas.width * 0.02, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Initialize particles based on weather condition
    const initializeParticles = () => {
      particles = [];
      
      switch (normalizedCondition) {
        case 'rain':
        case 'light-rain':
          const rainCount = normalizedCondition === 'light-rain' ? 30 : 70;
          for (let i = 0; i < rainCount; i++) {
            particles.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              length: canvas.height * (normalizedCondition === 'light-rain' ? 0.02 : 0.04),
              speed: canvas.height * (normalizedCondition === 'light-rain' ? 0.01 : 0.02),
            });
          }
          break;
          
        case 'snow':
        case 'light-snow':
          const snowCount = normalizedCondition === 'light-snow' ? 30 : 70;
          for (let i = 0; i < snowCount; i++) {
            particles.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              radius: canvas.width * (0.005 + Math.random() * 0.005),
              speed: canvas.height * (0.002 + Math.random() * 0.002),
              wind: Math.random() * 0.5 - 0.25,
            });
          }
          break;
          
        case 'thunderstorm':
          // Create some rain particles
          for (let i = 0; i < 50; i++) {
            particles.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              length: canvas.height * 0.04,
              speed: canvas.height * 0.02,
              type: 'rain'
            });
          }
          
          // Add lightning
          particles.push({
            nextFlash: 30 + Math.random() * 120,
            countdown: 0,
            type: 'lightning'
          });
          break;
          
        case 'fog':
          for (let i = 0; i < 5; i++) {
            particles.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              radius: canvas.width * 0.2,
              opacity: 0.2 + Math.random() * 0.3,
              speed: canvas.width * 0.0005,
              type: 'fog'
            });
          }
          break;
      }
    };
    
    // Draw clouds function
    const drawClouds = (coverage: number) => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      
      // Main cloud shape
      for (let i = 0; i < coverage; i++) {
        const cloudWidth = canvas.width * (0.3 + Math.random() * 0.3);
        const cloudHeight = cloudWidth * 0.6;
        const x = canvas.width * (i / coverage) * 0.8;
        const y = canvas.height * (0.2 + Math.random() * 0.1);
        
        ctx.beginPath();
        ctx.arc(x + cloudWidth * 0.3, y + cloudHeight * 0.5, cloudHeight * 0.5, 0, Math.PI * 2);
        ctx.arc(x + cloudWidth * 0.7, y + cloudHeight * 0.5, cloudHeight * 0.6, 0, Math.PI * 2);
        ctx.arc(x + cloudWidth * 0.5, y + cloudHeight * 0.3, cloudHeight * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    
    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw sun/moon for appropriate conditions
      if (normalizedCondition === 'clear' || normalizedCondition === 'partly-cloudy') {
        if (isDayTime) {
          // Sun
          ctx.fillStyle = '#FDB813';
          ctx.beginPath();
          ctx.arc(canvas.width * 0.75, canvas.height * 0.25, canvas.width * 0.15, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Moon
          ctx.fillStyle = '#FFFACD';
          ctx.beginPath();
          ctx.arc(canvas.width * 0.75, canvas.height * 0.25, canvas.width * 0.12, 0, Math.PI * 2);
          ctx.fill();
          
          // Moon craters
          ctx.fillStyle = '#E0E0D1';
          ctx.beginPath();
          ctx.arc(canvas.width * 0.78, canvas.height * 0.2, canvas.width * 0.03, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.beginPath();
          ctx.arc(canvas.width * 0.7, canvas.height * 0.29, canvas.width * 0.02, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      // Draw appropriate weather elements based on condition
      switch(normalizedCondition) {
        case 'partly-cloudy':
          drawClouds(2);
          break;
          
        case 'cloudy':
          drawClouds(3);
          break;
          
        case 'overcast':
          drawClouds(5);
          break;
          
        case 'rain':
        case 'light-rain':
          drawClouds(4);
          
          // Draw and update rain particles
          ctx.strokeStyle = 'rgba(174, 194, 224, 0.7)';
          ctx.lineWidth = 1;
          
          particles.forEach((drop, index) => {
            ctx.beginPath();
            ctx.moveTo(drop.x, drop.y);
            ctx.lineTo(drop.x, drop.y + drop.length);
            ctx.stroke();
            
            drop.y += drop.speed;
            
            if (drop.y > canvas.height) {
              drop.y = 0;
              drop.x = Math.random() * canvas.width;
            }
          });
          break;
          
        case 'snow':
        case 'light-snow':
          drawClouds(4);
          
          // Draw and update snow particles
          ctx.fillStyle = 'white';
          
          particles.forEach((flake, index) => {
            ctx.beginPath();
            ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
            ctx.fill();
            
            flake.y += flake.speed;
            flake.x += flake.wind;
            
            if (flake.y > canvas.height) {
              flake.y = 0;
              flake.x = Math.random() * canvas.width;
            }
            
            if (flake.x > canvas.width) flake.x = 0;
            if (flake.x < 0) flake.x = canvas.width;
          });
          break;
          
        case 'thunderstorm':
          drawClouds(5);
          
          // Dark clouds overlay
          ctx.fillStyle = 'rgba(62, 70, 89, 0.5)';
          ctx.fillRect(0, 0, canvas.width, canvas.height * 0.5);
          
          // Process lightning
          const lightning = particles.find(p => p.type === 'lightning');
          if (lightning) {
            lightning.countdown--;
            
            if (lightning.countdown <= 0) {
              // Flash lightning
              if (lightning.countdown > -5) {
                ctx.fillStyle = 'rgba(255, 255, 240, 0.7)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Draw lightning bolt
                ctx.strokeStyle = 'rgba(255, 250, 220, 0.9)';
                ctx.lineWidth = 3;
                
                const startX = canvas.width * (0.3 + Math.random() * 0.4);
                let x = startX;
                let y = canvas.height * 0.2;
                
                ctx.beginPath();
                ctx.moveTo(x, y);
                
                while (y < canvas.height * 0.7) {
                  x += (Math.random() - 0.5) * canvas.width * 0.1;
                  y += canvas.height * 0.1;
                  ctx.lineTo(x, y);
                }
                
                ctx.stroke();
              } else {
                // Reset for next flash
                lightning.countdown = lightning.nextFlash;
                lightning.nextFlash = 30 + Math.random() * 120;
              }
            }
          }
          
          // Draw and update rain particles
          ctx.strokeStyle = 'rgba(174, 194, 224, 0.7)';
          ctx.lineWidth = 1;
          
          particles.filter(p => p.type === 'rain').forEach(drop => {
            ctx.beginPath();
            ctx.moveTo(drop.x, drop.y);
            ctx.lineTo(drop.x, drop.y + drop.length);
            ctx.stroke();
            
            drop.y += drop.speed;
            
            if (drop.y > canvas.height) {
              drop.y = 0;
              drop.x = Math.random() * canvas.width;
            }
          });
          break;
          
        case 'fog':
          // Draw fog particles
          particles.forEach(fog => {
            const gradient = ctx.createRadialGradient(
              fog.x, fog.y, 0,
              fog.x, fog.y, fog.radius
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${fog.opacity})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(fog.x, fog.y, fog.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Slowly move fog
            fog.x += fog.speed;
            if (fog.x - fog.radius > canvas.width) {
              fog.x = -fog.radius;
              fog.y = Math.random() * canvas.height;
            }
          });
          break;
      }
      
      animationFrameId = window.requestAnimationFrame(animate);
    };
    
    // Initialize and start animation
    initializeParticles();
    animate();
    
    // Clean up
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [condition, timeOfDay]);

  return (
    <div className={`animated-weather-icon size-${size}`}>
      <canvas
        ref={canvasRef}
        width={size === 'small' ? 80 : size === 'medium' ? 120 : 200}
        height={size === 'small' ? 80 : size === 'medium' ? 120 : 200}
        className="weather-canvas"
      />
    </div>
  );
};

export default AnimatedWeatherIcon;