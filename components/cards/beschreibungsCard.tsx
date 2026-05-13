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
      className={`p-4 bg-surface transition ease-in-out max-w-[300px] h-min rounded-lg flex flex-col gap-4 shadow-lg`}
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
        className={`${
          beschreibung ? "text-text-primary" : "text-red-400"
        } text-light font-medium `}
      >
        {beschreibung ? beschreibung : "keine Beschreibung vorhanden!"}
      </p>
    </div>
  );
}
