export const API_KEY = 'YOUR_OPENWEATHER_API_KEY'; // Replace with your actual API key
export const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const WEATHER_ICONS = {
  '01d': 'clear-day',
  '01n': 'clear-night',
  '02d': 'partly-cloudy-day',
  '02n': 'partly-cloudy-night',
  '03d': 'cloudy',
  '03n': 'cloudy',
  '04d': 'cloudy',
  '04n': 'cloudy',
  '09d': 'rain',
  '09n': 'rain',
  '10d': 'rain',
  '10n': 'rain',
  '11d': 'thunderstorm',
  '11n': 'thunderstorm',
  '13d': 'snow',
  '13n': 'snow',
  '50d': 'fog',
  '50n': 'fog'
};

export const WEATHER_CONDITIONS = {
  200: { description: 'Thunderstorm with light rain', icon: 'thunderstorm' },
  201: { description: 'Thunderstorm with rain', icon: 'thunderstorm' },
  202: { description: 'Thunderstorm with heavy rain', icon: 'thunderstorm' },
  210: { description: 'Light thunderstorm', icon: 'thunderstorm' },
  211: { description: 'Thunderstorm', icon: 'thunderstorm' },
  212: { description: 'Heavy thunderstorm', icon: 'thunderstorm' },
  221: { description: 'Ragged thunderstorm', icon: 'thunderstorm' },
  230: { description: 'Thunderstorm with light drizzle', icon: 'thunderstorm' },
  231: { description: 'Thunderstorm with drizzle', icon: 'thunderstorm' },
  232: { description: 'Thunderstorm with heavy drizzle', icon: 'thunderstorm' },
  
  300: { description: 'Light intensity drizzle', icon: 'rain' },
  301: { description: 'Drizzle', icon: 'rain' },
  302: { description: 'Heavy intensity drizzle', icon: 'rain' },
  310: { description: 'Light intensity drizzle rain', icon: 'rain' },
  311: { description: 'Drizzle rain', icon: 'rain' },
  312: { description: 'Heavy intensity drizzle rain', icon: 'rain' },
  313: { description: 'Shower rain and drizzle', icon: 'rain' },
  314: { description: 'Heavy shower rain and drizzle', icon: 'rain' },
  321: { description: 'Shower drizzle', icon: 'rain' },
  
  500: { description: 'Light rain', icon: 'rain' },
  501: { description: 'Moderate rain', icon: 'rain' },
  502: { description: 'Heavy intensity rain', icon: 'rain' },
  503: { description: 'Very heavy rain', icon: 'rain' },
  504: { description: 'Extreme rain', icon: 'rain' },
  511: { description: 'Freezing rain', icon: 'sleet' },
  520: { description: 'Light intensity shower rain', icon: 'rain' },
  521: { description: 'Shower rain', icon: 'rain' },
  522: { description: 'Heavy intensity shower rain', icon: 'rain' },
  531: { description: 'Ragged shower rain', icon: 'rain' },
  
  600: { description: 'Light snow', icon: 'snow' },
  601: { description: 'Snow', icon: 'snow' },
  602: { description: 'Heavy snow', icon: 'snow' },
  611: { description: 'Sleet', icon: 'sleet' },
  612: { description: 'Light shower sleet', icon: 'sleet' },
  613: { description: 'Shower sleet', icon: 'sleet' },
  615: { description: 'Light rain and snow', icon: 'sleet' },
  616: { description: 'Rain and snow', icon: 'sleet' },
  620: { description: 'Light shower snow', icon: 'snow' },
  621: { description: 'Shower snow', icon: 'snow' },
  622: { description: 'Heavy shower snow', icon: 'snow' },
  
  701: { description: 'Mist', icon: 'fog' },
  711: { description: 'Smoke', icon: 'fog' },
  721: { description: 'Haze', icon: 'fog' },
  731: { description: 'Dust/sand whirls', icon: 'fog' },
  741: { description: 'Fog', icon: 'fog' },
  751: { description: 'Sand', icon: 'fog' },
  761: { description: 'Dust', icon: 'fog' },
  762: { description: 'Volcanic ash', icon: 'fog' },
  771: { description: 'Squalls', icon: 'wind' },
  781: { description: 'Tornado', icon: 'wind' },
  
  800: { description: 'Clear sky', icon: 'clear-day' },
  
  801: { description: 'Few clouds', icon: 'partly-cloudy-day' },
  802: { description: 'Scattered clouds', icon: 'partly-cloudy-day' },
  803: { description: 'Broken clouds', icon: 'cloudy' },
  804: { description: 'Overcast clouds', icon: 'cloudy' }
};

export const AQI_LEVELS = {
  1: { name: 'Good', color: '#8BC34A', description: 'Air quality is satisfactory, and air pollution poses little or no risk.' },
  2: { name: 'Fair', color: '#CDDC39', description: 'Air quality is acceptable; however, some pollutants may be a concern for a very small number of people.' },
  3: { name: 'Moderate', color: '#FFC107', description: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.' },
  4: { name: 'Poor', color: '#FF9800', description: 'Some members of the general public may experience health effects; members of sensitive groups may experience more serious effects.' },
  5: { name: 'Very Poor', color: '#F44336', description: 'Health alert: The risk of health effects is increased for everyone.' }
};