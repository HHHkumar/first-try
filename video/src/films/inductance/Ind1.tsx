import { useCurrentFrame } from 'remotion';
import voice from '../../../public/voice/inductance/ch1.json';
import { ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../../ui/Shell';
import { Big, Center, Kicker } from '../../ui/type';
import { CURRENT } from '../../world/magnet';
import { at, Cap, Ink, InkCoil, Spark, Timeline, VOICE } from './kit';

// Chapter 1 - The spark at the switch: Joseph Henry, 1832.
export const IND1_FRAMES = chapterFrames(voice.duration);

export const Ind1 = () => {
  const frame = useCurrentFrame();
  const bench = span(frame, T(-1), T(33.4), 12);
  const coil = frame >= T(17.6);
  const swap = 1 - span(frame, T(17.2), T(18.0), 6) * 0.9;
  const open = Math.max(ramp(frame, T(15.0), T(15.4)) * (1 - ramp(frame, T(17.0), T(17.5))), ramp(frame, T(22.2), T(22.5)));
  const spark = coil ? span(frame, T(22.3), T(25.0), 3) * (0.55 + 0.45 * Math.sin(frame * 2.3) ** 2) : 0;
  const live = open < 0.5 && frame > T(9.0);
  const wire = live ? CURRENT : '#d7e6ff';
  const final = ramp(frame, T(33.4), T(34.2));

  return (
    <Shell voice={VOICE(1)} frames={IND1_FRAMES}>
      <Scene opacity={bench}>
        <Ink color={wire} opacity={swap}>
          {/* battery, top wire with a switch, the load on the right, and the return */}
          <path d="M 560 480 V 330 H 900 M 1000 330 H 1400 V 400 M 1400 700 V 780 H 560 V 600" />
          <path d="M 500 480 H 620 M 530 520 H 590 M 500 560 H 620 M 530 600 H 590" strokeWidth={6} />
          <path d={`M 900 330 L ${900 + 100 * Math.cos(open * 0.7)} ${330 - 100 * Math.sin(open * 0.7)}`} strokeWidth={6} />
          <circle cx={900} cy={330} r={7} fill={wire} />
          <circle cx={1000} cy={330} r={7} fill={wire} />
          {coil ? <InkCoil x={1400} y0={400} y1={700} /> : <path d="M 1400 400 V 700" />}
        </Ink>
        <Spark x={985} y={300} frame={frame} opacity={spark} />
        <Panel opacity={at(frame, 8.8)} style={{ left: 250, top: 500 }}>
          <div style={{ fontSize: 30, fontWeight: 300, color: C.dim, width: 220 }}>a small battery</div>
        </Panel>
        <Panel opacity={at(frame, 12.6) * swap} style={{ left: 1520, top: 520 }}>
          <div style={{ fontSize: 34, fontWeight: 300, color: coil ? CURRENT : C.dim }}>{coil ? 'a long wire, wound into a coil' : 'a short wire'}</div>
        </Panel>
        <Cap opacity={span(frame, T(0.2), T(8.4))} kicker="Albany, New York · 1832" title="Joseph Henry notices something odd on his bench" />
        <Cap opacity={span(frame, T(8.7), T(17.2))} kicker="A short wire" title="Break the circuit, and nothing happens" />
        <Cap opacity={span(frame, T(17.6), T(25.0))} kicker="A long wire, wound into a coil" title="Break the circuit, and a bright spark jumps the gap" />
        <Cap opacity={span(frame, T(25.2), T(33.4))} kicker="The battery had not changed" title="Something in the coil refuses to let the current stop" />
      </Scene>
      <Center opacity={final}>
        <Kicker style={{ marginBottom: 24 }}>That something is</Kicker>
        <Big size={170} style={{ textShadow: `0 0 80px ${CURRENT}55` }}>
          Inductance
        </Big>
        <div style={{ fontSize: 56, fontWeight: 300, marginTop: 40, display: 'flex', gap: 60, justifyContent: 'center', color: C.dim }}>
          {[
            ['every motor', 36.6],
            ['every transformer', 37.8],
            ['every power line', 39.2],
          ].map(([w, t]) => (
            <span key={w} style={{ opacity: at(frame, t as number) }}>
              {w}
            </span>
          ))}
        </div>
      </Center>
      <Timeline frame={frame} already={[0]} events={[[1, 0.3]]} />
    </Shell>
  );
};
