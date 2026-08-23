export const playLevelUpSound = () => {
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtx) return;
  const ctx = new AudioCtx();

  // Retro 8-bit arpeggio sound (C4, E4, G4, C5)
  const notes = [261.63, 329.63, 392.00, 523.25];
  notes.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(ctx.destination);

    const startTime = ctx.currentTime + index * 0.08;
    gain.gain.setValueAtTime(0.2, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

    osc.start(startTime);
    osc.stop(startTime + 0.25);
  });
};