import React, { forwardRef, useRef, useState } from "react";
import { useKeyboardHandler } from "@/context/KeyboardContext";
import { useReduceMotion } from "@/context/PerformanceContext";
import { SpotifyIcon } from "../icons/spotify";

type VorschlagCardProps = {
  cardIndex?: number;
  cardClassName?: string;
  codierung?: number;
  mediumArt?: string;
  url?: string;
  spotifyUrl?: string;
  name: string;
  beschreibung: string;
  image: string;
};

const VorschlagCard = forwardRef<HTMLDivElement, VorschlagCardProps>((
  {
  name,
  beschreibung,
  image,
  url,
  spotifyUrl,
  mediumArt,
  codierung,
  cardClassName,
  cardIndex,
  },
  ref
) => {
  const [showMore, setShowMore] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReduceMotion();

  const setCardRef = (node: HTMLDivElement | null) => {
    cardRef.current = node;
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  const handleClick = () => {
    setShowMore((prev) => !prev);
  };

  useKeyboardHandler({
    enabled: true,
    onKey: (event, action) => {
      if (cardRef.current !== document.activeElement) return false;

      if (action.type === "button" && action.button === "green") {
        setShowMore(true);
        return true;
      }

      if (action.type === "button" && action.button === "red") {
        setShowMore(false);
        return true;
      }

      return false;
    },
  });

  return (
    <div
      ref={setCardRef}
      tabIndex={0}
      className={`${cardClassName} ${cardIndex === 1
          ? "border-[4px] border-medio-cyan"
          : cardIndex === 0
                ? "border-[4px] border-medio-pink"
              : cardIndex === 2
                  ? "border-[4px] border-medio-orange"
                : "border-2 border-gray-200"
        } bg-surface p-[clamp(1rem,2vh,1.5rem)] w-[clamp(16rem,28vw,24rem)] min-h-0 max-h-[min(52vh,520px)] rounded-2xl flex justify-between flex-col shadow-xl focus-visible:outline-none ${
          reduceMotion
            ? ""
            : "perf-gpu-hover hover:scale-95 focus:scale-[0.95] transition-transform"
        }`}
    >
      <div className="flex flex-col gap-[clamp(0.75rem,2vh,1.5rem)] min-h-0 overflow-y-auto">
        <span>
          <p className="bg-gray-100 px-2 rounded-md w-min font-medium text-gray-500 text-sm uppercase tracking-[1px]">
            {mediumArt}
          </p>
          <h2
            className="mt-1 px-1 font-semibold arcade:text-medio-lila text-[clamp(1.125rem,2.5vh,1.5rem)] uppercase"
            title={name}
          >
            {name.length > 27 ? `${name.slice(0, 27)}...` : name}
          </h2>
        </span>
        <img
          src={image}
          alt=""
          loading="lazy"
          decoding="async"
          className="bg-contain rounded-lg h-[clamp(6rem,18vh,12.5rem)] object-contain shrink-0"
        />
        {beschreibung && (
          <p className="arcade:text-medio-dark text-base">
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
            <i className="text-negative arcade:text-medio-dark text-lg cursor-pointer pi pi-external-link"></i>
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
);

VorschlagCard.displayName = "VorschlagCard";

export default VorschlagCard;
