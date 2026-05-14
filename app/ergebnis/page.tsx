"use client";
import localStorageManager from "@/util/localStore";
import { useEffect, useRef, useState } from "react";
import VorschlagCard from "@/components/cards/vorschlagCard";
import test from "../../data/media.json";
import { useRouter, useSearchParams } from "next/navigation";
//import {useEffect, useState} from 'react';
import React, { Suspense, use } from "react";
import textData from "@/data/texte.json";
import useAnimationToggle from "@/hooks/useAnimationToggle";
import { useKeyboardHandler } from "@/context/KeyboardContext";
import type { GewichteteAntworten } from "@/types/Befragung";
import type { Media, MediaList, MediaResults } from "@/types/Media";
import Place from "@/components/icons/Place";

const ErgebnisContent = () => {
    const router = useRouter();
    const animate = useAnimationToggle(7000);
    const searchParams = useSearchParams();
    const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
    const [focusedIndex, setFocusedIndex] = useState(0);

    const mediaList: MediaList = test as MediaList;
    const mediaResults: MediaResults = {};
    const answersParam = searchParams.get("answer");
    const answers: GewichteteAntworten = (() => {
        if (!answersParam) return [];
        try {
            const parsed = JSON.parse(answersParam);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.error("Failed to parse answers from search params:", error);
            return [];
        }
    })();

    // Reset der Antworten im Localstorage
    useEffect(() => {
        localStorageManager.clearAnswers();
    }, []);

    useEffect(() => {
        const target = cardRefs.current[focusedIndex];
        if (!target) return;
        target.focus();
        target.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
        });
    }, [focusedIndex]);

    useKeyboardHandler({
        enabled: true,
        onKey: (event, action) => {
            if (action.type === "nav" && action.direction === "left") {
                setFocusedIndex((prev) => Math.max(prev - 1, 0));
                return true;
            }
            if (action.type === "nav" && action.direction === "right") {
                setFocusedIndex((prev) => Math.min(prev + 1, 2));
                return true;
            }
            return false;
        },
    });

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
        <div className="mx-auto p-3 md:p-10 max-w-[1300px] min-h-screen overflow-x-hidden">
            <div className="flex flex-row justify-between">
                <div>
                    <h1 className="font-semibold text-4xl">Auswertung</h1>
                    <h2 className="text-xl">
                        Diese Auswahl an Medien könnten Sie interessieren.
                    </h2>
                </div>
            </div>

            <Suspense fallback={<div>Loading...</div>}>
                <div className="pt-10 pb-5 w-full overflow-x-auto overflow-y-hidden">
                    <div className="flex m-auto p-4 w-max">
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

            <span className="top-3 right-3 md:absolute flex flex-col items-center md:items-end gap-2 w-full">
                <button
                    onClick={() => router.push("/befragung")}
                    className="flex items-center gap-3 bg-purple-100 hover:bg-purple-200 mr-3 px-6 py-4 rounded-lg w-fit text-purple-400 hover:text-purple-500 uppercase scale-95 hover:scale-100 transition-all"
                >
                    {textData.repeat}
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
