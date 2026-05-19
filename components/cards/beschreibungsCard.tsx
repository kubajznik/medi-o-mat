import clsx from "clsx";
import React from "react";

export default function BeschreibungsCard({
  handleClick,
  beschreibung,
}: {
  handleClick: () => void;
  beschreibung: string;
}) {
  return (
    <div
      className="card-base p-4 transition ease-in-out max-w-[300px] h-min flex flex-col gap-4 shadow-lg"
    >
      <span className="flex flex-row justify-between items-baseline">
        <h3 className="font-medium text-xl">Beschreibung</h3>
        <button
          onClick={handleClick}
          type="button"
          className="hover:bg-fg rounded-full"
        >
          <i className="p-2 text-text-primary pi pi-times"></i>
        </button>
      </span>
      <p
        className={clsx("text-light font-medium", {
          "text-text-primary": beschreibung,
          "text-red-400": !beschreibung,
        })}
      >
        {beschreibung ? beschreibung : "keine Beschreibung vorhanden!"}
      </p>
    </div>
  );
}
