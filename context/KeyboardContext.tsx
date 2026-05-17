"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import * as sounds from "@/components/util/sounds";
import { useTheme } from "@/context/ThemeContext";

type Direction = "left" | "right" | "up" | "down";

type KeyboardAction =
    | { type: "nav"; direction: Direction }
    | { type: "button"; button: "yellow" | "green" | "red" }
    | { type: "confirm" }
    | { type: "number"; value: number }
    | { type: "escape" }
    | { type: "raw"; key: string };

type KeyboardHandler = {
    id: string;
    seq: number;
    priority: number;
    enabled: boolean;
    onKey: (event: KeyboardEvent, action: KeyboardAction) => boolean;
};

type RegisterKeyboardHandler = (handler: Omit<KeyboardHandler, "id" | "seq">) => () => void;

type KeyboardContextValue = {
    registerHandler: RegisterKeyboardHandler;
};

const KeyboardContext = createContext<KeyboardContextValue | undefined>(undefined);

const normalizeKey = (event: KeyboardEvent): KeyboardAction | null => {
    const { key } = event;

    if (key === "ArrowLeft") return { type: "nav", direction: "left" };
    if (key === "ArrowRight") return { type: "nav", direction: "right" };
    if (key === "ArrowUp") return { type: "nav", direction: "up" };
    if (key === "ArrowDown") return { type: "nav", direction: "down" };

    if (key === "y" || key === "Y") return { type: "button", button: "yellow" };
    if (key === "g" || key === "G") return { type: "button", button: "green" };
    if (key === "r" || key === "R") return { type: "button", button: "red" };

    if (key === "Enter" || key === " " || key === "Spacebar") return { type: "confirm" };

    if (/^[1-9]$/.test(key)) return { type: "number", value: Number(key) };

    if (key === "Escape") return { type: "escape" };

    return { type: "raw", key };
};

export function KeyboardProvider({ children }: { children: React.ReactNode }) {
    const handlersRef = useRef<KeyboardHandler[]>([]);
    const seqRef = useRef(0);
    const { theme } = useTheme();

    const registerHandler = useCallback<RegisterKeyboardHandler>((handler) => {
        const seq = seqRef.current++;
        const entry: KeyboardHandler = {
            id: `keyboard-handler-${seq}`,
            seq,
            ...handler,
        };

        handlersRef.current = [...handlersRef.current, entry];

        return () => {
            handlersRef.current = handlersRef.current.filter((item) => item.id !== entry.id);
        };
    }, []);

    const playSoundOnKey = useCallback((event: KeyboardEvent, action: KeyboardAction) => {
        if (event.repeat || theme !== "arcade" || window.innerWidth < 768) 
            return;


        if (action.type === "nav") {
            sounds.playMoveSound();
            return;
        }

        if (action.type === "button" && action.button === "green") {
            sounds.playConfirmSound();
            return;
        }
    }, [theme]);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            const action = normalizeKey(event);
            if (!action) return;

            playSoundOnKey(event, action);

            const handlers = handlersRef.current
                .filter((handler) => handler.enabled)
                .sort((a, b) => b.priority - a.priority || b.seq - a.seq);

            for (const handler of handlers) {
                const handled = handler.onKey(event, action);
                if (handled) {
                    event.preventDefault();
                    event.stopPropagation();
                    return;
                }
            }
        };

        window.addEventListener("keydown", onKeyDown, true);
        return () => window.removeEventListener("keydown", onKeyDown, true);
    }, [playSoundOnKey]);


    const value = useMemo(() => ({ registerHandler }), [registerHandler]);


    return <KeyboardContext.Provider value={value}>{children}</KeyboardContext.Provider>;
}

export function useKeyboardHandler({
    enabled = true,
    priority = 0,
    onKey,
}: {
    enabled?: boolean;
    priority?: number;
    onKey: (event: KeyboardEvent, action: KeyboardAction) => boolean;
}) {
    const context = useContext(KeyboardContext);

    useEffect(() => {
        if (!context) {
            return;
        }

        return context.registerHandler({ enabled, priority, onKey });
    }, [context, enabled, priority, onKey]);
}

export type { KeyboardAction };
