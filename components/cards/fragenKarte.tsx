"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import FrageButton from "../buttons/frageButtun";
import type { BewertungsOption } from "@/types/Befragung";
import { useKeyboardHandler } from "@/context/KeyboardContext";

interface FragenKarteProps {
  frage: string;
  kategorie?: string;
  fragenCounter: { index: number; counter: number };
  bewertung?: BewertungsOption[];
  handleNextQuestion: (value: number) => void;
  isKeyboardMode?: boolean;
}

export default function FragenKarte({
  frage,
  fragenCounter,
  kategorie,
  handleNextQuestion,
  isKeyboardMode = false,
  bewertung = [],
}: FragenKarteProps) {
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const defaultIndex = useMemo(
    () => Math.min(2, Math.max(0, bewertung.length - 1)),
    [bewertung.length]
  );
  const [focusedIndex, setFocusedIndex] = useState(defaultIndex);

  useEffect(() => {
    setFocusedIndex(defaultIndex);
  }, [defaultIndex, frage]);

  useEffect(() => {
    if (isKeyboardMode) {
      buttonRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex, isKeyboardMode]);

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
          setTimeout(() => selectAt(nextIndex), 450);
          return true;
        }
      }

      return false;
    },
  });

  return (
    <div className="flex flex-col gap-6 md:gap-10 bg-surface shadow-lg px-4 md:px-8 lg:px-16 py-6 md:py-10 rounded-2xl w-full max-w-[1000px]">
      <h3 className="font-semibold text-lg md:text-2xl md:text-left text-center leading-[140%]">
        {"Frage " + fragenCounter.index + " von " + fragenCounter.counter}
      </h3>

      <h2 className="font-normal text-xl md:text-4xl leading-[140%]">
        {frage + "."}
      </h2>

      <div className="flex md:flex-row flex-col md:justify-between gap-3 md:gap-6 mt-2 md:mt-6">
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
