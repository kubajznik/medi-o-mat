"use client";

import localStorageManager from "@/util/localStore";
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
    const lastActivityRef = useRef(Date.now());
    const hasRedirectedRef = useRef(false);

    routerRef.current = router;

    useEffect(() => {
        if (isStartPage(pathname)) return;

        hasRedirectedRef.current = false;
        lastActivityRef.current = Date.now();

        const markActive = () => {
            lastActivityRef.current = Date.now();
        };

        for (const event of ACTIVITY_EVENTS) {
            window.addEventListener(event, markActive, { passive: true });
        }
        window.addEventListener("mousemove", markActive, { passive: true });

        const intervalId = setInterval(() => {
            if (hasRedirectedRef.current) return;

            const idleFor = Date.now() - lastActivityRef.current;
            if (idleFor < INACTIVITY_MS) return;

            hasRedirectedRef.current = true;
            localStorageManager.clearSurveyProgress();
            routerRef.current.push("/");
        }, CHECK_INTERVAL_MS);

        return () => {
            clearInterval(intervalId);
            for (const event of ACTIVITY_EVENTS) {
                window.removeEventListener(event, markActive);
            }
            window.removeEventListener("mousemove", markActive);
        };
    }, [pathname]);

    return null;
}
