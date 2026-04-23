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
      className={`p-4 bg-white transition ease-in-out text-black max-w-[300px] h-min rounded-lg flex flex-col gap-4 shadow-lg`}
    >
      <span className="flex flex-row justify-between items-baseline">
        <h3 className="font-medium text-xl text-dark">Beschreibung</h3>
        <button
          onClick={handleClick}
          type="button"
          className="rounded-full hover:bg-gray-200"
        >
          <i className="pi pi-times text-gray-600 p-2"></i>
        </button>
      </span>
      <p
        className={`${
          beschreibung ? "text-gray-400" : "text-red-400"
        } text-light font-medium `}
      >
        {beschreibung ? beschreibung : "keine Beschreibung vorhanden!"}
      </p>
    </div>
  );
}
