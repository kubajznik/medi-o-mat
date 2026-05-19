import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../public/sounds");
const SAMPLE_RATE = 22050;

function writeWav(filePath, samples) {
    const numSamples = samples.length;
    const dataSize = numSamples * 2;
    const buffer = Buffer.alloc(44 + dataSize);

    buffer.write("RIFF", 0);
    buffer.writeUInt32LE(36 + dataSize, 4);
    buffer.write("WAVE", 8);
    buffer.write("fmt ", 12);
    buffer.writeUInt32LE(16, 16);
    buffer.writeUInt16LE(1, 20);
    buffer.writeUInt16LE(1, 22);
    buffer.writeUInt32LE(SAMPLE_RATE, 24);
    buffer.writeUInt32LE(SAMPLE_RATE * 2, 28);
    buffer.writeUInt16LE(2, 32);
    buffer.writeUInt16LE(16, 34);
    buffer.write("data", 36);
    buffer.writeUInt32LE(dataSize, 40);

    for (let i = 0; i < numSamples; i++) {
        const clamped = Math.max(-1, Math.min(1, samples[i]));
        buffer.writeInt16LE(Math.floor(clamped * 32767), 44 + i * 2);
    }

    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(filePath, buffer);
}

function squareWave(freq, time, volume) {
    return Math.sign(Math.sin(2 * Math.PI * freq * time)) * volume;
}

function sawWave(freq, time, volume) {
    const phase = (freq * time) % 1;
    return (2 * phase - 1) * volume;
}

function withEnvelope(samples, sampleRate, attack = 0.005, release = 0.08) {
    const attackSamples = Math.floor(attack * sampleRate);
    const releaseSamples = Math.floor(release * sampleRate);
    const result = new Float32Array(samples.length);

    for (let i = 0; i < samples.length; i++) {
        let env = 1;
        if (i < attackSamples) env = i / attackSamples;
        const fromEnd = samples.length - 1 - i;
        if (fromEnd < releaseSamples) env = Math.min(env, fromEnd / releaseSamples);
        result[i] = samples[i] * env;
    }

    return result;
}

function createMove() {
    const duration = 0.1;
    const len = Math.floor(duration * SAMPLE_RATE);
    const raw = new Float32Array(len);
    for (let i = 0; i < len; i++) {
        raw[i] = squareWave(800, i / SAMPLE_RATE, 0.28);
    }
    return withEnvelope(raw, SAMPLE_RATE, 0.002, 0.05);
}

function createConfirm() {
    const duration = 0.25;
    const len = Math.floor(duration * SAMPLE_RATE);
    const raw = new Float32Array(len);
    for (let i = 0; i < len; i++) {
        const t = i / SAMPLE_RATE;
        const freq = 600 + (300 * t) / duration;
        raw[i] = sawWave(freq, t, 0.32);
    }
    return withEnvelope(raw, SAMPLE_RATE, 0.005, 0.1);
}

function createFanfare() {
    const notes = [
        { freq: 523, duration: 0.12 },
        { freq: 523, duration: 0.12 },
        { freq: 523, duration: 0.12 },
        { freq: 1047, duration: 0.28 },
        { freq: 784, duration: 0.18 },
        { freq: 659, duration: 0.45 },
    ];

    const gap = 0.02;
    const totalDuration = notes.reduce((sum, n) => sum + n.duration + gap, 0);
    const len = Math.floor(totalDuration * SAMPLE_RATE);
    const raw = new Float32Array(len);

    let offset = 0;
    notes.forEach((note, index) => {
        const noteSamples = Math.floor(note.duration * SAMPLE_RATE);
        const volume = index === 3 || index === 5 ? 0.34 : 0.24;
        for (let i = 0; i < noteSamples; i++) {
            const t = i / SAMPLE_RATE;
            raw[offset + i] = squareWave(note.freq, t, volume);
        }
        const release = Math.min(0.06, note.duration * 0.4);
        for (let i = 0; i < noteSamples; i++) {
            const fromEnd = noteSamples - 1 - i;
            if (fromEnd < Math.floor(release * SAMPLE_RATE)) {
                raw[offset + i] *= fromEnd / Math.floor(release * SAMPLE_RATE);
            }
        }
        offset += noteSamples + Math.floor(gap * SAMPLE_RATE);
    });

    return raw;
}

writeWav(path.join(outDir, "move.wav"), createMove());
writeWav(path.join(outDir, "confirm.wav"), createConfirm());
writeWav(path.join(outDir, "fanfare.wav"), createFanfare());

console.log("Generated sounds in public/sounds/");
