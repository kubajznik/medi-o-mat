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
      className="active:bg-blue-700 p-4 border-2 border-gray-300 hover:border-highlight border-solid rounded-2xl text-dark active:text-white hover:scale-110 transition"
    >
      {label}
    </button>
  );
}
