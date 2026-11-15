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
  speedScale?: (frame: number) => number; // slows or speeds all motion (1 = normal)
};

export type Scatter = { step: number; i: number; x: number; y: number; z: number };

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
    const scale = params.speedScale ? params.speedScale(frame) : 1;
    const pScatter = (dt * scale) / Math.max(0.5, params.tau(frame));
    for (let i = 0; i < count; i++) {
      const o = i * 3;
      if (rand() < pScatter) {
        const d = randomUnitVector(rand);
        v[o] = d[0] * thermalSpeed;
        v[o + 1] = d[1] * thermalSpeed;
        v[o + 2] = d[2] * thermalSpeed;
        scatters.push({ step: s, i, x: p[o], y: p[o + 1], z: p[o + 2] });
      }
      v[o] += a * dt * scale;
      let w = 0;
      for (let k = 0; k < 3; k++) {
        let x = p[o + k] + v[o + k] * dt * scale;
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

// An electron that stays near the middle of the box and is never wrapped to the
// other side during a stretch of frames: one the camera can follow.
export const findCalmElectron = (sim: SimResult, fromFrame: number, toFrame: number, maxZ = 1.2, maxY = 3): number => {
  const { count, substeps } = sim.params;
  const a = Math.max(0, Math.round(fromFrame * substeps));
  const b = Math.min(sim.steps - 1, Math.round(toFrame * substeps));
  let best = 0;
  let bestScore = Infinity;
  for (let i = 0; i < count; i++) {
    let worst = 0;
    let ok = true;
    for (let s = a; s <= b; s++) {
      if (sim.wrapped[s * count + i]) {
        ok = false;
        break;
      }
      const o = (s * count + i) * 3;
      worst = Math.max(worst, Math.abs(sim.positions[o + 2]) / maxZ, Math.abs(sim.positions[o + 1]) / maxY, Math.abs(sim.positions[o]) / 14);
    }
    if (ok && worst < bestScore) {
      bestScore = worst;
      best = i;
    }
  }
  return best;
};

export const positionAt = (sim: SimResult, i: number, frame: number): [number, number, number] => {
  const step = Math.min(sim.steps - 1, Math.max(0, Math.round(frame * sim.params.substeps)));
  const o = (step * sim.params.count + i) * 3;
  return [sim.positions[o], sim.positions[o + 1], sim.positions[o + 2]];
};

// Mean x-velocity of the whole gas at a frame, in lattice units per frame.
export const meanVelocityX = (sim: SimResult, frame: number): number => {
  const { count, substeps, half } = sim.params;
  const s1 = Math.min(sim.steps - 1, Math.max(1, Math.round(frame * substeps)));
  let sum = 0;
  for (let i = 0; i < count; i++) {
    let d = sim.positions[(s1 * count + i) * 3] - sim.positions[((s1 - 1) * count + i) * 3];
    if (d > half[0]) d -= 2 * half[0];
    if (d < -half[0]) d += 2 * half[0];
    sum += d;
  }
  return (sum / count) * substeps;
};
