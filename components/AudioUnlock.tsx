"use client";

import { unlockAudio } from "@/util/sounds";
import { useEffect } from "react";

const UNLOCK_EVENTS = ["pointerdown", "keydown", "touchstart"] as const;

export default function AudioUnlock() {
    useEffect(() => {
        const listenerOptions: AddEventListenerOptions = {
            capture: true,
            passive: true,
        };

        const tryUnlock = () => {
            void unlockAudio();
        };

        for (const event of UNLOCK_EVENTS) {
            window.addEventListener(event, tryUnlock, listenerOptions);
        }

        return () => {
            for (const event of UNLOCK_EVENTS) {
                window.removeEventListener(event, tryUnlock, listenerOptions);
            }
        };
    }, []);

    return null;
}
