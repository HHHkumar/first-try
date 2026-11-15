import { mulberry32, randomUnitVector } from './rng';

// A Drude-style electron gas: every electron flies at the thermal speed in a
// random direction, the field adds a steady acceleration along x, and each
// scattering event throws the direction away and resets the speed. Drift
// velocity therefore settles at (acceleration x mean time between scatterings),
// which is exactly the picture the narration describes.

export type SimParams = {
  seed: number;
  count: number;
  frames: number;
  substeps: number;
  half: [number, number, number]; // half-extent of the periodic box
  thermalSpeed: number; // lattice units per frame
  accel: (frame: number) => number; // along x, lattice units per frame^2
  tau: (frame: number) => number; // mean frames between scatterings
};

export type Scatter = { step: number; x: number; y: number; z: number };

export type SimResult = {
  params: SimParams;
  steps: number;
  // positions[(step * count + i) * 3 + axis]
  positions: Float32Array;
  // 1 where electron i was wrapped to the other side of the box at this step
  wrapped: Uint8Array;
  scatters: Scatter[];
};

export const simulate = (params: SimParams): SimResult => {
  const { seed, count, frames, substeps, half, thermalSpeed } = params;
  const rand = mulberry32(seed);
  const steps = frames * substeps + 1;
  const positions = new Float32Array(steps * count * 3);
  const wrapped = new Uint8Array(steps * count);
  const scatters: Scatter[] = [];
  const p = new Float32Array(count * 3);
  const v = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    for (let k = 0; k < 3; k++) p[i * 3 + k] = (rand() * 2 - 1) * half[k];
    const d = randomUnitVector(rand);
    for (let k = 0; k < 3; k++) v[i * 3 + k] = d[k] * thermalSpeed;
  }
  positions.set(p, 0);

  const dt = 1 / substeps;
  for (let s = 1; s < steps; s++) {
    const frame = (s - 1) / substeps;
    const a = params.accel(frame);
    const pScatter = dt / Math.max(0.5, params.tau(frame));
    for (let i = 0; i < count; i++) {
      const o = i * 3;
      if (rand() < pScatter) {
        const d = randomUnitVector(rand);
        v[o] = d[0] * thermalSpeed;
        v[o + 1] = d[1] * thermalSpeed;
        v[o + 2] = d[2] * thermalSpeed;
        scatters.push({ step: s, x: p[o], y: p[o + 1], z: p[o + 2] });
      }
      v[o] += a * dt;
      let w = 0;
      for (let k = 0; k < 3; k++) {
        let x = p[o + k] + v[o + k] * dt;
        if (x > half[k]) {
          x -= 2 * half[k];
          w = 1;
        } else if (x < -half[k]) {
          x += 2 * half[k];
          w = 1;
        }
        p[o + k] = x;
      }
      wrapped[s * count + i] = w;
    }
    positions.set(p, s * count * 3);
  }
  return { params, steps, positions, wrapped, scatters };
};
