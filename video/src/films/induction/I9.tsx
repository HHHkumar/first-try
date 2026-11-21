import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/induction/ch9.json';
import { ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Shell, T, chapterFrames } from '../../ui/Shell';
import { Meter } from '../../ui/type';
import { CURRENT, NORTH } from '../../world/magnet';
import { rgb, Stage3D } from '../../world/Stage3D';
import { coilPose, drawCoilField, drawTurns, useCoil } from '../inductance/kit';
import { drawGapField, drawLoop, drawPoleFaces } from '../magnetism/gap';
import { at, Cap, orbit, shot, Timeline, VOICE, VOLT } from './kit';

// Chapter 9 - Motors and back EMF, regeneration, and self-induction.
export const I9_FRAMES = chapterFrames(voice.duration);
const io = Easing.inOut(Easing.quad);
// the motor's speed (0..1): running, spun up from rest, jammed, then slowing as a generator
const speedAt = (f: number) => {
  const up = ramp(f, T(17.0), T(38.0), Easing.out(Easing.quad));
  const jam = ramp(f, T(42.5), T(43.6), io) - ramp(f, T(60.6), T(62.4), io);
  const slow = ramp(f, T(63.4), T(73.6), io) * 0.75;
  const base = f < T(13.6) ? 0.6 : up;
  return Math.max(0, base * (1 - jam) - slow);
};

export const I9 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const coil = useCoil();
  const sMotor = shot(frame, -1, 74.0);
  const sCoil = shot(frame, 73.8, 120);
  const self = frame >= T(73.9);
  let angle = 0.5;
  for (let f = 0; f < frame; f += 2) angle += speedAt(f) * 0.14;
  const speed = speedAt(frame);
  const regen = frame >= T(63.4) && frame < T(73.9);
  const back = speed;
  const current = regen ? -0.4 * speed : frame < T(13.6) ? 0.4 : 1 - 0.88 * back;
  const stalled = frame >= T(43.6) && frame < T(60.6);
  const i2 = 0.55 + 0.45 * Math.sin((frame - T(80.8)) * 0.07);

  return (
    <Shell
      voice={VOICE(9)}
      frames={I9_FRAMES}
      world={
        <AbsoluteFill style={{ opacity: Math.max(sMotor, sCoil) }}>
          <Stage3D
            width={width}
            height={height}
            pose={self ? coilPose(frame) : { ...orbit(frame, 21, 3.4, 4), target: [0.5, -0.3, 0] }}
            orbs={(add) => {
              if (!self) drawPoleFaces(add);
            }}
            glows={(add) => {
              if (!self) {
                drawGapField(add, frame);
                drawLoop(add, angle, frame * (current >= 0 ? 1 : -1), 0.5 + 0.5 * Math.min(1, Math.abs(current) * 2), frame < T(13.6) && frame > T(8.4) ? 0 : Math.min(1, Math.abs(current) * 1.6));
                if (stalled) {
                  // a jammed motor: the windings glow with the heat
                  const hot = at(frame, 49.0);
                  add(Math.cos(angle) * 2.3, Math.sin(angle) * 2.3, 0, 3, rgb(NORTH), 0.4 * hot);
                  add(-Math.cos(angle) * 2.3, -Math.sin(angle) * 2.3, 0, 3, rgb(NORTH), 0.4 * hot);
                }
              } else {
                const cur = frame < T(80.8) ? 1 : i2;
                drawTurns(add, coil, frame * 0.8, cur);
                drawCoilField(add, coil, frame, cur);
              }
            }}
          />
        </AbsoluteFill>
      }
    >
      <Panel opacity={span(frame, T(13.6), T(73.8))} style={{ right: 110, top: 60, display: 'flex', gap: 50 }}>
        <Meter label="Speed" value={`${Math.round(speed * 100)} %`} color={C.text} size={76} />
        <Meter label="Back EMF" value={`${Math.round(back * 100)} %`} color={VOLT} size={76} />
        <Meter label={regen ? 'Current, back to the battery' : 'Current drawn'} value={`${regen ? '−' : '×'} ${Math.abs(current * (regen ? 2.5 : 8.3)).toFixed(1)}`} color={stalled ? NORTH : CURRENT} size={76} />
      </Panel>
      <Cap opacity={span(frame, T(0.2), T(8.3))} kicker="A motor and a generator are the same machine" title="Push current through the loop, and the field turns it: a motor" />
      <Cap opacity={span(frame, T(8.5), T(13.2))} kicker="Turn the loop by hand, and it gives out current" title="A generator" />
      <Cap opacity={span(frame, T(13.6), T(23.8))} kicker="It is always both at once" title="As a motor spins, a voltage is induced in its own coils" />
      <Cap opacity={span(frame, T(24.2), T(31.3))} kicker="By Lenz’s law, it opposes the supply" title="The back EMF, and it grows with speed" />
      <Cap opacity={span(frame, T(31.6), T(42.3))} kicker="At full speed, the back EMF nearly balances the supply" title="The motor draws only a small current" />
      <Cap opacity={span(frame, T(42.5), T(55.4))} kicker="At starting, or with the shaft jammed: no back EMF at all" title="The current can be many times the normal value" />
      <Cap opacity={span(frame, T(55.6), T(61.1))} kicker="That is why large motors need starters" title="and why a stalled motor burns out" />
      <Cap opacity={span(frame, T(61.3), T(73.8))} kicker="When an electric car or train slows down, the wheels drive the motor" title="It becomes a generator, and sends energy back" />
      <Cap opacity={span(frame, T(74.0), T(80.6))} kicker="And the inductance of two videos ago is the same law again" title="A coil sits in its own flux" />
      <Cap opacity={span(frame, T(80.8), T(120))} kicker="Change its current, and you change that flux" title="The coil induces a voltage in itself" />
      <Timeline frame={frame} already={[0, 1, 2, 3, 4, 5, 6]} />
    </Shell>
  );
};
