import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/induction/ch6.json';
import { ramp, span } from '../../anim';
import { Panel } from '../../ui/hud';
import { Shell, T, chapterFrames } from '../../ui/Shell';
import { Meter } from '../../ui/type';
import { BFIELD, CURRENT } from '../../world/magnet';
import { Stage3D } from '../../world/Stage3D';
import { drawGapField, drawLoop, drawPoleFaces } from '../magnetism/gap';
import { at, Cap, orbit, Timeline, VOICE, VOLT } from './kit';

// Chapter 6 - The generator: a loop turning in a field, and why the mains is a sine wave.
export const I6_FRAMES = chapterFrames(voice.duration);
// the loop's angle: a steady turn, speeding up late in the chapter
export const turnAngle = (frame: number) => {
  const slow = Math.max(0, frame - T(1.8)) * 0.03;
  const fast = Math.max(0, frame - T(63.4)) * 0.09 * ramp(frame, T(63.4), T(66.0));
  return slow + fast;
};

export const Graph = ({ frame, opacity, angleAt }: { frame: number; opacity: number; angleAt: (f: number) => number }) => {
  if (opacity <= 0.01) return null;
  const W = 760;
  const path = (fn: (a: number) => number, y0: number) => {
    let d = '';
    for (let i = 0; i <= 190; i++) {
      const f = frame - (190 - i) * 2;
      d += `${i === 0 ? 'M' : 'L'} ${(i / 190) * W} ${(y0 - 62 * fn(angleAt(f))).toFixed(1)} `;
    }
    return d;
  };
  return (
    <svg viewBox="0 0 800 330" width={800} height={330} style={{ position: 'absolute', right: 90, top: 60, opacity }}>
      <path d={`M 0 80 H ${W} M 0 245 H ${W}`} stroke="#d7e6ff" strokeOpacity={0.25} strokeWidth={2} />
      <path d={path(Math.sin, 80)} fill="none" stroke={BFIELD} strokeWidth={4} style={{ filter: `drop-shadow(0 0 6px ${BFIELD})` }} />
      <path d={path(Math.cos, 245)} fill="none" stroke={VOLT} strokeWidth={4} style={{ filter: `drop-shadow(0 0 6px ${VOLT})` }} />
      <circle cx={W} cy={80 - 62 * Math.sin(angleAt(frame))} r={9} fill={BFIELD} />
      <circle cx={W} cy={245 - 62 * Math.cos(angleAt(frame))} r={9} fill={VOLT} />
      <text x={0} y={16} fill={BFIELD} fontFamily="Sora" fontSize={22}>
        flux through the loop
      </text>
      <text x={0} y={182} fill={VOLT} fontFamily="Sora" fontSize={22}>
        voltage
      </text>
    </svg>
  );
};

export const I6 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const angle = turnAngle(frame);
  const v = Math.cos(angle);

  return (
    <Shell
      voice={VOICE(6)}
      frames={I6_FRAMES}
      world={
        <AbsoluteFill>
          <Stage3D
            width={width}
            height={height}
            pose={{ ...orbit(frame, 21, 3.4, 4), target: [0.5, -0.3, 0] }}
            orbs={(add) => drawPoleFaces(add)}
            glows={(add) => {
              drawGapField(add, frame);
              drawLoop(add, angle, frame * (v >= 0 ? 1 : -1), 0.4 + 0.6 * Math.abs(v), 0);
            }}
          />
        </AbsoluteFill>
      }
    >
      <Graph frame={frame} opacity={at(frame, 6.3)} angleAt={turnAngle} />
      <Cap opacity={span(frame, T(0.2), T(6.1))} kicker="Now make it practical" title="Spin a loop of wire steadily in a magnetic field" />
      <Cap opacity={span(frame, T(6.3), T(14.4))} kicker="As the loop turns, the flux through it rises and falls" title="Facing the field squarely, the flux is greatest" />
      <Cap opacity={span(frame, T(14.6), T(22.8))} kicker="A quarter turn later it is edge-on: no flux" title="Another quarter, and the field passes through from the other side" />
      <Cap opacity={span(frame, T(23.1), T(29.6))} kicker="But remember" title="The voltage depends on how fast the flux is changing, not how large it is" />
      <Cap opacity={span(frame, T(30.1), T(38.3))} kicker="Face-on: the flux is at its peak, and hardly changing" title="So the voltage is zero" />
      <Cap opacity={span(frame, T(38.7), T(47.2))} kicker="Edge-on: the flux is changing as fast as it ever does" title="So the voltage is at its greatest" />
      <Cap opacity={span(frame, T(47.6), T(56.2))} kicker="One way, then the other, once every turn" title="That is alternating current" />
      <Cap opacity={span(frame, T(56.7), T(63.2))} kicker="The mains is a sine wave for one simple reason" title="It is made by something going round" />
      <Cap opacity={span(frame, T(63.4), T(71.2))} kicker="Spin the loop fifty times a second" title="Fifty cycles a second: the frequency of the grid" />
      <Panel opacity={span(frame, T(64.6), T(71.2))} style={{ left: 110, top: 70 }}>
        <Meter label="Frequency" value="50" unit="Hz" color={CURRENT} size={110} />
      </Panel>
      <Cap opacity={span(frame, T(71.4), T(83.2))} kicker="Paris · 1832 · Hippolyte Pixii" title="The first machine of this kind, turned by hand" />
      <Cap opacity={span(frame, T(83.4), T(120))} kicker="A power-station generator works in exactly the same way" title="It is simply larger, by a factor of about a hundred million" />
      <Timeline frame={frame} already={[0, 2]} events={[[1, 75.0]]} />
    </Shell>
  );
};
