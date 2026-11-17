import { Easing } from 'remotion';
import { lerp, lerp3, ramp } from '../../anim';
import { T } from '../../ui/Shell';
import { rgb, type Add } from '../../world/Stage3D';
import { CYAN, FLOOR, MINT, PINK, ribbon, SUN, VIOLET, WHITE } from '../ac/kit';
import { Timeline as BaseTimeline } from '../charge/kit';

// Pieces shared by every chapter of "Out of Step".
// Voltage is always pink, current always cyan, power always gold.
export const VOICE = (n: number) => `ac2/ch${n}`;
export const COPPER = '#ffb27a';
const HOT: readonly number[] = [1, 0.55, 0.16];
const PI = Math.PI;

// a value that moves between keyframes [narration seconds, value], easing in and out of each
export const keys = (frame: number, k: [number, number][]) => {
  let v = k[0][1];
  for (let j = 1; j < k.length; j++) if (frame >= T(k[j - 1][0])) v = lerp(k[j - 1][1], k[j][1], ramp(frame, T(k[j - 1][0]), T(k[j][0]), Easing.inOut(Easing.quad)));
  return v;
};

// A graph of voltage and current against time (time runs to the right).
export type Graph = { x0: number; x1: number; th: (x: number) => number; axis: number; amp: number; z?: number };
export const pair = (add: Add, g: Graph, shift: number, o: { v?: number; i?: number; iAmp?: number; vTo?: number; iTo?: number } = {}) => {
  const { v = 1, i = 1, iAmp = 0.72, vTo = g.x1, iTo = g.x1 } = o;
  const z = g.z ?? 0;
  ribbon(add, g.x0, Math.min(g.x1, vTo), (x) => g.axis + g.amp * Math.sin(g.th(x)), () => rgb(PINK), { axis: g.axis, fill: false, gain: v, z });
  ribbon(add, g.x0, Math.min(g.x1, iTo), (x) => g.axis + g.amp * iAmp * Math.sin(g.th(x) - shift), () => rgb(CYAN), { axis: g.axis, fill: false, gain: i, z });
};
// the power: voltage times current, drawn in gold on its own axis
export const power = (add: Add, g: Graph, shift: number, gain = 1) =>
  ribbon(add, g.x0, g.x1, (x) => g.axis + g.amp * 2 * Math.sin(g.th(x)) * Math.sin(g.th(x) - shift), () => rgb(SUN), { axis: g.axis, gain, z: g.z ?? 0 });

// a "now" line on a graph, and bright points where it meets the waves
export const cursor = (add: Add, x: number, y0: number, y1: number, gain = 1, z = 0) => {
  if (gain <= 0.01) return;
  for (let y = y0; y <= y1; y += 0.12) add(x, y, z, 0.09, rgb(WHITE), 0.7 * gain);
};
export const dot = (add: Add, x: number, y: number, color: string, gain = 1, z = 0) => {
  if (gain <= 0.01) return;
  add(x, y, z, 1.0, rgb(color), 0.9 * gain);
  add(x, y, z, 0.34, [1, 1, 1], gain);
};
// a horizontal arrow of signed length
export const arrow = (add: Add, x: number, y: number, z: number, len: number, color: string, gain = 1) => {
  if (gain <= 0.01 || Math.abs(len) < 0.08) return;
  const c = rgb(color);
  const s = Math.sign(len);
  for (let k = 0, n = Math.ceil(Math.abs(len) / 0.06); k <= n; k++) add(x + (len * k) / n, y, z, 0.22, c, gain);
  for (let k = 1; k <= 8; k++) for (const u of [-1, 1]) add(x + len - s * k * 0.06, y + u * k * 0.05, z, 0.2, c, gain);
};
// a span marked between two points on a graph
export const bracket = (add: Add, xa: number, xb: number, y: number, color: string, gain = 1, z = 0) => {
  if (gain <= 0.01) return;
  const c = rgb(color);
  for (let x = xa; x <= xb; x += 0.05) add(x, y, z, 0.14, c, gain);
  for (const x of [xa, xb]) for (let d = -0.35; d <= 0.35; d += 0.05) add(x, y + d, z, 0.14, c, gain);
};
// charge carriers along a wire, displaced by `disp`
export const flow = (add: Add, x0: number, x1: number, y: number, disp: number, color: string, gain = 1, z = 0) => {
  if (gain <= 0.01) return;
  const s = 0.55;
  for (let x = x0 + ((((disp % s) + s) % s) as number); x <= x1; x += s) add(x, y, z, 0.26, rgb(color), gain);
};
export const wire = (add: Add, x0: number, y0: number, x1: number, y1: number, gain = 1, z = 0) => {
  if (gain <= 0.01) return;
  const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 0.07);
  for (let k = 0; k <= n; k++) add(x0 + ((x1 - x0) * k) / n, y0 + ((y1 - y0) * k) / n, z, 0.11, rgb(WHITE), 0.55 * gain);
};

