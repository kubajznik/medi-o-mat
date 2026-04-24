const config = {
    KEYBOARD_MODE: "keyboard-mode",
} as const;

type ConfigKey = typeof config[keyof typeof config];

class LocalStorageManager {

    private setItem(key: ConfigKey, value: string) {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.error(`Error setting item in localStorage: ${error}`);
        }
    }

    private getItem(key: ConfigKey): string | null {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.error(`Error getting item from localStorage: ${error}`);
            return null;
        }
    }   

    private removeItem(key: ConfigKey) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing item from localStorage: ${error}`);
        }
    }

    setKeyboardMode(enabled: boolean) {
        this.setItem(config.KEYBOARD_MODE, enabled ? "true" : "false");
    }

    getKeyboardMode(): boolean {
        const value = this.getItem(config.KEYBOARD_MODE);
        return value === "true";
    }
};

const localStorageManager = new LocalStorageManager();

export default localStorageManager;

