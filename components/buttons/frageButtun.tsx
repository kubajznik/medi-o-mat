"use client";
import React from "react";

type Props = {
  label: string;
  handleClick: () => void;
  index: number;
  buttonRef?: (el: HTMLButtonElement | null) => void;
  onFocus?: () => void;
  isFocused?: boolean;
};

export default function FrageButton({
  label,
  handleClick,
  buttonRef,
  onFocus,
  isFocused = false,
}: Props) {
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      onFocus={onFocus}
      className="p-4 border-2 border-gray-300 arcade:border-medio-lila hover:border-highlight border-solid rounded-2xl arcade:text-medio-dark md:hover:scale-110 transition"
    >
      {label}
    </button>
  );
}
