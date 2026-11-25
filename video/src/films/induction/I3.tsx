import { useMemo } from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/induction/ch3.json';
import { lerp, ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Shell, T, chapterFrames } from '../../ui/Shell';
import { Big, Center, Frac, Kicker, Meter, Sub, Sym } from '../../ui/type';
import { drawLines, traceLines } from '../../world/field';
import { barPoles, BFIELD, CURRENT, drawBarMagnet } from '../../world/magnet';
import { Stage3D } from '../../world/Stage3D';
import { at, Cap, orbit, ringLoop, shiftLines, Timeline, VOICE, VOLT, xField } from './kit';

// Chapter 3 - Faraday's law: any change of flux, and its rate.
export const I3_FRAMES = chapterFrames(voice.duration);
const io = Easing.inOut(Easing.quad);

// everything that changes, as functions of the frame, so the voltage can follow the rate of change
const state = (f: number) => {
  const slowFast = ramp(f, T(38.6), T(42.8), io) - ramp(f, T(42.85), T(43.0)) + ramp(f, T(43.1), T(43.7), io) - ramp(f, T(46.0), T(48.0), io);
  const coilPush = ramp(f, T(68.4), T(69.6), io) - ramp(f, T(71.4), T(72.6), io) + ramp(f, T(74.8), T(76.0), io) - ramp(f, T(77.0), T(78.0), io);
  const early = ramp(f, T(4.6), T(7.0), io) - ramp(f, T(9.4), T(11.2), io) + ramp(f, T(17.6), T(19.6), io) - ramp(f, T(21.0), T(22.8), io);
  const push = f < T(36) ? early : f < T(62) ? slowFast : coilPush;
  const area = ramp(f, T(23.6), T(24.6), io) - ramp(f, T(24.8), T(25.7), io);
  const turn = ramp(f, T(26.2), T(28.2), io) - ramp(f, T(28.8), T(30.6), io);
  const r = 1.7 + 0.7 * area;
  const tilt = turn * 1.4;
  const uniform = f >= T(23.2) && f < T(36.0);
  const flux = uniform ? r * r * Math.cos(tilt) : 3 * push;
  return { push, r, tilt, uniform, flux };
};

export const I3 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const lines = useMemo(() => traceLines(barPoles(0, 0, 1.4), { perCharge: 14, bound: 7 }), []);
  const s = state(frame);
  const coil = frame >= T(62.4);
  const emf = (state(frame + 1).flux - state(frame - 1).flux) * 9;
  const words = span(frame, T(49.5), T(62.3), 12);
  const formula = ramp(frame, T(78.0), T(78.8));
  const mx = lerp(-6.2, -2.6, s.push);
  const turns = coil ? [-0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9] : [0];
  const reading = Math.abs(emf) < 0.03 ? 0 : emf * (coil ? 100 : 1);

  return (
    <Shell
      voice={VOICE(3)}
      frames={I3_FRAMES}
      world={
        <AbsoluteFill style={{ opacity: lerp(1, 0.25, Math.max(words, formula)) }}>
          <Stage3D
            width={width}
            height={height}
            pose={orbit(frame)}
            orbs={(add) => {
              if (!s.uniform) drawBarMagnet(add, mx, 0, 1.4);
            }}
            glows={(add) => {
              if (s.uniform) xField(add, frame, 0.9);
              else drawLines(add, shiftLines(lines, mx), frame, 0.9, BFIELD, { bold: true });
              for (const x of turns) ringLoop(add, 1.2 + x, 0, 0, s.r, s.tilt, frame, emf * 2.2);
            }}
          />
        </AbsoluteFill>
      }
    >
      <Panel opacity={span(frame, T(3.8), T(49.4)) + span(frame, T(62.5), T(78.0))} style={{ right: 110, top: 70, display: 'flex', gap: 56 }}>
        <Meter label="Flux through the loop" value={Math.abs(state(frame + 1).flux - state(frame - 1).flux) < 0.003 ? 'steady' : 'changing'} color={BFIELD} size={70} />
        <Meter label={coil ? 'Voltage, 100 turns' : 'Voltage round the loop'} value={`${reading >= 0 ? '+' : '−'}${Math.abs(reading).toFixed(coil ? 0 : 2)}`} unit="V" color={VOLT} size={70} />
      </Panel>
      <Cap opacity={span(frame, T(0.2), T(8.8))} kicker="What Faraday found, in one line" title="Whenever the flux through a loop changes, a voltage appears round it" />
      <Cap opacity={span(frame, T(9.0), T(12.6))} kicker="And the faster the flux changes" title="the larger the voltage" />
      <Cap opacity={span(frame, T(13.0), T(23.2))} kicker="It does not matter how you change the flux" title="Make the field stronger or weaker: bring a magnet closer" />
      <Cap opacity={span(frame, T(23.5), T(25.8), 8)} kicker="Or" title="change the area of the loop" />
      <Cap opacity={span(frame, T(26.0), T(30.8))} kicker="Or" title="turn the loop, to face the field more squarely, or less" />
      <Cap opacity={span(frame, T(31.0), T(36.0))} kicker="The loop cannot tell the difference" title="Any change in flux gives a voltage" />
      <Cap opacity={span(frame, T(36.2), T(42.9))} kicker="It is the rate that counts" title="Push the magnet in slowly, and the needle barely stirs" />
      <Cap opacity={span(frame, T(43.0), T(49.4))} kicker="Push it in fast, and it jumps" title="The total change is the same. The speed is not" />
      <Center opacity={words}>
        <Kicker style={{ marginBottom: 22 }}>Engineers call this voltage</Kicker>
        <Big size={104}>
          an electromotive force: <span style={{ color: VOLT }}>EMF</span>
        </Big>
        <Sub style={{ opacity: at(frame, 54.8) }}>not a force at all, but the old name has stuck</Sub>
        <Sub style={{ opacity: at(frame, 58.2), color: C.text }}>the voltage that drives current round a circuit</Sub>
      </Center>
      <Cap opacity={span(frame, T(62.6), T(67.3))} kicker="One more thing you can do" title="Use a coil instead of a single loop" />
      <Cap opacity={span(frame, T(67.5), T(77.8))} kicker="Every turn gets the same voltage, and they add" title="A hundred turns give a hundred times the voltage" />
      <Center opacity={formula}>
        <Kicker style={{ marginBottom: 30 }}>Faraday’s law</Kicker>
        <div style={{ fontSize: 170, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 34 }}>
          <Sym color={VOLT} style={{ fontStyle: 'normal' }}>
            EMF
          </Sym>
          <Sym color={C.dim} style={{ fontStyle: 'normal' }}>
            =
          </Sym>
          <Sym color={CURRENT}>N</Sym>
          <Frac
            width={250}
            top={
              <span>
                <Sym style={{ fontStyle: 'normal' }}>Δ</Sym>
                <Sym color={BFIELD}>Φ</Sym>
              </span>
            }
            bottom={
              <span>
                <Sym style={{ fontStyle: 'normal' }}>Δ</Sym>
                <Sym color={C.shape}>t</Sym>
              </span>
            }
          />
        </div>
        <Sub style={{ marginTop: 30 }}>number of turns × rate of change of flux</Sub>
      </Center>
      <Timeline frame={frame} already={[0]} />
    </Shell>
  );
};
