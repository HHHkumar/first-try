import { useMemo } from 'react';
import { ThreeCanvas } from '@remotion/three';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { C, hexToRgb } from '../theme';
import { mulberry32 } from './rng';
import type { Scatter, SimResult } from './sim';
import { makeSprites, pushSprite, Sprites } from './Sprites';

export type CameraPose = {
  pos: [number, number, number];
  target: [number, number, number];
  fov: number;
  focus: number; // distance from the camera that is sharp
  dof: number; // how quickly things blur away from the focus distance
};

export type WireLook = {
  temperature: number; // 0 = room temperature look, 1 = glowing hot
  electronGain: number; // brightness of the electron gas
  ionGain: number;
  fog: number;
  slab?: number; // if set, only this half-thickness around z = 0 stays visible
  tremble?: number; // multiplies the lattice vibration (0 = perfectly still)
  flaws?: number; // 0..1, how visible the impurity atoms are
  ionTint?: string; // another material
  electronFraction?: number; // share of the electrons that exist (semiconductors)
  pulse?: { x: number; width: number; gain: number }; // a bright front sweeping along the wire
  flashes?: number; // brightness of a spark at every scattering
  flashColor?: string;
  hero?: { index: number; trail: number; gain: number }; // one electron to follow
};

export type LatticeSpec = { nx: number; ny: number; nz: number };

type Props = {
  frame: number;
  width: number;
  height: number;
  lattice: LatticeSpec;
  sim: SimResult;
  pose: CameraPose;
  look: WireLook;
};

const TRAIL = 40;

const mix3 = (a: readonly number[], b: readonly number[], t: number): [number, number, number] => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

const Camera = ({ pose, aspect }: { pose: CameraPose; aspect: number }) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  camera.position.set(pose.pos[0], pose.pos[1], pose.pos[2]);
  camera.up.set(0, 1, 0);
  camera.lookAt(pose.target[0], pose.target[1], pose.target[2]);
  camera.fov = pose.fov;
  camera.aspect = aspect;
  camera.near = 0.05;
  camera.far = 400;
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
  return null;
};

