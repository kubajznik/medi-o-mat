"use client";
import BeschreibungsBtn from "@/components/buttons/beschreibungsBtn";
import BeschreibungsCard from "@/components/cards/beschreibungsCard";
import FragenKarte from "@/components/cards/fragenKarte";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

// import JSON
import data from "../../data/questions.json";

export default function Befragung() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [hideExample, setHideExample] = useState(false);
  const [summe, setSumme] = useState(0);
  const [currentQuestValue, setCurrentQuestValue] = useState<number[]>([]);

  const handleCancel = () => {
    router.push("/");
  };

  const handleNextQuestion = (value: number) => {
    setCurrentQuestValue((prev) => [...prev, value]);
    setSumme((prev) => prev + value);
    let updatedSumme = summe + value;
    let updateQuestValue = [...currentQuestValue, value];
    if (currentQuestionIndex + 1 < totalQuestionCount) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      router.push("/gewichtung?answer=" + JSON.stringify(updateQuestValue));
    }
  };

  const handleQuestionBefore = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
      setSumme(
        (prev) => prev - currentQuestValue[currentQuestValue.length - 1]
      );
      setCurrentQuestValue((prev) => prev.slice(0, -1));
    }
  };

  // Helper
  let totalQuestionCount = data.fragen.reduce(
    (acc, curr) => acc + curr.fragenliste.length,
    0
  );

  let currentQuestion = null;
  let currentCategoryIndex = 0;
  for (let i = 0; i < data.fragen.length; i++) {
    if (
      currentQuestionIndex >= currentCategoryIndex &&
      currentQuestionIndex <
      currentCategoryIndex + data.fragen[i].fragenliste.length
    ) {
      currentQuestion =
        data.fragen[i].fragenliste[currentQuestionIndex - currentCategoryIndex];
      break;
    }
    currentCategoryIndex += data.fragen[i].fragenliste.length;
  }

  return (
    <div className="bg-gray-100 w-full h-screen">
      <div className="flex flex-col gap-14 items-center pt-4 md:pt-24">
        <div className="flex flex-row gap-4">
          {/* Zurück-Button */}

          <div className="relative w-full max-w-[1000px]">
            {currentQuestionIndex > 0 && !hideExample && (
              <button
                onClick={handleQuestionBefore}
                type="button"
                className="absolute top-3 left-3 md:-left-16 p-4 bg-[#C86BFA] text-white rounded-lg flex gap-2 justify-center items-center w-min"
              >
                <i
                  className="pi pi-arrow-left"
                  style={{ fontSize: "1rem", fontWeight: "bold" }}
                ></i>
              </button>
            )}

            {currentQuestion && !hideExample && (
              <FragenKarte
                frage={currentQuestion.frage}
                handleNextQuestion={handleNextQuestion}
                fragenCounter={{
                  index: currentQuestionIndex + 1,
                  counter: totalQuestionCount,
                }}
                bewertung={currentQuestion.bewertung}
              />
            )}

            <div className="absolute top-3 right-3 md:top-3 md:-right-16 z-10">
              <BeschreibungsBtn
                hideExample={hideExample}
                handleClick={() => setHideExample(!hideExample)}
              />
            </div>
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
          className="bg-[#FE4E4E20] hover:bg-[#FE4E4E30] text-[#FE4E4E] uppercase w-[500px] p-2 rounded-lg font-medium"
          onClick={handleCancel}
        >
          befragung abbrechen
        </button> */}
      </div>
    </div>
  );
}
