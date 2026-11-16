import type { Charge, Line } from './field';
import { fieldAt } from './field';
import { rgb, type Add } from './Stage3D';

// Magnets, currents and their fields, drawn with points of light.
export const NORTH = '#ff5a4d';
export const SOUTH = '#4d8dff';
export const BFIELD = '#7dffb0';
export const CURRENT = '#ffe08a';

// A bar magnet lying along x, as a block of lit spheres: north half red, south half blue.
export const drawBarMagnet = (orb: Add, cx: number, cy: number, half: number, gain = 1, thick = 1, northRight = true) => {
  if (gain <= 0.01) return;
  const n = rgb(NORTH);
  const s = rgb(SOUTH);
  for (let x = -half + 0.25; x <= half - 0.24; x += 0.5)
    for (let y = -0.5 * thick; y <= 0.5 * thick + 0.01; y += 0.5)
      for (let z = -0.5 * thick; z <= 0.5 * thick + 0.01; z += 0.5) orb(cx + x, cy + y, z, 0.5, x > 0 === northRight ? n : s, gain);
};

// The two poles of a bar magnet, as sources for tracing its outside field.
export const barPoles = (cx: number, cy: number, half: number, northRight = true): Charge[] => [
  { x: cx + (northRight ? 1 : -1) * (half - 0.15), y: cy, z: 0, q: 1 },
  { x: cx - (northRight ? 1 : -1) * (half - 0.15), y: cy, z: 0, q: -1 },
];

// A compass needle at a point, lying along the field there: red end leading.
export const drawNeedle = (glow: Add, x: number, y: number, z: number, dx: number, dy: number, dz: number, length = 0.7, gain = 1) => {
  if (gain <= 0.01) return;
  const m = Math.hypot(dx, dy, dz) || 1;
  const ux = dx / m;
  const uy = dy / m;
  const uz = dz / m;
  const n = rgb(NORTH);
  const s = rgb(SOUTH);
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    const w = (0.12 + length * 0.09) * (1 - t * 0.75);
    glow(x + ux * length * 0.5 * t, y + uy * length * 0.5 * t, z + uz * length * 0.5 * t, w, n, gain);
    glow(x - ux * length * 0.5 * t, y - uy * length * 0.5 * t, z - uz * length * 0.5 * t, w, s, gain);
  }
};

export const needleAt = (glow: Add, sources: Charge[], x: number, y: number, length = 0.7, gain = 1) => {
  const e = fieldAt(sources, x, y, 0);
  drawNeedle(glow, x, y, 0, e[0], e[1], e[2], length, gain);
};

// A straight wire along x with its current shown as bright beads running along it.
export const drawWire = (glow: Add, y: number, z: number, x0: number, x1: number, frame: number, direction: 1 | -1 | 0, gain = 1, color = '#c8d4ea') => {
  if (gain <= 0.01) return;
  const c = rgb(color);
  const gold = rgb(CURRENT);
  const n = Math.round((x1 - x0) / 0.09);
  for (let i = 0; i <= n; i++) {
    const x = x0 + (i / n) * (x1 - x0);
    glow(x, y, z, 0.16, c, 0.7 * gain);
    if (direction !== 0) {
      const phase = (((i * direction - frame * 0.9) % 26) + 26) % 26;
      if (phase < 3) glow(x, y, z, 0.34, gold, 0.9 * gain);
    }
  }
};

// Rings of field around a wire along x. Looking along the current, the field
// runs clockwise (the right-hand grip rule); pulses run round each ring that way.
export const drawRings = (glow: Add, y: number, z: number, xs: number[], radii: number[], frame: number, direction: 1 | -1, gain = 1) => {
  if (gain <= 0.01) return;
  const c = rgb(BFIELD);
  xs.forEach((x, k) => {
    radii.forEach((r, j) => {
      const n = Math.round(r * 46);
      const fade = 1 / (1 + j * 0.9);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const phase = (((i * direction - frame * 0.7 + k * 9) % (n / 3)) + n / 3) % (n / 3);
        const pulse = Math.exp(-(phase * phase) / 10);
        glow(x, y + Math.cos(a) * r, z + Math.sin(a) * r * direction * -1, 0.06 + 0.1 * pulse, c, (0.45 + 0.7 * pulse) * gain * fade);
      }
    });
  });
};

// --- coils: field by adding up the contribution of every short piece of wire ---
export type Coil = Float32Array; // [mx, my, mz, dx, dy, dz] per segment

export const makeCoil = (xs: number[], radius: number, segments = 20): Coil => {
  const out = new Float32Array(xs.length * segments * 6);
  let o = 0;
  for (const x of xs)
    for (let i = 0; i < segments; i++) {
      const a0 = (i / segments) * Math.PI * 2;
      const a1 = ((i + 1) / segments) * Math.PI * 2;
      const am = (a0 + a1) / 2;
      out[o++] = x;
      out[o++] = Math.cos(am) * radius;
      out[o++] = Math.sin(am) * radius;
      out[o++] = 0;
      out[o++] = (Math.cos(a1) - Math.cos(a0)) * radius;
      out[o++] = (Math.sin(a1) - Math.sin(a0)) * radius;
    }
  return out;
};

export const coilField = (coil: Coil, x: number, y: number, z: number): [number, number, number] => {
  let bx = 0;
  let by = 0;
  let bz = 0;
  for (let o = 0; o < coil.length; o += 6) {
    const rx = x - coil[o];
    const ry = y - coil[o + 1];
    const rz = z - coil[o + 2];
    const r2 = rx * rx + ry * ry + rz * rz + 0.02;
    const k = 1 / (r2 * Math.sqrt(r2));
    const dx = coil[o + 3];
    const dy = coil[o + 4];
    const dz = coil[o + 5];
    bx += (dy * rz - dz * ry) * k;
    by += (dz * rx - dx * rz) * k;
    bz += (dx * ry - dy * rx) * k;
  }
  return [bx, by, bz];
};

// Field lines of a coil, each started inside it and followed until it closes or leaves.
export const traceCoil = (coil: Coil, seeds: [number, number, number][], bound = 13, step = 0.1, maxSteps = 700): Line[] =>
  seeds.map((s) => {
    const pts: number[] = [];
    let [x, y, z] = s;
    for (let i = 0; i < maxSteps; i++) {
      pts.push(x, y, z);
      const b = coilField(coil, x, y, z);
      const m = Math.hypot(b[0], b[1], b[2]);
      if (m < 1e-9) break;
      x += (b[0] / m) * step;
      y += (b[1] / m) * step;
      z += (b[2] / m) * step;
      if (Math.hypot(x, y, z) > bound) break;
      if (i > 30 && (x - s[0]) ** 2 + (y - s[1]) ** 2 + (z - s[2]) ** 2 < 0.02) break;
    }
    return { points: new Float32Array(pts), reversed: false };
  });

// The turns of a coil, with current beads running round them.
export const drawCoil = (glow: Add, xs: number[], radius: number, frame: number, gain = 1) => {
  if (gain <= 0.01) return;
  const c = rgb('#ffb36b');
  const gold = rgb(CURRENT);
  xs.forEach((x, k) => {
    for (let i = 0; i < 70; i++) {
      const a = (i / 70) * Math.PI * 2;
      const phase = (((i - frame * 0.8 + k * 5) % 23) + 23) % 23;
      glow(x, Math.cos(a) * radius, Math.sin(a) * radius, phase < 2 ? 0.3 : 0.15, phase < 2 ? gold : c, (phase < 2 ? 0.95 : 0.75) * gain);
    }
  });
};
