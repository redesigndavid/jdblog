import { createContext } from "react";
import { track } from "../Tracker";
import { useNavigate } from "react-router";

export const NavigationContext = createContext(null);

function NavigationProvider({ children }) {
  const navigate = useNavigate();
  const nav = (path) => {
    track(path);
    navigate(path);
  };
  return (
    <NavigationContext.Provider value={{nav}}>
      {children}
    </NavigationContext.Provider>
  );
}
export default NavigationProvider;
