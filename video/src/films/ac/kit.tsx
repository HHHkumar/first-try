import type { ReactNode } from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { ramp } from '../../anim';
import { LEAD } from '../../ui/Shell';
import { rgb, Stage3D, type Add } from '../../world/Stage3D';
import type { CameraPose } from '../../world/WireWorld';
import { Timeline as BaseTimeline } from '../charge/kit';

// The look and the shared pieces of the alternating-current series ("Aurora"):
// a deep indigo stage with teal and magenta light, a floor of light running to
// the horizon with reflections in it, and waves coloured by where they are in their cycle.
export { at, Cap, shot } from '../charge/kit';
export { EndCard } from '../capacitance/kit';
export const BG = '#0b0722';
export const PINK = '#ff4fa3';
export const CYAN = '#35c9ff';
export const MINT = '#7dffb0';
export const TEAL = '#5ff5e0';
export const SUN = '#ffd646';
export const VIOLET = '#b78bff';
export const WHITE = '#ffffff';
export const FLOOR = -3.2;
const HAZE =
  'radial-gradient(ellipse 60% 55% at 18% 22%, rgba(0,220,200,0.26), rgba(0,220,200,0) 70%), radial-gradient(ellipse 55% 60% at 85% 30%, rgba(214,60,255,0.24), rgba(214,60,255,0) 70%), radial-gradient(ellipse 90% 40% at 50% 100%, rgba(60,90,255,0.30), rgba(60,90,255,0) 75%)';

export const hsl = (h: number, s: number, l: number): [number, number, number] => {
  const f = (n: number) => {
    const k = (n + h * 12) % 12;
    return l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return [f(0), f(8), f(4)];
};
// colour for a point u cycles along a wave
export const phaseColor = (u: number) => hsl((((0.86 + u * 0.75) % 1) + 1) % 1, 0.95, 0.66);

// Chapter frame: world, aurora light, 2D on top, narration, fades.
export const AShell = ({ voice, frames, world, children }: { voice: string; frames: number; world?: ReactNode; children: ReactNode }) => {
  const frame = useCurrentFrame();
  const veil = Math.max(1 - ramp(frame, 0, 12), ramp(frame, frames - 16, frames - 2));
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {world}
      <AbsoluteFill style={{ mixBlendMode: 'screen', background: HAZE }} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)' }} />
      {children}
      <AbsoluteFill style={{ backgroundColor: BG, opacity: veil }} />
      <Sequence from={LEAD}>
        <Audio src={staticFile(`voice/${voice}.mp3`)} />
      </Sequence>
    </AbsoluteFill>
  );
};

const floor = (glow: Add) => {
  const c = rgb('#42e8ff');
  for (let x = -40; x <= 40; x += 2) for (let z = -60; z <= 14; z += 0.5) glow(x, FLOOR, z, 0.07, c, 0.5);
  for (let z = -60; z <= 14; z += 2) for (let x = -40; x <= 40; x += 0.5) glow(x, FLOOR, z, 0.07, c, 0.5);
};

// The stage. `scene` is drawn twice: once reflected faintly in the floor, once for real.
export const AStage = ({ pose, orbs, scene, opacity = 1, mirror = 0.16, ground = true }: { pose: CameraPose; orbs?: (add: Add) => void; scene: (glow: Add) => void; opacity?: number; mirror?: number; ground?: boolean }) => {
  const { width, height } = useVideoConfig();
  if (opacity <= 0.003) return null;
  return (
    <AbsoluteFill style={{ opacity }}>
      <Stage3D
        width={width}
        height={height}
        bg={BG}
        fog={0.014}
        deep={[0.12, 0.08, 0.2]}
        pose={pose}
        orbs={orbs}
        glows={(add) => {
          if (ground) {
            floor(add);
            scene((x, y, z, size, color, alpha) => add(x, 2 * FLOOR - y, z, size, color, alpha * mirror));
          }
          scene(add);
        }}
      />
    </AbsoluteFill>
  );
};

export const sway = (frame: number, amount = 1.5) => Math.sin(frame * 0.003) * amount;

