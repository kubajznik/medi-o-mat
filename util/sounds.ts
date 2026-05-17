export function playMoveSound() {
  const audioCtx = new (window.AudioContext || window.AudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  oscillator.frequency.setValueAtTime(800, audioCtx.currentTime); // Hell
  oscillator.type = 'square'; // 8-bit feeling
  
  gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
  
  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + 0.1);
}

// Bestätigung (chime)
export function playConfirmSound() {
  const audioCtx = new (window.AudioContext || window.AudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
  oscillator.frequency.linearRampToValueAtTime(900, audioCtx.currentTime + 0.15);
  oscillator.type = 'sawtooth';
  
  gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
  
  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + 0.25);
}

export function playFanfareSound() {
  const audioCtx = new (window.AudioContext || window.AudioContext)();
    
  const notes = [
    {freq: 523, duration: 0.12},
    {freq: 523, duration: 0.12},
    {freq: 523, duration: 0.12},
    {freq: 1047, duration: 0.28},
    {freq: 784, duration: 0.18},
    {freq: 659, duration: 0.45}
  ];
  
  let time = audioCtx.currentTime;
  notes.forEach((note, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.frequency.setValueAtTime(note.freq, time);
    osc.type = 'square';
    
    const volume = (i === 3 || i === 5) ? 0.35 : 0.25;
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + note.duration);
    
    osc.start(time);
    osc.stop(time + note.duration);
    time += note.duration + 0.02;
  });
}