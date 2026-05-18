"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import FrageButton from "../buttons/frageButtun";
import type { BewertungsOption } from "@/types/Befragung";
import { useKeyboardHandler } from "@/context/KeyboardContext";
import { useReduceMotion } from "@/context/PerformanceContext";

interface FragenKarteProps {
  frage: string;
  kategorie?: string;
  fragenCounter: { index: number; counter: number };
  bewertung?: BewertungsOption[];
  handleNextQuestion: (value: number) => void;
  isKeyboardMode?: boolean;
  focusRequestIndex?: number;
  focusRequestToken?: number;
  onFocusIndexChange?: (index: number) => void;
}

export default function FragenKarte({
  frage,
  fragenCounter,
  kategorie,
  handleNextQuestion,
  isKeyboardMode = false,
  bewertung = [],
  focusRequestIndex,
  focusRequestToken,
  onFocusIndexChange,
}: FragenKarteProps) {
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const defaultIndex = useMemo(
    () => Math.min(2, Math.max(0, bewertung.length - 1)),
    [bewertung.length]
  );
  const [focusedIndex, setFocusedIndex] = useState(defaultIndex);
  const reduceMotion = useReduceMotion();

  useEffect(() => {
    setFocusedIndex(defaultIndex);
  }, [defaultIndex, frage]);

  useEffect(() => {
    if (!isKeyboardMode || focusRequestToken === undefined || focusRequestIndex === undefined) {
      return;
    }
    if (bewertung.length === 0) return;
    const clamped = Math.min(Math.max(focusRequestIndex, 0), bewertung.length - 1);
    setFocusedIndex(clamped);
    buttonRefs.current[clamped]?.focus();
  }, [focusRequestToken, focusRequestIndex, isKeyboardMode, bewertung.length]);

  useEffect(() => {
    if (isKeyboardMode) {
      buttonRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex, isKeyboardMode]);

  useEffect(() => {
    onFocusIndexChange?.(focusedIndex);
  }, [focusedIndex, onFocusIndexChange]);

  const handleButtonClick = (value: number) => {
    handleNextQuestion(value);
  };

  const selectAt = (index: number) => {
    if (index < 0 || index >= bewertung.length) return;
    handleButtonClick(bewertung[index].wert);
  };

  useKeyboardHandler({
    enabled: isKeyboardMode,
    onKey: (event, action) => {
      if (bewertung.length === 0) return false;

      const isNav = action.type === "nav";
      if (event.repeat && !isNav) {
        return true;
      }

      if (action.type === "nav") {
        if (action.direction === "right") {
          setFocusedIndex((prev) => Math.min(prev + 1, bewertung.length - 1));
          return true;
        }
        if (action.direction === "left") {
          setFocusedIndex((prev) => Math.max(prev - 1, 0));
          return true;
        }
      }

      if (action.type === "confirm" || (action.type === "button" && action.button === "green")) {
        selectAt(focusedIndex);
        return true;
      }

      if (action.type === "number") {
        const nextIndex = action.value - 1;
        if (nextIndex < bewertung.length) {
          setFocusedIndex(nextIndex);
          setTimeout(() => selectAt(nextIndex), reduceMotion ? 0 : 450);
          return true;
        }
      }

      return false;
    },
  });

  return (
    <div className="flex flex-col gap-[clamp(0.75rem,2.5vh,2.5rem)] bg-surface shadow-lg px-4 md:px-8 lg:px-16 py-[clamp(1rem,3vh,2.5rem)] rounded-2xl w-full max-w-[1000px]">
      <h3 className="font-semibold arcade:text-medio-lila text-[clamp(1rem,2.5vh,1.5rem)] md:text-left text-center leading-[140%]">
        {"Frage " + fragenCounter.index + " von " + fragenCounter.counter}
      </h3>

      <h2 className="font-normal arcade:text-medio-dark text-[clamp(1.125rem,3.5vh,2.25rem)] leading-[140%]">
        {frage + "."}
      </h2>

      <div className="flex md:flex-row flex-col md:justify-between gap-[clamp(0.5rem,1.5vh,1.5rem)] mt-[clamp(0.5rem,2vh,1.5rem)]">
        {bewertung.map((frage, index) => (
          <FrageButton
            key={index}
            index={index}
            label={frage.label}
            buttonRef={(el) => {
              buttonRefs.current[index] = el;
            }}
              onFocus={() => setFocusedIndex(index)}
            isFocused={focusedIndex === index}
            handleClick={() => handleButtonClick(frage.wert)}
          />
        ))}
      </div>
    </div>
  );
}
