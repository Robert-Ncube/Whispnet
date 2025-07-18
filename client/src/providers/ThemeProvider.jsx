import React, { createContext, useContext, useEffect, useState } from "react";
import { THEMES } from "../constants/Themes";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem("chat-theme");
    if (savedTheme && THEMES[savedTheme]) {
      setTheme(savedTheme);
    } else {
      // Set default theme based on system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    applyTheme(theme);
    // Save to localStorage
    localStorage.setItem("chat-theme", theme);
  }, [theme]);

  const applyTheme = (themeName) => {
    const theme = THEMES[themeName];
    if (!theme) return;

    Object.entries(theme).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value);
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
