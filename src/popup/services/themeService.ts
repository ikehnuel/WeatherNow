type Theme = 'light' | 'dark' | 'system';

/**
 * Apply theme to document by setting data-theme attribute
 */
export const applyTheme = (theme: Theme): void => {
  // If theme is system, check user's preference
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
};

/**
 * Listen for system theme changes
 */
export const listenForThemeChanges = (callback: (isDark: boolean) => void): void => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
    callback(e.matches);
  };
  
  // Initial check
  handleChange(mediaQuery);
  
  // Add listener
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleChange);
  } else {
    // Fallback for older browsers
    mediaQuery.addListener(handleChange);
  }
};

/**
 * Get current active theme (accounting for system preference)
 */
export const getActiveTheme = (theme: Theme): 'light' | 'dark' => {
  if (theme !== 'system') {
    return theme;
  }
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};