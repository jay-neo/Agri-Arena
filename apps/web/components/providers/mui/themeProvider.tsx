"use client";

import { createContext, useMemo, useState, useContext, useEffect } from 'react';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './theme';
import { CssBaseline } from '@mui/material';

const ThemeContext = createContext(undefined);

export const useTheme = () => useContext(ThemeContext);

export const MuiThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState('light');

  const theme = useMemo(() => (themeMode === 'dark' ? darkTheme : lightTheme), [themeMode]);

  useEffect(() => {
    const storedMode = localStorage.getItem('themeMode');
    if (storedMode) {
      setThemeMode(storedMode);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(newTheme);
    localStorage.setItem('themeMode', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        <div className={themeMode === 'dark' ? 'dark' : ''}>
          {children}
        </div>
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};
