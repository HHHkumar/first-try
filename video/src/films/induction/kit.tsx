import { Timeline as BaseTimeline } from '../charge/kit';
import type { Line } from '../../world/field';
import { BFIELD, CURRENT, NORTH, SOUTH } from '../../world/magnet';
import { rgb, type Add } from '../../world/Stage3D';
import type { CameraPose } from '../../world/WireWorld';

// Pieces shared by every chapter of "The Field That Moves the World" (induction).
export { at, Cap, Ink, shot } from '../charge/kit';
export { EndCard, GOLD } from '../capacitance/kit';
export { ring } from '../fields/kit';
export const VOICE = (n: number) => `induction/ch${n}`;
export const VOLT = '#ffb36b';
export const COPPER = '#e8935a';

export const TIMELINE = [
  { year: '1831', name: 'Faraday' },
  { year: '1832', name: 'Pixii' },
  { year: '1834', name: 'Lenz' },
  { year: '1855', name: 'Foucault' },
  { year: '1885', name: 'Budapest' },
  { year: '1886', name: 'Stanley' },
  { year: '1895', name: 'Niagara' },
] as const;
export const Timeline = (props: { frame: number; already: number[]; events?: [number, number][]; opacity?: number }) => <BaseTimeline {...props} entries={TIMELINE} />;

export const orbit = (frame: number, back = 15, height = 3.4, side = 5): CameraPose => ({ pos: [side + Math.sin(frame * 0.003) * 1.6, height, back], target: [0, 0, 0], fov: 34, focus: back + 1, dof: 0.04 });

// A uniform magnetic field running along x, drawn as straight lines with pulses.
export const xField = (glow: Add, frame: number, gain = 1, half = 6, ys = [-1.6, -0.8, 0, 0.8, 1.6], zs = [-2, -1, 0, 1, 2]) => {
  if (gain <= 0.01) return;
  const c = rgb(BFIELD);
  let k = 0;
  for (const y of ys)
    for (const z of zs) {
      k++;
      const n = Math.round(half * 20);
      for (let i = 0; i <= n; i++) {
        const phase = (((i - frame * 0.8 + k * 13) % 40) + 40) % 40;
        const pulse = Math.exp(-(phase * phase) / 14);
        glow(-half + i * 0.1, y, z, 0.07 + 0.1 * pulse, c, (0.38 + 0.6 * pulse) * gain);
      }
    }
};

// A circular loop of wire. It starts face-on to x; `tilt` turns it about the
// vertical. `current` (-1..1) lights beads running round it one way or the other.
export const ringLoop = (glow: Add, cx: number, cy: number, cz: number, r: number, tilt: number, frame: number, current = 0, gain = 1, color = '#c8d4ea') => {
  if (gain <= 0.01) return;
  const c = rgb(color);
  const gold = rgb(CURRENT);
  const n = Math.round(r * 60) + 20;
  const dir = current >= 0 ? 1 : -1;
  const strength = Math.min(1, Math.abs(current));
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const phase = (((i * dir - frame * 0.9) % 20) + 20) % 20;
    const bead = phase < 2.5 && strength > 0.04;
    const u = Math.cos(a) * r;
    const v = Math.sin(a) * r;
    glow(cx - Math.sin(tilt) * v, cy + u, cz + Math.cos(tilt) * v, bead ? 0.17 + 0.2 * strength : 0.17, bead ? gold : c, (bead ? 0.6 + 0.4 * strength : 0.8) * gain);
  }
};

export const shiftLines = (lines: Line[], dx: number, dy = 0): Line[] => lines.map((l) => ({ ...l, points: l.points.map((v, i) => (i % 3 === 0 ? v + dx : i % 3 === 1 ? v + dy : v)) }));

// A bar magnet turned about the z axis (north end leading at angle 0).
export const rotMagnet = (orb: Add, angle: number, half = 1.6, gain = 1, cx = 0, cy = 0) => {
  if (gain <= 0.01) return;
  const co = Math.cos(angle);
  const si = Math.sin(angle);
  for (let x = -half + 0.25; x <= half - 0.24; x += 0.5)
    for (const y of [-0.25, 0.25]) for (const z of [-0.25, 0.25]) orb(cx + x * co - y * si, cy + x * si + y * co, z, 0.5, rgb(x > 0 ? NORTH : SOUTH), gain);
};

// A flat sheet of metal in the y-z plane at x, drawn as a lattice of points.
export const plate = (glow: Add, x: number, cy: number, cz: number, hy: number, hz: number, gain = 1, color = COPPER, slots = false) => {
  if (gain <= 0.01) return;
  const c = rgb(color);
  for (let y = -hy; y <= hy + 0.01; y += 0.2)
    for (let z = -hz; z <= hz + 0.01; z += 0.2) {
      if (slots && Math.abs(((z + hz) % 0.8) - 0.4) < 0.11 && y < hy - 0.5) continue;
      glow(x, cy + y, cz + z, 0.16, c, 0.6 * gain);
    }
};
