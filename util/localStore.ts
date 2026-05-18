import { STORAGE_KEYS, THEMES, type StorageKey, type Theme } from "@/types/storage";
import type { GewichteteAntwort } from "@/types/Befragung";

const isTheme = (value: string): value is Theme =>
    (Object.values(THEMES) as Theme[]).includes(value as Theme);

/** Survey answers live in memory only (no resume after reload or return visits). */
let sessionAnswers: number[] = [];
let sessionWeightedAnswers: GewichteteAntwort[] = [];

const clearLegacySurveyStorage = () => {
    if (typeof window === "undefined") return;
    try {
        localStorage.removeItem(STORAGE_KEYS.ANSWERS);
        localStorage.removeItem(STORAGE_KEYS.WEIGHTED_ANSWERS);
    } catch (error) {
        console.error("Error clearing legacy survey storage:", error);
    }
};

clearLegacySurveyStorage();

class LocalStorageManager {

    private setItem(key: StorageKey, value: string) {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.error(`Error setting item in localStorage: ${error}`);
        }
    }

    private getItem(key: StorageKey): string | null {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.error(`Error getting item from localStorage: ${error}`);
            return null;
        }
    }   

    private removeItem(key: StorageKey) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing item from localStorage: ${error}`);
        }
    }

    setKeyboardMode(enabled: boolean) {
        this.setItem(STORAGE_KEYS.KEYBOARD_MODE, enabled ? "true" : "false");
    }

    getKeyboardMode(): boolean {
        const value = this.getItem(STORAGE_KEYS.KEYBOARD_MODE);
        return value === "true";
    }

    addAnswer(value: number) {
        sessionAnswers.push(value);
    }

    setAnswers(values: number[]) {
        sessionAnswers = [...values];
    }

    getAnswers(): number[] {
        return [...sessionAnswers];
    }

    clearAnswers() {
        sessionAnswers = [];
        clearLegacySurveyStorage();
    }

    setWeightedAnswers(values: GewichteteAntwort[]) {
        sessionWeightedAnswers = values.map((item) => ({ ...item }));
    }

    getWeightedAnswers(): GewichteteAntwort[] {
        return sessionWeightedAnswers.map((item) => ({ ...item }));
    }

    clearWeightedAnswers() {
        sessionWeightedAnswers = [];
        clearLegacySurveyStorage();
    }

    clearSurveyProgress() {
        this.clearAnswers();
        this.clearWeightedAnswers();
    }

    popAnswer() {
        sessionAnswers.pop();
    }

    getTheme(): Theme {
        const value = this.getItem(STORAGE_KEYS.THEME);
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? THEMES.DARK : THEMES.LIGHT;
        return value && isTheme(value) ? value : systemTheme;
    }

    setTheme(theme: Theme) {
        this.setItem(STORAGE_KEYS.THEME, theme);
    }
};

const localStorageManager = new LocalStorageManager();

export default localStorageManager;
