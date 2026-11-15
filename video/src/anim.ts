import { Easing, interpolate } from 'remotion';
import { FPS } from './theme';

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// 0 -> 1 between two frames.
export const ramp = (frame: number, from: number, to: number, easing: (t: number) => number = Easing.inOut(Easing.cubic)) =>
  interpolate(frame, [from, to], [0, 1], { ...CLAMP, easing });

// Fades in over `fade` frames from `start`, and out over `fade` frames ending at `end`.
export const span = (frame: number, start: number, end: number, fade = 14) =>
  Math.min(interpolate(frame, [start, start + fade], [0, 1], CLAMP), interpolate(frame, [end - fade, end], [1, 0], CLAMP));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const lerp3 = (a: readonly number[], b: readonly number[], t: number) =>
  a.map((v, i) => lerp(v, b[i], t)) as [number, number, number];

export type Word = { text: string; start: number; end: number; paragraph: number };

// Looks up when a spoken word starts, so every visual is pinned to the
// narration and follows it if a chapter is ever re-voiced.
export const makeCues = (words: Word[], leadFrames: number) => {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9']/g, '');
  const seconds = (text: string, nth = 1) => {
    const target = norm(text);
    let seen = 0;
    for (const w of words) {
      if (norm(w.text) === target && ++seen === nth) return w.start;
    }
    throw new Error(`Narration cue not found: "${text}" (#${nth})`);
  };
  // frame at which the nth occurrence of the word starts, plus an offset in seconds
  return (text: string, nth = 1, offset = 0) => Math.round(leadFrames + (seconds(text, nth) + offset) * FPS);
};
