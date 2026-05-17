export const STORAGE_KEYS = {
    KEYBOARD_MODE: "keyboard-mode",
    ANSWERS: "answers",
    WEIGHTED_ANSWERS: "weighted-answers",
    THEME: "theme",
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

export const THEMES = {
    LIGHT: "light",
    DARK: "dark",
    ARCADE: "arcade",
} as const;

export type Theme = typeof THEMES[keyof typeof THEMES];
