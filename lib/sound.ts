/**
 * Plays a pleasant, modern notification chime using Web Audio API synthesis
 * (C5 -> E5 -> G5 soft sine bell tone with gentle exponential decay).
 * Works across all modern browsers without loading external MP3 assets.
 */
export function playNotificationSound() {
  if (typeof window === "undefined") return;

  try {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Pleasant 3-note ascending chime sequence: C5 (523.25 Hz) -> E5 (659.25 Hz) -> G5 (783.99 Hz)
    const tones = [
      { freq: 523.25, time: 0.0, duration: 0.15, gainVal: 0.12 },
      { freq: 659.25, time: 0.08, duration: 0.2, gainVal: 0.14 },
      { freq: 783.99, time: 0.16, duration: 0.35, gainVal: 0.16 },
    ];

    tones.forEach(({ freq, time, duration, gainVal }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + time);

      // Fast attack, smooth exponential decay
      gain.gain.setValueAtTime(0, now + time);
      gain.gain.linearRampToValueAtTime(gainVal, now + time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + time + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + time);
      osc.stop(now + time + duration + 0.05);
    });
  } catch (err) {
    console.warn("Could not play notification sound:", err);
  }
}
