import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/induction/ch5.json';
import { ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Shell, T, chapterFrames } from '../../ui/Shell';
import { Meter, Sym } from '../../ui/type';
import { drawArrow, NEG, POS } from '../../world/field';
import { BFIELD, CURRENT } from '../../world/magnet';
import { rgb, Stage3D } from '../../world/Stage3D';
import { drawPoleFaces } from '../magnetism/gap';
import { at, Cap, COPPER, orbit, shot, Timeline, VOICE, VOLT, xField } from './kit';

// Chapter 5 - A wire moving through a field, Faraday's disc, and an airliner's wings.
export const I5_FRAMES = chapterFrames(voice.duration);

export const I5 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const sWire = shot(frame, -1, 41.0);
  const sDisc = shot(frame, 40.8, 67.6);
  const sPlane = shot(frame, 67.4, 120);
  const which = frame < T(40.9) ? 0 : frame < T(67.5) ? 1 : 2;
  // the wire is carried up and down through the field
  const moving = ramp(frame, T(7.4), T(9.0));
  const wy = -1.4 + 2.8 * (0.5 - 0.5 * Math.cos(Math.max(0, frame - T(7.4)) * 0.035));
  const vel = Math.sin(Math.max(0, frame - T(7.4)) * 0.035) * moving;
  const sep = at(frame, 24.6) * vel;
  const spin = Math.max(0, frame - T(57.3)) * 0.05 * ramp(frame, T(57.3), T(59.0), Easing.in(Easing.quad));
  const px = ((frame - T(67.4)) * 0.05) % 16 - 8;

  return (
    <Shell
      voice={VOICE(5)}
      frames={I5_FRAMES}
      world={
        <AbsoluteFill style={{ opacity: Math.max(sWire, sDisc, sPlane) }}>
          <Stage3D
            width={width}
            height={height}
            pose={which === 2 ? { pos: [4, 5, 15], target: [0, 0, 0], fov: 34, focus: 16, dof: 0.035 } : which === 1 ? orbit(frame, 13, 3, 10) : orbit(frame, 16, 3.6, 5.5)}
            orbs={(add) => {
              if (which === 0) {
                // the free electrons inside the wire, carried along with it and pushed toward one end
                for (let i = 0; i < 9; i++) {
                  const z = -2.4 + i * 0.6 + Math.max(-0.4, Math.min(0.4, sep * 0.5)) + 0.12 * Math.sin(frame * 0.2 + i * 2);
                  add(0, wy, z, 0.26, rgb(NEG), at(frame, 10.4));
                }
              }
              if (which === 1) drawPoleFaces(add, 0.9);
            }}
            glows={(add) => {
              if (which === 0) {
                xField(add, frame, 0.8);
                const c = rgb('#c8d4ea');
                for (let i = 0; i <= 70; i++) add(0, wy, -2.8 + i * 0.08, 0.2, c, 0.7);
                drawArrow(add, 0, wy, 3.2, 0, vel >= 0 ? 1 : -1, 0, 1.4 * Math.abs(vel), '#d7e6ff', 1, 0.11);
                // charge piles up at the ends
                add(0, wy, 2.8, 1.2, rgb(sep > 0 ? NEG : POS), 0.7 * Math.abs(sep));
                add(0, wy, -2.8, 1.2, rgb(sep > 0 ? POS : NEG), 0.7 * Math.abs(sep));
              }
              if (which === 1) {
                xField(add, frame, 0.5, 5, [-1.2, 0, 1.2], [-1.2, 0, 1.2]);
                // a copper disc, face on to the field, turning
                const c = rgb(COPPER);
                for (let i = 0; i < 620; i++) {
                  const r = 2.9 * Math.sqrt((i + 0.5) / 620);
                  const a = i * 2.39996 + spin;
                  add(0, Math.cos(a) * r, Math.sin(a) * r, i % 31 === 0 ? 0.3 : 0.15, c, i % 31 === 0 ? 0.95 : 0.55);
                }
                // one contact on the rim, one on the axle, and the current between them
                const flow = at(frame, 57.6);
                for (let j = 0; j <= 30; j++) {
                  const phase = (((j - frame * 0.5) % 10) + 10) % 10;
                  add(0.1, (j / 30) * 2.9, 0, phase < 2 ? 0.3 : 0.12, rgb(CURRENT), (phase < 2 ? 1 : 0.4) * flow);
                }
                add(0, 2.95, 0, 0.5, rgb(CURRENT), at(frame, 53.9));
                add(0, 0, 0, 0.5, rgb(CURRENT), at(frame, 55.4));
              }
              if (which === 2) {
                // the Earth's field, pointing down, and an airliner crossing it
                const c = rgb(BFIELD);
                for (let x = -8; x <= 8.01; x += 2) for (let z = -4; z <= 4.01; z += 2) for (let k = 0; k < 30; k++) {
                  const y = 3 - k * 0.2;
                  const phase = (((k - frame * 0.4 + x * 3 + z * 5) % 15) + 15) % 15;
                  add(x, y, z, phase < 1.5 ? 0.13 : 0.06, c, phase < 1.5 ? 0.8 : 0.3);
                }
                const g = rgb('#dfe8f8');
                for (let i = 0; i <= 50; i++) add(px - 1.6 + i * 0.07, 0, 0, 0.22, g, 0.95);
                for (let i = -40; i <= 40; i++) add(px - Math.abs(i) * 0.02, 0, i * 0.08, 0.17, g, 0.95);
                for (let i = -10; i <= 10; i++) add(px - 1.5, 0, i * 0.08, 0.14, g, 0.9);
                add(px - 0.8, 0, 3.3, 1.1, rgb(POS), 0.7 * at(frame, 77.2));
                add(px - 0.8, 0, -3.3, 1.1, rgb(NEG), 0.7 * at(frame, 77.2));
              }
            }}
          />
        </AbsoluteFill>
      }
    >
      <Cap opacity={span(frame, T(0.2), T(5.3))} kicker="A second way to look at it" title="It ties back to something we already know" />
      <Cap opacity={span(frame, T(5.5), T(14.8))} kicker="Move a straight wire sideways through a field" title="Its free electrons are carried along with it" />
      <Cap opacity={span(frame, T(15.0), T(24.5))} kicker="So they are charges moving through a magnetic field" title="Each feels a force at right angles to its motion" />
      <Cap opacity={span(frame, T(24.7), T(34.6))} kicker="That force pushes the electrons toward one end" title="A voltage has appeared across the wire" />
      <Panel opacity={span(frame, T(36.8), T(40.9), 8)} style={{ right: 110, top: 70 }}>
        <div style={{ fontSize: 124, display: 'flex', alignItems: 'baseline', gap: 26 }}>
          <Sym color={VOLT} style={{ fontStyle: 'normal' }}>
            EMF
          </Sym>
          <Sym color={C.dim} style={{ fontStyle: 'normal' }}>
            =
          </Sym>
          <Sym color={BFIELD}>B</Sym>
          <Sym color={C.shape}>L</Sym>
          <Sym>v</Sym>
        </div>
      </Panel>
      <Cap opacity={span(frame, T(34.8), T(40.9), 8)} kicker="Its size is easy to remember" title="Field × length of the wire × speed" />
      <Cap opacity={span(frame, T(41.1), T(53.8))} kicker="October 1831 · Faraday’s disc" title="A copper disc turning between the poles of a large magnet" />
      <Cap opacity={span(frame, T(54.0), T(60.4))} kicker="One contact on the rim, another on the axle" title="Turn the handle, and a steady current flows" />
      <Cap opacity={span(frame, T(60.6), T(67.4))} kicker="Feeble, but the first of its kind" title="Motion turned directly into a continuous electric current" />
      <Panel opacity={span(frame, T(57.4), T(67.4))} style={{ right: 110, top: 70 }}>
        <Meter label="The first generator" value="1831" color={CURRENT} size={96} align="right" />
      </Panel>
      <Cap opacity={span(frame, T(67.6), T(77.1))} kicker="On a grand scale, every day" title="An airliner: a metal bar forty metres long, crossing the Earth’s field" />
      <Cap opacity={span(frame, T(77.3), T(120))} kicker="Between its wingtips there is a voltage" title="Only a fraction of a volt, but real" />
      <Timeline frame={frame} already={[0, 2]} />
    </Shell>
  );
};
