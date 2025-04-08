// This file contains the background script for the Chrome extension, handling events and background tasks.

chrome.runtime.onInstalled.addListener(() => {
    console.log("WeatherNow extension installed.");
});

// Add any additional background event listeners or functions here.