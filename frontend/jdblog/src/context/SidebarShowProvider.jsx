import { useState, createContext } from "react";

export const SidebarShowContext = createContext(null);

function SidebarShowProvider({ children }) {
  const [showSidebar, setSidebar] = useState(false);

  return (
    <SidebarShowContext.Provider value={{ showSidebar, setSidebar }}>
      {children}
    </SidebarShowContext.Provider>
  );
}

export default SidebarShowProvider;
