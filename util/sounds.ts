type SoundId = "move" | "confirm" | "fanfare";

const SOUND_FILES: Record<SoundId, string> = {
    move: "/sounds/move.wav",
    confirm: "/sounds/confirm.wav",
    fanfare: "/sounds/fanfare.wav",
};

const templates: Partial<Record<SoundId, HTMLAudioElement>> = {};
let unlocked = false;

function getTemplate(id: SoundId): HTMLAudioElement {
    if (!templates[id]) {
        const audio = new Audio(SOUND_FILES[id]);
        audio.preload = "auto";
        templates[id] = audio;
    }
    return templates[id]!;
}

/** Unlock playback after a user gesture (required on kiosk / Raspberry Pi). */
export async function unlockAudio(): Promise<boolean> {
    if (typeof window === "undefined") return false;
    if (unlocked) return true;

    const ids: SoundId[] = ["move", "confirm", "fanfare"];
    try {
        await Promise.all(
            ids.map(async (id) => {
                const audio = getTemplate(id);
                const previousMuted = audio.muted;
                audio.muted = true;
                await audio.play();
                audio.pause();
                audio.currentTime = 0;
                audio.muted = previousMuted;
            })
        );
        unlocked = true;
        return true;
    } catch (error) {
        console.warn("Audio unlock failed:", error);
        return false;
    }
}

function playClip(id: SoundId, volume = 1) {
    if (typeof window === "undefined") return;

    const start = () => {
        const clip = getTemplate(id).cloneNode(true) as HTMLAudioElement;
        clip.volume = volume;
        void clip.play().catch((error) => {
            console.warn(`Failed to play sound "${id}":`, error);
        });
    };

    if (unlocked) {
        start();
        return;
    }

    void unlockAudio().then((ok) => {
        if (ok) start();
    });
}

export function playMoveSound() {
    playClip("move", 0.7);
}

export function playConfirmSound() {
    playClip("confirm", 0.8);
}

export function playFanfareSound() {
    playClip("fanfare", 0.85);
}
