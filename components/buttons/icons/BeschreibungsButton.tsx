"use client";

import clsx from "clsx";

export default function BeschreibungsButton({
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
      className={clsx("btn-icon", {
        hidden: hideExample,
      })}
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
