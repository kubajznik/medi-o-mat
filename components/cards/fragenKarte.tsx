import React, { useState } from "react";
import FrageButton from "../buttons/frageButtun";

interface Bewertung {
  wert: number;
  label: string;
}

interface FragenKarteProps {
  frage: string;
  kategorie?: string;
  fragenCounter: { index: number; counter: number };
  bewertung: Bewertung[];
  handleNextQuestion: (value: number) => void;
}

export default function FragenKarte({
  frage,
  fragenCounter,
  kategorie,
  handleNextQuestion,
  bewertung,
}: FragenKarteProps) {
  const handleButtonClick = (value: number) => {
    handleNextQuestion(value);
  };

  return (
    <div className="flex flex-col gap-6 md:gap-10 w-full max-w-[1000px] rounded-2xl px-4 md:px-8 lg:px-16 py-6 md:py-10 shadow-lg bg-white text-dark">
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
            label={frage.label}
            handleClick={() => handleButtonClick(frage.wert)}
          />
        ))}
      </div>
    </div>
  );
}
