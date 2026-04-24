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
      className="border-solid border-2 rounded-2xl p-4 transition active:bg-blue-700 active:text-white text-dark hover:border-[#C86BFA] hover:scale-110
         border-gray-300"
    >
      {label}
    </button>
  );
}
