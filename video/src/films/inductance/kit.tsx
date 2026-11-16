import { useMemo } from 'react';
import { Timeline as BaseTimeline } from '../charge/kit';
import { drawLines, type Line } from '../../world/field';
import { BFIELD, CURRENT, makeCoil, traceCoil } from '../../world/magnet';
import { mulberry32 } from '../../world/rng';
import { rgb, type Add } from '../../world/Stage3D';
import type { CameraPose } from '../../world/WireWorld';

// Pieces shared by every chapter of "The Current That Won't Stop" (inductance).
export { at, Cap, Ink, shot } from '../charge/kit';
export { EndCard, GOLD } from '../capacitance/kit';
export const VOICE = (n: number) => `inductance/ch${n}`;
export const VOLT = '#ffb36b';

export const TIMELINE = [
  { year: '1831', name: 'Faraday' },
  { year: '1832', name: 'Henry' },
  { year: '1834', name: 'Lenz' },
  { year: '1851', name: 'Ruhmkorff' },
  { year: '1886', name: 'Heaviside' },
  { year: '1893', name: 'The henry' },
  { year: '1899', name: 'Pupin' },
] as const;
export const Timeline = (props: { frame: number; already: number[]; events?: [number, number][]; opacity?: number }) => <BaseTimeline {...props} entries={TIMELINE} />;

// --- the coil ------------------------------------------------------------------
export type CoilShape = { xs: number[]; radius: number; lines: Line[] };
export const useCoil = (turns = 11, length = 6, radius = 1.5): CoilShape =>
  useMemo(() => {
    const xs = Array.from({ length: turns }, (_, i) => -length / 2 + (i / (turns - 1)) * length);
    const seeds: [number, number, number][] = [[0, 0, 0]];
    for (const f of [0.3, 0.6, 0.8]) for (let k = 0; k < 6; k++) seeds.push([0, Math.cos((k * Math.PI) / 3) * f * radius, Math.sin((k * Math.PI) / 3) * f * radius]);
    return { xs, radius, lines: traceCoil(makeCoil(xs, radius), seeds, 12) };
  }, [turns, length, radius]);

export const coilPose = (frame: number, back = 14): CameraPose => ({ pos: [5 + Math.sin(frame * 0.003) * 2, 3.4, back], target: [0, 0, 0], fov: 34, focus: back + 1, dof: 0.045 });

// The turns of the coil. Beads of current run round them only while current flows:
// `flow` is how far the beads have travelled, `current` how bright they are.
export const drawTurns = (glow: Add, coil: CoilShape, flow: number, current: number, gain = 1) => {
  if (gain <= 0.01) return;
  const c = rgb('#ffb36b');
  const gold = rgb(CURRENT);
  coil.xs.forEach((x, k) => {
    for (let i = 0; i < 70; i++) {
      const a = (i / 70) * Math.PI * 2;
      const phase = (((i - flow + k * 5) % 23) + 23) % 23;
      const bead = phase < 2 && current > 0.03;
      glow(x, Math.cos(a) * coil.radius, Math.sin(a) * coil.radius, bead ? 0.15 + 0.15 * current : 0.15, bead ? gold : c, (bead ? 0.95 : 0.7) * gain);
    }
  });
};

// The coil's field: its brightness follows the current.
export const drawCoilField = (glow: Add, coil: CoilShape, frame: number, current: number, boost = 1, reveal = 1) => {
  if (current <= 0.02) return;
  drawLines(glow, coil.lines, frame, current * 1.5 * boost, BFIELD, { bold: true, reveal });
};

export const drawCore = (orb: Add, length: number, slide = 1) => {
  if (slide <= 0) return;
  const iron = rgb('#9aa6c0');
  for (let x = -length / 2 - 0.4; x <= length / 2 + 0.41; x += 0.62) for (const [y, z] of [[0.36, 0.36], [-0.36, 0.36], [0.36, -0.36], [-0.36, -0.36]]) orb(x - (1 - slide) * 9, y, z, 0.66, iron, 1);
};

// --- sparks, drawn fresh every frame ----------------------------------------------
export const Spark = ({ x, y, frame, size = 120, opacity = 1 }: { x: number; y: number; frame: number; size?: number; opacity?: number }) => {
  if (opacity <= 0.01) return null;
  const r = mulberry32(frame * 7 + 3);
  const rays = Array.from({ length: 9 }, () => {
    const a = r() * Math.PI * 2;
    const l = size * (0.35 + r() * 0.9);
    const k = (r() - 0.5) * 0.7;
    return `M ${x} ${y} L ${x + Math.cos(a + k) * l * 0.5} ${y + Math.sin(a + k) * l * 0.5} L ${x + Math.cos(a) * l} ${y + Math.sin(a) * l}`;
  });
  return (
    <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity, filter: 'drop-shadow(0 0 14px #9fdcff)' }}>
      <defs>
        <radialGradient id="sparkhalo">
          <stop offset="0" stopColor="#8fd0ff" stopOpacity={0.55} />
          <stop offset="1" stopColor="#8fd0ff" stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={size * 2} fill="url(#sparkhalo)" opacity={0.6 + 0.4 * r()} />
      <circle cx={x} cy={y} r={size * 0.28} fill="#ffffff" />
      <path d={rays.join(' ')} fill="none" stroke="#eaf6ff" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const Bolt = ({ x0, x1, y, frame, opacity = 1 }: { x0: number; x1: number; y: number; frame: number; opacity?: number }) => {
  if (opacity <= 0.01) return null;
  const r = mulberry32(frame * 13 + 1);
  const paths = [0, 1].map(() => {
    let d = `M ${x0} ${y}`;
    for (let i = 1; i < 12; i++) d += ` L ${x0 + ((x1 - x0) * i) / 12} ${y + (r() - 0.5) * 70}`;
    return `${d} L ${x1} ${y}`;
  });
  return (
    <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity, filter: 'drop-shadow(0 0 16px #9fdcff)' }}>
      <path d={paths[0]} fill="none" stroke="#ffffff" strokeWidth={5} strokeLinejoin="round" />
      <path d={paths[1]} fill="none" stroke="#bfe6ff" strokeWidth={2.5} strokeLinejoin="round" opacity={0.8} />
    </svg>
  );
};

// A coil drawn in ink, standing upright: loops stacked from y0 to y1 at x.
export const InkCoil = ({ x, y0, y1, turns = 11, rx = 70 }: { x: number; y0: number; y1: number; turns?: number; rx?: number }) => (
  <>
    {Array.from({ length: turns }, (_, i) => (
      <ellipse key={i} cx={x} cy={y0 + ((i + 0.5) / turns) * (y1 - y0)} rx={rx} ry={(y1 - y0) / turns / 1.1} />
    ))}
  </>
);
