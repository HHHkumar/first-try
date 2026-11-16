import { useCurrentFrame } from 'remotion';
import voice from '../../../public/voice/fields/ch6.json';
import { span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../../ui/Shell';
import { Big, Kicker, Meter } from '../../ui/type';
import { at, Cap, EFIELD, GOLD, Ink, Spark, Timeline, VOICE } from './kit';

// Chapter 6 - Hertz: the wave found, and the spectrum.
export const F6_FRAMES = chapterFrames(voice.duration);
const sine = (x0: number, x1: number, y: number, amp: number, k: number, phase: number) => {
  let d = '';
  for (let x = x0; x <= x1; x += 6) d += `${x === x0 ? 'M' : 'L'} ${x} ${(y - amp * Math.sin((x - x0) * k - phase)).toFixed(1)} `;
  return d;
};
// the spectrum: a wave whose wavelength shrinks steadily from left to right
const chirp = (() => {
  let d = '';
  let ph = 0;
  for (let x = 160; x <= 1760; x += 2) {
    const u = (x - 160) / 1600;
    ph += 0.02 + 0.5 * u * u * u;
    d += `${x === 160 ? 'M' : 'L'} ${x} ${(520 - 70 * Math.sin(ph)).toFixed(1)} `;
  }
  return d;
})();
const BANDS: [string, string, number, number][] = [
  ['Radio', 'as long as a building', 87.4, 290],
  ['Microwaves', 'the size of your hand', 90.0, 600],
  ['Infrared', 'felt as warmth', 94.5, 880],
  ['Visible light', 'what your eyes detect', 97.1, 1130],
  ['Ultraviolet', '', 99.7, 1370],
  ['X-rays', 'smaller than an atom', 101.0, 1620],
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

  return (
    <Shell voice={VOICE(6)} frames={F6_FRAMES}>
      <Scene opacity={intro}>
        <Panel opacity={1} style={{ left: 0, right: 0, top: 240, textAlign: 'center' }}>
          <Kicker>Still only a prediction</Kicker>
          <div style={{ fontSize: 60, fontWeight: 300, color: C.dim, marginTop: 50, opacity: at(frame, 2.6) }}>Maxwell died in 1879, without seeing it tested</div>
          <Big size={100} style={{ marginTop: 50, opacity: at(frame, 7.2) }}>
            1887 · Heinrich Hertz
          </Big>
        </Panel>
      </Scene>

      <Scene opacity={lab}>
        <Ink>
          {/* the transmitter: two brass rods with a gap */}
          <path d="M 330 250 V 440 M 330 480 V 670" strokeWidth={9} stroke={GOLD} />
          <circle cx={330} cy={230} r={34} stroke={GOLD} />
          <circle cx={330} cy={690} r={34} stroke={GOLD} />
          <circle cx={330} cy={440} r={11} fill={GOLD} stroke={GOLD} />
          <circle cx={330} cy={480} r={11} fill={GOLD} stroke={GOLD} />
          {/* the receiver: a plain loop with a tiny gap */}
          <path d="M 1516 446 A 130 130 0 1 0 1516 474" strokeWidth={7} opacity={at(frame, 30.4)} />
          <path d="M 1740 260 V 660" strokeWidth={12} opacity={mirror} />
        </Ink>
        <Ink color={EFIELD} width={4} opacity={at(frame, 24.4) * 0.9}>
          <path d={sine(380, 1500, 460, 60, 0.03, frame * 0.35)} />
        </Ink>
        <Ink color={EFIELD} width={3} opacity={mirror * 0.5}>
          <path d={sine(1530, 1730, 460, 40, 0.03, -frame * 0.35)} />
        </Ink>
        <Spark x={330} y={460} frame={frame} size={46} opacity={firing} />
        <Spark x={1520} y={460} frame={frame + 5} size={22} opacity={answer} />
        <Panel opacity={at(frame, 18.4)} style={{ left: 180, top: 760, width: 300, textAlign: 'center' }}>
          <div style={{ fontSize: 30, fontWeight: 300, color: C.dim }}>a spark, millions of times a second</div>
        </Panel>
        <Panel opacity={at(frame, 30.4)} style={{ left: 1240, top: 640, width: 300, textAlign: 'center' }}>
          <div style={{ fontSize: 30, fontWeight: 300, color: C.dim }}>a loop of wire, connected to nothing</div>
        </Panel>
        <Panel opacity={at(frame, 55.8)} style={{ right: 110, top: 70 }}>
          <Meter label="Measured speed" value="the speed of light" color={GOLD} size={70} align="right" />
        </Panel>
        <Cap opacity={span(frame, T(12.9), T(30.3))} kicker="If Maxwell was right" title="Charge rushing back and forth should send out waves" />
        <Cap opacity={span(frame, T(30.5), T(40.1))} kicker="Across the room" title="A loop of wire with a tiny gap. No battery, no wires" />
        <Cap opacity={span(frame, T(40.3), T(47.7))} kicker="When the first spark fired" title="a faint spark appeared in the gap of the loop" />
        <Cap opacity={span(frame, T(47.9), T(59.9))} kicker="He tested it as you would test light" title="Reflected by a metal sheet, focused by a curved one" />
      </Scene>

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

      <Scene opacity={spectrum}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute' }}>
          <defs>
            <linearGradient id="rainbow" x1="0" x2="1">
              {['#ff3b30', '#ff9500', '#ffe600', '#34c759', '#32ade6', '#5856d6', '#af52de'].map((c, i) => (
                <stop key={c} offset={i / 6} stopColor={c} />
              ))}
            </linearGradient>
          </defs>
          <rect x={1090} y={420} width={80} height={200} fill="url(#rainbow)" opacity={0.75 * at(frame, 97.1)} rx={6} />
        </svg>
        <Ink color={EFIELD} width={3}>
          <path d={chirp} />
        </Ink>
        {BANDS.map(([name, note, t, x]) => (
          <Panel key={name} opacity={at(frame, t)} style={{ left: x - 150, top: 650, width: 300, textAlign: 'center' }}>
            <div style={{ fontSize: 38, fontWeight: 300 }}>{name}</div>
            <div style={{ fontSize: 24, fontWeight: 300, color: C.dim, marginTop: 4 }}>{note}</div>
          </Panel>
        ))}
        <Panel opacity={1} style={{ left: 0, right: 0, top: 150, textAlign: 'center' }}>
          <Kicker>Hertz’s waves: metres long · light: under a thousandth of a millimetre</Kicker>
          <div style={{ fontSize: 64, fontWeight: 300, marginTop: 14 }}>{frame < T(103.6) ? 'Wavelength is the only difference' : 'They are all the same thing'}</div>
        </Panel>
      </Scene>
      <Timeline frame={frame} already={[0, 1, 2, 3]} events={[[5, 8.0], [6, 67.4]]} />
    </Shell>
  );
};
