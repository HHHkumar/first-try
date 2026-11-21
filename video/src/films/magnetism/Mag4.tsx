import { useMemo } from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/magnetism/ch4.json';
import { lerp, ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Shell, T, chapterFrames } from '../../ui/Shell';
import { Kicker, Sym } from '../../ui/type';
import { drawLines, fieldAt, traceLines } from '../../world/field';
import { barPoles, BFIELD, drawBarMagnet, needleAt } from '../../world/magnet';
import { mulberry32 } from '../../world/rng';
import { rgb, Stage3D } from '../../world/Stage3D';
import type { CameraPose } from '../../world/WireWorld';
import { at, Cap, Timeline, VOICE } from './kit';

// Chapter 4 - The magnetic field. Filings, lines, and loops that never end.
export const MAG4_FRAMES = chapterFrames(voice.duration);
const HALF = 2.2;

export const Mag4 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const poles = useMemo(() => barPoles(0, 0.3, HALF), []);
  const lines = useMemo(() => traceLines(poles, { perCharge: 20, planar: true, bound: 12 }), [poles]);
  const filings = useMemo(() => {
    const rand = mulberry32(31);
    return Array.from({ length: 1100 }, () => ({ x: (rand() * 2 - 1) * 8.6, y: 0.3 + (rand() * 2 - 1) * 4.2, a: rand() * Math.PI }));
  }, []);

  const pose: CameraPose = { pos: [0, 0.3, 15.5], target: [0, 0.3, 0], fov: 34, focus: 15.5, dof: 0.06 };
  const settle = ramp(frame, T(4.6), T(8.4), Easing.inOut(Easing.cubic));
  const toLines = ramp(frame, T(15.6), T(18.6));
  // a compass carried round the magnet
  const tour = ramp(frame, T(23.0), T(28.4), Easing.inOut(Easing.quad));
  const ca = lerp(0.4, Math.PI * 1.7, tour);
  const cpos = { x: Math.cos(ca) * 5.2, y: 0.3 + Math.sin(ca) * 2.9 };
  const inside = ramp(frame, T(41.6), T(45.6));

  return (
    <Shell
      voice={VOICE(4)}
      frames={MAG4_FRAMES}
      world={
        <AbsoluteFill>
          <Stage3D
            width={width}
            height={height}
            pose={pose}
            orbs={(add) => drawBarMagnet(add, 0, 0.3, HALF)}
            glows={(add) => {
              // iron filings: each one a tiny needle that turns to lie along the field
              const iron = rgb('#c8d4ea');
              const fade = (1 - toLines) * at(frame, 3.6);
              if (fade > 0.01)
                for (const f of filings) {
                  if (Math.abs(f.x) < HALF + 0.2 && Math.abs(f.y - 0.3) < 0.7) continue;
                  const e = fieldAt(poles, f.x, f.y, 0);
                  const target = Math.atan2(e[1], e[0]);
                  let d = target - f.a;
                  while (d > Math.PI / 2) d -= Math.PI;
                  while (d < -Math.PI / 2) d += Math.PI;
                  const a = f.a + d * settle;
                  for (let k = -2; k <= 2; k++) add(f.x + Math.cos(a) * k * 0.05, f.y + Math.sin(a) * k * 0.05, 0, 0.07, iron, 0.75 * fade);
                }
              drawLines(add, lines, frame, toLines, BFIELD, { reveal: ramp(frame, T(15.6), T(21.4)), bold: true });
              // inside the magnet the lines run on, from south back to north: closed loops
              if (inside > 0) {
                const c = rgb(BFIELD);
                for (const y of [-0.3, 0, 0.3, 0.6, 0.9])
                  for (let i = 0; i <= 44 * inside; i++) {
                    const x = -HALF + (i / 44) * 2 * HALF;
                    const phase = (((i - frame * 0.9) % 22) + 22) % 22;
                    add(x, y, 0.9, phase < 3 ? 0.2 : 0.1, c, phase < 3 ? 1 : 0.7);
                  }
              }
              if (tour > 0 && tour < 1) needleAt(add, poles, cpos.x, cpos.y, 1.9, 1);
            }}
          />
        </AbsoluteFill>
      }
    >
      <Cap opacity={span(frame, T(0.2), T(10.6))} kicker="Like a charge, a magnet changes the space around it" title="Iron filings show a pattern that was there all along" />
      <Panel opacity={span(frame, T(10.8), T(15.4))} style={{ right: 110, top: 70, textAlign: 'right' }}>
        <Kicker color={BFIELD}>The magnetic field</Kicker>
        <Sym color={BFIELD} size={230} show={at(frame, 13.6)} style={{ lineHeight: 1.05 }}>
          B
        </Sym>
      </Panel>
      <Cap opacity={span(frame, T(15.9), T(22.8))} kicker="We draw it with lines, as Faraday taught us" title="They leave the north pole and enter the south" />
      <Cap opacity={span(frame, T(23.2), T(28.8))} kicker="A compass needle, anywhere in the field" title="turns to lie along the line through that point" />
      <Panel opacity={span(frame, T(29.4), T(53.6))} style={{ left: 110, top: 70, width: 900 }}>
        <Kicker>One great difference</Kicker>
        <div style={{ fontSize: 44, fontWeight: 300, marginTop: 12, lineHeight: 1.4 }}>
          <div style={{ opacity: at(frame, 32.8) }}>
            Electric field lines <span style={{ color: C.rho }}>start and end</span> on charges
          </div>
          <div style={{ opacity: at(frame, 37.8) }}>
            Magnetic field lines <span style={{ color: BFIELD }}>never start and never end</span>
          </div>
        </div>
      </Panel>
      <Cap opacity={span(frame, T(41.7), T(53.8))} kicker="Through the magnet, and round again" title="Unbroken loops: there are no single poles to begin or end on" />
      <Timeline frame={frame} already={[0, 1, 2, 3, 4]} />
    </Shell>
  );
};
