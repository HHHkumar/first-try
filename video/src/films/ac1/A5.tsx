import { Easing, useCurrentFrame } from 'remotion';
import voice from '../../../public/voice/ac1/ch5.json';
import { lerp, ramp, span } from '../../anim';
import { Panel } from '../../ui/hud';
import { T, chapterFrames } from '../../ui/Shell';
import { Meter } from '../../ui/type';
import { drawArrow } from '../../world/field';
import { AShell, AStage, at, Cap, level, phaseColor, PINK, ribbon, SUN, sway, Timeline } from '../ac/kit';
import { VOICE } from './A1';

// Chapter 5 - How big: the peak, and the surprise that 230 volts is not it.
export const A5_FRAMES = chapterFrames(voice.duration);

export const A5 = () => {
  const frame = useCurrentFrame();
  const run = frame * 0.012;
  // the wave at 230 V mains, then at 120 V mains (drawn smaller)
  const us = ramp(frame, T(26.2), T(27.6), Easing.inOut(Easing.quad));
  const R = lerp(2.6, 1.36, us);
  const rms = R * 0.7071;

  return (
    <AShell
      voice={VOICE(5)}
      frames={A5_FRAMES}
      world={
        <AStage
          pose={{ pos: [1 + sway(frame), 2.4, 24], target: [0, -0.3, 0], fov: 34, focus: 24, dof: 0.025 }}
          scene={(add) => {
            ribbon(add, -12, 12, (x) => Math.sin((x * 0.11 - run) * 6.283) * R, (x) => phaseColor(x * 0.11 - run));
            // the height from zero to the crest
            drawArrow(add, -13, 0, 0, 0, 1, 0, R * at(frame, 1.8), PINK, at(frame, 1.8), 0.14);
            level(add, R, -13, 12, PINK, at(frame, 17.7));
            level(add, rms, -13, 12, SUN, at(frame, 10.2));
          }}
        />
      }
    >
      <Panel opacity={span(frame, T(10.2), T(60))} style={{ right: 110, top: 60, display: 'flex', gap: 56 }}>
        <Meter label={us > 0.5 ? 'Meter, North America' : 'Meter on the wall socket'} value={`${Math.round(lerp(230, 120, us))}`} unit="V" color={SUN} size={96} />
        <div style={{ opacity: at(frame, 21.9) }}>
          <Meter label="The crest of the wave" value={`${Math.round(lerp(325, 170, us))}`} unit="V" color={PINK} size={96} />
        </div>
      </Panel>
      <Cap opacity={span(frame, T(0.2), T(8.3))} kicker="Now for size" title="The height from zero to the crest: the peak value, or amplitude" />
      <Cap opacity={span(frame, T(8.6), T(17.4))} kicker="Here is a surprise" title="A meter on a wall socket reads about 230 volts" />
      <Cap opacity={span(frame, T(17.7), T(26.0))} kicker="But the voltage does not peak at 230" title="Twice in every cycle, it reaches 325" />
      <Cap opacity={span(frame, T(26.2), T(31.9))} kicker="In North America" title="The meter says 120, and the peak is 170" />
      <Cap opacity={span(frame, T(32.1), T(38.6))} kicker="The number printed on every appliance is not the peak" title="It is not the average either" />
      <Cap opacity={span(frame, T(38.9), T(60))} kicker="It is a third thing" title="To understand it, ask what the number is for" />
      <Timeline frame={frame} already={[0]} />
    </AShell>
  );
};
