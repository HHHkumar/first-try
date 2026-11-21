import { useMemo } from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/induction/ch4.json';
import { lerp, ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Shell, T, chapterFrames } from '../../ui/Shell';
import { Big, Center, Kicker, Meter, Sub } from '../../ui/type';
import { drawArrow, drawLines, traceLines } from '../../world/field';
import { barPoles, BFIELD, CURRENT, drawBarMagnet, NORTH, SOUTH } from '../../world/magnet';
import { rgb, Stage3D } from '../../world/Stage3D';
import { at, Cap, COPPER, orbit, ring, ringLoop, shiftLines, shot, Timeline, VOICE } from './kit';

// Chapter 4 - Lenz's law, and the magnet in the copper pipe.
export const I4_FRAMES = chapterFrames(voice.duration);
const io = Easing.inOut(Easing.quad);
const pushAt = (f: number) => ramp(f, T(13.2), T(17.0), io) - ramp(f, T(23.9), T(27.4), io) + ramp(f, T(33.6), T(36.0), io) - ramp(f, T(37.0), T(39.6), io) + ramp(f, T(40.6), T(43.4), io);

export const I4 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const lines = useMemo(() => traceLines(barPoles(0, 0, 1.4), { perCharge: 14, bound: 7 }), []);
  const sA = shot(frame, -1, 63.0);
  const sPipe = shot(frame, 62.8, 120);
  const pipe = frame >= T(62.9);
  const push = pushAt(frame);
  const rate = (pushAt(frame + 1) - pushAt(frame - 1)) * 28;
  const mx = lerp(-6.2, -2.4, push);
  const suppose = span(frame, T(44.0), T(62.8), 12);
  // the magnet drifts down the pipe; a steel ball beside it simply falls
  const fall = ramp(frame, T(69.6), T(84.6));
  const my = lerp(3.9, -2.2, fall);
  const bs = Math.max(0, (frame - T(70.0)) / 30);
  const by = Math.max(-3.4, 3.9 - 3.2 * bs * bs);

  return (
    <Shell
      voice={VOICE(4)}
      frames={I4_FRAMES}
      world={
        <AbsoluteFill style={{ opacity: Math.max(sA, sPipe) * lerp(1, 0.25, suppose) }}>
          <Stage3D
            width={width}
            height={height}
            pose={pipe ? { pos: [5 + Math.sin(frame * 0.003) * 1.5, 2.0, 19], target: [1.2, 0.3, 0], fov: 34, focus: 19.5, dof: 0.03 } : orbit(frame)}
            orbs={(add) => {
              if (!pipe) drawBarMagnet(add, mx, 0, 1.4);
              else {
                for (const dy of [-0.5, 0, 0.5]) for (const [x, z] of [[0.22, 0.22], [-0.22, 0.22], [0.22, -0.22], [-0.22, -0.22]]) add(x, my + dy, z, 0.46, rgb(dy < 0 ? NORTH : dy > 0 ? SOUTH : '#b78fd0'), 1);
                add(4.2, by, 0, 0.8, rgb('#9aa6c0'), 1);
              }
            }}
            glows={(add) => {
              if (!pipe) {
                drawLines(add, shiftLines(lines, mx), frame, 0.9, BFIELD, { bold: true });
                ringLoop(add, 1.4, 0, 0, 1.8, 0, frame, rate * 2);
                // the face of the loop that the magnet sees: a like pole as it comes, an unlike one as it goes
                if (Math.abs(rate) > 0.05) {
                  add(1.1, 0, 0, 2.6, rgb(rate > 0 ? NORTH : SOUTH), 0.35 * Math.min(1, Math.abs(rate)));
                  drawArrow(add, mx + 1.7, 1.5, 0, rate > 0 ? -1 : 1, 0, 0, 1.3 * Math.min(1, Math.abs(rate)), CURRENT, 1, 0.13);
                }
              } else {
                // a thick copper pipe, as a stack of rings; currents bloom in the rings near the magnet
                for (let y = -3.0; y <= 3.01; y += 0.3) {
                  ring(add, 0, y, 0, 'y', 1.25, 0, COPPER, 0.55);
                  const near = Math.exp(-((y - my) ** 2) / 0.9);
                  if (near > 0.08 && fall > 0 && fall < 1) ring(add, 0, y, 0, 'y', 1.25, frame * 1.5, CURRENT, near * 1.1, y > my ? 1 : -1);
                }
              }
            }}
          />
        </AbsoluteFill>
      }
    >
      <Cap opacity={span(frame, T(0.2), T(12.8))} kicker="Lenz’s law · 1834" title="The induced current always flows so as to oppose the change that caused it" />
      <Cap opacity={span(frame, T(13.0), T(23.6))} kicker="Push a north pole toward the loop" title="The near face of the loop becomes a north pole too, and pushes back" />
      <Cap opacity={span(frame, T(23.8), T(30.8))} kicker="Pull the magnet away, and the current reverses" title="Now the loop attracts the magnet, trying to hold on to it" />
      <Cap opacity={span(frame, T(31.0), T(36.1))} kicker="Either way, you feel resistance" title="You have to do work to move the magnet" />
      <Cap opacity={span(frame, T(36.3), T(43.9))} kicker="That is where the electrical energy comes from" title="The work your hand does becomes the energy of the current" />
      <Center opacity={suppose}>
        <Kicker style={{ marginBottom: 24 }}>Suppose it went the other way, and the current helped the magnet along</Kicker>
        <Big size={68} style={{ opacity: at(frame, 49.4) }}>
          faster → more current → faster still → <span style={{ color: NORTH }}>energy from nothing</span>
        </Big>
        <Sub style={{ opacity: at(frame, 57.3), color: C.text, marginTop: 40 }}>Lenz’s law is the conservation of energy, written for magnets and wires</Sub>
      </Center>
      <Panel opacity={span(frame, T(69.0), T(120))} style={{ right: 110, top: 70, display: 'flex', gap: 56 }}>
        <Meter label="Magnet in the copper pipe" value="drifting" color={CURRENT} size={64} />
        <Meter label="Steel ball beside it" value={by > -3.3 ? 'falling' : 'landed'} color={C.dim} size={64} />
      </Panel>
      <Cap opacity={span(frame, T(63.0), T(68.6))} kicker="A strong magnet and a thick copper pipe" title="Copper is not magnetic" />
      <Cap opacity={span(frame, T(69.0), T(76.2))} kicker="Yet the magnet does not fall" title="It drifts down slowly, as if through honey" />
      <Cap opacity={span(frame, T(76.5), T(120))} kicker="The falling magnet changes the flux through each ring of the pipe" title="Currents flow in the copper, and they oppose the fall" />
      <Timeline frame={frame} already={[0]} events={[[2, 5.9]]} />
    </Shell>
  );
};
