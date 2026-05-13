"use client";
import React, { Suspense } from "react";
import data from "../../data/media.json";
import VorschlagCard from "@/components/cards/vorschlagCard";
import { useRouter } from "next/navigation";
import textData from "@/data/texte.json";

export default function Gewichtung() {
  const router = useRouter();
  const cards: any[] = [];
  for (let medium of data) {
    cards.push(medium);
  }
  return (
    <div className="p-8">
      <div className="flex justify-between items-center">
        <span>
          <h1 className="font-semibold text-4xl">Unsere Medien</h1>
          <h2 className="text-xl">Folgende Medien wurden von uns codiert</h2>
        </span>
        <span className="flex flex-col gap-2">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-3 bg-purple-100 hover:bg-purple-200 px-6 py-4 rounded-lg text-purple-400 hover:text-purple-500 uppercase scale-95 hover:scale-100 transition-all"
          >
            {textData.zurStartseite}
            {/* <i className="pi-arrow-right pi" style={{ fontSize: "1rem" }} /> */}
          </button>
        </span>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex py-2 wrap">
          {cards.map((card, index) => (
            <VorschlagCard
              key={index}
              name={card.name}
              beschreibung={card.beschreibung}
              image={card.image}
              mediumArt={card.mediumArt}
              url={card.url}
            />
          ))}
        </div>
      </Suspense>
    </div>
  );
}
