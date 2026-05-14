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