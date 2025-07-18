import React, { createContext, useContext, useEffect, useState } from "react";

export const THEMES = {
  light: {
    "--bg-primary": "#ffffff",
    "--bg-secondary": "#f3f4f6",
    "--bg-accent": "#e5e7eb",
    "--text-primary": "#1f2937",
    "--text-secondary": "#4b5563",
    "--accent": "#3b82f6",
    "--success": "#10b981",
    "--warning": "#f59e0b",
    "--danger": "#ef4444",
    "--border": "#d1d5db",

    // Font settings for light theme
    "--font-heading": "'Inter', sans-serif",
    "--font-body": "'Inter', sans-serif",
    "--font-mono": "'Roboto Mono', monospace",
  },
  dark: {
    "--bg-primary": "#111827",
    "--bg-secondary": "#1f2937",
    "--bg-accent": "#374151",
    "--text-primary": "#f9fafb",
    "--text-secondary": "#d1d5db",
    "--accent": "#60a5fa",
    "--success": "#34d399",
    "--warning": "#fbbf24",
    "--danger": "#f87171",
    "--border": "#4b5563",

    // Font settings for dark theme
    "--font-heading": "'Inter', sans-serif",
    "--font-body": "'Inter', sans-serif",
    "--font-mono": "'Roboto Mono', monospace",
  },
  cupcake: {
    "--bg-primary": "#faf7f5",
    "--bg-secondary": "#efeae6",
    "--bg-accent": "#e8e1dc",
    "--text-primary": "#5c4a5e",
    "--text-secondary": "#8b7a8d",
    "--accent": "#65c3c8",
    "--success": "#36d399",
    "--warning": "#fbbd23",
    "--danger": "#f87272",
    "--border": "#e1d4d6",

    // Font settings for cupcake theme
    "--font-heading": "'Comic Neue', cursive",
    "--font-body": "'Nunito', sans-serif",
    "--font-mono": "'Source Code Pro', monospace",
  },
  bumblebee: {
    "--bg-primary": "#ffffff",
    "--bg-secondary": "#f9f8f0",
    "--bg-accent": "#f0eeda",
    "--text-primary": "#1a1a1a",
    "--text-secondary": "#4d4d4d",
    "--accent": "#e0a82e",
    "--success": "#78dcca",
    "--warning": "#f0a15e",
    "--danger": "#e58f8f",
    "--border": "#e0d3b6",

    // Font settings for bumblebee theme
    "--font-heading": "'Poppins', sans-serif",
    "--font-body": "'Open Sans', sans-serif",
    "--font-mono": "'Fira Code', monospace",
  },
  emerald: {
    "--bg-primary": "#f9fafb",
    "--bg-secondary": "#e5e7eb",
    "--bg-accent": "#d1d5db",
    "--text-primary": "#1f2937",
    "--text-secondary": "#4b5563",
    "--accent": "#66cc8a",
    "--success": "#36d399",
    "--warning": "#fbbd23",
    "--danger": "#ef4444",
    "--border": "#c5d0d6",

    // Font settings for emerald theme
    "--font-heading": "'Playfair Display', serif",
    "--font-body": "'Lora', serif",
    "--font-mono": "'IBM Plex Mono', monospace",
  },
  corporate: {
    "--bg-primary": "#ffffff",
    "--bg-secondary": "#f6f7f9",
    "--bg-accent": "#edf0f3",
    "--text-primary": "#1a202c",
    "--text-secondary": "#4a5568",
    "--accent": "#4b6bfb",
    "--success": "#36d399",
    "--warning": "#fbbd23",
    "--danger": "#ef4444",
    "--border": "#dde4ec",

    // Font settings for corporate theme
    "--font-heading": "'Roboto', sans-serif",
    "--font-body": "'Roboto', sans-serif",
    "--font-mono": "'Roboto Mono', monospace",
  },
  synthwave: {
    "--bg-primary": "#241b4d",
    "--bg-secondary": "#2d2156",
    "--bg-accent": "#3d2963",
    "--text-primary": "#f7f0ff",
    "--text-secondary": "#d6c3ff",
    "--accent": "#ff7edb",
    "--success": "#00f5d4",
    "--warning": "#f9c74f",
    "--danger": "#f94144",
    "--border": "#6d5acf",

    // Font settings for synthwave theme
    "--font-heading": "'Orbitron', sans-serif",
    "--font-body": "'Rajdhani', sans-serif",
    "--font-mono": "'Share Tech Mono', monospace",
  },
  retro: {
    "--bg-primary": "#f4e8d0",
    "--bg-secondary": "#e8d9b9",
    "--bg-accent": "#dcc9a2",
    "--text-primary": "#3d3d3d",
    "--text-secondary": "#6b6b6b",
    "--accent": "#ef9995",
    "--success": "#a4cbb4",
    "--warning": "#ebdc99",
    "--danger": "#e05263",
    "--border": "#d1b894",

    // Font settings for retro theme
    "--font-heading": "'Press Start 2P', cursive",
    "--font-body": "'VT323', monospace",
    "--font-mono": "'VT323', monospace",
  },
  cyberpunk: {
    "--bg-primary": "#f9f8ff",
    "--bg-secondary": "#f3f0ff",
    "--bg-accent": "#ede8ff",
    "--text-primary": "#2a2a2a",
    "--text-secondary": "#5a5a5a",
    "--accent": "#ff7598",
    "--success": "#75d7b8",
    "--warning": "#ffd166",
    "--danger": "#ef476f",
    "--border": "#d9d0ff",

    // Font settings for cyberpunk theme
    "--font-heading": "'Roboto Mono', monospace",
    "--font-body": "'Roboto Mono', monospace",
    "--font-mono": "'Roboto Mono', monospace",
  },
  valentine: {
    "--bg-primary": "#fdf0f0",
    "--bg-secondary": "#fae0e0",
    "--bg-accent": "#f7d0d0",
    "--text-primary": "#5c4a4a",
    "--text-secondary": "#8b7a7a",
    "--accent": "#e96d7b",
    "--success": "#a3d9b1",
    "--warning": "#f9d5bb",
    "--danger": "#e87171",
    "--border": "#f0c8c8",

    // Font settings for valentine theme
    "--font-heading": "'Dancing Script', cursive",
    "--font-body": "'Poppins', sans-serif",
    "--font-mono": "'Courier New', monospace",
  },
  halloween: {
    "--bg-primary": "#212121",
    "--bg-secondary": "#2a2a2a",
    "--bg-accent": "#333333",
    "--text-primary": "#f0e6d2",
    "--text-secondary": "#d4c9b5",
    "--accent": "#ff8c00",
    "--success": "#8cc152",
    "--warning": "#ffaa00",
    "--danger": "#ff5722",
    "--border": "#5a4a42",

    // Font settings for halloween theme
    "--font-heading": "'Creepster', cursive",
    "--font-body": "'Roboto', sans-serif",
    "--font-mono": "'Courier New', monospace",
  },
  garden: {
    "--bg-primary": "#f9fbf9",
    "--bg-secondary": "#e5f0e5",
    "--bg-accent": "#d1e5d1",
    "--text-primary": "#1a2c1a",
    "--text-secondary": "#4a5a4a",
    "--accent": "#5db85b",
    "--success": "#4caf50",
    "--warning": "#ffd54f",
    "--danger": "#e57373",
    "--border": "#c5d9c5",

    // Font settings for garden theme
    "--font-heading": "'Lobster', cursive",
    "--font-body": "'Open Sans', sans-serif",
    "--font-mono": "'Courier New', monospace",
  },
  forest: {
    "--bg-primary": "#1a2c1a",
    "--bg-secondary": "#2a3f2a",
    "--bg-accent": "#3d5a3d",
    "--text-primary": "#e8f5e9",
    "--text-secondary": "#c8e6c9",
    "--accent": "#81c784",
    "--success": "#4caf50",
    "--warning": "#ffd54f",
    "--danger": "#e57373",
    "--border": "#4a7050",

    // Font settings for forest theme
    "--font-heading": "'Lora', serif",
    "--font-body": "'Lora', serif",
    "--font-mono": "'Courier New', monospace",
  },
  aqua: {
    "--bg-primary": "#e8f7ff",
    "--bg-secondary": "#d1efff",
    "--bg-accent": "#bae7ff",
    "--text-primary": "#1a3d5c",
    "--text-secondary": "#4a6d8c",
    "--accent": "#00b4d8",
    "--success": "#48c78e",
    "--warning": "#ffe08a",
    "--danger": "#f14668",
    "--border": "#a8d8f0",

    // Font settings for aqua theme
    "--font-heading": "'Montserrat', sans-serif",
    "--font-body": "'Montserrat', sans-serif",
    "--font-mono": "'Courier New', monospace",
  },
  lofi: {
    "--bg-primary": "#ffffff",
    "--bg-secondary": "#f5f5f5",
    "--bg-accent": "#e5e5e5",
    "--text-primary": "#000000",
    "--text-secondary": "#4d4d4d",
    "--accent": "#808080",
    "--success": "#666666",
    "--warning": "#999999",
    "--danger": "#b3b3b3",
    "--border": "#d9d9d9",

    // Font settings for lofi theme
    "--font-heading": "'Courier New', monospace",
    "--font-body": "'Courier New', monospace",
    "--font-mono": "'Courier New', monospace",
  },
  pastel: {
    "--bg-primary": "#fdf6f6",
    "--bg-secondary": "#f8edeb",
    "--bg-accent": "#f3e4e0",
    "--text-primary": "#5d5d5d",
    "--text-secondary": "#8b8b8b",
    "--accent": "#d1c1d7",
    "--success": "#b5e5cf",
    "--warning": "#ffe5b4",
    "--danger": "#ffc6c6",
    "--border": "#e9d8d6",

    // Font settings for pastel theme
    "--font-heading": "'Poppins', sans-serif",
    "--font-body": "'Poppins', sans-serif",
    "--font-mono": "'Courier New', monospace",
  },
  fantasy: {
    "--bg-primary": "#ffffff",
    "--bg-secondary": "#f0f0f0",
    "--bg-accent": "#e0e0e0",
    "--text-primary": "#1a1a1a",
    "--text-secondary": "#4d4d4d",
    "--accent": "#6e0b75",
    "--success": "#007a5a",
    "--warning": "#ff9d00",
    "--danger": "#ff3d3d",
    "--border": "#d4d4d4",

    // Font settings for fantasy theme
    "--font-heading": "'Cinzel', serif",
    "--font-body": "'Cinzel', serif",
    "--font-mono": "'Courier New', monospace",
  },
  wireframe: {
    "--bg-primary": "#ffffff",
    "--bg-secondary": "#f0f0f0",
    "--bg-accent": "#e0e0e0",
    "--text-primary": "#000000",
    "--text-secondary": "#4d4d4d",
    "--accent": "#b8b8b8",
    "--success": "#666666",
    "--warning": "#999999",
    "--danger": "#b3b3b3",
    "--border": "#000000",

    // Font settings for wireframe theme
    "--font-heading": "'Courier New', monospace",
    "--font-body": "'Courier New', monospace",
    "--font-mono": "'Courier New', monospace",
  },
  black: {
    "--bg-primary": "#000000",
    "--bg-secondary": "#0d0d0d",
    "--bg-accent": "#1a1a1a",
    "--text-primary": "#ffffff",
    "--text-secondary": "#d9d9d9",
    "--accent": "#4d4d4d",
    "--success": "#00cc66",
    "--warning": "#ffcc00",
    "--danger": "#ff3333",
    "--border": "#333333",

    // Font settings for black theme
    "--font-heading": "'Roboto', sans-serif",
    "--font-body": "'Roboto', sans-serif",
    "--font-mono": "'Courier New', monospace",
  },
  luxury: {
    "--bg-primary": "#0d0d0d",
    "--bg-secondary": "#1a1a1a",
    "--bg-accent": "#262626",
    "--text-primary": "#e6e6e6",
    "--text-secondary": "#b3b3b3",
    "--accent": "#d4af37",
    "--success": "#a78bfa",
    "--warning": "#fde047",
    "--danger": "#ef4444",
    "--border": "#333333",

    // Font settings for luxury theme
    "--font-heading": "'Playfair Display', serif",
    "--font-body": "'Playfair Display', serif",
    "--font-mono": "'Courier New', monospace",
  },
  dracula: {
    "--bg-primary": "#282a36",
    "--bg-secondary": "#343746",
    "--bg-accent": "#424457",
    "--text-primary": "#f8f8f2",
    "--text-secondary": "#bd93f9",
    "--accent": "#ff79c6",
    "--success": "#50fa7b",
    "--warning": "#f1fa8c",
    "--danger": "#ff5555",
    "--border": "#6272a4",

    // Font settings for dracula theme
    "--font-heading": "'Fira Code', monospace",
    "--font-body": "'Fira Code', monospace",
    "--font-mono": "'Fira Code', monospace",
  },
  cmyk: {
    "--bg-primary": "#ffffff",
    "--bg-secondary": "#f0f5ff",
    "--bg-accent": "#e1ebff",
    "--text-primary": "#1a1a1a",
    "--text-secondary": "#4d4d4d",
    "--accent": "#45aeee",
    "--success": "#00c4a7",
    "--warning": "#ffb400",
    "--danger": "#ff2e63",
    "--border": "#d1e0ff",

    // Font settings for cmyk theme
    "--font-heading": "'Montserrat', sans-serif",
    "--font-body": "'Montserrat', sans-serif",
    "--font-mono": "'Courier New', monospace",
  },
  autumn: {
    "--bg-primary": "#f9f5f0",
    "--bg-secondary": "#f0e6d9",
    "--bg-accent": "#e7d8c3",
    "--text-primary": "#5c4a42",
    "--text-secondary": "#8b7a72",
    "--accent": "#e96d5d",
    "--success": "#8fb339",
    "--warning": "#e6a937",
    "--danger": "#d9534f",
    "--border": "#d9c8b8",

    // Font settings for autumn theme
    "--font-heading": "'Merriweather', serif",
    "--font-body": "'Merriweather', serif",
    "--font-mono": "'Courier New', monospace",
  },
  business: {
    "--bg-primary": "#1a1d28",
    "--bg-secondary": "#232734",
    "--bg-accent": "#2d3240",
    "--text-primary": "#e2e8f0",
    "--text-secondary": "#a0aec0",
    "--accent": "#4c6fff",
    "--success": "#48bb78",
    "--warning": "#f6ad55",
    "--danger": "#f56565",
    "--border": "#3a4151",

    // Font settings for business theme
    "--font-heading": "'Roboto', sans-serif",
    "--font-body": "'Roboto', sans-serif",
    "--font-mono": "'Courier New', monospace",
  },
  acid: {
    "--bg-primary": "#f9fafb",
    "--bg-secondary": "#f0f0f0",
    "--bg-accent": "#e6e6e6",
    "--text-primary": "#1a1a1a",
    "--text-secondary": "#666666",
    "--accent": "#ff00ff",
    "--success": "#00ff00",
    "--warning": "#ffff00",
    "--danger": "#ff0000",
    "--border": "#d9d9d9",

    // Font settings for acid theme
    "--font-heading": "'Courier New', monospace",
    "--font-body": "'Courier New', monospace",
    "--font-mono": "'Courier New', monospace",
  },
  lemonade: {
    "--bg-primary": "#f7f9e9",
    "--bg-secondary": "#eff2d6",
    "--bg-accent": "#e7ecc3",
    "--text-primary": "#4a4a4a",
    "--text-secondary": "#7a7a7a",
    "--accent": "#f9c80e",
    "--success": "#7bd142",
    "--warning": "#ff9e00",
    "--danger": "#ff6b6b",
    "--border": "#d9e2c6",

    // Font settings for lemonade theme
    "--font-heading": "'Lato', sans-serif",
    "--font-body": "'Lato', sans-serif",
    "--font-mono": "'Courier New', monospace",
  },
  night: {
    "--bg-primary": "#1a202c",
    "--bg-secondary": "#232b3c",
    "--bg-accent": "#2d364c",
    "--text-primary": "#e2e8f0",
    "--text-secondary": "#a0aec0",
    "--accent": "#63b3ed",
    "--success": "#68d391",
    "--warning": "#f6e05e",
    "--danger": "#fc8181",
    "--border": "#3a4151",

    // Font settings for night theme
    "--font-heading": "'Roboto', sans-serif",
    "--font-body": "'Roboto', sans-serif",
    "--font-mono": "'Courier New', monospace",
  },
  coffee: {
    "--bg-primary": "#3c2f2f",
    "--bg-secondary": "#4b3832",
    "--bg-accent": "#854442",
    "--text-primary": "#fff4e6",
    "--text-secondary": "#be9b7b",
    "--accent": "#c89666",
    "--success": "#a3c14a",
    "--warning": "#e6bc5c",
    "--danger": "#ab6c6c",
    "--border": "#5c4a4a",

    // Font settings for coffee theme
    "--font-heading": "'Merriweather', serif",
    "--font-body": "'Merriweather', serif",
    "--font-mono": "'Courier New', monospace",
  },
  winter: {
    "--bg-primary": "#ffffff",
    "--bg-secondary": "#f0f4f8",
    "--bg-accent": "#e1e9f0",
    "--text-primary": "#1a202c",
    "--text-secondary": "#4a5568",
    "--accent": "#3182ce",
    "--success": "#38a169",
    "--warning": "#dd6b20",
    "--danger": "#e53e3e",
    "--border": "#cbd5e0",

    // Font settings for winter theme
    "--font-heading": "'Roboto', sans-serif",
    "--font-body": "'Roboto', sans-serif",
    "--font-mono": "'Courier New', monospace",
  },
  dim: {
    "--bg-primary": "#1c1c1c",
    "--bg-secondary": "#282828",
    "--bg-accent": "#343434",
    "--text-primary": "#e0e0e0",
    "--text-secondary": "#a0a0a0",
    "--accent": "#5d8aa8",
    "--success": "#4caf50",
    "--warning": "#ff9800",
    "--danger": "#f44336",
    "--border": "#404040",

    // Font settings for dim theme
    "--font-heading": "'Roboto', sans-serif",
    "--font-body": "'Roboto', sans-serif",
    "--font-mono": "'Courier New', monospace",
  },
  nord: {
    "--bg-primary": "#2e3440",
    "--bg-secondary": "#3b4252",
    "--bg-accent": "#434c5e",
    "--text-primary": "#d8dee9",
    "--text-secondary": "#a3a9b8",
    "--accent": "#81a1c1",
    "--success": "#a3be8c",
    "--warning": "#ebcb8b",
    "--danger": "#bf616a",
    "--border": "#4c566a",

    // Font settings for nord theme
    "--font-heading": "'Roboto', sans-serif",
    "--font-body": "'Roboto', sans-serif",
    "--font-mono": "'Courier New', monospace",
  },
  sunset: {
    "--bg-primary": "#2c1a1d",
    "--bg-secondary": "#3d2528",
    "--bg-accent": "#4e3033",
    "--text-primary": "#f8d7da",
    "--text-secondary": "#d9a8ac",
    "--accent": "#e76f51",
    "--success": "#2a9d8f",
    "--warning": "#e9c46a",
    "--danger": "#e63946",
    "--border": "#5c3a3d",

    // Font settings for sunset theme
    "--font-heading": "'Playfair Display', serif",
    "--font-body": "'Playfair Display', serif",
    "--font-mono": "'Courier New', monospace",
  },
};

/**
 This implementation includes all 31 themes from the original DaisyUI configuration, converted to use the 10 CSS variables we defined for our custom theme system:

--bg-primary: Primary background color

--bg-secondary: Secondary background color

--bg-accent: Accent background color

--text-primary: Primary text color

--text-secondary: Secondary text color

--accent: Primary accent color (buttons, highlights)

--success: Success color

--warning: Warning color

--danger: Danger/error color

--border: Border color
 */
