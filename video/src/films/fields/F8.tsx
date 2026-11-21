import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/fields/ch8.json';
import { ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Shell, T, chapterFrames } from '../../ui/Shell';
import { Meter } from '../../ui/type';
import { drawArrow } from '../../world/field';
import { BFIELD, CURRENT, drawWire } from '../../world/magnet';
import { rgb, Stage3D } from '../../world/Stage3D';
import type { CameraPose } from '../../world/WireWorld';
import { drawTransformer } from '../induction/I7';
import { at, Cap, drawWave, EFIELD, ring, shot, Timeline, VOICE } from './kit';

// Chapter 8 - What engineers do with it.
export const F8_FRAMES = chapterFrames(voice.duration);

export const F8 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const bounds = [-1, 25.15, 35.15, 55.95, 73.55, 200];
  const which = frame < T(25.15) ? 0 : frame < T(35.15) ? 1 : frame < T(55.95) ? 2 : frame < T(73.55) ? 3 : 4;
  let vis = 0;
  for (let i = 0; i < 5; i++) vis = Math.max(vis, shot(frame, bounds[i] - 0.1, bounds[i + 1] + 0.1));
  const beat = 0.5 + 0.5 * Math.sin(frame * 0.3);
  const fill = ramp(frame, T(13.3), T(24.0));
  const packet = -9 + (((frame - T(56)) * 0.35) % 18);
  const sway = Math.sin(frame * 0.003) * 1.5;
  const poses: CameraPose[] = [
    { pos: [4 + sway, 4.4, 12], target: [0, -0.1, 0], fov: 34, focus: 13, dof: 0.04 },
    { pos: [3.5 + sway, 2.4, 16], target: [0.4, 0.5, 0], fov: 34, focus: 17, dof: 0.04 },
    { pos: [2 + sway, 3.4, 17], target: [0, 0, 0], fov: 34, focus: 17.5, dof: 0.04 },
    { pos: [3 + sway, 2.6, 14], target: [0, 0, 0], fov: 34, focus: 14.5, dof: 0.04 },
    { pos: [0, 2.2, 17], target: [0, 0.4, 0], fov: 34, focus: 17, dof: 0.03 },
  ];

  return (
    <Shell
      voice={VOICE(8)}
      frames={F8_FRAMES}
      world={
        <AbsoluteFill style={{ opacity: vis }}>
          <Stage3D
            width={width}
            height={height}
            pose={poses[which]}
            deep={which === 1 ? [0.1, 0.11, 0.14] : undefined}
            orbs={(add) => {
              if (which === 1) drawTransformer(add, null, frame, 12);
            }}
            glows={(add) => {
              if (which === 0) {
                // a charging pad with its coil, and a phone lying on it with a coil of its own
                const edge = rgb('#c8d4ea');
                for (let i = 0; i <= 60; i++) {
                  const u = -1 + (i / 60) * 2;
                  for (const s of [-1, 1]) {
                    add(u * 3.4, -0.9, s * 2.2, 0.15, edge, 0.8);
                    add(s * 3.4, -0.9, u * 2.2, 0.15, edge, 0.8);
                    add(u * 2.4, 0.5, s * 1.3, 0.15, edge, 0.8 * at(frame, 10.5));
                    add(s * 2.4, 0.5, u * 1.3, 0.15, edge, 0.8 * at(frame, 10.5));
                  }
                }
                for (const r of [0.6, 1.0, 1.4, 1.8]) {
                  ring(add, 0, -0.8, 0, 'y', r, 0, '#e8935a', 0.7);
                  ring(add, 0, -0.8, 0, 'y', r, frame * 2, CURRENT, 0.9, Math.sin(frame * 0.3) > 0 ? 1 : -1);
                }
                for (const r of [0.5, 0.8, 1.1]) {
                  ring(add, 0, 0.4, 0, 'y', r, 0, '#c8d4ea', 0.7 * at(frame, 10.5));
                  ring(add, 0, 0.4, 0, 'y', r, frame * 2, '#ffb36b', at(frame, 13.3), Math.cos(frame * 0.3) > 0 ? 1 : -1);
                }
                for (const s of [-1, 1]) {
                  ring(add, s * 1.2, -0.2, 0, 'z', 1.4, frame, BFIELD, at(frame, 13.3) * (0.4 + 0.6 * beat));
                  ring(add, 0, -0.2, s * 1.2, 'x', 1.4, frame, BFIELD, at(frame, 13.3) * (0.4 + 0.6 * beat));
                }
              }
              if (which === 1) drawTransformer(null, add, frame, 12);
              if (which === 2) {
                // two antennas: charge driven up and down the first, pushed back and forth in the second
                for (const [x, g] of [[-8.5, 1], [8.5, at(frame, 45.7)]] as [number, number][])
                  for (let i = 0; i <= 60; i++) {
                    const y = -2.4 + i * 0.08;
                    const bead = Math.abs(y - 2 * Math.sin(frame * 0.13 - (x > 0 ? 25.5 : 0))) < 0.2;
                    add(x, y, 0, bead ? 0.4 : 0.17, rgb(bead ? CURRENT : '#c8d4ea'), (bead ? 1 : 0.8) * g);
                  }
                drawWave(add, -8.2, 8.2, frame, { front: -8.2 + 17 * ramp(frame, T(40.0), T(46.0)) });
              }
              if (which === 3) {
                // a cable: the field between the conductors races along, the electrons barely crawl
                drawWire(add, 1.1, 0, -10, 10, 0, 0, 1, '#e8935a');
                drawWire(add, -1.1, 0, -10, 10, 0, 0, 1, '#e8935a');
                for (let i = 0; i < 9; i++) drawArrow(add, packet + i * 0.3, 0.9, 0, 0, -1, 0, 1.7, EFIELD, Math.sin((i / 8) * Math.PI), 0.1);
                for (let i = 0; i < 40; i++) add(-10 + ((i * 0.5 + frame * 0.004) % 20), i % 2 ? 1.1 : -1.1, 0, 0.2, rgb(C.electron), 0.9);
              }
              if (which === 4) {
                // one whole wavelength of a 50 hertz supply, laid out along a very long line
                drawWire(add, 0.4, 0, -9, 9, 0, 0, 0.6);
                for (let x = -9; x <= 9; x += 0.05) add(x, 0.4 + 2 * Math.sin(((x + 9) / 18) * Math.PI * 2 - frame * 0.1), 0, 0.17, rgb(CURRENT), 0.95);
                for (const x of [-9, 9]) for (let y = -2.2; y <= 3; y += 0.12) add(x, y, 0, 0.1, rgb('#9aa6c0'), 0.6);
              }
            }}
          />
        </AbsoluteFill>
      }
    >
      <Panel opacity={span(frame, T(13.3), T(25.1))} style={{ right: 110, top: 70 }}>
        <Meter label="Phone battery" value={`${Math.round(20 + 70 * fill)} %`} color="#34c759" size={96} align="right" />
      </Panel>
      <Cap opacity={span(frame, T(0.2), T(5.7))} kicker="For an engineer" title="This changes how you look at every circuit" />
      <Cap opacity={span(frame, T(5.9), T(20.7))} kicker="A wireless charging pad" title="The changing field of one coil drives a current in the other" />
      <Cap opacity={span(frame, T(20.9), T(25.1), 8)} kicker="Nothing touches" title="The energy crosses the gap as field" />
      <Cap opacity={span(frame, T(25.3), T(35.1))} kicker="A transformer: the same idea, for a whole town" title="Two coils that never touch, linked only by a changing magnetic field" />
      <Cap opacity={span(frame, T(35.3), T(45.6))} kicker="An antenna goes one step further" title="Charge driven so quickly that its fields break away as waves" />
      <Cap opacity={span(frame, T(45.8), T(55.9))} kicker="Far away, a second antenna sits in the passing wave" title="Its charges are pushed back and forth: that is your radio signal" />
      <Cap opacity={span(frame, T(56.1), T(73.5))} kicker="Even in an ordinary cable" title="The energy travels in the fields around the conductors, not inside the copper" />
      <Panel opacity={span(frame, T(62.3), T(73.5))} style={{ right: 110, top: 70, display: 'flex', gap: 56 }}>
        <Meter label="The field between the wires" value="near light speed" color={EFIELD} size={60} />
        <Meter label="The electrons" value="barely crawling" color={C.electron} size={60} />
      </Panel>
      <Cap opacity={span(frame, T(73.7), T(200))} kicker="That speed, though enormous, is not infinite" title="On a very long line, power engineers have to design for it" />
      <Panel opacity={span(frame, T(77.4), T(200))} style={{ left: 0, right: 0, top: 70, textAlign: 'center' }}>
        <div style={{ fontSize: 54, fontWeight: 300 }}>
          one wavelength at 50 Hz: <span style={{ color: CURRENT }}>6,000 km</span>
        </div>
        <div style={{ fontSize: 32, fontWeight: 300, color: C.dim, marginTop: 8, opacity: at(frame, 82.3) }}>the far end of a long line is out of step with the near end</div>
      </Panel>
      <Timeline frame={frame} already={[0, 1, 2, 3, 4, 5, 6, 7]} />
    </Shell>
  );
};
