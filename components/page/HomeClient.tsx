"use client";

import { useKeyboardHandler } from "@/context/KeyboardContext";
import { useLogoVisibility } from "@/context/LogoVisibilityContext";
import useAnimationToggle from "@/hooks/useAnimationToggle";
import localStorageManager from "@/util/localStore";
import { resetUserActivity } from "@/util/userActivity";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import ScrollToButton from "../buttons/ScrollToButton";

interface HomeClientProps {
    ersteInformation: string;
    startButton: string;
    medienuebersichtButton: string;
    nextSectionId: string;
}

export default function HomeClient({
    ersteInformation,
    startButton,
    medienuebersichtButton,
    nextSectionId,
}: HomeClientProps) {
    const router = useRouter();
    const animate = useAnimationToggle(7000);
    const logoRef = useRef<HTMLImageElement>(null);
    const { setMainLogoVisible } = useLogoVisibility();

    const handleStartButtonClick = () => {
        localStorageManager.clearSurveyProgress();
        resetUserActivity();
        router.push("/befragung");
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setMainLogoVisible(entry.isIntersecting);
            },
            { threshold: 0.1 } // Trigger when 10% of logo is visible
        );

        if (logoRef.current) {
            observer.observe(logoRef.current);
        }

        return () => {
            if (logoRef.current) {
                observer.unobserve(logoRef.current);
            }
        };
    }, [setMainLogoVisible]);

    useKeyboardHandler({
        enabled: true,
        priority: 10,
        onKey: (event, action) => {
            if (
                action.type === "button" &&
                (action.button === "green" || action.button === "yellow")
            ) {
                handleStartButtonClick();
                return true;
            }
            return false;
        },
    });

    return (
        <div id="#start" className="flex flex-col justify-center items-center mt-10 sm:mt-0 min-h-screen text-center">
            <img ref={logoRef} src="/images/mediomat_logo.png" alt="Medi-o-Mat Logo" className="px-2 w-auto h-auto" />
            <p
                className="mt-8 md:mt-16 max-w-[900px] font-normal text-xl"
                style={{ whiteSpace: "pre-wrap" }}
            >
                {ersteInformation}
            </p>
            <button
                onClick={handleStartButtonClick}
                className={`${animate ? "animate__animated animate__headShake" : ""
                    } mt-28 px-6 py-4 bg-medio-pink arcade:bg-medio-cyan text-negative font-medium text-2xl rounded-lg shadow-md flex flex-row-reverse gap-3 justify-center items-center w-[400px] transition hover:shadow-2xl hover:scale-105 ease-in uppercase`}
            >
                <i className="pi-arrow-right text-negative pi" style={{ fontSize: "1.2rem" }} />
                {startButton}
            </button>
            <ScrollToButton targetId={nextSectionId} />
        </div>
    );
}
