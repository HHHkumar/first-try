import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/inductance/ch5.json';
import { ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Shell, T, chapterFrames } from '../../ui/Shell';
import { Frac, Meter, Sym } from '../../ui/type';
import { BFIELD, CURRENT, drawRings, drawWire } from '../../world/magnet';
import { Stage3D } from '../../world/Stage3D';
import type { CameraPose } from '../../world/WireWorld';
import { at, Cap, coilPose, drawCoilField, drawCore, drawTurns, shot, Timeline, useCoil, VOICE } from './kit';

// Chapter 5 - What sets it: turns squared, area, length, and the core.
export const IND5_FRAMES = chapterFrames(voice.duration);

export const Ind5 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const few = useCoil(6, 3.2, 1.3);
  const many = useCoil(12, 3.2, 1.3);
  const wide = useCoil(12, 3.2, 1.84);
  const long = useCoil(12, 6.4, 1.84);
  const stage = frame < T(8.6) ? 0 : frame < T(27.0) ? 1 : frame < T(32.6) ? 2 : 3;
  const coil = [few, many, wide, long][stage];
  const vis = Math.max(shot(frame, -1, 8.7), shot(frame, 8.5, 27.1), shot(frame, 26.9, 32.7), shot(frame, 32.5, 50.3));
  const sWire = shot(frame, 50.1, 80);
  const straight = frame >= T(50.2);
  const core = ramp(frame, T(41.6), T(43.6), Easing.out(Easing.cubic));
  const four = ramp(frame, T(21.3), T(22.4));
  const L = stage === 0 ? 1 : stage === 1 ? 1 + 3 * four : stage === 2 ? 8 : 4 * (1 + 999 * ramp(frame, T(45.0), T(48.6)));
  const wirePose: CameraPose = { pos: [7 + Math.sin(frame * 0.003) * 1.5, 4.2, 12], target: [0, 0, 0], fov: 34, focus: 14, dof: 0.05 };
  const term = (t: number) => ({ opacity: 0.25 + 0.75 * at(frame, t) });

  return (
    <Shell
      voice={VOICE(5)}
      frames={IND5_FRAMES}
      world={
        <AbsoluteFill style={{ opacity: Math.max(vis, sWire) }}>
          <Stage3D
            width={width}
            height={height}
            pose={straight ? wirePose : coilPose(frame, 15)}
            deep={core > 0 && !straight ? [0.1, 0.11, 0.14] : undefined}
            orbs={(add) => {
              if (!straight && stage === 3) drawCore(add, 6.4, core);
            }}
            glows={(add) => {
              if (straight) {
                drawWire(add, 0, 0, -9, 9, frame, 1);
                drawRings(add, 0, 0, [-5, -2.5, 0, 2.5, 5], [1.2, 2.2], frame, 1, 0.8);
              } else {
                drawTurns(add, coil, frame * 0.8, 1);
                drawCoilField(add, coil, frame, 0.75, 1 + 1.3 * core);
              }
            }}
          />
        </AbsoluteFill>
      }
    >
      <Panel opacity={span(frame, T(6.2), T(50.2))} style={{ right: 110, top: 70 }}>
        <Meter label="Inductance" value={`× ${L < 10 ? L.toFixed(L % 1 ? 1 : 0) : Math.round(L).toLocaleString('en-US')}`} color={CURRENT} size={96} align="right" />
      </Panel>
      <Panel opacity={span(frame, T(23.4), T(50.2))} style={{ left: 110, top: 70 }}>
        <div style={{ fontSize: 112, display: 'flex', alignItems: 'center', gap: 24 }}>
          <Sym>L</Sym>
          <Sym color={C.dim} style={{ fontStyle: 'normal' }}>
            =
          </Sym>
          <span style={term(41.6)}>
            <Sym color={BFIELD}>μ</Sym>
          </span>
          <Frac
            width={230}
            top={
              <span>
                <Sym color={CURRENT}>
                  N<sup style={{ fontSize: '0.5em', fontStyle: 'normal' }}>2</sup>
                </Sym>{' '}
                <span style={term(27.0)}>
                  <Sym color={C.shape}>A</Sym>
                </span>
              </span>
            }
            bottom={
              <span style={term(32.6)}>
                <Sym color={C.shape}>l</Sym>
              </span>
            }
          />
        </div>
      </Panel>
      <Cap opacity={span(frame, T(0.2), T(5.8))} kicker="What decides the inductance of a coil?" title="Only its shape, and what it is wound on" />
      <Cap opacity={span(frame, T(6.2), T(12.2))} kicker="The number of turns" title="Double the turns: the same current makes twice the field" />
      <Cap opacity={span(frame, T(12.5), T(21.0))} kicker="And that field passes through twice as many turns" title="each one adding its own voltage" />
      <Cap opacity={span(frame, T(21.3), T(26.7))} kicker="Not double: four times" title="Inductance grows with the square of the turns" />
      <Cap opacity={span(frame, T(27.0), T(32.2))} kicker="A wider coil encloses more field" title="Inductance grows with the area" />
      <Cap opacity={span(frame, T(32.6), T(39.4))} kicker="A longer coil, same turns spread out" title="A weaker field: inductance falls with the length" />
      <Cap opacity={span(frame, T(39.7), T(50.0))} kicker="And then the core" title="Iron multiplies the field, and the inductance with it" />
      <Cap opacity={span(frame, T(50.4), T(59.2))} kicker="Any wire carrying current has a field around it" title="So every wire has some inductance, even a straight one" />
      <Cap opacity={span(frame, T(59.5), T(70))} kicker="Usually tiny: about a millionth of a henry per metre" title="At high frequencies, or on a long power line, it matters a great deal" />
      <Timeline frame={frame} already={[0, 1, 2, 4, 5]} />
    </Shell>
  );
};
