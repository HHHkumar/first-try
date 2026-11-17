import { useCurrentFrame } from 'remotion';
import voice from '../../../public/voice/ac2/ch4.json';
import { lerp, ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { T, chapterFrames } from '../../ui/Shell';
import { Big, Center, Kicker, Meter, Sub, Sym } from '../../ui/type';
import { rgb } from '../../world/Stage3D';
import { AShell, AStage, at, Cap, CYAN, PINK, ribbon, shot, SUN, sway, TEAL } from '../ac/kit';
import { X0, X1, CX } from './B2';
import { coil, COPPER, cursor, resistor, Timeline, VOICE } from './kit';

// Chapter 4 - Reactance: a coil's opposition grows with frequency and with inductance.
export const B4_FRAMES = chapterFrames(voice.duration);
const AX = 0.5;
const AMP = 2.2;
const K0 = 0.62;
// the frequency of the supply (relative), and the inductance (relative), through the chapter
const freq = (f: number) => 1 + ramp(f, T(15.2), T(22.0)) - ramp(f, T(33), T(37)) + 3 * ramp(f, T(45.7), T(48.2));
const ind = (f: number) => 1 + ramp(f, T(25.3), T(28.2)) - ramp(f, T(33), T(37));

export const B4 = () => {
  const frame = useCurrentFrame();
  let phi = 0;
  for (let f = 0; f < frame; f++) phi += 0.05 * freq(f);
  const fr = freq(frame);
  const L = ind(frame);
  const dc = ramp(frame, T(50.0), T(52.6));
  const formula = span(frame, T(28.8), T(39.3), 12);
  const versus = frame >= T(59.7);
  const name = span(frame, T(70.8), T(200), 12);
  const iAmp = 0.85 / (fr * L);
  const cur = lerp(iAmp * Math.sin(phi - Math.PI / 2), 1, dc);
  const now = frame * 0.06;

  return (
    <AShell
      voice={VOICE(4)}
      frames={B4_FRAMES}
      world={
        <AStage
          opacity={Math.max(shot(frame, -1, 59.8), shot(frame, 59.6, 200)) * lerp(1, 0.3, Math.max(formula, name))}
          pose={versus ? { pos: [sway(frame), 2.2, 20], target: [0, 0, 0], fov: 34, focus: 20, dof: 0.03 } : { pos: [sway(frame), 2.3, 25], target: [-0.4, -0.5, 0], fov: 34, focus: 25, dof: 0.022 }}
          scene={(add) => {
            if (versus) {
              // thirty-one ohms of resistance, and thirty-one ohms of reactance
              resistor(add, -5.5, 0, at(frame, 62.5) * (0.55 + 0.45 * Math.sin(now) ** 2), 1, 1.3);
              coil(add, 5.5, -0.2, Math.sin(now - 1.57), frame, 1, { len: 4.4, r: 1.3 });
              return;
            }
            const th = (x: number) => phi - (X1 - x) * K0 * fr;
            ribbon(add, X0, X1, (x) => AX + AMP * lerp(Math.sin(th(x)), 0.55, dc), () => rgb(PINK), { axis: AX, fill: false });
            ribbon(add, X0, X1, (x) => AX + AMP * lerp(iAmp * Math.sin(th(x) - Math.PI / 2), 0.95, dc), () => rgb(CYAN), { axis: AX, fill: false });
            cursor(add, X1, -2, 3, 0.7);
            coil(add, CX, 0.4, cur, frame, 1, { len: 3.4 + 1.2 * (L - 1), turns: Math.round(7 * L), r: 1.15 });
          }}
        />
      }
    >
      <Panel opacity={span(frame, T(13.4), T(28.6))} style={{ right: 110, top: 60, display: 'flex', gap: 56 }}>
        <Meter label="Frequency" value={`× ${fr.toFixed(1)}`} color={TEAL} size={72} />
        <div style={{ opacity: at(frame, 25.3) }}>
          <Meter label="Inductance" value={`× ${L.toFixed(1)}`} color={COPPER} size={72} />
        </div>
        <Meter label="Reactance" value={`× ${(fr * L).toFixed(1)}`} color={SUN} size={72} />
      </Panel>
      <Panel opacity={span(frame, T(39.5), T(59.6))} style={{ right: 110, top: 60, display: 'flex', gap: 56 }}>
        <Meter label="Inductance" value="0.1" unit="H" color={COPPER} size={72} />
        <Meter label="Frequency" value={frame < T(45.7) ? '50' : frame < T(50.0) ? '5 000' : '0'} unit="Hz" color={TEAL} size={72} />
        <Meter label="Reactance" value={frame < T(45.7) ? '31' : frame < T(50.0) ? '3 142' : '0'} unit="Ω" color={SUN} size={72} />
      </Panel>
      <Panel opacity={span(frame, T(59.8), T(70.6))} style={{ left: 0, right: 0, top: 70, display: 'flex', justifyContent: 'center', gap: 330 }}>
        <Meter label="Resistance" value="31" unit="Ω" color={PINK} size={84} align="center" />
        <Meter label="Reactance" value="31" unit="Ω" color={SUN} size={84} align="center" />
      </Panel>
      <Center opacity={formula}>
        <Kicker style={{ marginBottom: 26, color: TEAL }}>The reactance of a coil</Kicker>
        <div style={{ fontSize: 150, display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 30 }}>
          <Sym color={SUN}>
            X<sub style={{ fontSize: '0.4em', fontStyle: 'normal' }}>L</sub>
          </Sym>
          <Sym color={C.dim} style={{ fontStyle: 'normal' }}>
            =
          </Sym>
          <Sym style={{ fontStyle: 'normal' }}>2π</Sym>
          <Sym color={TEAL}>f</Sym>
          <Sym color={COPPER}>L</Sym>
        </div>
        <Sub style={{ opacity: at(frame, 34.8), color: C.text }}>measured in ohms: it is a voltage divided by a current</Sub>
      </Center>
      <Center opacity={name}>
        <Kicker style={{ marginBottom: 22, color: TEAL }}>1893 · Édouard Hospitalier, Paris</Kicker>
        <Big size={170} style={{ textShadow: `0 0 80px ${SUN}55` }}>
          <span style={{ color: SUN }}>Reactance</span>
        </Big>
        <Sub style={{ color: C.text }}>a new word, as alternating current was first being put to work</Sub>
      </Center>
      <Cap opacity={span(frame, T(0.2), T(5.0))} kicker="A coil on alternating current" title="limits the current, just as a resistor would" />
      <Cap opacity={span(frame, T(5.2), T(13.2))} kicker="But in a completely different way, so it has a different name" title="Reactance" />
      <Cap opacity={span(frame, T(13.4), T(21.9))} kicker="The faster the supply alternates, the faster the current must change" title="and the harder the coil pushes back" />
      <Cap opacity={span(frame, T(22.1), T(28.6))} kicker="Double the frequency, and the reactance doubles" title="A larger inductance pushes back harder still" />
      <Cap opacity={span(frame, T(39.5), T(45.5))} kicker="A coil of a tenth of a henry, at fifty hertz" title="About thirty-one ohms" />
      <Cap opacity={span(frame, T(45.7), T(49.8))} kicker="At five thousand hertz" title="The same coil has three thousand ohms" />
      <Cap opacity={span(frame, T(50.0), T(59.6))} kicker="For a steady current, at zero frequency, it has none" title="A coil passes direct current freely and holds back alternating current" />
      <Cap opacity={span(frame, T(59.8), T(70.6))} kicker="But these are not the ohms of a resistor" title={frame < T(65.4) ? 'A resistor with thirty-one ohms gets hot' : 'An ideal coil with thirty-one ohms does not'} />
      <Timeline frame={frame} already={[1, 2]} events={[[3, 70.8]]} />
    </AShell>
  );
};
