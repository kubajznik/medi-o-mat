"use client";
import ToggleKeyboardButton from "@/components/buttons/ToggleKeyboardButton";
import BeschreibungsBtn from "@/components/buttons/beschreibungsBtn";
import BeschreibungsCard from "@/components/cards/beschreibungsCard";
import FragenKarte from "@/components/cards/fragenKarte";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import localStorageManager from "@/util/localStore";
import type { Antworten, Fragebogen } from "@/types/Befragung";
import ResetButton from "@/components/buttons/ResetButton";
import { useKeyboardHandler } from "@/context/KeyboardContext";

// import JSON
import data from "../../data/questions.json";

export default function Befragung() {
    const router = useRouter();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [hideExample, setHideExample] = useState(false);
    const [summe, setSumme] = useState(0);
    const [currentQuestValue, setCurrentQuestValue] = useState<Antworten>([]);
    const [isKeyboardMode, setIsKeyboardMode] = useState(false);

    const questionData = data as Fragebogen;
    const flatQuestions = useMemo(
        () => questionData.fragen.flatMap((category) => category.fragenliste),
        [questionData]
    );
    const totalQuestionCount = flatQuestions.length;

    useEffect(() => {
        setIsKeyboardMode(localStorageManager.getKeyboardMode());
        const savedAnswers = localStorageManager.getAnswers();
        if (savedAnswers.length >= totalQuestionCount && totalQuestionCount > 0) {
            router.replace("/gewichtung?answer=" + JSON.stringify(savedAnswers));
            return;
        }
        if (savedAnswers.length > 0) {
            setCurrentQuestValue(savedAnswers);
            setSumme(savedAnswers.reduce((acc, val) => acc + val, 0));
            setCurrentQuestionIndex(savedAnswers.length);
        }
    }, [router, totalQuestionCount]);

    const handleCancel = () => {
        router.push("/");
    };

    const handleResetClick = () => {
        confirm("Möchtest du die Befragung wirklich zurücksetzen? Alle bisherigen Antworten gehen verloren.") && onReset();
    };

    const onReset = () => {
        localStorageManager.clearAnswers();
        setCurrentQuestionIndex(0);
        setCurrentQuestValue([]);
        setSumme(0);
    };
    const currentQuestion = flatQuestions[currentQuestionIndex] ?? null;

    const handleNextQuestion = (value: number) => {
        localStorageManager.addAnswer(value);
        const nextValues = [...currentQuestValue, value];
        setCurrentQuestValue(nextValues);
        setSumme((prev) => prev + value);
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < totalQuestionCount) {
            setCurrentQuestionIndex(nextIndex);
            return;
        }
        router.push("/gewichtung?answer=" + JSON.stringify(nextValues));
    };

    const handleQuestionBefore = () => {
        if (currentQuestionIndex > 0) {
            localStorageManager.popAnswer();
            const lastValue = currentQuestValue[currentQuestValue.length - 1] ?? 0;
            setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
            setSumme((prev) => prev - lastValue);
            setCurrentQuestValue((prev) => prev.slice(0, -1));
        }
    };

    useKeyboardHandler({
        enabled: isKeyboardMode,
        onKey: (event, action) => {
            if (action.type === "button" && action.button === "red") {
                handleQuestionBefore();
                return true;
            }
            return false;
        }
    })

    return (
        <div className="px-4 w-full h-screen">
            <div className="relative flex flex-row gap-4 mx-auto pt-4 md:pt-24 w-full max-w-[1000px]">
                {/* Zurück-Button */}

                <div className="relative w-full">
                    {currentQuestionIndex > 0 && !hideExample && (
                        <button
                            onClick={handleQuestionBefore}
                            type="button"
                            className="xl:top-3 -bottom-3 left-3 xl:-left-16 absolute flex justify-center items-center gap-2 bg-medio-pink p-4 rounded-lg h-fit text-negative translate-y-full xl:translate-y-0"
                        >
                            <i
                                className="pi-arrow-left text-negative pi"
                                style={{ fontSize: "1rem", fontWeight: "bold" }}
                            ></i>
                        </button>
                    )}

                    {currentQuestion && !hideExample && (
                        <FragenKarte
                            frage={currentQuestion.frage}
                            handleNextQuestion={handleNextQuestion}
                            isKeyboardMode={isKeyboardMode}
                            fragenCounter={{
                                index: currentQuestionIndex + 1,
                                counter: totalQuestionCount,
                            }}
                            bewertung={currentQuestion.bewertung ?? []}
                        />
                    )}

                    {!hideExample &&
                        <div className="xl:top-3 right-3 xl:-right-16 -bottom-2 xl:bottom-auto z-10 absolute flex flex-row-reverse xl:flex-col gap-4 h-fit translate-y-full xl:translate-y-0">
                            <BeschreibungsBtn
                                hideExample={hideExample}
                                handleClick={() => setHideExample(!hideExample)}
                            />
                            <ResetButton
                                onReset={handleResetClick}
                            />
                            <ToggleKeyboardButton
                                className="invisible md:visible"
                                isActive={isKeyboardMode}
                                onToggle={setIsKeyboardMode}
                            />
                        </div>
                    }
                    {
                        hideExample &&
                        <BeschreibungsCard
                            handleClick={() => setHideExample(false)}
                            beschreibung={currentQuestion?.beschreibung || ""}
                        />
                    }
                </div>

            </div>
            {/* <button
          className="bg-[#FE4E4E20] hover:bg-[#FE4E4E30] p-2 rounded-lg w-[500px] font-medium text-[#FE4E4E] uppercase"
          onClick={handleCancel}
        >
          befragung abbrechen
        </button> */}
        </div>
    );
}
