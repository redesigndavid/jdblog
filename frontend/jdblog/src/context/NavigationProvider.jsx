import { createContext } from "react";
import { track } from "../Tracker";
import { useNavigate } from "react-router";

export const NavigationContext = createContext(null);

function NavigationProvider({ children }) {
  const navigate = useNavigate();
  const nav = (path) => {
    track(path, `${window.location.origin}${path}`, window.location.href);
    navigate(path);
  };

  const jump = (url) => {
    track(null, `${window.location.href}`, url);
    window.location = url;
  }
  const newtab = (url) => {
    track(null, `${window.location.href}`, url);
    window.open(url, "_blank").focus();
  }

  return (
    <NavigationContext.Provider value={{nav, jump, newtab}}>
      {children}
    </NavigationContext.Provider>
  );
}
export default NavigationProvider;
