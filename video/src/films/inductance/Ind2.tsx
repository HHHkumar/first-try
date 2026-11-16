import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/inductance/ch2.json';
import { ramp, span } from '../../anim';
import { Panel } from '../../ui/hud';
import { Shell, T, chapterFrames } from '../../ui/Shell';
import { Meter } from '../../ui/type';
import { BFIELD, CURRENT } from '../../world/magnet';
import { Stage3D } from '../../world/Stage3D';
import { Cap, coilPose, drawCoilField, drawTurns, GOLD, Timeline, useCoil, VOICE } from './kit';

// Chapter 2 - A field takes energy to build.
export const IND2_FRAMES = chapterFrames(voice.duration);

export const Ind2 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const coil = useCoil();
  // the current of the last film; then off, and switched on again slowly
  const off = ramp(frame, T(6.4), T(7.4));
  const on = ramp(frame, T(10.2), T(21.0), Easing.out(Easing.quad));
  const current = frame < T(8.5) ? 1 - off : on;
  const flow = frame < T(8.5) ? frame * 0.8 : (frame - T(10.2)) * 0.8 * on;

  return (
    <Shell
      voice={VOICE(2)}
      frames={IND2_FRAMES}
      world={
        <AbsoluteFill>
          <Stage3D
            width={width}
            height={height}
            pose={coilPose(frame)}
            glows={(add) => {
              drawTurns(add, coil, flow, current);
              drawCoilField(add, coil, frame, current, 1, frame < T(8.5) ? 1 : 0.15 + 0.85 * on);
            }}
          />
        </AbsoluteFill>
      }
    >
      <Panel opacity={span(frame, T(9.6), T(46))} style={{ right: 110, top: 70, display: 'flex', gap: 56 }}>
        <Meter label="Current" value={`${Math.round(current * 100)} %`} color={CURRENT} size={84} />
        <Meter label="Energy in the field" value={`${Math.round(current * current * 100)} %`} color={GOLD} size={84} />
      </Panel>
      <Cap opacity={span(frame, T(0.2), T(6.2))} kicker="Last time" title="A current makes a magnetic field, and a coil concentrates it" />
      <Cap opacity={span(frame, T(6.5), T(15.4))} kicker="The moment the current starts" title="The field is not there, and then it is. It has to be built" />
      <Cap opacity={span(frame, T(15.6), T(26.4))} kicker="Like the electric field in a capacitor" title={<span>A magnetic field holds <span style={{ color: GOLD }}>energy</span>, and it comes from the circuit</span> as unknown as string} />
      <Cap opacity={span(frame, T(26.6), T(34.6))} kicker="While the field is being built" title="the circuit has to do extra work" />
      <Cap opacity={span(frame, T(34.8), T(46))} kicker="Once the current is steady, it costs nothing more" title={<span>The energy sits in the <span style={{ color: BFIELD }}>space in and around the coil</span></span> as unknown as string} />
      <Timeline frame={frame} already={[0, 1]} />
    </Shell>
  );
};
