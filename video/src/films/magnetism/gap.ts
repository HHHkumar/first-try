import { drawArrow } from '../../world/field';
import { BFIELD, CURRENT, NORTH, SOUTH } from '../../world/magnet';
import { rgb, type Add } from '../../world/Stage3D';

// The gap between two magnet poles: a north face on the left, a south face on
// the right, and a straight, even field running across from one to the other.
export const drawPoleFaces = (orb: Add, gain = 1) => {
  if (gain <= 0.01) return;
  for (const side of [-1, 1])
    for (let x = 0; x < 3; x++)
      for (let y = -2; y <= 2.01; y += 0.8)
        for (let z = -2.4; z <= 2.41; z += 0.8) orb(side * (5.6 + x * 0.8), y, z, 0.8, rgb(side < 0 ? NORTH : SOUTH), gain);
};

export const drawGapField = (glow: Add, frame: number, gain = 1) => {
  if (gain <= 0.01) return;
  const c = rgb(BFIELD);
  let k = 0;
  for (let y = -1.6; y <= 1.61; y += 0.8)
    for (let z = -2; z <= 2.01; z += 1) {
      k++;
      for (let i = 0; i <= 100; i++) {
        const x = -5 + i * 0.1;
        const phase = (((i - frame * 0.8 + k * 13) % 40) + 40) % 40;
        const pulse = Math.exp(-(phase * phase) / 14);
        glow(x, y, z, 0.07 + 0.1 * pulse, c, (0.38 + 0.6 * pulse) * gain);
      }
    }
};

// A straight conductor running front to back (along z), with its current.
export const drawZWire = (glow: Add, x: number, y: number, z0: number, z1: number, frame: number, direction: 1 | -1, gain = 1) => {
  if (gain <= 0.01) return;
  const c = rgb('#c8d4ea');
  const gold = rgb(CURRENT);
  const n = Math.round(Math.abs(z1 - z0) / 0.08);
  for (let i = 0; i <= n; i++) {
    const z = z0 + (i / n) * (z1 - z0);
    glow(x, y, z, 0.17, c, 0.8 * gain);
    const phase = (((i * direction - frame * 0.9) % 22) + 22) % 22;
    if (phase < 3) glow(x, y, z, 0.36, gold, 0.95 * gain);
  }
};

// A rectangular loop of wire turning about the z axis in the gap. Its two long
// sides carry current in opposite directions, so one is pushed up and one down.
export const drawLoop = (glow: Add, angle: number, frame: number, gain = 1, force = 1) => {
  if (gain <= 0.01) return;
  const r = 2.3;
  const cx = Math.cos(angle) * r;
  const cy = Math.sin(angle) * r;
  drawZWire(glow, cx, cy, -2, 2, frame, 1, gain);
  drawZWire(glow, -cx, -cy, -2, 2, frame, -1, gain);
  const c = rgb('#c8d4ea');
  for (const z of [-2, 2]) for (let i = 0; i <= 50; i++) glow(-cx + (i / 50) * 2 * cx, -cy + (i / 50) * 2 * cy, z, 0.17, c, 0.8 * gain);
  // the push on each side: always straight up on one, straight down on the other
  drawArrow(glow, cx, cy + 0.3, 0, 0, 1, 0, 1.3, CURRENT, force * gain, 0.12);
  drawArrow(glow, -cx, -cy - 0.3, 0, 0, -1, 0, 1.3, CURRENT, force * gain, 0.12);
};
