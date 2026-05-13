import { Refresh } from "iconoir-react"

interface ResetButtonProps {
  onReset: () => void;
  className?: string;
}

export default function ResetButton({ onReset, className = "" }: ResetButtonProps) {
  return (
        <button
        onClick={onReset}
        type="button"
        className={`p-2 bg-surface text-gray-400 transition w-min h-min flex items-center justify-center rounded-full shadow-lg hover:scale-110 ${className}`}
        >
            <Refresh className="w-8 h-8"/> 
        </button>
  );
}

