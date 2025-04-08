import React, { useRef, useEffect } from 'react';
import { WEATHER_ICONS } from '../../constants';
import '../styles/AnimatedWeatherIcon.css';

interface AnimatedWeatherIconProps {
  condition: string;
  isDayTime?: boolean;
  size?: 'small' | 'medium' | 'large';
}

// Interface for various particle types
interface Particle {
  x?: number;
  y?: number;
  radius?: number;
  speedX?: number;
  speedY?: number;
  length?: number;
  speed?: number;
  opacity?: number;
  nextFlash?: number;
  countdown?: number;
  type: 'rain' | 'snow' | 'fog' | 'lightning';
}

const AnimatedWeatherIcon: React.FC<AnimatedWeatherIconProps> = ({ 
  condition, 
  isDayTime = true,
  size = 'medium'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationFrameId = useRef<number | null>(null);
  
  // Map OpenWeather icon codes to our normalized conditions
  const normalizedCondition = WEATHER_ICONS[condition] || 'clear-day';
  
  // Set background color based on day/night
  const bgColor = isDayTime ? 
    'linear-gradient(to bottom, #87CEEB, #ADD8E6)' :
    'linear-gradient(to bottom, #1a1a2e, #16213e)';
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      let multiplier;
      switch (size) {
        case 'small':
          multiplier = 0.8;
          break;
        case 'large':
          multiplier = 1.2;
          break;
        default:
          multiplier = 1;
      }
      
      canvas.width = 128 * multiplier;
      canvas.height = 128 * multiplier;
    };
    
    setCanvasDimensions();
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Initialize particles based on weather type
    particles.current = [];
    
    const initializeParticles = () => {
      // Clear existing particles
      particles.current = [];
      
      // Create different particle types based on weather condition
      switch (true) {
        case normalizedCondition.includes('rain'):
          for (let i = 0; i < 80; i++) {
            particles.current.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              length: canvas.height * 0.04,
              speed: canvas.height * 0.02,
              type: 'rain'
            });
          }
          
          // Add lightning if thunderstorm
          if (normalizedCondition.includes('thunder')) {
            particles.current.push({
              nextFlash: 30 + Math.random() * 120,
              countdown: 0,
              type: 'lightning'
            });
          }
          break;
          
        case normalizedCondition.includes('snow'):
          for (let i = 0; i < 60; i++) {
            particles.current.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              radius: 2 + Math.random() * 2,
              speedY: canvas.height * 0.002 + Math.random() * canvas.height * 0.002,
              speedX: (Math.random() - 0.5) * canvas.width * 0.001,
              type: 'snow'
            });
          }
          break;
          
        case normalizedCondition.includes('fog'):
          for (let i = 0; i < 5; i++) {
            particles.current.push({
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
      ctx.beginPath();
      ctx.arc(canvas.width * 0.5, canvas.height * 0.4, canvas.width * 0.15, 0, Math.PI * 2);
      ctx.arc(canvas.width * 0.63, canvas.height * 0.38, canvas.width * 0.15, 0, Math.PI * 2);
      ctx.arc(canvas.width * 0.37, canvas.height * 0.42, canvas.width * 0.12, 0, Math.PI * 2);
      ctx.arc(canvas.width * 0.75, canvas.height * 0.44, canvas.width * 0.12, 0, Math.PI * 2);
      ctx.arc(canvas.width * 0.25, canvas.height * 0.46, canvas.width * 0.10, 0, Math.PI * 2);
      ctx.fill();
      
      // Add clouds based on coverage (1-5 scale)
      if (coverage >= 3) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(canvas.width * 0.2, canvas.height * 0.3, canvas.width * 0.10, 0, Math.PI * 2);
        ctx.arc(canvas.width * 0.8, canvas.height * 0.25, canvas.width * 0.12, 0, Math.PI * 2);
        ctx.fill();
      }
      
      if (coverage >= 4) {
        ctx.fillStyle = 'rgba(230, 230, 230, 0.7)';
        ctx.beginPath();
        ctx.arc(canvas.width * 0.5, canvas.height * 0.2, canvas.width * 0.13, 0, Math.PI * 2);
        ctx.arc(canvas.width * 0.7, canvas.height * 0.15, canvas.width * 0.10, 0, Math.PI * 2);
        ctx.fill();
      }
      
      if (coverage >= 5) {
        ctx.fillStyle = 'rgba(200, 200, 200, 0.8)';
        ctx.beginPath();
        ctx.arc(canvas.width * 0.3, canvas.height * 0.1, canvas.width * 0.11, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    
    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      if (isDayTime) {
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#ADD8E6');
      } else {
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#16213e');
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw sun/moon for appropriate conditions
      if (normalizedCondition.includes('clear') || normalizedCondition.includes('partly-cloudy')) {
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
          ctx.fillStyle = 'rgba(200, 200, 200, 0.3)';
          ctx.beginPath();
          ctx.arc(canvas.width * 0.72, canvas.height * 0.22, canvas.width * 0.02, 0, Math.PI * 2);
          ctx.arc(canvas.width * 0.78, canvas.height * 0.28, canvas.width * 0.025, 0, Math.PI * 2);
          ctx.arc(canvas.width * 0.76, canvas.height * 0.17, canvas.width * 0.015, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      // Draw weather condition representations
      switch (normalizedCondition) {
        case 'clear-day':
          // Sun rays
          ctx.strokeStyle = '#FDB813';
          ctx.lineWidth = 2;
          for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI / 4);
            const length = canvas.width * 0.1;
            const startX = canvas.width * 0.75 + Math.cos(angle) * (canvas.width * 0.17);
            const startY = canvas.height * 0.25 + Math.sin(angle) * (canvas.width * 0.17);
            const endX = startX + Math.cos(angle) * length;
            const endY = startY + Math.sin(angle) * length;
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
          }
          break;
          
        case 'clear-night':
          // Stars
          ctx.fillStyle = 'white';
          for (let i = 0; i < 30; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height * 0.6;
            const size = Math.random() * 2 + 1;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
          }
          break;
          
        case 'partly-cloudy-day':
        case 'partly-cloudy-night':
          drawClouds(3);
          break;
          
        case 'cloudy':
          drawClouds(5);
          break;
          
        case 'rain':
          drawClouds(4);
          
          // Process rain particles
          particles.current.forEach(particle => {
            if (particle.type === 'rain') {
              ctx.strokeStyle = 'rgba(180, 220, 250, 0.7)';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(particle.x!, particle.y!);
              ctx.lineTo(particle.x!, particle.y! + particle.length!);
              ctx.stroke();
              
              particle.y! += particle.speed!;
              
              if (particle.y! > canvas.height) {
                particle.y = 0;
                particle.x = Math.random() * canvas.width;
              }
            }
          });
          break;
          
        case 'snow':
          drawClouds(4);
          
          // Process snow particles
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          particles.current.forEach(flake => {
            if (flake.type === 'snow') {
              ctx.beginPath();
              ctx.arc(flake.x!, flake.y!, flake.radius!, 0, Math.PI * 2);
              ctx.fill();
              
              flake.y! += flake.speedY!;
              flake.x! += flake.speedX!;
              
              if (flake.y! > canvas.height) {
                flake.y = 0;
                flake.x = Math.random() * canvas.width;
              }
              
              if (flake.x! > canvas.width) flake.x = 0;
              if (flake.x! < 0) flake.x = canvas.width;
            }
          });
          break;
          
        case 'thunderstorm':
          drawClouds(5);
          
          // Dark clouds overlay
          ctx.fillStyle = 'rgba(62, 70, 89, 0.5)';
          ctx.fillRect(0, 0, canvas.width, canvas.height * 0.5);
          
          // Process lightning
          const lightning = particles.current.find(p => p.type === 'lightning');
          if (lightning) {
            lightning.countdown!--;
            
            if (lightning.countdown! <= 0) {
              // Flash lightning
              if (lightning.countdown! > -5) {
                ctx.fillStyle = 'rgba(255, 255, 240, 0.7)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Draw lightning bolt
                ctx.strokeStyle = 'rgba(255, 250, 220, 0.9)';
                ctx.lineWidth = 3;
                ctx.beginPath();
                
                const startX = canvas.width * (0.3 + Math.random() * 0.4);
                let x = startX;
                let y = canvas.height * 0.2;
                
                ctx.moveTo(x, y);
                
                // Create zigzag pattern
                while (y < canvas.height * 0.7) {
                  x += (Math.random() - 0.5) * canvas.width * 0.15;
                  y += canvas.height * 0.1;
                  ctx.lineTo(x, y);
                }
                
                ctx.stroke();
              } else {
                // Reset lightning timer
                lightning.countdown = lightning.nextFlash!;
                lightning.nextFlash = 50 + Math.random() * 150;
              }
            }
          }
          
          // Process rain with lightning
          particles.current.forEach(particle => {
            if (particle.type === 'rain') {
              ctx.strokeStyle = 'rgba(180, 220, 250, 0.7)';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(particle.x!, particle.y!);
              ctx.lineTo(particle.x!, particle.y! + particle.length!);
              ctx.stroke();
              
              particle.y! += particle.speed!;
              
              if (particle.y! > canvas.height) {
                particle.y = 0;
                particle.x = Math.random() * canvas.width;
              }
            }
          });
          break;
          
        case 'fog':
          // Process fog particles
          particles.current.forEach(particle => {
            if (particle.type === 'fog') {
              ctx.fillStyle = `rgba(220, 220, 230, ${particle.opacity})`;
              ctx.beginPath();
              ctx.arc(particle.x!, particle.y!, particle.radius!, 0, Math.PI * 2);
              ctx.fill();
              
              particle.x! += particle.speed!;
              
              if (particle.x! > canvas.width + particle.radius!) {
                particle.x = -particle.radius!;
              }
            }
          });
          
          // Add ground fog effect
          ctx.fillStyle = 'rgba(230, 230, 240, 0.6)';
          ctx.fillRect(0, canvas.height * 0.6, canvas.width, canvas.height * 0.4);
          break;
      }
      
      // Continue animation
      animationFrameId.current = requestAnimationFrame(animate);
    };
    
    // Initialize and start animation
    initializeParticles();
    animate();
    
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [normalizedCondition, isDayTime, size]);
  
  return (
    <div className={`animated-weather-icon icon-size-${size}`}>
      <canvas ref={canvasRef} className="weather-canvas"></canvas>
    </div>
  );
};

export default AnimatedWeatherIcon;