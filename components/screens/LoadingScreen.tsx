export const LoadingScreen = () => {
    return (
        <div
            className="z-50 absolute inset-0 flex justify-center items-center bg-white/70"
            aria-live="polite"
        >
            <div className="flex flex-col items-center gap-3">
                <div
                    className="border-4 border-medio-pink/30 border-t-medio-pink rounded-full w-10 h-10 animate-spin"
                    role="status"
                    aria-label="Loading"
                />
            </div>
        </div>
    )
}
