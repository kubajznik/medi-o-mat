import React from "react";

export default function GewichtungsCard({
  frage,
  onClick,
}: {
  frage?: string;
  onClick: () => void;
}) {
  let bar: React.RefObject<HTMLDivElement> = React.createRef();
  let marker: React.RefObject<HTMLParagraphElement> = React.createRef();

  function mark() {
    if (bar.current != null) {
      //if (bar.current.classList.contains('bg-white'))
      // bar.current.classList.remove('bg-white')
      // bar.current.classList.add('bg-blue', 'text-white')
      //   bar.current.classList.toggle("bg-white");
      bar.current.classList.toggle("ring-2");
      bar.current.classList.toggle("ring-highlight");
      bar.current.classList.toggle("text-highlight");
    }
    if (marker.current != null) {
      marker.current.classList.toggle("opacity-0");
    }
  }

  return (
    <div
      onClick={onClick}
      ref={bar}
      className="relative bg-surface p-4 rounded-lg hover:ring-2 hover:ring-highlight overflow-hidden cursor-pointer"
    >
      <p
        onClick={mark}
        ref={marker}
        className="absolute inset-0 flex justify-start items-center opacity-0 hover:opacity-100 ml-5 font-bold text-highlight text-lg md:text-xl transition-opacity duration-300"
      >
        2x
      </p>
      <p className="pl-12 font-medium text-lg md:text-xl">{frage}</p>
    </div>
  );
}
