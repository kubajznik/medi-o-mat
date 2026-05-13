"use client";

import useAnimationToggle from "@/hooks/useAnimationToggle";
import { useRouter } from "next/navigation";
import ScrollToButton from "../buttons/ScrollToButton";
import { useKeyboardHandler } from "@/context/KeyboardContext";

interface HomeClientProps {
  ersteInformation: string;
  startButton: string;
  medienuebersichtButton: string;
  nextSectionId: string;
}

export default function HomeClient({
  ersteInformation,
  startButton,
  medienuebersichtButton,
  nextSectionId,
}: HomeClientProps) {
  const router = useRouter();
  const animate = useAnimationToggle(7000);

  const handleStartButtonClick = () => {
    router.push("/befragung");
  }

  useKeyboardHandler({
    enabled: true,
    onKey: (event, action) => {
      if (action.type === "button" && action.button === "green") {
        handleStartButtonClick();
        return true
      }
      return false
    }
  });

  return (
    <div className="flex flex-col justify-center items-center mt-10 sm:mt-0 min-h-screen text-center">
      <img src="/images/mediomat_logo.png" alt="Medi-o-Mat Logo" className="px-2 w-auto h-auto" />
      <p
        className="mt-8 md:mt-16 max-w-[800px] font-normal text-text-primary text-xl"
        style={{ whiteSpace: "pre-wrap" }}
      >
        {ersteInformation}
      </p>
      <button
        onClick={handleStartButtonClick}
        className={`${
          animate ? "animate__animated animate__headShake" : ""
        } mt-28 px-6 py-4 bg-medio-pink text-white font-medium text-2xl rounded-lg shadow-md flex flex-row-reverse gap-3 justify-center items-center w-[400px] transition hover:shadow-2xl hover:scale-105 ease-in uppercase`}
      >
        <i className="pi-arrow-right text-white pi" style={{ fontSize: "1.2rem" }} />
        {startButton}
      </button>
      <ScrollToButton targetId={nextSectionId} />
    </div>
  );
}
