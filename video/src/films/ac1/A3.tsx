import { useCurrentFrame } from 'remotion';
import voice from '../../../public/voice/ac1/ch3.json';
import { span } from '../../anim';
import { Panel } from '../../ui/hud';
import { T, chapterFrames } from '../../ui/Shell';
import { Meter } from '../../ui/type';
import { rgb } from '../../world/Stage3D';
import { AShell, AStage, at, Cap, gapField, level, loop, phaseColor, PINK, poles, ribbon, SUN, sway, TEAL, Timeline, WHITE } from '../ac/kit';
import { VOICE } from './A1';

// Chapter 3 - Reading the wave: the turning loop draws it; cycle, period, frequency.
export const A3_FRAMES = chapterFrames(voice.duration);
export const GX = -7.5; // centre of the generator
export const RX = 0.4; // where the ribbon begins
const W = 0.045; // the loop's turn, radians a frame
const K = 0.86; // how tightly the wave is wound along the ribbon
export const turn = (frame: number) => Math.max(0, frame - T(4.0)) * W;

export const A3 = () => {
  const frame = useCurrentFrame();
  const angle = turn(frame);
  const drawn = Math.min(13, Math.max(0, frame - T(4.0)) * 0.05);
  const cycle = span(frame, T(32.5), T(47.2), 12);
  const lam = (2 * Math.PI) / K;

  return (
    <AShell
      voice={VOICE(3)}
      frames={A3_FRAMES}
      world={
        <AStage
          pose={{ pos: [3 + sway(frame), 2.4, 27], target: [0.8, -0.7, 0], fov: 34, focus: 27, dof: 0.022 }}
          orbs={(add) => poles(add, GX)}
          scene={(add) => {
            gapField(add, GX, frame);
            loop(add, GX, angle, WHITE, 1, 2.3, phaseColor(angle / 6.283));
            // the bright point on the loop hands its height to the ribbon, which unrolls to the right
            const y0 = Math.sin(angle) * 2.3;
            for (let i = 0; i < 60; i++) add(GX + Math.cos(angle) * 2.3 + ((RX - GX - Math.cos(angle) * 2.3) * i) / 60, y0, 2, 0.07, rgb(WHITE), 0.45);
            ribbon(add, RX, RX + drawn, (x) => Math.sin(angle - (x - RX) * K) * 2.3, (x) => phaseColor((angle - (x - RX) * K) / 6.283), { z: 2 });
            // one whole cycle, marked out
            if (cycle > 0.01) for (const x of [RX + 1.2, RX + 1.2 + lam]) for (let y = -2.8; y <= 2.8; y += 0.1) add(x, y, 2, 0.1, rgb(SUN), cycle);
            level(add, 3.0, RX + 1.2, RX + 1.2 + lam, SUN, cycle, 2);
          }}
        />
      }
    >
      <Panel opacity={span(frame, T(32.5), T(90))} style={{ right: 110, top: 60, display: 'flex', gap: 50 }}>
        <Meter label="One cycle" value="one turn" color={SUN} size={66} />
        <div style={{ opacity: at(frame, 40.7) }}>
          <Meter label="Period" value={frame < T(61.4) ? 'time for one cycle' : '20'} unit={frame < T(61.4) ? undefined : 'ms'} color={PINK} size={66} />
        </div>
        <div style={{ opacity: at(frame, 43.7) }}>
          <Meter label="Frequency" value={frame < T(57.6) ? 'cycles each second' : '50'} unit={frame < T(57.6) ? undefined : 'Hz'} color={TEAL} size={66} />
        </div>
      </Panel>
      <Cap opacity={span(frame, T(0.2), T(7.2))} kicker="To talk about alternating current, we draw it" title="Time runs along, and the voltage goes up and down" />
      <Cap opacity={span(frame, T(7.6), T(17.4))} kicker="You already know where this shape comes from" title="A loop of wire turning in a magnetic field" />
      <Cap opacity={span(frame, T(17.6), T(25.5))} kicker="As it turns" title="A peak, through zero, a peak the other way, and back" />
      <Cap opacity={span(frame, T(25.7), T(32.3))} kicker="Watch one point on the loop, and plot its height as time goes by" title="Out comes the wave" />
      <Cap opacity={span(frame, T(32.5), T(38.8))} kicker="One complete turn draws one complete wave" title="We call that one cycle" />
      <Cap opacity={span(frame, T(39.0), T(47.3))} kicker="The time for one cycle is the period" title="The number of cycles in one second is the frequency" />
      <Cap opacity={span(frame, T(47.5), T(57.2))} kicker="The unit: the hertz, after Heinrich Hertz" title="One hertz is one cycle each second" />
      <Cap opacity={span(frame, T(57.6), T(68.1))} kicker="Mains frequency in most of the world: fifty hertz" title="Each cycle lasts one fiftieth of a second: twenty thousandths" />
      <Cap opacity={span(frame, T(68.3), T(74.2))} kicker="Two changes of direction in each cycle" title="So the current reverses a hundred times a second" />
      <Cap opacity={span(frame, T(74.6), T(90))} kicker="Period and frequency say the same thing" title="Divide one into one, and you get the other" />
      <Timeline frame={frame} already={[]} events={[[0, 14.0]]} />
    </AShell>
  );
};
