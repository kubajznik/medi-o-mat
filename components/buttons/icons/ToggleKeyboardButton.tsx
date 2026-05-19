import clsx from "clsx";
import localStorageManager from "@/util/localStore";
import Keyboard from "@/components/icons/keyboard";
import Mouse from "@/components/icons/mouse";

interface ToggleKeyboardButtonProps {
    className?: string;
    isActive?: boolean;
    onToggle?: (enabled: boolean) => void;
}

export default function ToggleKeyboardButton({ className, isActive = false, onToggle }: ToggleKeyboardButtonProps) {
    const handleClick = () => {
        const newMode = !isActive;
        localStorageManager.setKeyboardMode(newMode);
        onToggle?.(newMode);
    };

    return (
        <button
        onClick={handleClick}
        type="button"
        className={clsx("btn-icon", className)}
        >
            {
                isActive ? 
                <Mouse className="w-8 h-8"/>
                : 
                <Keyboard className="w-8 h-8"/> 
            }
        </button>
    )

}