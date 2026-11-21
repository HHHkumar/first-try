import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/magnetism/ch8.json';
import { ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Shell, T, chapterFrames } from '../../ui/Shell';
import { Sym } from '../../ui/type';
import { drawArrow, NEG } from '../../world/field';
import { BFIELD, CURRENT } from '../../world/magnet';
import { rgb, Stage3D } from '../../world/Stage3D';
import type { CameraPose } from '../../world/WireWorld';
import { drawGapField, drawLoop, drawPoleFaces, drawZWire } from './gap';
import { at, Cap, shot, Timeline, VOICE } from './kit';

// Chapter 8 - The force on a moving charge, on a wire, and on a loop.
export const MAG8_FRAMES = chapterFrames(voice.duration);
const R = 2.6;

const Formula = ({ parts }: { parts: [string, string][] }) => (
  <div style={{ fontSize: 124, display: 'flex', alignItems: 'baseline', gap: 26 }}>
    {parts.map(([s, color], i) => (
      <Sym key={i} color={color} style={s === '=' ? { fontStyle: 'normal' } : undefined}>
        {s}
      </Sym>
    ))}
  </div>
);

export const Mag8 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const sCharge = shot(frame, -1, 28.8);
  const sGap = shot(frame, 28.6, 60);
  const gap = frame >= T(28.7);
  const loop = frame >= T(42.9);

  // the charge stands still, then is sent across the field and circles
  const moved = Math.max(0, frame - T(5.0)) / 30;
  const start = ramp(frame, T(5.0), T(6.2), Easing.in(Easing.quad));
  const angle = Math.PI - (moved - 0.6 * (1 - start) * Math.min(moved, 1.2)) * 1.25;
  const px = Math.cos(angle) * R;
  const py = Math.sin(angle) * R;

  const kick = ramp(frame, T(34.6), T(36.6), Easing.out(Easing.cubic));
  const turn = Math.max(0, frame - T(48.6)) * 0.045 * ramp(frame, T(48.6), T(50.4));
  const loopAngle = 0.5 + turn;

  const posePoint: CameraPose = { pos: [0, -3.4, 14.5], target: [0, 0, 0], fov: 34, focus: 14.6, dof: 0.04 };
  const poseGap: CameraPose = { pos: [5.5 + Math.sin(frame * 0.004), 3.6, 15], target: [0, 0, 0], fov: 34, focus: 16, dof: 0.04 };

  return (
    <Shell
      voice={VOICE(8)}
      frames={MAG8_FRAMES}
      world={
        <AbsoluteFill style={{ opacity: Math.max(sCharge, sGap) }}>
          <Stage3D
            width={width}
            height={height}
            pose={gap ? poseGap : posePoint}
            orbs={(add) => {
              if (gap) drawPoleFaces(add);
              else add(px, py, 0, 0.62, rgb(NEG), 1);
            }}
            glows={(add) => {
              if (!gap) {
                // the field seen end on: a lattice of lines running away from us
                const c = rgb(BFIELD);
                for (let x = -7; x <= 7.01; x += 1.4)
                  for (let y = -3.6; y <= 3.61; y += 1.2)
                    for (let k = 0; k < 14; k++) {
                      const z = -3.2 + k * 0.4;
                      const phase = (((k + frame * 0.25 + x * 3 + y * 5) % 14) + 14) % 14;
                      add(x, y, z, phase < 1.2 ? 0.2 : 0.09, c, phase < 1.2 ? 0.9 : 0.4);
                    }
                add(px, py, 0, 1.5, rgb(NEG), 0.5);
                // where it has been
                const seen = Math.min(moved, 5.0);
                for (let i = 1; i < 160; i++) {
                  const back = (i / 160) * seen * 1.25;
                  if (moved <= 0 || back > Math.PI - angle) break;
                  add(Math.cos(angle + back) * R, Math.sin(angle + back) * R, 0, 0.1, rgb(NEG), 0.75 * (1 - i / 160));
                }
                if (moved > 0.3) {
                  // its motion (along the path) and the force (always toward the centre)
                  drawArrow(add, px, py, 0, Math.sin(angle), -Math.cos(angle), 0, 1.5, '#d7e6ff', start, 0.1);
                  drawArrow(add, px, py, 0, -px, -py, 0, 1.4, CURRENT, at(frame, 10.4), 0.12);
                }
              } else {
                drawGapField(add, frame);
                if (!loop) {
                  drawZWire(add, 0, -1.2 + 2.2 * kick, -3, 3, frame, 1, at(frame, 29.4));
                  drawArrow(add, 0, -0.9 + 2.2 * kick, 0, 0, 1, 0, 1.4, CURRENT, at(frame, 34.4), 0.12);
                } else drawLoop(add, loopAngle, frame, at(frame, 43.2), at(frame, 47.2));
              }
            }}
          />
        </AbsoluteFill>
      }
    >
      <Cap opacity={span(frame, T(0.2), T(4.4))} kicker="A charge standing still" title="The magnetic field does not push on it at all" />
      <Cap opacity={span(frame, T(4.6), T(9.6))} kicker="It acts only on a charge that is moving" title="And the force is strange" />
      <Cap opacity={span(frame, T(9.9), T(16.0))} kicker="Neither along the field nor along the motion" title="The force is at right angles to both" />
      <Cap opacity={span(frame, T(16.3), T(23.5))} kicker="Always sideways" title="It cannot speed the charge up or slow it down, only turn it" />
      <Cap opacity={span(frame, T(23.8), T(28.5), 8)} kicker="So across a magnetic field" title="a moving charge travels in a circle" />
      <Panel opacity={span(frame, T(10.6), T(28.5), 8)} style={{ right: 110, top: 70 }}>
        <Formula parts={[['F', CURRENT], ['=', C.dim], ['q', NEG], ['v', '#d7e6ff'], ['B', BFIELD]]} />
        <div style={{ fontSize: 30, fontWeight: 300, color: C.dim, marginTop: 6 }}>charge × speed × field</div>
      </Panel>
      <Panel opacity={span(frame, T(0.6), T(28.5), 8)} style={{ left: 110, top: 80 }}>
        <div style={{ fontSize: 30, fontWeight: 300, color: BFIELD }}>field pointing away from us</div>
      </Panel>

      <Cap opacity={span(frame, T(29.0), T(32.3))} kicker="A current is nothing but charges in motion" title="So a wire across a field feels the same force" />
      <Cap opacity={span(frame, T(32.6), T(42.8))} kicker="The wire is pushed sideways" title="Force = field × current × length of wire in the field" />
      <Panel opacity={span(frame, T(37.4), T(42.8), 8)} style={{ right: 110, top: 70 }}>
        <Formula parts={[['F', CURRENT], ['=', C.dim], ['B', BFIELD], ['I', CURRENT], ['L', C.shape]]} />
      </Panel>
      <Cap opacity={span(frame, T(43.1), T(46.8))} kicker="A loop of wire in the field" title="Pass a current through it" />
      <Cap opacity={span(frame, T(47.0), T(51.2))} kicker="One side is pushed up, the other down" title="and the loop turns" />
      <Cap opacity={span(frame, T(51.4), T(56), 8)} kicker="You are looking at" title="an electric motor" />
      <Timeline frame={frame} already={[0, 1, 2, 3, 4, 5, 6, 7, 9, 10]} />
    </Shell>
  );
};
