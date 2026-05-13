import { useState } from "react";
import { SpotifyIcon } from "../icons/spotify";

export default function VorschlagCard({
  name,
  beschreibung,
  image,
  url,
  spotifyUrl,
  mediumArt,
  codierung,
  cardClassName,
  cardIndex,
}: {
  cardIndex?: number;
  cardClassName?: string;
  codierung?: number;
  mediumArt?: string;
  url?: string;
  spotifyUrl?: string;
  name: string;
  beschreibung: string;
  image: string;
}) {
  const [showMore, setShowMore] = useState(false);
  const handleClick = () => {
    setShowMore(!showMore);
  };
  return (
    <div
      className={`${cardClassName} ${cardIndex === 1
          ? "border-[4px] border-medio-cyan"
          : cardIndex === 0
                ? "border-[4px] border-medio-pink"
              : cardIndex === 2
                  ? "border-[4px] border-medio-orange"
                : "border-2 border-gray-200"
        } bg-surface p-6 w-72 md:w-96 min-h-[600px] md:min-h-[700px] rounded-2xl hover:scale-95 scale-90 flex justify-between flex-col shadow-xl transition-all`}
    >
      <div className="flex flex-col gap-6">
        <span>
          <p className="bg-gray-100 px-2 rounded-md w-min font-medium text-gray-500 text-sm uppercase tracking-[1px]">
            {mediumArt}
          </p>
          <h2
            className="mt-1 px-1 font-semibold text-2xl uppercase"
            title={name}
          >
            {name.length > 27 ? `${name.slice(0, 27)}...` : name}
          </h2>
        </span>
        <img
          src={image}
          alt="medium"
          className="bg-contain rounded-lg h-[200px] object-contain"
        />
        {beschreibung && (
          <p className="text-base">
            {showMore
              ? beschreibung
              : `${beschreibung.slice(0, 200)}${beschreibung.length > 200 ? "..." : ""
              }`}
          </p>
        )}
        {beschreibung && beschreibung.length > 200 && (
          <button onClick={handleClick} className="rounded-md text-text-faded">
            {showMore ? "Weniger anzeigen" : "mehr anzeigen..."}
          </button>
        )}
      </div>
      {codierung}
      <div className="flex justify-around">
        <a
          href={url ? url : "/"}
          className="w-fit uppercase cursor-pointer"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex justify-center items-baseline gap-4 mt-8 p-4 rounded-lg bg-text-primary text-text-negative cursor-pointer">
            <i className="text-negative text-lg cursor-pointer pi pi-external-link"></i>
          </div>
        </a>

        {
          spotifyUrl && 
          <a
            href={spotifyUrl}
            className="w-fit uppercase cursor-pointer"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex justify-center items-baseline gap-4 bg-spotify-black mt-8 rounded-lg text-white cursor-pointer">
              <SpotifyIcon className="w-[52px] h-[52px]"/>
            </div>
          </a>
        }
      </div>
    </div>
  );
}
