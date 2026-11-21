import { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/magnetism/ch10.json';
import { lerp, ramp, span } from '../../anim';
import { C } from '../../theme';
import { Shell, T, TAIL } from '../../ui/Shell';
import { Big, Center, Kicker, Sub } from '../../ui/type';
import { drawLines, traceLines } from '../../world/field';
import { barPoles, BFIELD, drawBarMagnet, drawCoil, drawRings, drawWire, makeCoil, traceCoil } from '../../world/magnet';
import { rgb, Stage3D } from '../../world/Stage3D';
import type { CameraPose } from '../../world/WireWorld';
import { drawGapField, drawLoop, drawPoleFaces } from './gap';
import { at, Cap, EndCard, shot, Timeline, TIMELINE, VOICE } from './kit';

// Chapter 10 - Recap, a look ahead, and the closing card.
const END = 5.0;
export const MAG10_FRAMES = T(voice.duration + END) + TAIL;

export const Mag10 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const poles = useMemo(() => barPoles(0, 0, 2.5), []);
  const barLines = useMemo(() => traceLines(poles, { perCharge: 18, planar: true, bound: 12 }), [poles]);
  const coilXs = useMemo(() => Array.from({ length: 11 }, (_, i) => -3 + i * 0.6), []);
  const coilLines = useMemo(
    () =>
      traceCoil(
        makeCoil(coilXs, 1.5),
        [0, 0.45, 0.9, 1.2].flatMap((r) => (r === 0 ? [[0, 0, 0] as [number, number, number]] : [0, 1, 2, 3, 4, 5].map((k) => [0, Math.cos((k * Math.PI) / 3) * r, Math.sin((k * Math.PI) / 3) * r] as [number, number, number]))),
        12,
      ),
    [coilXs],
  );
  const which = frame < T(12.6) ? 0 : frame < T(19.5) ? 1 : frame < T(27.95) ? 2 : 3;
  const vis = Math.max(shot(frame, -1, 12.7), shot(frame, 12.5, 19.6), shot(frame, 19.4, 28.05), shot(frame, 27.85, 80));
  const next = span(frame, T(34.0), T(44.6), 14);
  const orbit = Math.sin(frame * 0.004);
  const poses: CameraPose[] = [
    { pos: [orbit, 0.6, 16], target: [0, 0, 0], fov: 34, focus: 16, dof: 0.05 },
    { pos: [7 + orbit * 1.5, 4.2, 12], target: [0, 0, 0], fov: 34, focus: 14, dof: 0.05 },
    { pos: [5 + orbit * 2, 3.4, 14], target: [0, 0, 0], fov: 34, focus: 15, dof: 0.045 },
    { pos: [5.5 + orbit, 3.6, 15], target: [0, 0, 0], fov: 34, focus: 16, dof: 0.04 },
  ];

  return (
    <Shell
      voice={VOICE(10)}
      frames={MAG10_FRAMES}
      fadeOut
      world={
        <AbsoluteFill style={{ opacity: vis * lerp(1, 0.3, next) }}>
          <Stage3D
            width={width}
            height={height}
            pose={poses[which]}
            deep={which === 2 ? [0.1, 0.11, 0.14] : undefined}
            orbs={(add) => {
              if (which === 0) drawBarMagnet(add, 0, 0, 2.5);
              if (which === 2) for (let x = -3.4; x <= 3.41; x += 0.62) for (const [y, z] of [[0.36, 0.36], [-0.36, 0.36], [0.36, -0.36], [-0.36, -0.36]]) add(x, y, z, 0.66, rgb('#9aa6c0'), at(frame, 21.6));
              if (which === 3) drawPoleFaces(add);
            }}
            glows={(add) => {
              if (which === 0) drawLines(add, barLines, frame, at(frame, 6.6, 1.2), BFIELD, { bold: true });
              if (which === 1) {
                drawWire(add, 0, 0, -9, 9, frame, 1);
                drawRings(add, 0, 0, [-5, -2.5, 0, 2.5, 5], [1.5], frame, 1);
              }
              if (which === 2) {
                drawCoil(add, coilXs, 1.5, frame);
                drawLines(add, coilLines, frame, 1 + 1.2 * at(frame, 21.6), BFIELD, { bold: true });
              }
              if (which === 3) {
                drawGapField(add, frame);
                drawLoop(add, 0.5 + Math.max(0, frame - T(28.4)) * 0.045, frame);
              }
            }}
          />
        </AbsoluteFill>
      }
    >
      <Cap opacity={span(frame, T(1.9), T(6.4))} kicker="Magnets have two poles" title="and the poles always come in pairs" />
      <Cap opacity={span(frame, T(6.6), T(12.5))} kicker="The magnetic field" title="Its lines never start or end: they form closed loops" />
      <Cap opacity={span(frame, T(12.8), T(16.3))} kicker="A current makes a magnetic field" title="that circles the wire" />
      <Cap opacity={span(frame, T(16.5), T(19.4), 8)} kicker="Not a separate force" title="Magnetism is what moving charge does" />
      <Cap opacity={span(frame, T(19.7), T(27.9))} kicker="A coil concentrates the field, an iron core multiplies it" title="Iron is full of tiny current loops that line up" />
      <Cap opacity={span(frame, T(28.1), T(33.8))} kicker="A field pushes sideways on moving charge" title="and that push turns every motor" />

      <Center opacity={next}>
        <Kicker style={{ marginBottom: 22 }}>Next time: building a field up, and tearing it down</Kicker>
        <Big size={150} style={{ textShadow: `0 0 80px ${BFIELD}55` }}>
          Inductance
        </Big>
        <Sub style={{ opacity: at(frame, 42.4), color: C.dim }}>what a coil does when its current changes</Sub>
      </Center>

      <Timeline frame={frame} already={TIMELINE.map((_, i) => i)} opacity={1 - ramp(frame, T(44.3), T(44.9))} />
      <EndCard frame={frame} from={44.7} />
    </Shell>
  );
};