// A resistor: a block of lattice that glows as it heats.
export const resistor = (add: Add, cx: number, cy: number, heat: number, gain = 1, s = 1) => {
  if (gain <= 0.01) return;
  const c = lerp3(rgb(VIOLET), HOT, Math.min(1, heat));
  for (let x = -3; x <= 3; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) add(cx + x * 0.5 * s, cy + y * 0.5 * s, z * 0.5 * s, 0.42 * s, c, (0.5 + 0.5 * heat) * gain);
  add(cx, cy, 0, 7 * s, HOT, 0.3 * heat * gain);
  wire(add, cx - 3.2 * s, cy, cx - 1.7 * s, cy, gain);
  wire(add, cx + 1.7 * s, cy, cx + 3.2 * s, cy, gain);
};

// A coil, with the magnetic field its current makes. `cur` runs from -1 to 1.
export const coil = (add: Add, cx: number, cy: number, cur: number, frame: number, gain = 1, o: { turns?: number; len?: number; r?: number; field?: number } = {}) => {
  if (gain <= 0.01) return;
  const { turns = 7, len = 3.6, r = 1.0, field = 1 } = o;
  const c = rgb(COPPER);
  for (let k = 0, n = turns * 44; k <= n; k++) {
    const a = (k / n) * turns * 2 * PI;
    add(cx - len / 2 + (len * k) / n, cy + r * Math.cos(a), r * Math.sin(a), 0.17, c, (0.45 + 0.55 * Math.max(0, Math.sin(a))) * gain);
  }
  wire(add, cx - len / 2 - 1.3, cy + r, cx - len / 2, cy + r, gain);
  wire(add, cx + len / 2, cy + r, cx + len / 2 + 1.3, cy + r, gain);
  const m = Math.abs(cur) * field * gain;
  if (m <= 0.02) return;
  const f = rgb(MINT);
  const dir = Math.sign(cur);
  for (let q = 0; q < 4; q++)
    for (let k = 1; k <= 2; k++) {
      const b = 0.5 * r + 0.75 * r * k;
      const a = len / 2 + 0.4 + 0.55 * k;
      for (let j = 0; j < 96; j++) {
        const phi = (j / 96) * 2 * PI;
        const off = 0.22 * k * r + b * (1 - Math.sin(phi));
        const phase = (((j - dir * frame * 0.6 + k * 7 + q * 5) % 24) + 24) % 24;
        const pulse = Math.exp(-(phase * phase) / 8);
        add(cx + a * Math.cos(phi), cy + off * Math.cos((q * PI) / 2), off * Math.sin((q * PI) / 2), 0.11 + 0.14 * pulse, f, (0.45 + 0.55 * pulse) * m);
      }
    }
};

