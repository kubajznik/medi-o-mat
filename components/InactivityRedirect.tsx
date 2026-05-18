"use client";

import localStorageManager from "@/util/localStore";
import {
    getIdleMs,
    markUserActivity,
    resetUserActivity,
} from "@/util/userActivity";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const INACTIVITY_MS = 30_000;
const CHECK_INTERVAL_MS = 1_000;

const ACTIVITY_EVENTS = [
    "mousedown",
    "keydown",
    "touchstart",
    "click",
] as const;

const isStartPage = (pathname: string | null) =>
    !pathname || pathname === "/";

export default function InactivityRedirect() {
    const router = useRouter();
    const pathname = usePathname();
    const routerRef = useRef(router);
    const hasRedirectedRef = useRef(false);

    routerRef.current = router;

    useEffect(() => {
        if (isStartPage(pathname)) return;

        hasRedirectedRef.current = false;
        resetUserActivity();

        const markActive = () => {
            markUserActivity();
        };

        const listenerOptions: AddEventListenerOptions = {
            capture: true,
            passive: true,
        };

        for (const event of ACTIVITY_EVENTS) {
            window.addEventListener(event, markActive, listenerOptions);
        }

        const intervalId = setInterval(() => {
            if (hasRedirectedRef.current) return;
            if (getIdleMs() < INACTIVITY_MS) return;

            hasRedirectedRef.current = true;
            localStorageManager.clearSurveyProgress();
            routerRef.current.push("/");
        }, CHECK_INTERVAL_MS);

        return () => {
            clearInterval(intervalId);
            for (const event of ACTIVITY_EVENTS) {
                window.removeEventListener(event, markActive, listenerOptions);
            }
        };
    }, [pathname]);

    return null;
}
