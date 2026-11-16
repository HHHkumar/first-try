import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/fields/ch6.json';
import { ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../../ui/Shell';
import { Big, Kicker, Meter } from '../../ui/type';
import { rgb, Stage3D } from '../../world/Stage3D';
import { plate, ringLoop } from '../induction/kit';
import { at, Cap, drawWave, GOLD, Timeline, VOICE } from './kit';

// Chapter 6 - Hertz: the wave found, and the spectrum.
export const F6_FRAMES = chapterFrames(voice.duration);
const BANDS: [string, string, number, number][] = [
  ['Radio', 'as long as a building', 87.4, 233],
  ['Microwaves', 'the size of your hand', 90.0, 544],
  ['Infrared', 'felt as warmth', 94.5, 815],
  ['Visible light', 'what your eyes detect', 97.1, 1105],
  ['Ultraviolet', '', 99.7, 1380],
  ['X-rays', 'smaller than an atom', 101.0, 1650],
];

export const F6 = () => {
  const frame = useCurrentFrame();
  const intro = span(frame, T(-1), T(12.6), 12);
  const lab = span(frame, T(12.7), T(59.9), 12);
  const use = span(frame, T(60.0), T(78.2), 12);
  const spectrum = span(frame, T(78.3), T(120), 12);
  const firing = frame > T(24.0) ? 0.5 + 0.5 * Math.sin(frame * 2.1) ** 2 : 0;
  const answer = frame > T(42.6) ? 0.35 + 0.35 * Math.sin(frame * 2.1 - 1) ** 2 : 0;
  const mirror = at(frame, 50.9);
  const { width, height } = useVideoConfig();
  const inSpectrum = frame >= T(69.5);

  return (
    <Shell
      voice={VOICE(6)}
      frames={F6_FRAMES}
      world={
        frame > T(12.5) ? (
          <AbsoluteFill style={{ opacity: Math.max(lab, spectrum) * (1 - use) }}>
            <Stage3D
              width={width}
              height={height}
              pose={inSpectrum ? { pos: [0, 1.5, 17], target: [0, 0.4, 0], fov: 34, focus: 17, dof: 0.02 } : { pos: [2 + Math.sin(frame * 0.003) * 1.5, 3, 16], target: [0.6, 0, 0], fov: 34, focus: 16.5, dof: 0.04 }}
              orbs={(add) => {
                if (!inSpectrum) for (const y of [-2.4, 2.4]) add(-7.4, y, 0, 0.7, rgb(GOLD), 1);
              }}
              glows={(add) => {
                if (!inSpectrum) {
                  // the transmitter: two brass rods with a gap, and a spark leaping across it
                  for (let y = 0.25; y <= 2.2; y += 0.08) for (const s of [-1, 1]) add(-7.4, s * y, 0, 0.18, rgb(GOLD), 0.9);
                  add(-7.4, 0, 0, 0.5 + firing * 1.4, [0.8, 0.92, 1], firing);
                  add(-7.4, 0, 0, 0.3, [1, 1, 1], firing);
                  drawWave(add, -7, 5.8, frame, { front: -7 + 13 * ramp(frame, T(24.4), T(40.0)), amp: 1.4 });
                  // the receiver: a plain loop of wire with a tiny gap, and its faint answering spark
                  ringLoop(add, 6.6, 0, 0, 1.5, 0, frame, 0, at(frame, 30.4));
                  add(6.6, 1.5, 0, 0.3 + answer, [0.8, 0.92, 1], answer * 1.4);
                  plate(add, 9.4, 0, 0, 2.2, 2.2, 1.5 * mirror, '#d7e6ff');
                } else {
                  // the whole family of waves: the same thing, with the wavelength shrinking steadily
                  let ph = -frame * 0.1;
                  for (let x = -9; x <= 9.01; x += 0.035) {
                    const u = (x + 9) / 18;
                    ph += 0.012 + 0.17 * u * u * u;
                    const sv = Math.sin(ph) * 1.5;
                    const vis = x > 0.9 && x < 1.9;
                    const hue = (x - 0.9) / 1.0;
                    const col: [number, number, number] = vis ? [1 - hue, 1 - Math.abs(hue - 0.5) * 2, hue] : [0.72, 0.64, 1];
                    for (let j = 2; j <= 7; j++) add(x, 0.4 + (sv * j) / 7, 0, 0.1, col, vis ? 0.9 * at(frame, 97.1) + 0.3 : 0.3 + 0.07 * j);
                    for (let j = 4; j <= 7; j += 3) add(x, 0.4, (sv * j) / 7, 0.08, [0.49, 1, 0.69], 0.35);
                  }
                }
              }}
            />
          </AbsoluteFill>
        ) : null
      }
    >
      <Scene opacity={intro}>
        <Panel opacity={1} style={{ left: 0, right: 0, top: 240, textAlign: 'center' }}>
          <Kicker>Still only a prediction</Kicker>
          <div style={{ fontSize: 60, fontWeight: 300, color: C.dim, marginTop: 50, opacity: at(frame, 2.6) }}>Maxwell died in 1879, without seeing it tested</div>
          <Big size={100} style={{ marginTop: 50, opacity: at(frame, 7.2) }}>
            1887 · Heinrich Hertz
          </Big>
        </Panel>
      </Scene>

      <AbsoluteFill style={{ opacity: lab }}>
        <Panel opacity={at(frame, 55.8)} style={{ right: 110, top: 70 }}>
          <Meter label="Measured speed" value="the speed of light" color={GOLD} size={70} align="right" />
        </Panel>
        <Cap opacity={span(frame, T(12.9), T(30.3))} kicker="If Maxwell was right" title="Charge rushing back and forth should send out waves" />
        <Cap opacity={span(frame, T(30.5), T(40.1))} kicker="Across the room" title="A loop of wire with a tiny gap. No battery, no wires" />
        <Cap opacity={span(frame, T(40.3), T(47.7))} kicker="When the first spark fired" title="a faint spark appeared in the gap of the loop" />
        <Cap opacity={span(frame, T(47.9), T(59.9))} kicker="He tested it as you would test light" title="Reflected by a metal sheet, focused by a curved one" />
      </AbsoluteFill>

      <Scene opacity={use}>
        <Panel opacity={1} style={{ left: 0, right: 0, top: 190, textAlign: 'center' }}>
          <Kicker>What use might it be?</Kicker>
          <Big size={110} style={{ marginTop: 20, opacity: at(frame, 64.2) }}>
            “None at all.”
          </Big>
          <div style={{ fontSize: 54, fontWeight: 300, marginTop: 70, opacity: at(frame, 67.4) }}>
            1901 · <span style={{ color: C.electron }}>Marconi</span> sends a signal across the Atlantic
          </div>
          <div style={{ fontSize: 54, fontWeight: 300, marginTop: 30, opacity: at(frame, 72.8) }}>
            1 <span style={{ color: GOLD }}>hertz</span> = one cycle each second
          </div>
        </Panel>
      </Scene>

      <AbsoluteFill style={{ opacity: spectrum }}>
        {BANDS.map(([name, note, t, x]) => (
          <Panel key={name} opacity={at(frame, t)} style={{ left: x - 150, top: 690, width: 300, textAlign: 'center' }}>
            <div style={{ fontSize: 38, fontWeight: 300 }}>{name}</div>
            <div style={{ fontSize: 24, fontWeight: 300, color: C.dim, marginTop: 4 }}>{note}</div>
          </Panel>
        ))}
        <Panel opacity={1} style={{ left: 0, right: 0, top: 150, textAlign: 'center' }}>
          <Kicker>Hertz’s waves: metres long · light: under a thousandth of a millimetre</Kicker>
          <div style={{ fontSize: 64, fontWeight: 300, marginTop: 14 }}>{frame < T(103.6) ? 'Wavelength is the only difference' : 'They are all the same thing'}</div>
        </Panel>
      </AbsoluteFill>
      <Timeline frame={frame} already={[0, 1, 2, 3]} events={[[5, 8.0], [6, 67.4]]} />
    </Shell>
  );
};
