"use client";
import React, { Suspense } from "react";
import data from "../../data/media.json";
import VorschlagCard from "@/components/cards/vorschlagCard";
import { useRouter } from "next/navigation";
import textData from "@/data/texte.json";
import { MediaList } from "@/types/Media";

export default function Gewichtung() {
    const router = useRouter();
    const cards: MediaList = [];
    for (const medium of data) {
        cards.push(medium);
    }

    const [filteredCards, setFilteredCards] = React.useState(cards);

    const handleSearch = (query: string) => {
        const filtered = cards.filter((card) =>
            card.name.toLowerCase().includes(query.toLowerCase()) ||
            card.beschreibung.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredCards(filtered);
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center">
                <span>
                    <h1 className="font-semibold text-4xl">Unsere Medien</h1>
                    <h2 className="text-xl">Folgende Medien wurden von uns codiert</h2>


                    <div className="mt-4 w-full min-w-[200px] max-w-sm">
                        <div className="relative">
                            <input
                                className="bg-transparent shadow-sm focus:shadow py-2 pr-28 pl-3 border border-text-primary hover:border-highlight focus:border-highlight rounded-md focus:outline-none w-full placeholder:text-text-faded text-sm transition duration-300 ease"
                                placeholder="Suche..."
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                    </div>

                </span>
            </div>

            <Suspense fallback={<div>Loading...</div>}>
                <div className="flex py-2 wrap">
                    {filteredCards.map((card, index) => (
                        <VorschlagCard
                            key={index}
                            name={card.name}
                            beschreibung={card.beschreibung}
                            image={card.image}
                            mediumArt={card.mediumArt}
                            url={card.url}
                            spotifyUrl={card.spotifyUrl}
                        />
                    ))}
                </div>
            </Suspense>
        </div>
    );
}
