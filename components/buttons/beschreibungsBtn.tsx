"use client";
import React, { useState } from "react";

export default function BeschreibungsBtn({
  handleClick,
  hideExample,
}: {
  handleClick: () => void;
  hideExample: boolean;
}) {
  return (
    <button
      onClick={handleClick}
      type="button"
      className={`${
        hideExample ? "hidden" : ""
      } p-2 bg-surface transition w-min h-min flex items-center justify-center rounded-full shadow-lg hover:scale-110`}
    >
      <i
        className="pi pi-question-circle"
        style={{
          fontSize: "2rem",
        }}
      ></i>
    </button>
  );
}
