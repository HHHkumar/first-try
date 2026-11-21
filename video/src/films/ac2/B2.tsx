import { useCurrentFrame } from 'remotion';
import voice from '../../../public/voice/ac2/ch2.json';
import { span } from '../../anim';
import { Panel } from '../../ui/hud';
import { T, chapterFrames } from '../../ui/Shell';
import { Meter } from '../../ui/type';
import { AShell, AStage, at, Cap, CYAN, level, PINK, SUN, sway } from '../ac/kit';
import { cursor, dot, flow, keys, pair, power, resistor, Timeline, VOICE, type Graph } from './kit';

// Chapter 2 - The resistor: voltage and current in step; power always positive.
export const B2_FRAMES = chapterFrames(voice.duration);
export const X0 = -12.5;
export const X1 = 4.6;
export const CX = 9.4;
const PI = Math.PI;
const K = (2 * PI * 2.5) / (X1 - X0);

export const B2 = () => {
  const frame = useCurrentFrame();
  const th = keys(frame, [[0, 0], [8, 0], [14.6, PI / 2], [17.0, PI / 2], [18.4, PI], [20.2, PI], [21.8, 1.5 * PI], [24.0, 1.5 * PI], [62.7, 5 * PI]]);
  const xc = X0 + th / K;
  const g: Graph = { x0: X0, x1: X1, th: (x) => (x - X0) * K, axis: 1.7, amp: 1.6 };
  const gp: Graph = { ...g, axis: -2.4, amp: 0.75 };
  const pw = at(frame, 28.2);
  const v = Math.sin(th);

  return (
    <AShell
      voice={VOICE(2)}
      frames={B2_FRAMES}
      world={
        <AStage
          pose={{ pos: [sway(frame), 2.3, 25], target: [-0.4, -0.6, 0], fov: 34, focus: 25, dof: 0.022 }}
          scene={(add) => {
            pair(add, g, 0, { i: at(frame, 7.8) });
            power(add, gp, 0, pw);
            level(add, gp.axis + gp.amp, X0, X1, SUN, at(frame, 53.4));
            cursor(add, xc, pw > 0.5 ? -2.6 : -0.2, 3.5, at(frame, 7.8));
            dot(add, xc, g.axis + g.amp * v, PINK, at(frame, 7.8));
            dot(add, xc, g.axis + g.amp * 0.72 * v, CYAN, at(frame, 7.8));
            dot(add, xc, gp.axis + gp.amp * 2 * v * v, SUN, pw);
            resistor(add, CX - 0.3, 0.6, v * v, 1, 1.3);
            flow(add, CX - 3.4, CX + 3.4, 0.6, -Math.cos(th) * 0.6, CYAN, 0.85, 0.75);
          }}
        />
      }
    >
      <Panel opacity={span(frame, T(4.1), T(28.0))} style={{ right: 110, top: 60 }}>
        <Meter label="Ohm’s law, at every instant" value="I = V ÷ R" color={CYAN} size={72} align="right" />
      </Panel>
      <Panel opacity={span(frame, T(28.2), T(90))} style={{ right: 110, top: 60, display: 'flex', gap: 56 }}>
        <Meter label="Power" value="V × I" color={SUN} size={72} />
        <div style={{ opacity: at(frame, 53.4) }}>
          <Meter label="Its average" value="V rms × I rms" color={SUN} size={72} />
        </div>
      </Panel>
      <Cap opacity={span(frame, T(0.2), T(3.9))} kicker="Start with the resistor" title="It holds no surprises" />
      <Cap opacity={span(frame, T(4.1), T(13.7))} kicker="A resistor obeys Ohm’s law at every instant" title="The current is the voltage at this moment, divided by the resistance" />
      <Cap opacity={span(frame, T(13.9), T(23.7))} kicker={frame < T(17.3) ? 'Voltage at its peak' : frame < T(20.4) ? 'Voltage zero' : 'Voltage reverses'} title={frame < T(17.3) ? 'So is the current' : frame < T(20.4) ? 'The current is zero' : 'The current reverses with it'} />
      <Cap opacity={span(frame, T(23.9), T(28.0))} kicker="The two waves are in phase" title="They keep perfect step" />
      <Cap opacity={span(frame, T(28.2), T(35.2))} kicker="Now the power: voltage times current" title="Both positive: the power is positive" />
      <Cap opacity={span(frame, T(35.4), T(42.6))} kicker="Both negative: a negative times a negative is positive again" title="So the power never goes below zero" />
      <Cap opacity={span(frame, T(42.8), T(48.2))} kicker="A resistor takes energy on both halves of the cycle" title="and turns all of it into heat" />
      <Cap opacity={span(frame, T(48.4), T(53.2))} kicker="The power does pulse" title="It swells and fades twice in every cycle" />
      <Cap opacity={span(frame, T(53.4), T(90))} kicker="But its average is simple: RMS voltage times RMS current" title="That is exactly what RMS was invented for" />
      <Timeline frame={frame} already={[]} events={[[1, 4.1]]} />
    </AShell>
  );
};
