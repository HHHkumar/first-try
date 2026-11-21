import { Easing, useCurrentFrame } from 'remotion';
import voice from '../../../public/voice/ac1/ch8.json';
import { lerp, ramp, span } from '../../anim';
import { Panel } from '../../ui/hud';
import { T, chapterFrames } from '../../ui/Shell';
import { Meter } from '../../ui/type';
import { rgb } from '../../world/Stage3D';
import { AShell, AStage, at, Cap, CYAN, gapField, loop, PINK, poles, ribbon, shot, SUN, sway, TEAL, Timeline } from '../ac/kit';
import { VOICE } from './A1';
import { GX, RX } from './A3';

// Chapter 8 - In step and out of step: phase, as an angle on the turning shaft.
export const A8_FRAMES = chapterFrames(voice.duration);
const K = 0.86;
const io = Easing.inOut(Easing.quad);

export const A8 = () => {
  const frame = useCurrentFrame();
  const machine = frame >= T(26.4);
  const vis = Math.max(shot(frame, -1, 26.5), shot(frame, 26.3, 150));
  const angle = frame * 0.045;
  // the second wave slips behind: a little, then a quarter turn, then half a turn; then three, evenly spaced
  const lag = lerp(lerp(lerp(0, 0.6, ramp(frame, T(14.6), T(18.0), io)), Math.PI / 2, ramp(frame, T(36.6), T(39.0), io)), Math.PI, ramp(frame, T(41.6), T(44.0), io));
  const three = ramp(frame, T(55.8), T(58.4), io);
  const lag2 = lerp(lag, (2 * Math.PI) / 3, three);
  const deg = Math.round((lag2 * 180) / Math.PI);
  const x0 = machine ? RX : -12;
  const wave = (shift: number) => (x: number) => Math.sin(angle - shift - (x - x0) * (machine ? K : 0.7)) * 2.3;

  return (
    <AShell
      voice={VOICE(8)}
      frames={A8_FRAMES}
      world={
        <AStage
          opacity={vis}
          pose={machine ? { pos: [3 + sway(frame), 2.4, 27], target: [0.8, -0.7, 0], fov: 34, focus: 27, dof: 0.022 } : { pos: [1 + sway(frame), 2.4, 24], target: [0, -0.3, 0], fov: 34, focus: 24, dof: 0.025 }}
          orbs={(add) => {
            if (machine) poles(add, GX);
          }}
          scene={(add) => {
            if (machine) {
              // loops fixed on one shaft at an angle to each other: each draws its own wave
              gapField(add, GX, frame, 0.7);
              loop(add, GX, angle, PINK, 1, 2.3, rgb(PINK));
              loop(add, GX, angle - lag2, CYAN, 1, 2.3, rgb(CYAN));
              loop(add, GX, angle - 2 * lag2, SUN, three, 2.3, rgb(SUN));
            }
            ribbon(add, x0, 13, wave(0), () => rgb(PINK), { z: 2, fill: false, gain: at(frame, 7.3) });
            ribbon(add, x0, 13, wave(lag2), () => rgb(CYAN), { z: 2, fill: false, gain: at(frame, 8.2) });
            ribbon(add, x0, 13, wave(2 * lag2), () => rgb(SUN), { z: 2, fill: false, gain: three });
          }}
        />
      }
    >
      <Panel opacity={span(frame, T(10.0), T(150))} style={{ right: 110, top: 60, display: 'flex', gap: 56 }}>
        <Meter label="The two waves are" value={deg === 0 ? 'in phase' : 'out of phase'} color={deg === 0 ? TEAL : PINK} size={70} />
        <div style={{ opacity: at(frame, 22.0) }}>
          <Meter label="Phase difference" value={`${deg}°`} color={CYAN} size={70} />
        </div>
      </Panel>
      <Cap opacity={span(frame, T(0.2), T(6.9))} kicker="Besides its size and its frequency" title="A sine wave has timing" />
      <Cap opacity={span(frame, T(7.3), T(14.4))} kicker="Two waves of the same frequency, rising and falling together" title="We say they are in phase" />
      <Cap opacity={span(frame, T(14.6), T(21.8))} kicker="One reaches its crest a moment later" title="Then they are out of phase" />
      <Cap opacity={span(frame, T(22.0), T(32.0))} kicker="We measure the gap as a fraction of a turn" title="Two loops on the same shaft, at an angle to each other" />
      <Cap opacity={span(frame, T(32.4), T(41.4))} kicker="Two waves, identical in shape, one lagging by exactly that angle" title="A quarter of a turn is ninety degrees" />
      <Cap opacity={span(frame, T(41.6), T(47.2))} kicker="Half a turn is a hundred and eighty" title="Then one wave is the mirror image of the other" />
      <Cap opacity={span(frame, T(47.6), T(55.6))} kicker="Phase is the key to everything that follows" title="It decides how much power a circuit really takes" />
      <Cap opacity={span(frame, T(55.8), T(150))} kicker="It is the secret of the three-phase system" title="And it starts with the simplest question in AC" />
      <Timeline frame={frame} already={[0, 1, 2, 3, 4]} />
    </AShell>
  );
};
