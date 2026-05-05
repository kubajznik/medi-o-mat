"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollToButtonProps {
  targetId: string;
}

export default function ScrollToButton({ targetId }: ScrollToButtonProps) {
  const sentinelRef = useRef<HTMLSpanElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleScrollToTarget = () => {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <span ref={sentinelRef} className="block h-12 w-12" aria-hidden="true" />
      {isVisible && (
        <button
          type="button"
          onClick={handleScrollToTarget}
          aria-label="Scroll to target section"
          className="fixed left-1/2 bottom-10 -translate-x-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition hover:border-gray-500 hover:text-gray-700 sm:bottom-12 lg:bottom-[10%]"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      )}
    </>
  );
};