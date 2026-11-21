import { useMemo, useRef } from 'react';
import { ThreeCanvas } from '@remotion/three';
import { C, hexToRgb } from '../theme';
import { makeSprites, pushSprite, Sprites } from './Sprites';
import { Camera, type CameraPose } from './WireWorld';

// A general luminous 3D stage. A scene describes itself by calling `add` for
// every lit sphere (orb) and every point of light (glow); the stage sorts,
// uploads and draws them with the same depth of field as the wire scenes.
export type Add = (x: number, y: number, z: number, size: number, color: readonly number[], alpha: number) => void;

const cache = new Map<string, [number, number, number]>();
export const rgb = (hex: string): [number, number, number] => {
  let v = cache.get(hex);
  if (!v) {
    v = hexToRgb(hex);
    cache.set(hex, v);
  }
  return v;
};

type Props = {
  width: number;
  height: number;
  pose: CameraPose;
  fog?: number;
  halo?: number;
  deep?: [number, number, number];
  bg?: string;
  orbs?: (add: Add) => void;
  glows?: (add: Add) => void;
};

const ORBS = 9000;
const GLOWS = 90000;

const Scene = ({ pose, fog = 0.02, halo = 0.2, deep, bg = C.bg0, orbs, glows }: Omit<Props, 'width' | 'height'>) => {
  const orbSprites = useMemo(() => makeSprites(ORBS), []);
  const glowSprites = useMemo(() => makeSprites(GLOWS), []);
  const scratch = useMemo(() => ({ data: new Float32Array(ORBS * 8), order: new Uint32Array(ORBS), depth: new Float32Array(ORBS) }), []);
  const version = useRef(0);
  version.current++;

  // orbs: collect, sort far to near, upload
  let n = 0;
  const { data, order, depth } = scratch;
  orbs?.((x, y, z, size, color, alpha) => {
    if (n >= ORBS) return;
    const o = n * 8;
    data[o] = x;
    data[o + 1] = y;
    data[o + 2] = z;
    data[o + 3] = size;
    data[o + 4] = color[0];
    data[o + 5] = color[1];
    data[o + 6] = color[2];
    data[o + 7] = alpha;
    depth[n] = (x - pose.pos[0]) ** 2 + (y - pose.pos[1]) ** 2 + (z - pose.pos[2]) ** 2;
    order[n] = n;
    n++;
  });
  const sorted = order.subarray(0, n).sort((a, b) => depth[b] - depth[a]);
  orbSprites.count = 0;
  for (let j = 0; j < n; j++) {
    const o = sorted[j] * 8;
    // quad is 2.6x the sphere so the halo fits
    pushSprite(orbSprites, data[o], data[o + 1], data[o + 2], data[o + 3] * 2.6, data[o + 4], data[o + 5], data[o + 6], data[o + 7]);
  }
  glowSprites.count = 0;
  glows?.((x, y, z, size, color, alpha) => pushSprite(glowSprites, x, y, z, size, color[0], color[1], color[2], alpha));

  const common = { focus: pose.focus, dof: pose.dof, fog, version: version.current };
  return (
    <>
      <color attach="background" args={[bg]} />
      <Sprites kind="orb" data={orbSprites} {...common} grow={1.4} halo={halo} deep={deep ?? hexToRgb(C.ionDeep)} renderOrder={1} />
      <Sprites kind="glow" data={glowSprites} {...common} grow={2.2} renderOrder={2} />
    </>
  );
};

export const Stage3D = ({ width, height, ...rest }: Props) => (
  <ThreeCanvas width={width} height={height} flat linear gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }} camera={{ fov: rest.pose.fov, near: 0.05, far: 600 }}>
    <Camera pose={rest.pose} aspect={width / height} />
    <Scene {...rest} />
  </ThreeCanvas>
);
