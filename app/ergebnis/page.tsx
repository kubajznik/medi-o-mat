"use client";
import localStorageManager from "@/util/localStore";
import { useEffect, useRef, useState } from "react";
import VorschlagCard from "@/components/cards/vorschlagCard";
import test from "../../data/media.json";
import { useRouter, useSearchParams } from "next/navigation";
//import {useEffect, useState} from 'react';
import React, { Suspense, use } from "react";
import textData from "@/data/texte.json";
import { useReduceMotion } from "@/context/PerformanceContext";
import { scrollElementIntoView } from "@/util/scrollIntoView";
import { useKeyboardHandler } from "@/context/KeyboardContext";
import type { GewichteteAntworten } from "@/types/Befragung";
import { parseSurveyAnswersParam } from "@/util/surveyFlow";
import type { Media, MediaList, MediaResults } from "@/types/Media";
import Place from "@/components/icons/Place";

const CARD_COUNT = 3;
const BUTTON_INDEX = CARD_COUNT;

const ErgebnisContent = () => {
    const router = useRouter();
    const reduceMotion = useReduceMotion();
    const searchParams = useSearchParams();
    const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const [focusedIndex, setFocusedIndex] = useState(0);
    const [answers, setAnswers] = useState<GewichteteAntworten | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const handleRestart = () => {
        localStorageManager.clearSurveyProgress();
        router.push("/");
    };

    const mediaList: MediaList = test as MediaList;
    const mediaResults: MediaResults = {};
    useEffect(() => {
        const fromQuery = parseSurveyAnswersParam<{
            value: number;
            weight: number;
        }>(searchParams.get("answer"));
        const fromSession = localStorageManager.getWeightedAnswers();
        const resolved = fromQuery.length > 0 ? fromQuery : fromSession;

        if (resolved.length === 0) {
            router.replace("/befragung/");
            return;
        }

        localStorageManager.setWeightedAnswers(resolved);
        setAnswers(resolved);
        setIsInitialized(true);
    }, [searchParams, router]);

    useEffect(() => {
        if (!isInitialized) return;
        const target =
            focusedIndex === BUTTON_INDEX
                ? buttonRef.current
                : cardRefs.current[focusedIndex];
        if (!target) return;
        target.focus();
        scrollElementIntoView(target, reduceMotion);
    }, [focusedIndex, reduceMotion, isInitialized]);

    useKeyboardHandler({
        enabled: true,
        onKey: (event, action) => {
            if (action.type === "nav" && action.direction === "up") {
                setFocusedIndex((prev) => Math.max(prev - 1, 0));
                return true;
            }
            if (action.type === "nav" && action.direction === "down") {
                setFocusedIndex((prev) =>
                    prev < CARD_COUNT ? BUTTON_INDEX : prev
                );
                return true;
            }
            if (action.type === "nav" && action.direction === "left") {
                setFocusedIndex((prev) => {
                    if (prev >= CARD_COUNT) return prev;
                    return Math.max(prev - 1, 0);
                });
                return true;
            }
            if (action.type === "nav" && action.direction === "right") {
                setFocusedIndex((prev) => {
                    if (prev >= CARD_COUNT) return prev;
                    return Math.min(prev + 1, CARD_COUNT - 1);
                });
                return true;
            }
            if (action.type === "button" && action.button === "green") {
                if (buttonRef.current === document.activeElement) {
                    handleRestart();
                    return true;
                }
            }
            return false;
        },
    });

    if (!isInitialized || !answers) {
        return null;
    }

    for (const medium of mediaList) {
        mediaResults[medium.code] = 0;
        for (let attr in medium.codierung) {
            const answerIndex = Number(attr) - 1;
            const answer = answers[answerIndex];
            if (!Number.isInteger(answerIndex) || !answer) {
                console.error("Invalid answer mapping for medium:", {
                    mediumCode: medium.code,
                    attr,
                    answerIndex,
                });
                continue;
            }
            mediaResults[medium.code] +=
                Math.pow(answer.value - medium.codierung[attr], 2) * answer.weight;
        }
        mediaResults[medium.code] = Math.sqrt(mediaResults[medium.code]);
    }

    let sorted = Object.entries(mediaResults).sort((a, b) => {
        // @ts-ignore
        return a[1] - b[1];
    });

    let winners = sorted.slice(0, 3);
    const favoriteCards: Media[] = [];
    favoriteCards.push(
        mediaList.find((e) => e.code === winners[0][0]) as Media
    );
    favoriteCards.push(
        mediaList.find((e) => e.code === winners[1][0]) as Media
    );
    favoriteCards.push(
        mediaList.find((e) => e.code === winners[2][0]) as Media
    );

    return (
        <div className="survey-page mx-auto p-3 md:p-6 max-w-[1300px] w-full flex flex-col min-h-0 flex-1">
            <div className="flex flex-row justify-between shrink-0">
                <div>
                    <h1 className="font-semibold text-[clamp(1.5rem,4vh,2.25rem)]">Auswertung</h1>
                    <h2 className="text-[clamp(1rem,2.5vh,1.25rem)] leading-snug">
                        Diese Auswahl an Medien könnten Sie interessieren.
                    </h2>
                </div>
            </div>

            <Suspense fallback={<div>Loading...</div>}>
                <div className="flex-1 min-h-0 pt-[clamp(0.5rem,2vh,2.5rem)] pb-2 w-full overflow-x-auto overflow-y-hidden">
                    <div className="flex m-auto p-2 md:p-4 w-max">
                        {favoriteCards.map((card, index) => (
                            <div
                                key={index}
                                className={`relative ${
                                    test
                                }`}
                            >
                                <Place index={index} />
                                <div className="flex">
                                    <VorschlagCard
                                        key={index}
                                        ref={(el) => {
                                            cardRefs.current[index] = el;
                                        }}
                                        name={card.name}
                                        beschreibung={card.beschreibung}
                                        image={card.image}
                                        mediumArt={card.mediumArt}
                                        url={card.url}
                                        spotifyUrl={card.spotifyUrl}
                                        cardIndex={index}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Suspense>

            <span className="flex flex-col items-center md:items-end gap-2 w-full shrink-0 py-[clamp(0.5rem,2vh,1rem)]">
                <button
                    type="button"
                    ref={buttonRef}
                    onClick={handleRestart}
                    className="flex items-center gap-3 bg-purple-100 hover:bg-purple-200 mx-auto px-6 py-4 rounded-lg focus-visible:outline-none w-fit text-purple-400 hover:text-purple-500 uppercase scale-95 hover:scale-100 focus:scale-100 transition-all"
                >
                    Zurück auf Start
                    <i className="pi pi-replay" style={{ fontSize: "1rem" }} />
                </button>
            </span>
        </div>
    );
};

const Ergebnis = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ErgebnisContent />
        </Suspense>
    );
};

export default Ergebnis;
