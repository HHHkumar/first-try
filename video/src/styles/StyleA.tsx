import { useMemo } from 'react';
import { ThreeCanvas } from '@remotion/three';
import { AbsoluteFill, useVideoConfig } from 'remotion';
import { stix } from '../fonts';
import { Caption, Vignette } from '../scenes/overlays';
import { C, hexToRgb } from '../theme';
import { Kicker } from '../ui/type';
import { mulberry32 } from '../world/rng';
import { makeSprites, pushSprite, Sprites } from '../world/Sprites';
import { Camera, type CameraPose } from '../world/WireWorld';

// Style A - "Luminous": the look of the first film. Glowing particles in deep
// space, real depth of field. Shown here on a charged parallel-plate capacitor.
const POSE: CameraPose = { pos: [9.5, 4.4, 12.5], target: [2.6, -0.4, 0], fov: 34, focus: 14.2, dof: 0.07 };

const Plates = () => {
  const { ions, glows } = useMemo(() => {
    const rand = mulberry32(3);
    const list: { x: number; y: number; z: number; side: number }[] = [];
    for (const side of [-1, 1])
      for (let layer = 0; layer < 2; layer++)
        for (let y = -3; y <= 3; y++) for (let z = -4; z <= 4; z++) list.push({ x: side * (3 + layer * 0.9), y, z, side });
    const d = (p: { x: number; y: number; z: number }) => (p.x - POSE.pos[0]) ** 2 + (p.y - POSE.pos[1]) ** 2 + (p.z - POSE.pos[2]) ** 2;
    list.sort((a, b) => d(b) - d(a));
    const ionSprites = makeSprites(list.length);
    const neg = hexToRgb('#7d6a5c');
    const pos = hexToRgb(C.ionHot);
    for (const p of list) {
      const c = p.side < 0 ? neg : pos;
      const g = p.side < 0 ? 1.0 : 1.35;
      pushSprite(ionSprites, p.x, p.y, p.z, 0.36 * 2.6, c[0] * g, c[1] * g, c[2] * g, 1);
    }
    const glow = makeSprites(6000);
    const e = hexToRgb(C.electron);
    const core = hexToRgb(C.electronCore);
    const f = hexToRgb(C.field);
    // surplus electrons crowding the inner face of the negative plate
    for (let i = 0; i < 90; i++) {
      const y = (rand() * 2 - 1) * 3.3;
      const z = (rand() * 2 - 1) * 4.3;
      const x = -2.45 + rand() * 0.25;
      pushSprite(glow, x, y, z, 0.55, e[0], e[1], e[2], 0.6);
      pushSprite(glow, x, y, z, 0.15, core[0], core[1], core[2], 1);
    }
    // field lines from the positive plate to the negative one
    for (let y = -3; y <= 3; y += 1.5)
      for (let z = -4; z <= 4; z += 2) {
        for (let k = 0; k <= 60; k++) {
          const x = 2.5 - (k / 60) * 4.9;
          const pulse = Math.exp(-(((k / 60 - ((y + z) * 0.13 + 0.5)) % 1) ** 2) * 60);
          pushSprite(glow, x, y, z, 0.07 + 0.12 * pulse, f[0], f[1], f[2], 0.3 + 0.7 * pulse);
        }
      }
    return { ions: ionSprites, glows: glow };
  }, []);
  const common = { focus: POSE.focus, dof: POSE.dof, fog: 0.018, version: 0 };
  return (
    <>
      <color attach="background" args={[C.bg0]} />
      <Sprites kind="orb" data={ions} {...common} grow={1.4} deep={hexToRgb(C.ionDeep)} renderOrder={1} />
      <Sprites kind="glow" data={glows} {...common} grow={2.2} renderOrder={2} />
    </>
  );
};

export const StyleA = () => {
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0 }}>
      <ThreeCanvas width={width} height={height} flat linear gl={{ antialias: true, alpha: false }} camera={{ fov: POSE.fov, near: 0.05, far: 400 }}>
        <Camera pose={POSE} aspect={width / height} />
        <Plates />
      </ThreeCanvas>
      <Vignette />
      <AbsoluteFill style={{ background: 'linear-gradient(270deg, rgba(3,6,13,0.9) 0%, rgba(3,6,13,0.6) 26%, rgba(3,6,13,0) 48%)' }} />
      <div style={{ position: 'absolute', right: 110, top: 86, textAlign: 'right' }}>
        <Kicker>Capacitance</Kicker>
        <div style={{ fontFamily: stix, fontStyle: 'italic', fontSize: 130, color: C.text, lineHeight: 1.1 }}>
          C <span style={{ fontStyle: 'normal', color: C.dim }}>=</span> <span style={{ color: C.electron }}>Q</span> / <span style={{ color: C.rho }}>V</span>
        </div>
      </div>
      <Caption opacity={1} kicker="Style A · Luminous" title="Charge crowds one plate; the field stretches across the gap" />
    </AbsoluteFill>
  );
};