// A capacitor: two plates, the charge on them, and the electric field in the gap. `q` runs from -1 to 1.
export const capacitor = (add: Add, cx: number, cy: number, q: number, frame: number, gain = 1, o: { gap?: number; h?: number; lead?: number } = {}) => {
  if (gain <= 0.01) return;
  const { gap = 0.8, h = 1.5, lead = 2.2 } = o;
  const m = Math.abs(q);
  for (const side of [-1, 1]) {
    const c = lerp3(rgb(WHITE), rgb(-side * q > 0 ? PINK : CYAN), Math.min(1, m * 1.2));
    for (let y = -h; y <= h + 0.01; y += 0.3) for (let z = -h; z <= h + 0.01; z += 0.3) add(cx + side * gap, cy + y, z, 0.2, c, (0.4 + 0.55 * m) * gain);
    wire(add, cx + side * gap, cy, cx + side * (gap + lead), cy, gain);
    flow(add, cx + (side < 0 ? -gap - lead : gap + 0.1), cx + (side < 0 ? -gap - 0.1 : gap + lead), cy, q * 0.5, CYAN, 0.9 * gain);
  }
  if (m <= 0.02) return;
  const e = rgb(VIOLET);
  const dir = Math.sign(q);
  for (let y = -h + 0.3; y <= h; y += 0.6)
    for (let z = -h + 0.3; z <= h; z += 0.6)
      for (let i = 1; i < 24; i++) {
        const phase = (((i - dir * frame * 0.5 + y * 9 + z * 5) % 12) + 12) % 12;
        const pulse = Math.exp(-(phase * phase) / 5);
        add(cx - gap + (2 * gap * i) / 24, cy + y, z, 0.07 + 0.09 * pulse, e, (0.25 + 0.6 * pulse) * m * gain);
      }
};

// One component with its own small graph above it (and, if asked, its power below).
export type Kind = 'R' | 'L' | 'C';
export const SHIFT: Record<Kind, number> = { R: 0, L: PI / 2, C: -PI / 2 };
export const station = (add: Add, cx: number, kind: Kind, now: number, frame: number, o: { v?: number; i?: number; p?: number; comp?: number; gain?: number; bus?: number } = {}) => {
  const { v = 1, i = 1, p = 0, comp = 1, gain = 1, bus = 0 } = o;
  const shift = SHIFT[kind];
  const th = (x: number) => now - (cx + 3 - x) * 1.6;
  pair(add, { x0: cx - 3, x1: cx + 3, th, axis: 2.5, amp: 0.95 }, shift, { v: v * gain, i: i * gain });
  if (p > 0.01) power(add, { x0: cx - 3, x1: cx + 3, th, axis: -2.3, amp: 0.36 }, shift, p * gain);
  const g = comp * gain;
  const cy = p > 0.01 ? 0.1 : -0.5;
  const cur = Math.sin(now - shift);
  if (kind === 'R') {
    resistor(add, cx, cy, Math.sin(now) ** 2, g, 0.8);
    flow(add, cx - 2.5, cx + 2.5, cy, -Math.cos(now) * 0.5, CYAN, 0.8 * g, 0.5);
  } else if (kind === 'L') coil(add, cx, cy, cur, frame, g, { len: 3, r: 0.8, turns: 6 });
  else capacitor(add, cx, cy, Math.sin(now), frame, g, { h: 1.0, gap: 0.6, lead: 1.9 });
  if (bus > 0.01) {
    const y = kind === 'L' ? cy + 0.8 : cy;
    const e = kind === 'L' ? 2.8 : 2.5;
    wire(add, cx - e, y, cx - e, FLOOR + 0.7, bus * g);
    wire(add, cx + e, y, cx + e, FLOOR + 0.3, bus * g);
  }
};

export const TIMELINE = [
  { year: '1745', name: 'Leyden jar' },
  { year: '1827', name: 'Ohm' },
  { year: '1832', name: 'Henry' },
  { year: '1893', name: 'Reactance' },
  { year: '1893', name: 'Phasors' },
] as const;
export const Timeline = (props: { frame: number; already: number[]; events?: [number, number][]; opacity?: number }) => <BaseTimeline {...props} entries={TIMELINE} />;
