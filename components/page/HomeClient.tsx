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
        <div id="#start" className="survey-shell flex flex-col justify-center items-center mt-10 sm:mt-0 short:mt-0 min-h-screen short:min-h-0 short:py-4 px-4 text-center">
            <img
                ref={logoRef}
                src="/images/mediomat_logo.png"
                alt="Medi-o-Mat Logo"
                className="px-2 w-auto max-h-[32vh] short:max-h-[20vh] object-contain"
                width={900}
                height={300}
                decoding="async"
            />
            <p
                className="mt-8 md:mt-16 short:mt-3 max-w-[900px] font-normal text-xl short:text-base short:leading-snug short:max-h-[30vh] short:overflow-y-auto"
                style={{ whiteSpace: "pre-wrap" }}
            >
                {ersteInformation}
            </p>
            <button
                onClick={handleStartButtonClick}
                className={`${animate ? "animate-head-shake" : ""
                    } mt-28 short:mt-4 px-6 py-4 short:py-3 bg-medio-pink arcade:bg-medio-cyan text-negative font-medium text-2xl short:text-lg rounded-lg shadow-md flex flex-row-reverse gap-3 justify-center items-center w-[400px] short:w-full short:max-w-sm perf-gpu-hover transition hover:shadow-2xl hover:scale-105 ease-in uppercase`}
            >
                <i className="pi-arrow-right text-negative pi" style={{ fontSize: "1.2rem" }} />
                {startButton}
            </button>
            <ScrollToButton targetId={nextSectionId} />
        </div>
    );
}
