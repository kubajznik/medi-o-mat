import clsx from "clsx";
import React, { forwardRef, useRef, useState } from "react";
import { useKeyboardHandler } from "@/context/KeyboardContext";

type GewichtungsCardProps = {
  frage?: string;
  onClick: () => void;
};

const GewichtungsCard = forwardRef<HTMLDivElement, GewichtungsCardProps>(
  ({ frage, onClick }, ref) => {
    const barRef = useRef<HTMLDivElement | null>(null);
    const markerRef = useRef<HTMLParagraphElement | null>(null);
    const [isMarked, setIsMarked] = useState(false);

    const setBarRef = (node: HTMLDivElement | null) => {
      barRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const toggleMark = () => {
      setIsMarked((prev) => !prev);
    };

  const loseFocus = () => {
    barRef.current?.blur();
  }

  useKeyboardHandler({
    enabled: true,
    onKey: (event, action) => {
        if (action.type === "button" && 
            (action.button === "green" || action.button === "red") && 
            barRef.current === document.activeElement) {
            toggleMark();
            onClick();
            return true;
        }
        return false;
    }
  });

  return (
    <div
      onClick={onClick}
      onMouseEnter={loseFocus}
      ref={setBarRef}
      tabIndex={0}
      className={clsx(
        "card-base relative p-4 md:hover:ring-2 md:hover:ring-highlight overflow-hidden md:focus:scale-105 cursor-pointer",
        isMarked && "ring-2 ring-highlight text-highlight"
      )}
    >
      <p
        onClick={toggleMark}
        ref={markerRef}
        className={clsx(
          "absolute inset-0 flex justify-start items-center md:hover:opacity-100 ml-5 font-bold text-highlight text-lg md:text-xl transition-opacity duration-300",
          isMarked ? "opacity-100" : "opacity-0"
        )}
      >
        2x
      </p>
      <p className="pl-12 font-medium arcade:text-medio-dark text-lg md:text-xl">{frage}</p>
    </div>
  );
}
);

GewichtungsCard.displayName = "GewichtungsCard";

export default GewichtungsCard;
