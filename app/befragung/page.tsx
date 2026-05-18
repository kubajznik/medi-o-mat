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
    const restartButtonRef = React.useRef<HTMLButtonElement | null>(null);
    const [focusRequestIndex, setFocusRequestIndex] = useState(0);
    const [focusRequestToken, setFocusRequestToken] = useState(0);
    const [lastFocusedIndex, setLastFocusedIndex] = useState(0);

    const questionData = data as Fragebogen;
    const flatQuestions = useMemo(
        () => questionData.fragen.flatMap((category) => category.fragenliste),
        [questionData]
    );
    const totalQuestionCount = flatQuestions.length;

    useEffect(() => {
        setIsKeyboardMode(localStorageManager.getKeyboardMode());
    }, []);

    const handleCancel = () => {
        router.push("/");
    };

    const handleResetClick = () => {
        onReset();
    };

    const onReset = () => {
        setCurrentQuestionIndex(0);
        setCurrentQuestValue([]);
        setSumme(0);
    };
    const currentQuestion = flatQuestions[currentQuestionIndex] ?? null;

    const handleNextQuestion = (value: number) => {
        const nextValues = [...currentQuestValue, value];
        setCurrentQuestValue(nextValues);
        setSumme((prev) => prev + value);
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < totalQuestionCount) {
            setCurrentQuestionIndex(nextIndex);
            return;
        }
        localStorageManager.setAnswers(nextValues);
        router.push("/gewichtung");
    };

    const handleQuestionBefore = () => {
        if (currentQuestionIndex > 0) {
            const lastValue = currentQuestValue[currentQuestValue.length - 1] ?? 0;
            setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
            setSumme((prev) => prev - lastValue);
            setCurrentQuestValue((prev) => prev.slice(0, -1));
        }
    };

    useKeyboardHandler({
        enabled: isKeyboardMode,
        onKey: (event, action) => {
            if (!currentQuestion || hideExample) return false;

            if (action.type === "nav" && action.direction === "down") {
                if (document.activeElement !== restartButtonRef.current) {
                    restartButtonRef.current?.focus();
                    return true;
                }
            }

            if (action.type === "nav" && action.direction === "up") {
                if (document.activeElement === restartButtonRef.current) {
                    setFocusRequestIndex(lastFocusedIndex);
                    setFocusRequestToken((prev) => prev + 1);
                    return true;
                }
            }

            if (action.type === "button" && action.button === "red") {
                handleQuestionBefore();
                return true;
            }

            if (document.activeElement === restartButtonRef.current) {
                if (action.type === "confirm" || (action.type === "button" && action.button === "green")) {
                    handleResetClick();
                    return true;
                }
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
                            focusRequestIndex={focusRequestIndex}
                            focusRequestToken={focusRequestToken}
                            onFocusIndexChange={setLastFocusedIndex}
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
                <button
                    className="flex bg-accent hover:bg-highlight focus:bg-highlight opacity-0 arcade:opacity-100 mx-auto mt-10 p-4 rounded-xl text-medio-dark"
                    onClick={handleResetClick}
                    ref={restartButtonRef}

                >
                    Befragung neu starten
                </button>
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
