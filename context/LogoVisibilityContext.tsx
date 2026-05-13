"use client";

import { createContext, useContext, useState, ReactNode, useMemo } from "react";

interface LogoVisibilityContextType {
  isMainLogoVisible: boolean;
  setMainLogoVisible: (visible: boolean) => void;
}

const LogoVisibilityContext = createContext<LogoVisibilityContextType | undefined>(undefined);

export function LogoVisibilityProvider({ children }: { children: ReactNode }) {
  const [isMainLogoVisible, setMainLogoVisible] = useState(true);
  
  const value = useMemo(
    () => ({ isMainLogoVisible, setMainLogoVisible }),
    [isMainLogoVisible]
  );

  return (
    <LogoVisibilityContext.Provider value={value}>
      {children}
    </LogoVisibilityContext.Provider>
  );
}

export function useLogoVisibility() {
  const context = useContext(LogoVisibilityContext);
  if (!context) {
    throw new Error("useLogoVisibility must be used within LogoVisibilityProvider");
  }
  return context;
}
