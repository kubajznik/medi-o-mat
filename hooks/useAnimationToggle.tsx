import { useReduceMotion } from "@/context/PerformanceContext";
import { useEffect, useState } from "react";

export default function useAnimationToggle(intervalTime: number) {
  const reduceMotion = useReduceMotion();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      setAnimate(false);
      return;
    }

    const interval = setInterval(() => {
      setAnimate((prev) => !prev);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [intervalTime, reduceMotion]);

  return reduceMotion ? false : animate;
}
