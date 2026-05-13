"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import localStorageManager from "@/util/localStore";
import { THEMES, type Theme } from "@/types/storage";

type ThemeContextValue = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(THEMES.LIGHT);

    useEffect(() => {
        const storedTheme = localStorageManager.getTheme();
        setThemeState(storedTheme);
        window.document.documentElement.setAttribute("data-theme", storedTheme);
    }, []);

    const setTheme = useCallback((nextTheme: Theme) => {
        setThemeState(nextTheme);
        localStorageManager.setTheme(nextTheme);
        window.document.documentElement.setAttribute("data-theme", nextTheme);
        console.log(`Theme set to ${nextTheme}`);
    }, []);

    const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return context;
}
