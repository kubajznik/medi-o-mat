"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import FrageButton from "../buttons/frageButtun";

interface Bewertung {
  wert: number;
  label: string;
}

interface FragenKarteProps {
  frage: string;
  kategorie?: string;
  fragenCounter: { index: number; counter: number };
  bewertung?: Bewertung[];
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

  const onCardKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const isArrow = e.key === "ArrowRight" || e.key === "ArrowLeft";

    if (e.repeat && !isArrow) return;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      setFocusedIndex((prev) => Math.min(prev + 1, bewertung.length - 1));
      return;
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setFocusedIndex((prev) => Math.max(prev - 1, 0));
      return;
    }

    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      selectAt(focusedIndex);
      return;
    }

    if (/^[1-9]$/.test(e.key)) {
      const nextIndex = Number(e.key) - 1;
      if (nextIndex < bewertung.length) {
        e.preventDefault();
        setFocusedIndex(nextIndex);
        setTimeout(() => selectAt(nextIndex), 450);
      }
    }
  };

  return (
    <div
      onKeyDown={onCardKeyDown}
      className="flex flex-col gap-6 md:gap-10 w-full max-w-[1000px] rounded-2xl px-4 md:px-8 lg:px-16 py-6 md:py-10 shadow-lg bg-white text-dark"
    >
      <h3 className="font-semibold text-lg text-center md:text-left md:text-2xl leading-[140%]">
        {"Frage " + fragenCounter.index + " von " + fragenCounter.counter}
      </h3>

      <h2 className="font-normal text-xl md:text-4xl leading-[140%]">
        {frage + "."}
      </h2>

      <div className="flex flex-col md:flex-row md:justify-between gap-3 md:gap-6 mt-2 md:mt-6">
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
