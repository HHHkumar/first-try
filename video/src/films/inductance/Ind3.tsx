import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/inductance/ch3.json';
import { ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../../ui/Shell';
import { Big, Center, Kicker, Meter, Sub } from '../../ui/type';
import { drawArrow } from '../../world/field';
import { BFIELD, CURRENT } from '../../world/magnet';
import { Stage3D } from '../../world/Stage3D';
import { at, Cap, coilPose, drawCoilField, drawTurns, shot, Timeline, useCoil, VOICE, VOLT } from './kit';

// Chapter 3 - The coil pushes back: Faraday's finding and Lenz's rule.
export const IND3_FRAMES = chapterFrames(voice.duration);

export const Ind3 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const coil = useCoil();
  const faraday = span(frame, T(-1), T(18.3), 12);
  const world = shot(frame, 18.2, 47.6);
  const final = ramp(frame, T(47.3), T(48.0));
  // the current: steady, a small wobble, then a rise, then a fall
  const rise = ramp(frame, T(38.2), T(42.0), Easing.inOut(Easing.quad));
  const fall = ramp(frame, T(42.6), T(47.0), Easing.inOut(Easing.quad));
  const wobble = frame < T(30) ? 0.12 * Math.sin((frame - T(21.2)) * 0.08) * ramp(frame, T(21.2), T(22.2)) : 0;
  const current = 0.5 + wobble + 0.5 * rise - 0.7 * fall;
  const rising = frame >= T(38.2) && frame < T(42.2);
  const falling = frame >= T(42.6) && frame < T(47.2);
  const changing = frame < T(30) ? Math.cos((frame - T(21.2)) * 0.08) * ramp(frame, T(21.2), T(22.2)) : rising ? 1 : falling ? -1 : 0;

  return (
    <Shell
      voice={VOICE(3)}
      frames={IND3_FRAMES}
      world={
        world > 0 ? (
          <AbsoluteFill style={{ opacity: world }}>
            <Stage3D
              width={width}
              height={height}
              pose={coilPose(frame)}
              glows={(add) => {
                drawTurns(add, coil, frame * 0.8 * current, current);
                drawCoilField(add, coil, frame, current);
                // the current through the coil, and the coil's own voltage against any change
                drawArrow(add, -1.2, -2.0, 1.2, 1, 0, 0, 2.4 * current + 0.6, CURRENT, 1, 0.13);
                const v = Math.abs(changing);
                if (v > 0.05) drawArrow(add, changing > 0 ? 1.4 : -1.4, 2.6, 0, changing > 0 ? -1 : 1, 0, 0, 2.8 * v, VOLT, at(frame, 24.6), 0.15);
              }}
            />
          </AbsoluteFill>
        ) : null
      }
    >
      <Scene opacity={faraday}>
        <Panel opacity={1} style={{ left: 0, right: 0, top: 200, textAlign: 'center' }}>
          <Kicker>How does the circuit feel that extra work? Through a voltage</Kicker>
          <div style={{ opacity: at(frame, 4.6) }}>
            <div style={{ fontSize: 60, fontWeight: 300, color: C.dim, marginTop: 60 }}>1831 · Michael Faraday</div>
            <Big size={92} style={{ marginTop: 20 }}>
              A changing <span style={{ color: BFIELD }}>magnetic field</span>
            </Big>
            <Big size={92} style={{ opacity: at(frame, 9.0) }}>
              produces a <span style={{ color: VOLT }}>voltage</span>
            </Big>
          </div>
          <Sub style={{ opacity: at(frame, 13.2), marginTop: 30 }}>that discovery gets a video of its own; here we need one consequence</Sub>
        </Panel>
      </Scene>

      <Panel opacity={span(frame, T(20.0), T(47.3))} style={{ right: 110, top: 70, display: 'flex', gap: 56 }}>
        <Meter label="Current" value={`${Math.round(current * 100)} %`} color={CURRENT} size={84} />
        <Meter label="Voltage across the coil" value={Math.abs(changing) < 0.05 ? 'none' : changing > 0 ? 'against' : 'onward'} color={VOLT} size={84} />
      </Panel>
      <Cap opacity={span(frame, T(18.6), T(27.9))} kicker="A coil sits in its own field" title="When its current changes, a voltage appears across the coil itself" />
      <Cap opacity={span(frame, T(28.1), T(37.9))} kicker="1834 · Heinrich Lenz" title="It always opposes the change that caused it" />
      <Cap opacity={span(frame, T(38.2), T(42.3))} kicker="Try to raise the current" title="and the coil pushes back against the rise" />
      <Cap opacity={span(frame, T(42.5), T(47.3))} kicker="Try to reduce the current" title="and the coil pushes it forward, to keep it going" />
      <Center opacity={final}>
        <Big size={100} style={{ color: C.dim }}>
          A coil does not resist current.
        </Big>
        <Big size={100} style={{ marginTop: 16, opacity: at(frame, 49.7) }}>
          It resists a <span style={{ color: VOLT }}>change</span> in current.
        </Big>
      </Center>
      <Timeline frame={frame} already={[1]} events={[[0, 4.6], [2, 30.4]]} />
    </Shell>
  );
};
