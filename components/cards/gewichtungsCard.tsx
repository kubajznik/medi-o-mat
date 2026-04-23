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
      bar.current.classList.toggle("ring-[#C86BFA]");
      bar.current.classList.toggle("bg-[#C86BFA28]");
      bar.current.classList.toggle("text-[#C86BFA]");
    }
    if (marker.current != null) {
      marker.current.classList.toggle("opacity-0");
    }
  }

  return (
    <div
      onClick={onClick}
      ref={bar}
      className="p-4 bg-[#f9f9f9]  rounded-lg relative overflow-hidden cursor-pointer hover:ring-2 hover:ring-_purple"
    >
      <p
        onClick={mark}
        ref={marker}
        className="opacity-0 transition-opacity duration-300 absolute inset-0 flex justify-start items-center hover:opacity-100 ml-5 font-bold text-lg md:text-xl text-[#C86BFA]"
      >
        2x
      </p>
      <p className="pl-12 font-medium text-lg md:text-xl">{frage}</p>
    </div>
  );
}
