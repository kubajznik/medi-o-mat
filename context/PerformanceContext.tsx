"use client";

import { STORAGE_KEYS } from "@/types/storage";
import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

type PerformanceContextValue = {
    reduceMotion: boolean;
};

const PerformanceContext = createContext<PerformanceContextValue>({
    reduceMotion: false,
});

function readStoredOverride(): boolean | null {
    if (typeof window === "undefined") return null;

    const value = localStorage.getItem(STORAGE_KEYS.LOW_PERFORMANCE);
    if (value === "true") return true;
    if (value === "false") return false;
    return null;
}

function detectReduceMotion(): boolean {
    if (typeof window === "undefined") return false;

    const override = readStoredOverride();
    if (override !== null) return override;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return true;
    }

    // Typical for Raspberry Pi 3/4/5 (4 cores) — override via localStorage if needed.
    const cores = navigator.hardwareConcurrency;
    if (cores > 0 && cores <= 4) {
        return true;
    }

    return false;
}

export function PerformanceProvider({ children }: { children: ReactNode }) {
    const [reduceMotion, setReduceMotion] = useState(false);

    useEffect(() => {
        const apply = () => setReduceMotion(detectReduceMotion());

        apply();

        const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        motionQuery.addEventListener("change", apply);

        return () => motionQuery.removeEventListener("change", apply);
    }, []);

    useEffect(() => {
        document.documentElement.dataset.reduceMotion = reduceMotion
            ? "true"
            : "false";
    }, [reduceMotion]);

    const value = useMemo(() => ({ reduceMotion }), [reduceMotion]);

    return (
        <PerformanceContext.Provider value={value}>
            {children}
        </PerformanceContext.Provider>
    );
}

export function useReduceMotion(): boolean {
    return useContext(PerformanceContext).reduceMotion;
}
