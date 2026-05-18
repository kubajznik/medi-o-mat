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
        <div id="#start" className="survey-page flex flex-col justify-center items-center px-4 py-[clamp(1rem,4vh,3rem)] text-center">
            <img
                ref={logoRef}
                src="/images/mediomat_logo.png"
                alt="Medi-o-Mat Logo"
                className="px-2 w-auto max-h-[min(32vh,280px)] object-contain"
                width={900}
                height={300}
                decoding="async"
            />
            <p
                className="mt-[clamp(0.75rem,3vh,4rem)] max-w-[900px] font-normal text-[clamp(1rem,2.5vh,1.25rem)] leading-snug"
                style={{ whiteSpace: "pre-wrap" }}
            >
                {ersteInformation}
            </p>
            <button
                onClick={handleStartButtonClick}
                className={`${animate ? "animate-head-shake" : ""
                    } mt-[clamp(1rem,5vh,7rem)] px-6 py-[clamp(0.75rem,2vh,1rem)] bg-medio-pink arcade:bg-medio-cyan text-negative font-medium text-[clamp(1.125rem,2.5vh,1.5rem)] rounded-lg shadow-md flex flex-row-reverse gap-3 justify-center items-center w-full max-w-[400px] perf-gpu-hover transition hover:shadow-2xl hover:scale-105 ease-in uppercase`}
            >
                <i className="pi-arrow-right text-negative pi" style={{ fontSize: "1.2rem" }} />
                {startButton}
            </button>
            <ScrollToButton targetId={nextSectionId} />
        </div>
    );
}
