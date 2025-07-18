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

    // Add Google Fonts to document head
    addGoogleFonts(theme);
  }, [theme]);

  const applyTheme = (themeName) => {
    const theme = THEMES[themeName];
    if (!theme) return;

    Object.entries(theme).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value);
    });
  };

  // Helper function to extract font names
  const extractFontName = (fontString) => {
    const match = fontString.match(/'([^']+)'/);
    return match ? match[1] : null;
  };

  // Function to add Google Fonts to document head
  const addGoogleFonts = (themeName) => {
    const theme = THEMES[themeName];
    if (!theme) return;

    // Remove existing font links
    document
      .querySelectorAll("link[data-theme-font]")
      .forEach((el) => el.remove());

    // Get unique fonts from theme
    const fonts = new Set();
    if (theme["--font-heading"])
      fonts.add(extractFontName(theme["--font-heading"]));
    if (theme["--font-body"]) fonts.add(extractFontName(theme["--font-body"]));
    if (theme["--font-mono"]) fonts.add(extractFontName(theme["--font-mono"]));

    // Create Google Fonts URL
    const fontNames = [...fonts].filter(Boolean);
    if (fontNames.length === 0) return;

    const fontUrl = `https://fonts.googleapis.com/css2?${fontNames
      .map((font) => `family=${font.replace(/\s+/g, "+")}:wght@400;500;700`)
      .join("&")}&display=swap`;

    // Create link element
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = fontUrl;
    link.setAttribute("data-theme-font", "true");
    document.head.appendChild(link);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
