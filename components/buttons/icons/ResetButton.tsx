import clsx from "clsx";
import { Refresh } from "iconoir-react";

interface ResetButtonProps {
  onReset: () => void;
  className?: string;
}

export default function ResetButton({ onReset, className = "" }: ResetButtonProps) {
  return (
        <button
        onClick={onReset}
        type="button"
        className={clsx("btn-icon", className)}
        >
            <Refresh className="w-8 h-8"/> 
        </button>
  );
}

