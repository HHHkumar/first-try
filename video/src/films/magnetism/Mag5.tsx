import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/magnetism/ch5.json';
import { lerp, lerp3, ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Shell, T, chapterFrames } from '../../ui/Shell';
import { Big, Center, Frac, Kicker, Sub, Sym } from '../../ui/type';
import { drawArrow } from '../../world/field';
import { BFIELD, CURRENT, drawNeedle, drawRings, drawWire } from '../../world/magnet';
import { Stage3D } from '../../world/Stage3D';
import type { CameraPose } from '../../world/WireWorld';
import { at, Cap, shot, Timeline, VOICE } from './kit';

// Chapter 5 - Current makes magnetism. Rings round a wire, the grip rule,
// Ampere's two wires, and the size of the field.
export const MAG5_FRAMES = chapterFrames(voice.duration);

export const Mag5 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const sWire = Math.max(shot(frame, -1, 24.2), shot(frame, 52.8, 72.0));
  const sTwo = shot(frame, 24.0, 53.0);
  const final = ramp(frame, T(71.8), T(72.6));
  const two = frame >= T(24.1) && frame < T(52.9);

  const orbit = frame * 0.003;
  const wirePose: CameraPose = { pos: [7 + Math.sin(orbit) * 1.5, 4.2, 12], target: [0, 0, 0], fov: 34, focus: 14, dof: 0.05 };
  const twoPose: CameraPose = { pos: [0, 2.2, 15], target: [0, 0, 0], fov: 34, focus: 15, dof: 0.04 };
  const pose: CameraPose = two ? twoPose : { ...wirePose, pos: lerp3(wirePose.pos, wirePose.pos, 0) };

  // Ampere: same way, the wires pull together; opposed, they push apart
  const together = ramp(frame, T(42.4), T(44.6), Easing.inOut(Easing.quad)) * (1 - ramp(frame, T(45.0), T(45.6)));
  const opposed = frame >= T(45.2);
  const apart = ramp(frame, T(46.6), T(48.4), Easing.inOut(Easing.quad));
  const gap = lerp(1.6, 0.85, together) + 1.0 * apart;

  return (
    <Shell
      voice={VOICE(5)}
      frames={MAG5_FRAMES}
      world={
        <AbsoluteFill style={{ opacity: Math.max(sWire, sTwo) * lerp(1, 0.4, final) }}>
          <Stage3D
            width={width}
            height={height}
            pose={pose}
            glows={(add) => {
              if (!two) {
                drawWire(add, 0, 0, -9, 9, frame, 1);
                const far = frame >= T(52.9);
                drawRings(add, 0, 0, [-5, -2.5, 0, 2.5, 5], far ? [1.1, 2.2, 3.3] : [1.5], frame, 1, at(frame, 6.6, 1.2));
                // a circle of compasses round the wire, each lying along its ring
                const seen = at(frame, 9.8) * (far ? 0 : 1);
                for (let i = 0; i < 10; i++) {
                  const a = (i / 10) * Math.PI * 2;
                  drawNeedle(add, 0, Math.cos(a) * 2.5, Math.sin(a) * 2.5, 0, -Math.sin(a), Math.cos(a), 0.9, seen);
                }
              } else {
                const seen = at(frame, 38.6);
                drawWire(add, gap, 0, -9, 9, frame, 1, seen);
                drawWire(add, -gap, 0, -9, 9, frame, opposed ? -1 : 1, seen);
                // the force on each wire
                const pull = at(frame, 42.6) * (opposed ? 0 : 1);
                const push = opposed ? at(frame, 46.4) : 0;
                for (const x of [-4, 0, 4]) {
                  drawArrow(add, x, gap + 1.3, 0, 0, -1, 0, 0.9, CURRENT, pull, 0.11);
                  drawArrow(add, x, -gap - 1.3, 0, 0, 1, 0, 0.9, CURRENT, pull, 0.11);
                  drawArrow(add, x, gap + 0.3, 0, 0, 1, 0, 0.9, CURRENT, push, 0.11);
                  drawArrow(add, x, -gap - 0.3, 0, 0, -1, 0, 0.9, CURRENT, push, 0.11);
                }
              }
            }}
          />
        </AbsoluteFill>
      }
    >
      <Cap opacity={span(frame, T(0.2), T(6.8))} kicker="What Oersted found" title="A wire carrying a current is surrounded by a magnetic field" />
      <Cap opacity={span(frame, T(7.0), T(13.6))} kicker="Not toward the wire, nor away from it" title="The field circles the wire, in rings" />
      <Panel opacity={span(frame, T(13.9), T(24.0))} style={{ left: 110, top: 80, width: 800 }}>
        <Kicker>The right-hand grip rule</Kicker>
        <div style={{ fontSize: 50, fontWeight: 300, marginTop: 12, lineHeight: 1.35 }}>
          <div style={{ opacity: at(frame, 18.6) }}>
            Thumb along the <span style={{ color: CURRENT }}>current</span>
          </div>
          <div style={{ opacity: at(frame, 21.2) }}>
            Fingers curl the way the <span style={{ color: BFIELD }}>field</span> goes
          </div>
        </div>
      </Panel>

      <Cap opacity={span(frame, T(24.7), T(38.4))} kicker="September 1820 · Paris · André-Marie Ampère" title="If a current acts like a magnet, two currents should act on each other" />
      <Panel opacity={span(frame, T(41.0), T(45.0), 8)} style={{ left: 0, right: 0, top: 770, textAlign: 'center' }}>
        <div style={{ fontSize: 56, fontWeight: 300 }}>
          Currents the same way: <span style={{ color: CURRENT }}>the wires pull together</span>
        </div>
      </Panel>
      <Panel opacity={span(frame, T(45.2), T(52.8), 8)} style={{ left: 0, right: 0, top: 770, textAlign: 'center' }}>
        <div style={{ fontSize: 56, fontWeight: 300 }}>
          Currents opposed: <span style={{ color: CURRENT }}>they push apart</span>
        </div>
        <Sub style={{ opacity: at(frame, 48.2) }}>no iron, no lodestone: only electricity in motion</Sub>
      </Panel>

      {/* the size of the field */}
      <Panel opacity={span(frame, T(57.6), T(71.8))} style={{ left: 110, top: 70 }}>
        <Kicker>Autumn 1820 · Biot and Savart</Kicker>
        <div style={{ fontSize: 120, display: 'flex', alignItems: 'center', gap: 28, marginTop: 6 }}>
          <Sym color={BFIELD}>B</Sym>
          <Sym color={C.dim} style={{ fontStyle: 'normal' }}>
            =
          </Sym>
          <Frac
            width={300}
            top={
              <span>
                <Sym>
                  μ<sub style={{ fontSize: '0.45em', fontStyle: 'normal' }}>0</sub>
                </Sym>{' '}
                <Sym color={CURRENT}>I</Sym>
              </span>
            }
            bottom={
              <span>
                <Sym>2π</Sym> <Sym color={C.shape}>r</Sym>
              </span>
            }
          />
        </div>
      </Panel>
      <Cap opacity={span(frame, T(57.8), T(62.9))} kicker="Around a long straight wire" title="The field grows with the current and falls off with distance" />
      <Cap opacity={span(frame, T(63.1), T(71.8))} kicker="One ampere, at one centimetre" title="About 20 millionths of a tesla: half the Earth’s own field" />

      <Center opacity={final}>
        <Kicker style={{ marginBottom: 26 }}>Ampère’s conclusion</Kicker>
        <Big size={104}>Magnetism is not a separate force.</Big>
        <Big size={104} style={{ color: BFIELD, marginTop: 14, opacity: at(frame, 78.4) }}>
          It is what moving charge does.
        </Big>
      </Center>
      <Timeline frame={frame} already={[0, 1, 2, 3, 4]} events={[[5, 27.2]]} />
    </Shell>
  );
};