// A wave drawn as a ribbon of light from x0 to x1. `y(x)` gives its height and
// `color(x)` its colour; `fill` hangs faint threads from the wave to its axis.
export const ribbon = (glow: Add, x0: number, x1: number, y: (x: number) => number, color: (x: number) => readonly number[], opts: { z?: number; gain?: number; fill?: boolean; axis?: number; size?: number } = {}) => {
  const { z = 0, gain = 1, fill = true, axis = 0, size = 0.2 } = opts;
  if (gain <= 0.01 || x1 <= x0) return;
  const n = Math.round((x1 - x0) / 0.026);
  for (let i = 0; i <= n; i++) {
    const x = x0 + (i / n) * (x1 - x0);
    const yy = y(x);
    const c = color(x);
    glow(x, yy, z, size, c, gain);
    if (fill && i % 3 === 0) for (let j = 1; j < 9; j++) glow(x, axis + ((yy - axis) * j) / 9, z, 0.09, c, 0.22 * gain);
    if (i % 4 === 0) glow(x, axis, z, 0.07, [1, 1, 1], 0.45 * gain);
  }
};

// A level line along x (dashed), for marking a value on a wave.
export const level = (glow: Add, y: number, x0: number, x1: number, color: string, gain = 1, z = 0) => {
  if (gain <= 0.01) return;
  const c = rgb(color);
  for (let x = x0; x <= x1; x += 0.09) if (Math.floor(x / 0.36) % 2 === 0) glow(x, y, z, 0.13, c, 0.9 * gain);
};

// The generator: two pole faces with a field between them and a loop turning in it.
export const poles = (orb: Add, cx: number, gain = 1) => {
  if (gain <= 0.01) return;
  for (const side of [-1, 1]) for (let x = 0; x < 3; x++) for (let y = -2; y <= 2.01; y += 0.8) for (let z = -2.4; z <= 2.41; z += 0.8) orb(cx + side * (5 + x * 0.8), y, z, 0.8, rgb(side < 0 ? PINK : CYAN), gain);
};
export const gapField = (glow: Add, cx: number, frame: number, gain = 1) => {
  if (gain <= 0.01) return;
  const f = rgb(MINT);
  for (const y of [-1.6, -0.8, 0, 0.8, 1.6])
    for (const z of [-2, -1, 0, 1, 2])
      for (let i = 0; i <= 80; i++) {
        const phase = (((i - frame * 0.8 + y * 9 + z * 5) % 40) + 40) % 40;
        const pulse = Math.exp(-(phase * phase) / 14);
        glow(cx - 4 + i * 0.1, y, z, 0.07 + 0.1 * pulse, f, (0.3 + 0.6 * pulse) * gain);
      }
};
export const loop = (glow: Add, cx: number, angle: number, color: string, gain = 1, r = 2.3, mark: readonly number[] | null = null) => {
  if (gain <= 0.01) return;
  const w = rgb(color);
  const x = Math.cos(angle) * r;
  const y = Math.sin(angle) * r;
  for (let i = 0; i <= 50; i++) {
    const z = -2 + i * 0.08;
    glow(cx + x, y, z, 0.2, w, 0.9 * gain);
    glow(cx - x, -y, z, 0.2, w, 0.9 * gain);
  }
  for (const z of [-2, 2]) for (let i = 0; i <= 50; i++) glow(cx - x + (i / 50) * 2 * x, -y + (i / 50) * 2 * y, z, 0.2, w, 0.9 * gain);
  if (mark) glow(cx + x, y, 2, 1.3, mark, gain);
};

export const TIMELINE = [
  { year: '1832', name: 'Pixii' },
  { year: '1886', name: 'Westinghouse' },
  { year: '1891', name: 'AEG' },
  { year: '1895', name: 'Tokyo' },
  { year: '1896', name: 'Osaka' },
] as const;
export const Timeline = (props: { frame: number; already: number[]; events?: [number, number][]; opacity?: number }) => <BaseTimeline {...props} entries={TIMELINE} />;
