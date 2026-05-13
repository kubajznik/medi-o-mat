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
        className={`p-2 bg-surface text-text-primary transition w-min h-min flex items-center justify-center rounded-full shadow-lg hover:scale-110 ${className}`}
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