"use client";

import localStorageManager from "@/util/localStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const INACTIVITY_MS = 30_000;

const ACTIVITY_EVENTS = [
    "mousedown",
    "mousemove",
    "keydown",
    "touchstart",
    "scroll",
    "click",
] as const;

export default function InactivityRedirect() {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (pathname === "/") return;

        let timeoutId: ReturnType<typeof setTimeout>;

        const goToStart = () => {
            localStorageManager.clearSurveyProgress();
            router.push("/");
        };

        const resetTimer = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(goToStart, INACTIVITY_MS);
        };

        for (const event of ACTIVITY_EVENTS) {
            window.addEventListener(event, resetTimer, { passive: true });
        }
        resetTimer();

        return () => {
            clearTimeout(timeoutId);
            for (const event of ACTIVITY_EVENTS) {
                window.removeEventListener(event, resetTimer);
            }
        };
    }, [pathname, router]);

    return null;
}
