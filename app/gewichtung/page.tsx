"use client";
import GewichtungsCard from "@/components/cards/gewichtungsCard";
import React, { useState } from "react";
import data from "../../data/questions.json";
import { useRouter, useSearchParams } from "next/navigation";
import { router } from "next/client";
import { Suspense } from "react";

interface Answer {
  value: number;
  weight: number;
}

function GewichtungContent() {
  const router = useRouter();

  const questions: any[] = [];
  for (let category of data["fragen"]) {
    for (let question of category.fragenliste) {
      questions.push(question.frage);
    }
  }

  const searchParams = useSearchParams();
  let output: Answer[] = [];
  let answers = JSON.parse(searchParams.get("answer") as string);
  for (let i = 0; i < answers.length; i++) {
    output.push({
      value: answers[i],
      weight: 1,
    });
  }

  function doubleWeight(question: number) {
    output[question].weight = output[question].weight == 1 ? 2 : 1;
    console.log(output);
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
    <div className="px-5 md:px-10 h-screen  text-dark pt-10">
      <div className="flex flex-col gap-2">
        <h1 className="font-semibold text-4xl md:text-6xl">Gewichtung der Thesen</h1>
        <h3 className="text-xl md:text-2xl max-w-[900px] mb-3 md:mb-10">
          Welche Thesen sind Ihnen besonders wichtig? Markieren Sie die Thesen,
          um diese mit doppelter Gewichtung in die Berechnung einfließen zu
          lassen.
        </h3>

        <div className="flex flex-col gap-3 w-full justify-center items-center">
          {questions.map((frage, index) => (
            <div className="w-full md:w-3/4" key={index}>
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
                key={index}
                frage={frage}
                onClick={() => {
                  doubleWeight(index);
                  // handleCounter(index);
                }}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center text-center mt-5 md:mt-10 mb-5">
          {/* NOTE - Zum anzeigen, wie viele Thesen man ausgewählt hat. Funktionier noch nicht richtig! */}
          {/* <p className="mb-2 text-[#c4c4c4]">
            {totalCount} These(n) wurde(n) ausgewählt
          </p> */}
          <button
            type="button"
            onClick={() =>
              router.push("/ergebnis?answer=" + JSON.stringify(output))
            }
            className="flex w-[400px] flex-row-reverse items-center justify-center gap-3 rounded-lg bg-[#C86BFA16] px-6 py-4 text-2xl 
                      font-medium uppercase text-[#C86BFA] transition ease-in hover:scale-105 hover:bg-[#C86BFA24]"
          >
            <i className="pi pi-arrow-right" style={{ fontSize: "1.3rem" }}></i>
            zur auswertung
          </button>
          <br />
          <br />
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
