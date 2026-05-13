import { STORAGE_KEYS, THEMES, type StorageKey, type Theme } from "@/types/storage";

const isTheme = (value: string): value is Theme =>
    (Object.values(THEMES) as Theme[]).includes(value as Theme);

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
        const answers = this.getAnswers();
        answers.push(value);
        this.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(answers));
    }

    getAnswers(): number[] {
        const value = this.getItem(STORAGE_KEYS.ANSWERS);
        if (!value) return [];
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.error(`Error parsing answers from localStorage: ${error}`);
            return [];
        }
    }

    clearAnswers() {
        this.removeItem(STORAGE_KEYS.ANSWERS);
    }

    popAnswer() {
        const answers = this.getAnswers();
        answers.pop();
        this.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(answers));
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

