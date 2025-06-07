export function setDarkMode(darkMode) {
  if (darkMode != undefined) {
    document.getElementsByTagName("body")[0].classList.toggle("dark", darkMode);
    document
      .getElementsByTagName("body")[0]
      .classList.toggle("light", !darkMode);
    localStorage.setItem("darkmode", JSON.stringify(darkMode));
  }
}

export async function onCreateGlobalContext(globalContext) {
  // Set a mediaquery change handler that matches dark mode with system preference.
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleChange = (event) => {
    setDarkMode(event.matches);
  };
  mediaQuery.addEventListener("change", handleChange);

  // Set dark mode according to local storage or current match state
  const localDarkMode = localStorage.getItem("darkmode");
  if (typeof localDarkMode !== 'undefined') {
    setDarkMode(JSON.parse(localDarkMode));
  } else {
    setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }
  globalContext.setDarkMode = setDarkMode;


}
