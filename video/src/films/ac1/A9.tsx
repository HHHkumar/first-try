import { useCurrentFrame } from 'remotion';
import voice from '../../../public/voice/ac1/ch9.json';
import { lerp, ramp, span } from '../../anim';
import { C } from '../../theme';
import { T, TAIL } from '../../ui/Shell';
import { Big, Center, Kicker, Sub } from '../../ui/type';
import { rgb } from '../../world/Stage3D';
import { AShell, AStage, at, Cap, CYAN, EndCard, gapField, level, loop, phaseColor, PINK, poles, ribbon, SUN, sway, TEAL, Timeline, TIMELINE, WHITE } from '../ac/kit';
import { VOICE } from './A1';
import { GX, RX } from './A3';

// Chapter 9 - Recap, a look ahead, and the closing card.
const END = 5.0;
export const A9_FRAMES = T(voice.duration + END) + TAIL;
const K = 0.86;

export const A9 = () => {
  const frame = useCurrentFrame();
  const angle = frame * 0.045;
  const next = span(frame, T(45.4), T(58.9), 14);
  const second = at(frame, 38.6);

  return (
    <AShell
      voice={VOICE(9)}
      frames={A9_FRAMES}
      world={
        <AStage
          opacity={lerp(1, 0.3, next)}
          pose={{ pos: [3 + sway(frame), 2.4, 27], target: [0.8, -0.7, 0], fov: 34, focus: 27, dof: 0.022 }}
          orbs={(add) => poles(add, GX)}
          scene={(add) => {
            gapField(add, GX, frame);
            loop(add, GX, angle, WHITE, 1, 2.3, phaseColor(angle / 6.283));
            ribbon(add, RX, 13, (x) => Math.sin(angle - (x - RX) * K) * 2.3, (x) => phaseColor((angle - (x - RX) * K) / 6.283), { z: 2 });
            level(add, 2.3, RX, 13, PINK, at(frame, 28.4), 2);
            level(add, 2.3 * 0.7071, RX, 13, SUN, at(frame, 30.7), 2);
            ribbon(add, RX, 13, (x) => Math.sin(angle - 1.2 - (x - RX) * K) * 2.3, () => rgb(CYAN), { z: 2, fill: false, gain: second });
          }}
        />
      }
    >
      <Cap opacity={span(frame, T(1.8), T(10.3))} kicker="Alternating current flows one way and then the other" title="The electrons only shuffle, but the energy still arrives" />
      <Cap opacity={span(frame, T(10.5), T(19.4))} kicker="One complete swing is a cycle" title="Its time is the period; cycles each second, the frequency, in hertz" />
      <Cap opacity={span(frame, T(19.6), T(28.2))} kicker="The shape is a sine wave: it comes from rotation" title="And it is the one shape that coils and capacitors do not distort" />
      <Cap opacity={span(frame, T(28.4), T(38.4))} kicker="The height of the wave is its peak" title="The label gives the RMS value: about 70 % of the peak" />
      <Cap opacity={span(frame, T(38.6), T(45.3))} kicker="Two waves of the same frequency can be in step, or out of step" title="by an angle we call phase" />
      <Center opacity={next}>
        <Kicker style={{ marginBottom: 22, color: TEAL }}>Next time: a resistor, a coil and a capacitor on an alternating supply</Kicker>
        <Big size={150} style={{ textShadow: `0 0 80px ${PINK}66` }}>
          <span style={{ color: PINK }}>Out</span> of <span style={{ color: CYAN }}>step</span>
        </Big>
        <Sub style={{ opacity: at(frame, 53.4), color: C.text }}>in two of the three, the current refuses to keep time with the voltage</Sub>
      </Center>
      <Timeline frame={frame} already={TIMELINE.map((_, i) => i)} opacity={1 - ramp(frame, T(58.6), T(59.2))} />
      <EndCard frame={frame} from={59.0} />
    </AShell>
  );
};
