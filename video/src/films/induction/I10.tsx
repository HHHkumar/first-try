import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/induction/ch10.json';
import { lerp, ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Shell, T, TAIL } from '../../ui/Shell';
import { Kicker } from '../../ui/type';
import { BFIELD, CURRENT } from '../../world/magnet';
import { Stage3D } from '../../world/Stage3D';
import { drawGapField, drawLoop, drawPoleFaces } from '../magnetism/gap';
import { drawTransformer } from './I7';
import { at, Cap, EndCard, GOLD, orbit, shot, Timeline, TIMELINE, VOICE, VOLT } from './kit';

// Chapter 10 - Recap of the video and of the whole series, and the closing card.
const END = 5.0;
export const I10_FRAMES = T(voice.duration + END) + TAIL;
const SERIES: [string, string, number, string][] = [
  ['Charge', 'and the electric field around it', 35.0, C.field],
  ['Resistance', 'charge struggling through a wire', 37.8, C.ion],
  ['Capacitance', 'energy stored in an electric field', 41.2, GOLD],
  ['Magnetism', 'the field of charge in motion', 44.7, BFIELD],
  ['Inductance', 'energy stored in a magnetic field', 47.8, CURRENT],
  ['The two fields', 'bound together as one', 51.3, C.electron],
  ['Induction', 'motion into electricity', 54.2, VOLT],
];

export const I10 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const trafo = frame >= T(27.6);
  const vis = Math.max(shot(frame, -1, 27.7), shot(frame, 27.5, 120));
  const series = span(frame, T(31.8), T(65.2), 14);
  const angle = frame * 0.035;

  return (
    <Shell
      voice={VOICE(10)}
      frames={I10_FRAMES}
      fadeOut
      world={
        <AbsoluteFill style={{ opacity: vis * lerp(1, 0.22, series) }}>
          <Stage3D
            width={width}
            height={height}
            pose={trafo ? { ...orbit(frame, 16, 2.4, 3.5), target: [0.4, 0.5, 0] } : { ...orbit(frame, 21, 3.4, 4), target: [0.5, -0.3, 0] }}
            deep={trafo ? [0.1, 0.11, 0.14] : undefined}
            orbs={(add) => (trafo ? drawTransformer(add, null, frame, 14) : drawPoleFaces(add))}
            glows={(add) => {
              if (trafo) drawTransformer(null, add, frame, 14);
              else {
                drawGapField(add, frame);
                drawLoop(add, angle, frame * (Math.cos(angle) >= 0 ? 1 : -1), 0.4 + 0.6 * Math.abs(Math.cos(angle)), 0);
              }
            }}
          />
        </AbsoluteFill>
      }
    >
      <Cap opacity={span(frame, T(1.7), T(5.6))} kicker="Magnetic flux" title="The amount of field passing through a loop" />
      <Cap opacity={span(frame, T(5.8), T(14.5))} kicker="Faraday’s law" title="A changing flux induces a voltage: turns × rate of change" />
      <Cap opacity={span(frame, T(14.8), T(22.3))} kicker="Lenz’s law: the conservation of energy" title="The induced current always opposes the change" />
      <Cap opacity={span(frame, T(22.6), T(27.5))} kicker="Spin a coil in a field" title="A generator, and alternating current" />
      <Cap opacity={span(frame, T(27.7), T(31.6))} kicker="Link two coils with a changing flux" title="A transformer" />

      <Panel opacity={series} style={{ left: 0, right: 0, top: 120, textAlign: 'center' }}>
        <Kicker>The picture we set out to draw</Kicker>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '34px 60px', marginTop: 50, padding: '0 160px' }}>
          {SERIES.map(([name, what, t, color]) => (
            <div key={name} style={{ width: 430, opacity: at(frame, t), textAlign: 'center' }}>
              <div style={{ fontSize: 66, fontWeight: 300, letterSpacing: -2, color }}>{name}</div>
              <div style={{ fontSize: 27, fontWeight: 300, color: C.dim, marginTop: 2 }}>{what}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 44, fontWeight: 300, marginTop: 60, opacity: at(frame, 59.6) }}>Every circuit you will ever meet is built from these ideas</div>
      </Panel>
      <Timeline frame={frame} already={TIMELINE.map((_, i) => i)} opacity={1 - ramp(frame, T(31.4), T(32.0))} />
      <EndCard frame={frame} from={65.2} />
    </Shell>
  );
};
