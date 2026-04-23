"use client";
import VorschlagCard from "@/components/cards/vorschlagCard";
import test from "../../data/media.json";
import { useRouter, useSearchParams } from "next/navigation";
//import {useEffect, useState} from 'react';
import React, { Suspense } from "react";
import textData from "@/data/texte.json";
import useAnimationToggle from "@/hooks/useAnimationToggle";
import Crown from "@/components/icons/crown";
import { Container } from "postcss";

interface Bewertung {
    wert: number;
    label: string;
}

interface Medium {
    name: string;
    mediumArt: string;
    beschreibung: string;
    url: string;
    spotifyUrl?: string;
    image: string;
    code: string;
    codierung: { [key: string]: number };
}

const ErgebnisContent = () => {
    const router = useRouter();
    const animate = useAnimationToggle(7000);
    const searchParams = useSearchParams();

    const testArray: Medium[] = test;

    let mediaResults: { [index: string]: number } = {};
    let answers = JSON.parse(searchParams.get("answer") as string);

    for (let medium of test) {
        // @ts-ignore
        mediaResults[medium.code] = 0;
        for (let attr in medium.codierung) {
            // @ts-ignore
            mediaResults[medium.code] += Math.pow(answers[attr - 1].value - medium.codierung[attr], 2) * answers[attr - 1].weight;
        }
        // @ts-ignore
        mediaResults[medium.code] = Math.sqrt(mediaResults[medium.code]);
    }

    let sorted = Object.entries(mediaResults).sort((a, b) => {
        // @ts-ignore
        return a[1] - b[1];
    });

    let winners = sorted.slice(0, 3);
    const favoriteCards: any[] = [];
    favoriteCards.push(
        test.find((e, i) => {
            return e.code == winners[0][0];
        })
    );
    favoriteCards.push(
        test.find((e, i) => {
            return e.code == winners[1][0];
        })
    );
    favoriteCards.unshift(
        test.find((e, i) => {
            return e.code == winners[2][0];
        })
    );

    return (
        <div className="overflow-x-hidden p-3 md:p-10 text-dark">
            <div className="flex flex-row justify-between">
                <div>
                    <h1 className="text-4xl font-semibold">Auswertung</h1>
                    <h2 className="text-xl">
                        Diese Auswahl an Medien könnten Sie interessieren.
                    </h2>
                </div>
            </div>

            <Suspense fallback={<div>Loading...</div>}>
                <div className="w-full overflow-x-auto overflow-y-hidden pt-10 pb-5">
                    <div className="flex w-max m-auto p-4">
                        {favoriteCards.map((card, index) => (
                            <div
                                key={index}
                                className={`relative ${
                                    index === 0 ? "order-2 md:order-1" :
                                    index === 1 ? "order-1 md:order-2" :
                                    "order-3"
                                }`}
                            >
                                <Crown index={index} />
                                <div className="flex">
                                    <VorschlagCard
                                        key={index}
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

            <span className="flex w-full flex-col items-center md:items-end md:absolute top-3 right-3 gap-2">
                <button
                    onClick={() => router.push("/befragung")}
                    className="flex w-fit items-center mr-3 gap-3 rounded-lg bg-purple-100 px-6 py-4 uppercase text-purple-400 scale-95 transition-all 
                            hover:scale-100 hover:bg-purple-200 hover:text-purple-500"
                >
                    {textData.repeat}
                    <i className="pi pi-replay" style={{ fontSize: "1rem" }} />
                </button>
                <button
                    onClick={() => router.push("/")}
                    className="underline text-sm text-gray-400"
                >
                    {textData.zurStartseite}
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
