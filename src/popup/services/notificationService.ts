import { WeatherResponse } from '../../types';

interface NotificationOptions {
  title: string;
  message: string;
  iconUrl?: string;
}

/**
 * Creates and shows a Chrome notification
 */
export const showNotification = (options: NotificationOptions): void => {
  // Check if we have permission to show notifications
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return;
  }

  // For Chrome extension
  if (typeof chrome !== 'undefined' && chrome.notifications) {
    chrome.notifications.create({
      type: 'basic',
      title: options.title,
      message: options.message,
      iconUrl: options.iconUrl || 'icons/icon128.png'
    });
  } 
  // For web fallback
  else if (Notification.permission === 'granted') {
    new Notification(options.title, {
      body: options.message,
      icon: options.iconUrl
    });
  } 
  // Request permission if not granted
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(options.title, {
          body: options.message,
          icon: options.iconUrl
        });
      }
    });
  }
};

/**
 * Check weather conditions and send notifications if needed
 */
export const checkWeatherAlerts = (weatherData: WeatherResponse): void => {
  const { current, location } = weatherData;
  const conditions = [];

  // Check for extreme temperatures
  if (current.temperature > 35) {
    conditions.push('Extreme heat warning');
  } else if (current.temperature < -10) {
    conditions.push('Extreme cold warning');
  }

  // Check for severe weather conditions
  const severeWeatherConditions = ['thunderstorm', 'tornado', 'hurricane', 'snow'];
  const currentCondition = current.description.toLowerCase();
  
  for (const condition of severeWeatherConditions) {
    if (currentCondition.includes(condition)) {
      conditions.push(`${condition.charAt(0).toUpperCase() + condition.slice(1)} warning`);
      break;
    }
  }

  // Send notification if conditions warrant it
  if (conditions.length > 0) {
    showNotification({
      title: `Weather Alert for ${location.city}`,
      message: `Alert: ${conditions.join(', ')}`,
      iconUrl: current.icon
    });
  }
};

/**
 * Schedule a daily forecast notification
 */
export const scheduleDailyForecast = (time: string, enabled: boolean): void => {
  // Store the preference in chrome.storage
  chrome.storage.local.set({
    'dailyForecast': {
      time,
      enabled
    }
  });
  
  // This would typically be handled by the background script
  // Here's the setup code that would go in background.js
  console.log(`Daily forecast notification ${enabled ? 'enabled' : 'disabled'} for ${time}`);
};

/**
 * Request notification permission
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
};