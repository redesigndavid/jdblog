import { useState, useEffect, createContext } from "react";

// Add either dark or light className to body tag
function setDarkMode(darkMode) {
  document.getElementsByTagName("body")[0].classList.toggle("dark", darkMode);
  document.getElementsByTagName("body")[0].classList.toggle("light", !darkMode);
  return darkMode;
}

export const ThemeContext = createContext(null);

function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Initialize
  useEffect(() => {
    // Set initial dark mode
    const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(!darkMode);

    // Set a mediaquery change handler that matches dark mode with system preference.
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event) => {
      setIsDarkMode(event.matches);
    };
    mediaQuery.addEventListener("change", handleChange);

    return () => {};
  }, []);

  // Update body classNames each time isDarkMode is updated.
  useEffect(() => {
    setDarkMode(isDarkMode);
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
export default ThemeProvider;
