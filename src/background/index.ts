// This file contains the background script for the Chrome extension, handling events and background tasks.

import { fetchWeather } from '../popup/utils/api';

chrome.runtime.onInstalled.addListener(() => {
    console.log("WeatherNow extension installed.");
    
    // Set up alarm for daily forecast (if enabled)
    chrome.storage.local.get(['dailyForecast'], (result) => {
        if (result.dailyForecast && result.dailyForecast.enabled) {
            setupDailyAlarm(result.dailyForecast.time);
        }
    });
});

// Listen for alarm events
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'dailyForecast') {
        sendDailyForecastNotification();
    }
});

// Set up daily forecast alarm based on user's preferred time
function setupDailyAlarm(timeString: string) {
    // Parse the time string (HH:MM)
    const [hours, minutes] = timeString.split(':').map(Number);
    
    // Calculate when the alarm should next fire
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours);
    scheduledTime.setMinutes(minutes);
    scheduledTime.setSeconds(0);
    
    // If the time has already passed today, schedule for tomorrow
    if (scheduledTime.getTime() < now.getTime()) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
    }
    
    // Calculate delay in minutes from now
    const delayInMinutes = (scheduledTime.getTime() - now.getTime()) / (1000 * 60);
    
    // Create or update the alarm
    chrome.alarms.create('dailyForecast', {
        delayInMinutes,
        periodInMinutes: 24 * 60 // Repeat daily
    });
}

// Send the daily forecast notification
async function sendDailyForecastNotification() {
    try {
        // Get the user's location
        const locationData = await chrome.storage.local.get(['currentLocation']);
        if (!locationData.currentLocation) {
            console.error('No location data available for notification');
            return;
        }
        
        const location = JSON.parse(locationData.currentLocation);
        
        // Fetch current weather data
        const weatherData = await fetchWeather(location.city);
        
        // Create notification
        chrome.notifications.create({
            type: 'basic',
            iconUrl: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`,
            title: `Today's Weather in ${weatherData.name}`,
            message: `${Math.round(weatherData.main.temp)}°C, ${weatherData.weather[0].description}. 
                    High: ${Math.round(weatherData.main.temp_max)}°C, 
                    Low: ${Math.round(weatherData.main.temp_min)}°C.`
        });
    } catch (error) {
        console.error('Error sending daily forecast notification:', error);
    }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'UPDATE_DAILY_FORECAST_SETTINGS') {
        const { enabled, time } = message.settings;
        
        if (enabled) {
            setupDailyAlarm(time);
        } else {
            chrome.alarms.clear('dailyForecast');
        }
        
        sendResponse({ success: true });
    }
    
    // Required for asynchronous response
    return true;
});