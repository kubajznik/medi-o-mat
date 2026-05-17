import React, { forwardRef, useRef } from "react";
import { useKeyboardHandler } from "@/context/KeyboardContext";

type GewichtungsCardProps = {
  frage?: string;
  onClick: () => void;
};

const GewichtungsCard = forwardRef<HTMLDivElement, GewichtungsCardProps>(
  ({ frage, onClick }, ref) => {
    const barRef = useRef<HTMLDivElement | null>(null);
    const markerRef = useRef<HTMLParagraphElement | null>(null);

    const setBarRef = (node: HTMLDivElement | null) => {
      barRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    function mark() {
    if (barRef.current != null) {
      //if (bar.current.classList.contains('bg-white'))
      // bar.current.classList.remove('bg-white')
      // bar.current.classList.add('bg-blue', 'text-white')
      //   bar.current.classList.toggle("bg-white");
      barRef.current.classList.toggle("ring-2");
      barRef.current.classList.toggle("ring-highlight");
      barRef.current.classList.toggle("text-highlight");
    }
    if (markerRef.current != null) {
      markerRef.current.classList.toggle("opacity-0");
    }
  }

  const loseFocus = () => {
    barRef.current?.blur();
  }

  useKeyboardHandler({
    enabled: true,
    onKey: (event, action) => {
        if (action.type === "button" && 
            (action.button === "green" || action.button === "red") && 
            barRef.current === document.activeElement) {
            mark();
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
      className="relative bg-surface p-4 rounded-lg md:hover:ring-2 md:hover:ring-highlight overflow-hidden md:focus:scale-105 cursor-pointer"
    >
      <p
        onClick={mark}
        ref={markerRef}
        className="absolute inset-0 flex justify-start items-center opacity-0 md:hover:opacity-100 ml-5 font-bold text-highlight text-lg md:text-xl transition-opacity duration-300"
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
