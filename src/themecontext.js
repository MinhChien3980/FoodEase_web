// src/themeContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const initialTheme = typeof window !== 'undefined' && window.localStorage.getItem('theme') ? window.localStorage.getItem('theme') : 'light';

const ThemeContext = createContext({
  theme: initialTheme,
  setTheme: () => {},
});

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export { ThemeContext, ThemeProvider };
