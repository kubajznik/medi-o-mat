const config = {
    KEYBOARD_MODE: "keyboard-mode",
    ANSWERS: "answers",
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

    addAnswer(value: number) {
        const answers = this.getAnswers();
        answers.push(value);
        this.setItem(config.ANSWERS, JSON.stringify(answers));
    }

    getAnswers(): number[] {
        const value = this.getItem(config.ANSWERS);
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
        this.removeItem(config.ANSWERS);
    }

    popAnswer() {
        const answers = this.getAnswers();
        answers.pop();
        this.setItem(config.ANSWERS, JSON.stringify(answers));
    }
};

const localStorageManager = new LocalStorageManager();

export default localStorageManager;

