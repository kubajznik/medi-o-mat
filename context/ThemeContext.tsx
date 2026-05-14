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
        const handleSystemThemeChange = (event: MediaQueryListEvent) => {
            const newTheme = event.matches ? THEMES.DARK : THEMES.LIGHT;
            setTheme(newTheme);
        };

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        mediaQuery.addEventListener("change", handleSystemThemeChange);

        return () => {
            mediaQuery.removeEventListener("change", handleSystemThemeChange);
        };
    }, []);

    useEffect(() => {
        const storedTheme = localStorageManager.getTheme();
        setTheme(storedTheme);
    }, []);

    const setTheme = useCallback((nextTheme: Theme) => {
        setThemeState(nextTheme);
        localStorageManager.setTheme(nextTheme);
        const root = document.documentElement;
        root.classList.toggle("dark", nextTheme === THEMES.DARK);
        root.setAttribute("data-theme", nextTheme);
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
