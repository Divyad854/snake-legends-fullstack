let audioCtx = null;

function ensureAudio() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      /* audio unavailable */
    }
  }
  return audioCtx;
}

function beep(soundOn, freq, dur, type, gainVal) {
  if (!soundOn) return;
  const ctx = ensureAudio();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type || "sine";
  osc.frequency.value = freq;
  gain.gain.value = gainVal || 0.08;
  osc.connect(gain);
  gain.connect(ctx.destination);
  const now = ctx.currentTime;
  gain.gain.setValueAtTime(gain.gain.value, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
  osc.start(now);
  osc.stop(now + dur);
}

export const sfx = {
  eat: (on) => { beep(on, 760, 0.12, "triangle", 0.09); setTimeout(() => beep(on, 980, 0.09, "triangle", 0.07), 60); },
  click: (on) => beep(on, 420, 0.05, "square", 0.04),
  gameOver: (on) => { beep(on, 300, 0.18, "sawtooth", 0.08); setTimeout(() => beep(on, 180, 0.28, "sawtooth", 0.08), 140); },
  locked: (on) => beep(on, 180, 0.08, "square", 0.05),
  purchase: (on) => { beep(on, 880, 0.08, "sine", 0.08); setTimeout(() => beep(on, 1180, 0.1, "sine", 0.08), 70); },
};
