import { useMemo } from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/induction/ch1.json';
import { lerp, lerp3, ramp, span } from '../../anim';
import { C } from '../../theme';
import { Shell, T, chapterFrames } from '../../ui/Shell';
import { Big, Center, Kicker } from '../../ui/type';
import { CURRENT, drawWire } from '../../world/magnet';
import { mulberry32 } from '../../world/rng';
import { rgb, Stage3D, type Add } from '../../world/Stage3D';
import type { CameraPose } from '../../world/WireWorld';
import { at, Cap, COPPER, ring, rotMagnet, shot, Timeline, VOICE } from './kit';

// Chapter 1 - From a city at night back to a magnet turning inside coils of wire.
export const I1_FRAMES = chapterFrames(voice.duration);

// the heart of every generator: a magnet turning inside coils
export const drawGenerator = (orbOrNull: Add | null, glow: Add | null, frame: number, angle: number) => {
  if (orbOrNull) rotMagnet(orbOrNull, angle, 1.7);
  if (glow) {
    const spots: [number, number, 'x' | 'y', number][] = [[3.1, 0, 'x', 0], [0, 3.1, 'y', Math.PI / 2], [-3.1, 0, 'x', Math.PI], [0, -3.1, 'y', -Math.PI / 2]];
    for (const [x, y, axis, a] of spots) {
      const c = Math.sin(angle - a);
      for (const d of [-0.3, 0, 0.3]) {
        ring(glow, x + (axis === 'x' ? d : 0), y + (axis === 'y' ? d : 0), 0, axis, 1.25, frame, COPPER, 0.5);
        ring(glow, x + (axis === 'x' ? d : 0), y + (axis === 'y' ? d : 0), 0, axis, 1.25, frame * 1.6, CURRENT, Math.abs(c) * 0.9, c > 0 ? 1 : -1);
      }
    }
  }
};

export const I1 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const lights = useMemo(() => {
    const r = mulberry32(5);
    return Array.from({ length: 900 }, () => {
      const bx = Math.floor(r() * 16) - 8;
      const bz = Math.floor(r() * 12) - 6;
      const h = 0.4 + r() * r() * 3.2;
      return { x: bx * 1.5 + r() * 1.0, z: bz * 1.5 + r() * 1.0, y: r() * h, warm: r(), tw: r() * 6 };
    });
  }, []);
  const sCity = shot(frame, -1, 11.6);
  const sLine = shot(frame, 11.4, 18.2);
  const sGen = shot(frame, 18.0, 80);
  const which = frame < T(11.5) ? 0 : frame < T(18.1) ? 1 : 2;
  const pull = ramp(frame, 0, T(11.4), Easing.inOut(Easing.quad));
  const run = ramp(frame, T(11.4), T(18.2));
  const closing = ramp(frame, T(38.6), T(39.6));
  const poses: CameraPose[] = [
    { pos: lerp3([0, 2.2, 9], [3, 11, 24], pull), target: [0, 0.6, 0], fov: 34, focus: lerp(10, 26, pull), dof: 0.03 },
    { pos: [lerp(-8, 6, run), 1.6, 9], target: [lerp(-4, 9, run), 0.6, 0], fov: 34, focus: 9.5, dof: 0.05 },
    { pos: [3 + Math.sin(frame * 0.004) * 2, 2.6, lerp(22, 14, ramp(frame, T(18.0), T(27.0), Easing.out(Easing.cubic)))], target: [0, 0, 0], fov: 34, focus: 15, dof: 0.04 },
  ];

  return (
    <Shell
      voice={VOICE(1)}
      frames={I1_FRAMES}
      world={
        <AbsoluteFill style={{ opacity: Math.max(sCity, sLine, sGen) * lerp(1, 0.3, closing) }}>
          <Stage3D
            width={width}
            height={height}
            pose={poses[which]}
            fog={which === 0 ? 0.02 : 0.012}
            orbs={(add) => {
              if (which === 2) rotMagnet(add, frame * 0.07, 1.7);
            }}
            glows={(add) => {
              if (which === 0)
                for (const l of lights) {
                  const tw = 0.7 + 0.3 * Math.sin(frame * 0.1 + l.tw);
                  add(l.x, l.y, l.z, 0.16, l.warm > 0.35 ? rgb('#ffd9a0') : rgb('#bfe0ff'), 0.9 * tw);
                }
              if (which === 1) {
                for (const [y, z] of [[2.2, -0.8], [2.2, 0.8], [2.9, 0]]) drawWire(add, y, z, -14, 22, frame * 2, 1);
                for (const x of [-9, -1, 7, 15]) {
                  for (let y = -1; y <= 3; y += 0.12) add(x, y, 0, 0.14, rgb('#9aa6c0'), 0.7);
                  for (let z = -1; z <= 1; z += 0.12) add(x, 2.2, z, 0.14, rgb('#9aa6c0'), 0.7);
                }
              }
              if (which === 2) drawGenerator(null, add, frame, frame * 0.07);
            }}
          />
        </AbsoluteFill>
      }
    >
      <Cap opacity={span(frame, T(0.2), T(10.9))} kicker="A city at night" title="Every lamp and motor runs on electricity made a moment ago, far away" />
      <Cap opacity={span(frame, T(11.4), T(17.8))} kicker="Follow the wires back" title="Substation, transmission line, power station" />
      <Cap opacity={span(frame, T(18.2), T(26.8))} kicker="Coal, gas, atoms, a dam or a wind turbine" title="At the centre, you find the same thing" />
      <Cap opacity={span(frame, T(27.0), T(38.4))} kicker="A magnet, turning, inside coils of wire" title="Nearly every unit of electricity you have used was made this way" />
      <Center opacity={closing}>
        <Kicker style={{ marginBottom: 24 }}>A basement laboratory in London · autumn 1831 · Michael Faraday</Kicker>
        <Big size={120} style={{ opacity: at(frame, 47.2), textShadow: `0 0 80px ${CURRENT}55` }}>
          Electromagnetic <span style={{ color: CURRENT }}>induction</span>
        </Big>
        <div style={{ fontSize: 44, fontWeight: 300, color: C.dim, marginTop: 40, opacity: at(frame, 50.4) }}>the last video of the series</div>
      </Center>
      <Timeline frame={frame} already={[]} events={[[0, 43.6]]} />
    </Shell>
  );
};
