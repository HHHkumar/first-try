import { mulberry32 } from './rng';
import { rgb, type Add } from './Stage3D';

// Electric charges, their field, and ways of drawing it with points of light.
export type Charge = { x: number; y: number; z: number; q: number };

export const POS = '#ff7d4d'; // positive charge
export const NEG = '#4fc8ff'; // negative charge
export const FIELD = '#b7a2ff';

export const fieldAt = (charges: Charge[], x: number, y: number, z: number): [number, number, number] => {
  let ex = 0;
  let ey = 0;
  let ez = 0;
  for (const c of charges) {
    const dx = x - c.x;
    const dy = y - c.y;
    const dz = z - c.z;
    const r2 = dx * dx + dy * dy + dz * dz + 0.01;
    const k = c.q / (r2 * Math.sqrt(r2));
    ex += dx * k;
    ey += dy * k;
    ez += dz * k;
  }
  return [ex, ey, ez];
};

// Evenly spread directions on a sphere.
export const fibSphere = (n: number): [number, number, number][] => {
  const out: [number, number, number][] = [];
  const g = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - ((i + 0.5) / n) * 2;
    const r = Math.sqrt(1 - y * y);
    out.push([Math.cos(g * i) * r, y, Math.sin(g * i) * r]);
  }
  return out;
};

export type Line = { points: Float32Array; reversed: boolean };

type TraceOptions = {
  perCharge?: number; // lines per unit of charge
  planar?: boolean; // keep every line in the z = 0 plane (a flat diagram)
  from?: 'positive' | 'all';
  bound?: number;
  step?: number;
  maxSteps?: number;
};

// Follows the field from each charge to draw its lines. Lines leave positive
// charges along the field; with from = 'all', lines are also traced backwards
// out of negative charges (needed when there is no positive charge to start on).
export const traceLines = (charges: Charge[], opts: TraceOptions = {}): Line[] => {
  const { perCharge = 14, planar = false, from = 'positive', bound = 16, step = 0.09, maxSteps = 420 } = opts;
  const lines: Line[] = [];
  for (const c of charges) {
    if (c.q === 0 || (c.q < 0 && from === 'positive')) continue;
    const sign = c.q > 0 ? 1 : -1;
    const n = Math.max(3, Math.round(perCharge * Math.abs(c.q)));
    const dirs: [number, number, number][] = planar
      ? Array.from({ length: n }, (_, i) => [Math.cos(((i + 0.5) / n) * Math.PI * 2), Math.sin(((i + 0.5) / n) * Math.PI * 2), 0] as [number, number, number])
      : fibSphere(n);
    for (const d of dirs) {
      const pts: number[] = [];
      let x = c.x + d[0] * 0.3;
      let y = c.y + d[1] * 0.3;
      let z = c.z + d[2] * 0.3;
      for (let s = 0; s < maxSteps; s++) {
        pts.push(x, y, z);
        const e = fieldAt(charges, x, y, z);
        const m = Math.hypot(e[0], e[1], e[2]);
        if (m < 1e-7) break;
        x += (e[0] / m) * step * sign;
        y += (e[1] / m) * step * sign;
        z += (e[2] / m) * step * sign;
        if (planar) z = c.z;
        if (Math.hypot(x, y, z) > bound) break;
        let hit = false;
        for (const o of charges) {
          if (o !== c && o.q * sign < 0 && (x - o.x) ** 2 + (y - o.y) ** 2 + (z - o.z) ** 2 < 0.09) hit = true;
        }
        if (hit) break;
      }
      lines.push({ points: new Float32Array(pts), reversed: sign < 0 });
    }
  }
  return lines;
};

// Draws traced lines as faint beads with brighter pulses running along the field.
export const drawLines = (add: Add, lines: Line[], frame: number, gain = 1, color = FIELD, opts: { reveal?: number; speed?: number; bold?: boolean } = {}) => {
  if (gain <= 0.01) return;
  const c = rgb(color);
  const { reveal = 1, speed = 0.9, bold = false } = opts;
  for (let li = 0; li < lines.length; li++) {
    const { points, reversed } = lines[li];
    const n = points.length / 3;
    const shown = Math.round(n * reveal);
    for (let i = 0; i < shown; i++) {
      const along = reversed ? n - i : i;
      const phase = (((along - frame * speed + li * 17) % 70) + 70) % 70;
      const pulse = Math.exp(-((phase - 35) ** 2) / 28);
      add(points[i * 3], points[i * 3 + 1], points[i * 3 + 2], (bold ? 0.075 : 0.045) + 0.1 * pulse, c, ((bold ? 0.6 : 0.3) + 0.75 * pulse) * gain);
    }
  }
};

