# WeatherNow

WeatherNow is a Chrome extension that provides users with real-time weather information. This project is structured to ensure modularity and maintainability, making it easy to extend and modify.

## Project Structure

```
WeatherNow
├── public
│   ├── manifest.json        # Metadata for the Chrome extension
│   ├── index.html           # Main HTML file for the popup interface
│   └── icons                # Icons for the Chrome extension
│       ├── icon16.png
│       ├── icon48.png
│       └── icon128.png
├── src
│   ├── background
│   │   └── index.ts         # Background script for handling events
│   ├── content
│   │   └── index.tsx        # Entry point for the content script
│   ├── popup
│   │   ├── components        # React components for the popup interface
│   │   │   ├── App.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── WeatherCard.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── hooks            # Custom hooks for the popup
│   │   │   └── useWeather.ts
│   │   ├── styles           # CSS styles for the popup
│   │   │   ├── index.css
│   │   │   ├── Header.css
│   │   │   ├── WeatherCard.css
│   │   │   └── SearchBar.css
│   │   ├── utils            # Utility functions for API calls
│   │   │   └── api.ts
│   │   └── index.tsx        # Entry point for the popup interface
│   ├── types                # TypeScript types and interfaces
│   │   └── index.ts
│   └── assets               # Assets for the application
│       └── logo.svg
├── package.json             # npm configuration file
├── tsconfig.json            # TypeScript configuration file
├── webpack.config.js        # Webpack configuration file
└── README.md                # Project documentation
```

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd WeatherNow
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the project**:
   ```bash
   npm run build
   ```

4. **Load the extension in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable "Developer mode".
   - Click "Load unpacked" and select the `public` directory.

## Usage

Once the extension is loaded, click on the extension icon in the Chrome toolbar to open the WeatherNow popup. Enter a location in the search bar to get the current weather information.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.