const Scene = ({ frame, lattice, sim, pose, look }: Omit<Props, 'width' | 'height'>) => {
  const ions = useMemo(() => {
    const { nx, ny, nz } = lattice;
    const rand = mulberry32(11);
    const n = nx * ny * nz;
    const base = new Float32Array(n * 3);
    const phase = new Float32Array(n * 6);
    let i = 0;
    for (let x = 0; x < nx; x++)
      for (let y = 0; y < ny; y++)
        for (let z = 0; z < nz; z++) {
          base[i * 3] = x - (nx - 1) / 2;
          base[i * 3 + 1] = y - (ny - 1) / 2;
          base[i * 3 + 2] = z - (nz - 1) / 2;
          for (let k = 0; k < 3; k++) {
            phase[i * 6 + k] = rand() * Math.PI * 2;
            phase[i * 6 + 3 + k] = 0.55 + rand() * 0.75; // tremble rate, rad per frame
          }
          i++;
        }
    const flaw = new Uint8Array(n);
    for (let j = 0; j < n; j++) flaw[j] = rand() < 0.045 ? 1 : 0;
    return { n, base, phase, flaw, order: new Uint32Array(n), depth: new Float32Array(n) };
  }, [lattice]);

  const ionSprites = useMemo(() => makeSprites(ions.n), [ions]);
  const scatterByStep = useMemo(() => {
    const m = new Map<number, Scatter[]>();
    for (const sc of sim.scatters) {
      const list = m.get(sc.step);
      if (list) list.push(sc);
      else m.set(sc.step, [sc]);
    }
    return m;
  }, [sim]);
  const electronSprites = useMemo(() => makeSprites(sim.params.count * (TRAIL * 2 + 2) + 4000), [sim]);

  // Refill every buffer for this frame.
  useMemo(() => {
    const cool = hexToRgb(look.ionTint ?? C.ion);
    const hot = hexToRgb(C.ionHot);
    const ionColor = mix3(cool, hot, look.temperature);
    const flawColor = hexToRgb(C.field);
    const flaws = look.flaws ?? 0;
    const amp = (0.035 + 0.13 * look.temperature) * (look.tremble ?? 1);
    const pulse = look.pulse;
    const pulseGain = (x: number) => (pulse ? 1 + pulse.gain * Math.exp(-(((x - pulse.x) / pulse.width) ** 2)) : 1);
    const slab = look.slab ?? 1e9;
    const inSlab = (z: number) => {
      const t = Math.min(1, Math.max(0, Math.abs(z) - slab));
      return 1 - t * t * (3 - 2 * t);
    };

    // Ions, sorted far to near so their soft edges composite correctly.
    const fwd = new THREE.Vector3(
      pose.target[0] - pose.pos[0],
      pose.target[1] - pose.pos[1],
      pose.target[2] - pose.pos[2],
    ).normalize();
    for (let i = 0; i < ions.n; i++) {
      ions.order[i] = i;
      ions.depth[i] =
        (ions.base[i * 3] - pose.pos[0]) * fwd.x +
        (ions.base[i * 3 + 1] - pose.pos[1]) * fwd.y +
        (ions.base[i * 3 + 2] - pose.pos[2]) * fwd.z;
    }
    ions.order.sort((a, b) => ions.depth[b] - ions.depth[a]);
    ionSprites.count = 0;
    for (let j = 0; j < ions.n; j++) {
      const i = ions.order[j];
      if (ions.depth[i] < 0.15) continue;
      const vis = inSlab(ions.base[i * 3 + 2]);
      if (vis < 0.01) continue;
      const p = ions.phase;
      const x = ions.base[i * 3] + amp * Math.sin(p[i * 6] + frame * p[i * 6 + 3]);
      const y = ions.base[i * 3 + 1] + amp * Math.sin(p[i * 6 + 1] + frame * p[i * 6 + 4]);
      const z = ions.base[i * 3 + 2] + amp * Math.sin(p[i * 6 + 2] + frame * p[i * 6 + 5]);
      // slow breathing so the lattice never looks frozen
      const breathe = 0.92 + 0.08 * Math.sin(p[i * 6] * 3.0 + frame * 0.045);
      const g = look.ionGain * breathe * pulseGain(x);
      const f = ions.flaw[i] * flaws;
      // quad is 2.6x the sphere so the halo fits
      pushSprite(
        ionSprites,
        x + f * 0.22 * Math.sin(p[i * 6] * 7),
        y + f * 0.22 * Math.cos(p[i * 6 + 1] * 7),
        z,
        0.3 * 2.6 * (1 + 0.45 * f),
        (ionColor[0] + (flawColor[0] - ionColor[0]) * f) * g,
        (ionColor[1] + (flawColor[1] - ionColor[1]) * f) * g,
        (ionColor[2] + (flawColor[2] - ionColor[2]) * f) * g,
        vis,
      );
    }

    // Electrons: a bright head and a fading trail from the last few sub-steps.
    const { count, substeps } = sim.params;
    const step = Math.min(sim.steps - 1, Math.round(frame * substeps));
    const e = hexToRgb(C.electron);
    const core = hexToRgb(C.electronCore);
    electronSprites.count = 0;
    const shown = Math.round(count * Math.min(1, Math.max(0, look.electronFraction ?? 1)));
    for (let i = 0; i < shown; i++) {
      if (look.hero && look.hero.index === i) continue;
      const head = (step * count + i) * 3;
      const gain = look.electronGain * inSlab(sim.positions[head + 2]) * pulseGain(sim.positions[head]);
      if (gain < 0.01) continue;
      for (let j = 0; j < TRAIL; j++) {
        const s = step - j;
        if (s < 0) break;
        const o = (s * count + i) * 3;
        const t = 1 - j / TRAIL;
        if (j === 0) {
          pushSprite(electronSprites, sim.positions[o], sim.positions[o + 1], sim.positions[o + 2], 0.5, e[0], e[1], e[2], 0.55 * gain);
          pushSprite(electronSprites, sim.positions[o], sim.positions[o + 1], sim.positions[o + 2], 0.13, core[0], core[1], core[2], 1.0 * gain);
        } else {
          const size = 0.035 + 0.085 * t;
          const a = 0.34 * t * t * gain;
          const x = sim.positions[o];
          const y = sim.positions[o + 1];
          const z = sim.positions[o + 2];
          pushSprite(electronSprites, x, y, z, size, e[0], e[1], e[2], a);
          // midpoint towards the newer sample, so the streak has no gaps
          const n = o + count * 3;
          pushSprite(electronSprites, (x + sim.positions[n]) / 2, (y + sim.positions[n + 1]) / 2, (z + sim.positions[n + 2]) / 2, size, e[0], e[1], e[2], a);
        }
        if (sim.wrapped[s * count + i]) break; // do not draw a trail across the box
      }
    }


    // A spark where each scattering happened, fading over a few steps.
    const flashGain = look.flashes ?? 0;
    const hero = look.hero;
    if (flashGain > 0 || hero) {
      const fc = hexToRgb(look.flashColor ?? '#ffffff');
      const life = 3 * substeps;
      for (let s = Math.max(1, step - life); s <= step; s++) {
        const list = scatterByStep.get(s);
        if (!list) continue;
        const age = (step - s) / life;
        for (const sc of list) {
          const isHero = hero ? sc.i === hero.index : false;
          const g = isHero ? Math.max(flashGain, 1.6 * hero!.gain) : flashGain * inSlab(sc.z);
          if (g < 0.01 || sc.i >= shown) continue;
          pushSprite(electronSprites, sc.x, sc.y, sc.z, (isHero ? 0.9 : 0.5) + age * 1.1, fc[0], fc[1], fc[2], (1 - age) * (1 - age) * g);
        }
      }
    }

    // The electron we follow: brighter, with a long memory of where it has been.
    if (hero) {
      const i = hero.index;
      for (let j = 0; j < hero.trail; j++) {
        const s = step - j;
        if (s < 0) break;
        const o = (s * count + i) * 3;
        const t = 1 - j / hero.trail;
        const x = sim.positions[o];
        const y = sim.positions[o + 1];
        const z = sim.positions[o + 2];
        if (j === 0) {
          pushSprite(electronSprites, x, y, z, 1.0, e[0], e[1], e[2], 0.75 * hero.gain);
          pushSprite(electronSprites, x, y, z, 0.24, core[0], core[1], core[2], 1.2 * hero.gain);
        } else {
          const size = 0.05 + 0.07 * t;
          const a = 0.34 * Math.pow(t, 0.8) * hero.gain;
          const n = o + count * 3; // the newer sample, for a gap-free streak
          pushSprite(electronSprites, x, y, z, size, core[0], core[1], core[2], a);
          pushSprite(electronSprites, x + (sim.positions[n] - x) / 3, y + (sim.positions[n + 1] - y) / 3, z + (sim.positions[n + 2] - z) / 3, size, core[0], core[1], core[2], a);
          pushSprite(electronSprites, x + ((sim.positions[n] - x) * 2) / 3, y + ((sim.positions[n + 1] - y) * 2) / 3, z + ((sim.positions[n + 2] - z) * 2) / 3, size, core[0], core[1], core[2], a);
        }
        if (sim.wrapped[s * count + i]) break;
      }
    }
  }, [frame, ions, sim, pose, look, lattice, ionSprites, electronSprites, scatterByStep]);

  const common = { focus: pose.focus, dof: pose.dof, fog: look.fog, version: frame };
  return (
    <>
      <color attach="background" args={[C.bg0]} />
      <Sprites kind="orb" data={ionSprites} {...common} grow={1.4} halo={0.2 + 0.5 * look.temperature} deep={look.ionTint ? (hexToRgb(look.ionTint).map((v) => v * 0.28) as [number, number, number]) : mix3(hexToRgb(C.ionDeep), hexToRgb('#d2500f'), look.temperature)} renderOrder={2} />
      <Sprites kind="glow" data={electronSprites} {...common} grow={2.2} renderOrder={3} />
    </>
  );
};

export const WireWorld = ({ width, height, ...rest }: Props) => {
  return (
    <ThreeCanvas
      width={width}
      height={height}
      flat
      linear
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      camera={{ fov: rest.pose.fov, near: 0.05, far: 400 }}
    >
      <Camera pose={rest.pose} aspect={width / height} />
      <Scene {...rest} />
    </ThreeCanvas>
  );
};