// A charge: a lit sphere in its sign's colour, a wide halo, and its sign drawn
// in small bright points on the side facing the camera.
export const drawCharge = (orb: Add, glow: Add, c: Charge, cam: readonly number[], radius = 0.34, gain = 1, sign = true) => {
  if (gain <= 0.01) return;
  const col = rgb(c.q >= 0 ? POS : NEG);
  orb(c.x, c.y, c.z, radius * 2, col, gain);
  glow(c.x, c.y, c.z, radius * 9, col, 0.22 * gain);
  glow(c.x, c.y, c.z, radius * 4.4, col, 0.3 * gain);
  if (!sign) return;
  // unit vector to the camera, and two axes across the view
  const vx = cam[0] - c.x;
  const vy = cam[1] - c.y;
  const vz = cam[2] - c.z;
  const vm = Math.hypot(vx, vy, vz);
  const f = [vx / vm, vy / vm, vz / vm];
  const rm = Math.hypot(f[2], f[0]) || 1;
  const right = [f[2] / rm, 0, -f[0] / rm];
  const up = [f[1] * right[2] - f[2] * right[1], f[2] * right[0] - f[0] * right[2], f[0] * right[1] - f[1] * right[0]];
  const white = rgb('#ffffff');
  const o = radius * 1.05;
  for (let i = -3; i <= 3; i++) {
    const t = (i / 3) * radius * 0.5;
    glow(c.x + f[0] * o + right[0] * t, c.y + f[1] * o + right[1] * t, c.z + f[2] * o + right[2] * t, radius * 0.22, white, 0.9 * gain);
    if (c.q > 0) glow(c.x + f[0] * o + up[0] * t, c.y + f[1] * o + up[1] * t, c.z + f[2] * o + up[2] * t, radius * 0.22, white, 0.9 * gain);
  }
};

// An arrow made of light: bright at the tip, fading back along its tail.
export const drawArrow = (add: Add, x: number, y: number, z: number, dx: number, dy: number, dz: number, length: number, color: string, gain = 1, thickness = 0.09) => {
  if (gain <= 0.01 || length <= 0.01) return;
  const c = rgb(color);
  const m = Math.hypot(dx, dy, dz) || 1;
  const ux = dx / m;
  const uy = dy / m;
  const uz = dz / m;
  const n = Math.max(4, Math.round(length / 0.045));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    add(x + ux * length * t, y + uy * length * t, z + uz * length * t, thickness * (0.45 + 0.55 * t), c, (0.25 + 0.75 * t) * gain);
  }
  // arrowhead: two short barbs in the plane facing the viewer (z up-ish)
  const px = -uy;
  const py = ux;
  const tipX = x + ux * length;
  const tipY = y + uy * length;
  const tipZ = z + uz * length;
  for (let i = 1; i <= 5; i++) {
    const b = (i / 5) * Math.min(0.28, length * 0.45);
    for (const s of [-1, 1]) add(tipX - ux * b + px * b * 0.6 * s, tipY - uy * b + py * b * 0.6 * s, tipZ - uz * b, thickness * 0.9, c, gain);
  }
  add(tipX, tipY, tipZ, thickness * 2.4, c, 0.9 * gain);
};

// A grid of field arrows on the z = 0 plane: long where the field is strong.
export const drawFieldArrows = (add: Add, charges: Charge[], spec: { x: [number, number]; y: [number, number]; spacing: number }, gain = 1, color = FIELD, reveal = 1) => {
  if (gain <= 0.01) return;
  let k = 0;
  const cols = Math.round((spec.x[1] - spec.x[0]) / spec.spacing) + 1;
  const rows = Math.round((spec.y[1] - spec.y[0]) / spec.spacing) + 1;
  const total = cols * rows;
  for (let i = 0; i < cols; i++)
    for (let j = 0; j < rows; j++) {
      k++;
      const x = spec.x[0] + i * spec.spacing;
      const y = spec.y[0] + j * spec.spacing;
      let near = false;
      for (const c of charges) if ((x - c.x) ** 2 + (y - c.y) ** 2 < 0.36) near = true;
      if (near) continue;
      // arrows appear outward from the middle of the grid
      const order = Math.hypot(i - cols / 2, j - rows / 2) / Math.hypot(cols / 2, rows / 2);
      const seen = Math.min(1, Math.max(0, (reveal * 1.3 - order) * 4));
      if (seen <= 0) continue;
      const e = fieldAt(charges, x, y, 0);
      const m = Math.hypot(e[0], e[1]);
      const len = Math.min(spec.spacing * 0.88, 0.3 + 0.62 * Math.pow(m, 0.42));
      drawArrow(add, x - (e[0] / m) * len * 0.5, y - (e[1] / m) * len * 0.5, 0, e[0], e[1], 0, len, color, gain * seen * Math.min(1.3, 0.7 + m * 1.6), 0.11);
    }
  return total + k * 0;
};

// Random points inside a set of capsules: a body made of particles.
export type Capsule = [number, number, number, number, number, number, number];
export const sampleCapsules = (capsules: Capsule[], count: number, seed: number): Float32Array => {
  const rand = mulberry32(seed);
  const vol = capsules.map((c) => Math.hypot(c[3] - c[0], c[4] - c[1], c[5] - c[2]) * c[6] * c[6] + c[6] ** 3);
  const total = vol.reduce((a, b) => a + b, 0);
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    let pick = rand() * total;
    let k = 0;
    while (pick > vol[k] && k < capsules.length - 1) pick -= vol[k++];
    const c = capsules[k];
    const t = rand();
    let ox = 0;
    let oy = 0;
    let oz = 0;
    do {
      ox = rand() * 2 - 1;
      oy = rand() * 2 - 1;
      oz = rand() * 2 - 1;
    } while (ox * ox + oy * oy + oz * oz > 1);
    out[i * 3] = c[0] + (c[3] - c[0]) * t + ox * c[6];
    out[i * 3 + 1] = c[1] + (c[4] - c[1]) * t + oy * c[6];
    out[i * 3 + 2] = c[2] + (c[5] - c[2]) * t + oz * c[6];
  }
  return out;
};
