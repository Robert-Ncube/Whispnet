import { useEffect } from "react";
import { useThemeStore } from "../store/useThemeStore";

const ThemeWrapper = ({ children }) => {
  const { theme } = useThemeStore();

  useEffect(() => {
    // Apply theme to root element
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);

    // Remove any conflicting classes
    root.classList.remove("light", "dark");
  }, [theme]);

  return children;
};

export default ThemeWrapper;
