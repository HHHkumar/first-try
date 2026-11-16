import { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/charge/ch9.json';
import { lerp, ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Shell, T, TAIL } from '../../ui/Shell';
import { Big, Center, Frac, Kicker, Sub, Sym } from '../../ui/type';
import { drawArrow, drawCharge, drawFieldArrows, drawLines, FIELD, POS, traceLines, type Charge } from '../../world/field';
import { Stage3D } from '../../world/Stage3D';
import type { CameraPose } from '../../world/WireWorld';
import { at, Cap, drawPairs, drawPlates, shot, Timeline, TIMELINE, VOICE } from './kit';

// Chapter 9 - Recap, and a look ahead to capacitance.
const END_CARD = 4.5;
export const CHARGE9_FRAMES = T(voice.duration + END_CARD) + TAIL;
const GRID = { x: [-7.2, 7.2] as [number, number], y: [-3.0, 3.6] as [number, number], spacing: 1.2 };

export const Charge9 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const dipole: Charge[] = useMemo(() => [{ x: -3, y: 0.3, z: 0, q: 1 }, { x: 3, y: 0.3, z: 0, q: -1 }], []);
  const lines = useMemo(() => traceLines(dipole, { perCharge: 18, planar: true, bound: 12 }), [dipole]);
  const single: Charge[] = [{ x: 0, y: 0.3, z: 0, q: 1 }];

  const sKinds = shot(frame, 7.4, 17.3);
  const sForce = shot(frame, 17.1, 23.4);
  const sField = shot(frame, 23.2, 31.0);
  const sLines = shot(frame, 30.8, 37.0);
  const sPlates = ramp(frame, T(36.8), T(37.4));
  const flat: CameraPose = { pos: [0, 0.3, 15.5], target: [0, 0.3, 0], fov: 34, focus: 15.5, dof: 0.06 };
  const plates: CameraPose = { pos: [6.5 + Math.sin(frame * 0.004), 4.2, 19], target: [0, -0.3, 0], fov: 34, focus: 20.4, dof: 0.03 };
  const pose = frame >= T(36.9) ? plates : flat;
  const cam = pose.pos;
  const sep = 1.3 + 2.2 * ramp(frame, T(20.4), T(23.0));
  const next = ramp(frame, T(45.2), T(46.0));

  return (
    <Shell
      voice={VOICE(9)}
      frames={CHARGE9_FRAMES}
      world={
        frame > T(7.2) ? (
          <AbsoluteFill style={{ opacity: Math.max(sKinds, sForce, sField, sLines, sPlates) * lerp(1, 0.5, next) }}>
            <Stage3D
              width={width}
              height={height}
              pose={pose}
              fog={frame >= T(36.9) ? 0.015 : 0.02}
              orbs={(add) => {
                if (frame < T(17.2)) drawPairs(add, null, cam, frame, at(frame, 9.6), at(frame, 11.2));
                else if (frame < T(23.3)) for (const x of [-sep, sep]) drawCharge(add, () => {}, { x, y: 0.3, z: 0, q: 1 }, cam, 0.42);
                else if (frame < T(30.9)) drawCharge(add, () => {}, single[0], cam, 0.46);
                else if (frame < T(36.9)) for (const c of dipole) drawCharge(add, () => {}, c, cam, 0.44);
                else drawPlates(add, null, frame, {});
              }}
              glows={(add) => {
                if (frame < T(17.2)) drawPairs(null, add, cam, frame, at(frame, 9.6), at(frame, 11.2));
                else if (frame < T(23.3)) {
                  for (const x of [-sep, sep]) drawCharge(() => {}, add, { x, y: 0.3, z: 0, q: 1 }, cam, 0.42);
                  const len = Math.min(3, 1.15 * (1.3 / sep) ** 2 * 2.2);
                  drawArrow(add, -sep - 0.7, 0.3, 0, -1, 0, 0, len, POS, 1, 0.12);
                  drawArrow(add, sep + 0.7, 0.3, 0, 1, 0, 0, len, POS, 1, 0.12);
                } else if (frame < T(30.9)) {
                  drawCharge(() => {}, add, single[0], cam, 0.46);
                  drawFieldArrows(add, single, GRID, 1, FIELD, ramp(frame, T(23.6), T(26.4)));
                } else if (frame < T(36.9)) {
                  for (const c of dipole) drawCharge(() => {}, add, c, cam, 0.44);
                  drawLines(add, lines, frame, 1, FIELD, { bold: true, reveal: ramp(frame, T(31.2), T(33.2)) });
                } else drawPlates(null, add, frame, {});
              }}
            />
          </AbsoluteFill>
        ) : null
      }
    >
      <Center opacity={span(frame, T(1.6), T(7.3), 14)}>
        <Kicker style={{ marginBottom: 20 }}>It began with a piece of amber</Kicker>
        <Big size={120}>Twenty-five centuries to understand</Big>
      </Center>

      <Cap opacity={span(frame, T(7.6), T(17.1))} kicker="Charge comes in two kinds" title="Never created or destroyed, only moved" />
      <Cap opacity={span(frame, T(17.4), T(23.2))} kicker="The force between two charges" title="grows with each charge, falls with the square of the distance" />
      <Cap opacity={span(frame, T(23.5), T(30.8))} kicker="A charge fills the space around it with a field" title="The force each unit of charge would feel, at every point" />
      <Panel opacity={span(frame, T(26.6), T(30.8))} style={{ right: 110, top: 70 }}>
        <div style={{ fontSize: 120, display: 'flex', alignItems: 'baseline', gap: 26 }}>
          <Sym color={POS}>F</Sym>
          <Sym color={C.dim} style={{ fontStyle: 'normal' }}>
            =
          </Sym>
          <Sym color="#fff3c4">q</Sym>
          <Sym color={FIELD}>E</Sym>
        </div>
      </Panel>
      <Cap opacity={span(frame, T(31.1), T(36.8))} kicker="We draw that field with lines" title="From positive to negative, crowded where it is strong" />
      <Cap opacity={span(frame, T(37.1), T(45.0))} kicker="Inside a conductor: zero. Between two plates: uniform." title="Equal to the voltage divided by the gap" />
      <Panel opacity={span(frame, T(41.8), T(45.0))} style={{ right: 110, top: 70 }}>
        <div style={{ fontSize: 120, display: 'flex', alignItems: 'center', gap: 26 }}>
          <Sym color={FIELD}>E</Sym>
          <Sym color={C.dim} style={{ fontStyle: 'normal' }}>
            =
          </Sym>
          <Frac width={110} top={<Sym color={C.rho}>V</Sym>} bottom={<Sym color={C.shape}>d</Sym>} />
        </div>
      </Panel>

      {/* next time */}
      <Center opacity={next}>
        <Kicker style={{ marginBottom: 22 }}>Next time</Kicker>
        <Big size={170} style={{ textShadow: `0 0 80px ${C.electron}55` }}>
          Capacitance
        </Big>
        <Sub style={{ opacity: at(frame, 48.2) }}>storing energy in the empty space between two plates</Sub>
      </Center>

      <Timeline frame={frame} already={TIMELINE.map((_, i) => i)} />
    </Shell>
  );
};
