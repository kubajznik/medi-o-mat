"use client";
import GewichtungsCard from "@/components/cards/gewichtungsCard";
import React, { useEffect, useMemo, useState, useRef } from "react";
import data from "../../data/questions.json";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useKeyboardHandler } from "@/context/KeyboardContext";
import type {
    Antworten,
    Fragebogen,
    GewichteteAntwort,
} from "@/types/Befragung";

function GewichtungContent() {
    const router = useRouter();
    const questionData = data as Fragebogen;
    const questions = questionData.fragen.flatMap((category) =>
        category.fragenliste.map((question) => question.frage)
    );

    const handleButtonClick = () => {
        router.push("/ergebnis?answer=" + JSON.stringify(output));
    };

    // Keyboard navigation section ///////////////////////////////////////////////////////////////////
    const divRefs = useRef<Array<HTMLDivElement | null>>([]);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const [focusedIndex, setFocusedIndex] = useState(0);

    useEffect(() => {
        const focusTarget =
            focusedIndex === questions.length
                ? buttonRef.current
                : divRefs.current[focusedIndex];

        if (!focusTarget) return;

        focusTarget.focus();
        focusTarget.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    }, [focusedIndex, questions.length]);

    useKeyboardHandler({
        enabled: true,
        onKey: (event, action) => {
            if (action.type === "nav" && action.direction === "up") {
                setFocusedIndex((prev) => Math.max(prev - 1, 0));
                return true;
            }

            if (action.type === "nav" && action.direction === "down") {
                if (focusedIndex === questions.length - 1) {
                    buttonRef.current?.focus();
                    setFocusedIndex(questions.length);
                    return true;
                }
                setFocusedIndex((prev) => Math.min(prev + 1, questions.length - 1));
                return true;
            }

            if (action.type === "button" && action.button === "green") {
                if (focusedIndex === questions.length) {
                    handleButtonClick();
                    return true;
                }
            }
            return false;
        }
    });


    // Answer handling section ////////////////////////////////////////////////////////////////////////
    const searchParams = useSearchParams();
    const answersParam = searchParams.get("answer");
    const answers = useMemo<Antworten>(() => {
        if (!answersParam) return [];
        try {
            const parsed = JSON.parse(answersParam);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.error("Failed to parse answers from search params:", error);
            return [];
        }
    }, [answersParam]);

    const [output, setOutput] = useState<GewichteteAntwort[]>(() =>
        answers.map((value) => ({ value, weight: 1 }))
    );

    useEffect(() => {
        setOutput(answers.map((value) => ({ value, weight: 1 })));
    }, [answers]);

    function doubleWeight(question: number) {
        setOutput((prev) =>
            prev.map((item, index) =>
                index === question
                    ? { ...item, weight: item.weight === 1 ? 2 : 1 }
                    : item
            )
        );
    }

    /**
     * Um zu zählen, wie viele Thesen man angeclickt hat.
     * NOTE - Funktioniert noch nicht richtig. Habe es erstmal weggelassen.
     */
    // const [counters, setCounters] = useState<number[]>(
    //   Array(questions.length).fill(0)
    // );

    // const handleCounter = (index: number) => {
    //   setCounters((prevCounters) => {
    //     const newCounters = [...prevCounters];
    //     newCounters[index] = newCounters[index] === 0 ? 1 : 0;
    //     // Aktualisieren Sie das Gewicht im output-Array entsprechend
    //     output[index].weight = newCounters[index] === 1 ? 2 : 1;
    //     return newCounters;
    //   });
    // };

    // const totalCount = counters.reduce((acc, val) => acc + val, 0);

    return (
        <div className="flex flex-col items-center px-5 md:px-10 pt-10 min-h-screen">
            <div className="flex flex-col gap-2 max-w-[900px]">
                <div className="items-start">
                    <h1 className="font-semibold text-4xl md:text-6xl">Gewichtung der Thesen</h1>
                    <h3 className="mb-3 md:mb-10 max-w-[900px] text-xl md:text-2xl">
                        Welche Thesen sind Ihnen besonders wichtig? Markieren Sie die Thesen,
                        um diese mit doppelter Gewichtung in die Berechnung einfließen zu
                        lassen.
                    </h3>
                </div>

                <div className="flex flex-col justify-center gap-3">
                    {questions.map((frage, index) => (
                        <div className="w-full" key={index}>
                            {index === 0 ? (
                                <p className="gewichtungCategory">Plattform</p>
                            ) : (
                                ""
                            )}
                            {index === 3 ? <p className="gewichtungCategory">Form</p> : null}
                            {index === 6 ? (
                                <p className="gewichtungCategory">Beitragslänge</p>
                            ) : (
                                ""
                            )}
                            {index === 7 ? (
                                <p className="gewichtungCategory">Frequenz</p>
                            ) : (
                                ""
                            )}
                            {index === 8 ? <p className="gewichtungCategory">Kosten</p> : ""}
                            {index === 9 ? (
                                <p className="gewichtungCategory">Redaktion</p>
                            ) : (
                                ""
                            )}
                            {index === 12 ? <p className="gewichtungCategory">Inhalt</p> : ""}
                            <GewichtungsCard
                                ref={(el) => {
                                    divRefs.current[index] = el;
                                }}
                                frage={frage}
                                onClick={() => {
                                    doubleWeight(index);
                                }}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex flex-col items-center mx-auto mt-5 md:mt-10 mb-5 text-center">
                    {/* NOTE - Zum anzeigen, wie viele Thesen man ausgewählt hat. Funktionier noch nicht richtig! */}
                    {/* <p className="mb-2 text-soft-gray">
            {totalCount} These(n) wurde(n) ausgewählt
          </p> */}
                    <button
                        type="button"
                        onClick={handleButtonClick}
                        className="flex flex-row justify-center items-center gap-3 bg-medio-purple-10 hover:bg-medio-purple-14 px-6 py-4 rounded-lg sm:w-full md:w-[400px] font-medium text-medio-pink text-2xl uppercase hover:scale-105 transition ease-in"
                        ref={buttonRef}
                    >
                        zur auswertung
                        <i className="pi-arrow-right pi" style={{ fontSize: "1.3rem" }}></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Gewichtung() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <GewichtungContent />
        </Suspense>
    );
}
