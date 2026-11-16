import type { ReactNode } from 'react';
import { Timeline as BaseTimeline } from '../charge/kit';
import { C } from '../../theme';
import { BFIELD } from '../../world/magnet';
import { rgb, type Add } from '../../world/Stage3D';

// Pieces shared by every chapter of "Two Fields, One Light".
export { at, Cap, Ink, shot } from '../charge/kit';
export { EndCard, GOLD } from '../capacitance/kit';
export { Bolt, Spark } from '../inductance/kit';
export const VOICE = (n: number) => `fields/ch${n}`;
export const EFIELD = C.field;

export const TIMELINE = [
  { year: '1831', name: 'Faraday' },
  { year: '1849', name: 'Fizeau' },
  { year: '1856', name: 'Weber' },
  { year: '1861', name: 'Maxwell' },
  { year: '1884', name: 'Heaviside' },
  { year: '1887', name: 'Hertz' },
  { year: '1901', name: 'Marconi' },
  { year: '1905', name: 'Einstein' },
] as const;
export const Timeline = (props: { frame: number; already: number[]; events?: [number, number][]; opacity?: number }) => <BaseTimeline {...props} entries={TIMELINE} />;

// A ring of field about one of the axes, with pulses running round it.
export const ring = (glow: Add, cx: number, cy: number, cz: number, axis: 'x' | 'y' | 'z', r: number, frame: number, color: string, gain = 1, dir = 1) => {
  if (gain <= 0.01) return;
  const c = rgb(color);
  const n = Math.round(r * 44) + 14;
  const third = n / 3;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const phase = (((i * dir - frame * 0.6) % third) + third) % third;
    const pulse = Math.exp(-(phase * phase) / 10);
    const u = Math.cos(a) * r;
    const v = Math.sin(a) * r;
    const size = 0.07 + 0.1 * pulse;
    const alpha = (0.45 + 0.7 * pulse) * gain;
    if (axis === 'x') glow(cx, cy + u, cz + v, size, c, alpha);
    else if (axis === 'y') glow(cx + u, cy, cz + v, size, c, alpha);
    else glow(cx + u, cy + v, cz, size, c, alpha);
  }
};

// An electromagnetic wave travelling along x: the electric field swings up and
// down (y), the magnetic field side to side (z), the two in step.
export const drawWave = (glow: Add, x0: number, x1: number, frame: number, opts: { front?: number; gain?: number; amp?: number; k?: number } = {}) => {
  const { front = x1, gain = 1, amp = 1.7, k = 1.5 } = opts;
  if (gain <= 0.01) return;
  const e = rgb(EFIELD);
  const b = rgb(BFIELD);
  const end = Math.min(x1, front);
  for (let x = x0; x <= end; x += 0.13) {
    const edge = Math.min(1, (front - x) / 1.4, (x - x0) / 0.8 + 0.2);
    const s = Math.sin(k * (x - x0) - frame * 0.13) * amp * edge;
    glow(x, 0, 0, 0.05, [0.8, 0.85, 1], 0.35 * gain);
    for (let j = 1; j <= 7; j++) {
      const t = j / 7;
      glow(x, s * t, 0, 0.06 + 0.06 * t, e, (0.25 + 0.65 * t) * gain);
      glow(x, 0, s * t, 0.06 + 0.06 * t, b, (0.25 + 0.65 * t) * gain);
    }
  }
};

// Short statements set large in the middle of the frame.
export const Line = ({ children, opacity = 1, size = 76, color = C.text, top = 0 }: { children: ReactNode; opacity?: number; size?: number; color?: string; top?: number }) => (
  <div style={{ fontFamily: 'Sora', fontSize: size, fontWeight: 300, letterSpacing: -1.5, lineHeight: 1.2, color, opacity, marginTop: top, textAlign: 'center' }}>{children}</div>
);
export const E = ({ children }: { children: ReactNode }) => <span style={{ color: EFIELD }}>{children}</span>;
export const B = ({ children }: { children: ReactNode }) => <span style={{ color: BFIELD }}>{children}</span>;
