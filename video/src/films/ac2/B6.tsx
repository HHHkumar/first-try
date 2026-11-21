import { useCurrentFrame } from 'remotion';
import voice from '../../../public/voice/ac2/ch6.json';
import { lerp, ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { T, chapterFrames } from '../../ui/Shell';
import { Center, Frac, Kicker, Meter, Sym } from '../../ui/type';
import { rgb } from '../../world/Stage3D';
import { AShell, AStage, at, Cap, CYAN, PINK, ribbon, shot, SUN, sway, TEAL, VIOLET, WHITE } from '../ac/kit';
import { X0, X1, CX } from './B2';
import { capacitor, COPPER, cursor, dot, Timeline, VOICE } from './kit';

// Chapter 6 - Capacitive reactance: it falls as the frequency rises.
export const B6_FRAMES = chapterFrames(voice.duration);
const AX = 0.5;
const AMP = 2.2;
const K0 = 0.62;
const freq = (f: number) => 1 + ramp(f, T(5.0), T(10.4)) - ramp(f, T(24), T(28)) + 3 * ramp(f, T(37.6), T(40.0));
const cap = (f: number) => 1 + ramp(f, T(14.5), T(18.0)) - ramp(f, T(24), T(28));
// the graph of ohms against frequency
const GX = -9;
const GY = -2.4;
const coilLine = (u: number) => 0.3 * u;
const capLine = (u: number) => 16 / u;
const UX = Math.sqrt(16 / 0.3);

export const B6 = () => {
  const frame = useCurrentFrame();
  let phi = 0;
  for (let f = 0; f < frame; f++) phi += 0.05 * freq(f);
  const fr = freq(frame);
  const Cm = cap(frame);
  const dc = ramp(frame, T(40.7), T(43.2));
  const formula = span(frame, T(20.8), T(30.7), 12);
  const chart = frame >= T(52.2);
  const iAmp = Math.min(1.05, 0.25 * fr * Cm);
  const drawL = ramp(frame, T(54.2), T(57.0));
  const drawC = ramp(frame, T(57.0), T(59.6));
  const meet = at(frame, 59.8);

  return (
    <AShell
      voice={VOICE(6)}
      frames={B6_FRAMES}
      world={
        <AStage
          opacity={Math.max(shot(frame, -1, 52.3), shot(frame, 52.1, 200)) * lerp(1, 0.3, formula)}
          pose={chart ? { pos: [sway(frame), 2.0, 24], target: [0, 0.2, 0], fov: 34, focus: 24, dof: 0.02 } : { pos: [sway(frame), 2.3, 25], target: [-0.4, -0.5, 0], fov: 34, focus: 25, dof: 0.022 }}
          scene={(add) => {
            if (chart) {
              for (let x = GX; x <= 9.4; x += 0.07) add(x, GY, 0, 0.1, rgb(WHITE), 0.7);
              for (let y = GY; y <= 3.6; y += 0.07) add(GX, y, 0, 0.1, rgb(WHITE), 0.7);
              ribbon(add, GX + 0.05, GX + 0.05 + 18 * drawL, (x) => GY + coilLine(x - GX), () => rgb(COPPER), { axis: GY, fill: false, size: 0.24 });
              ribbon(add, GX + 2.7, GX + 2.7 + 15.4 * drawC, (x) => GY + capLine(x - GX), () => rgb(VIOLET), { axis: GY, fill: false, size: 0.24 });
              dot(add, GX + UX, GY + coilLine(UX), WHITE, meet * (0.7 + 0.3 * Math.sin(frame * 0.2)));
              cursor(add, GX + UX, GY, GY + coilLine(UX), meet);
              return;
            }
            const th = (x: number) => phi - (X1 - x) * K0 * fr;
            ribbon(add, X0, X1, (x) => AX + AMP * lerp(Math.sin(th(x)), 0.55, dc), () => rgb(PINK), { axis: AX, fill: false });
            ribbon(add, X0, X1, (x) => AX + AMP * lerp(iAmp * Math.sin(th(x) + Math.PI / 2), 0, dc), () => rgb(CYAN), { axis: AX, fill: false });
            cursor(add, X1, -2, 3, 0.7);
            capacitor(add, CX, 0.3, lerp(Math.sin(phi), 0.6, dc), frame, 1, { h: 1.3 + 0.4 * Cm });
          }}
        />
      }
    >
      <Panel opacity={span(frame, T(5.0), T(20.6))} style={{ right: 110, top: 60, display: 'flex', gap: 56 }}>
        <Meter label="Frequency" value={`× ${fr.toFixed(1)}`} color={TEAL} size={72} />
        <div style={{ opacity: at(frame, 14.5) }}>
          <Meter label="Capacitance" value={`× ${Cm.toFixed(1)}`} color={VIOLET} size={72} />
        </div>
        <Meter label="Current" value={`× ${(fr * Cm).toFixed(1)}`} color={CYAN} size={72} />
      </Panel>
      <Panel opacity={span(frame, T(30.9), T(52.1))} style={{ right: 110, top: 60, display: 'flex', gap: 56 }}>
        <Meter label="Capacitance" value="100" unit="µF" color={VIOLET} size={72} />
        <Meter label="Frequency" value={frame < T(37.6) ? '50' : frame < T(40.7) ? '5 000' : '0'} unit="Hz" color={TEAL} size={72} />
        <Meter label="Reactance" value={frame < T(37.6) ? '32' : frame < T(40.7) ? '0.32' : '∞'} unit="Ω" color={SUN} size={72} />
      </Panel>
      <Panel opacity={span(frame, T(52.3), T(200))} style={{ left: 0, top: 0, width: 1920, height: 1080 }}>
        <div style={{ position: 'absolute', left: 150, top: 120, fontSize: 30, fontWeight: 300, color: C.dim }}>reactance, in ohms</div>
        <div style={{ position: 'absolute', right: 150, top: 700, fontSize: 30, fontWeight: 300, color: C.dim }}>frequency →</div>
        <div style={{ position: 'absolute', left: 1330, top: 200, fontSize: 40, fontWeight: 300, color: COPPER, opacity: drawL }}>the coil climbs</div>
        <div style={{ position: 'absolute', left: 560, top: 200, fontSize: 40, fontWeight: 300, color: VIOLET, opacity: drawC }}>the capacitor falls</div>
      </Panel>
      <Center opacity={formula}>
        <Kicker style={{ marginBottom: 26, color: TEAL }}>The reactance of a capacitor</Kicker>
        <div style={{ fontSize: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 30 }}>
          <Sym color={SUN}>
            X<sub style={{ fontSize: '0.4em', fontStyle: 'normal' }}>C</sub>
          </Sym>
          <Sym color={C.dim} style={{ fontStyle: 'normal' }}>
            =
          </Sym>
          <Frac
            width={420}
            top={<Sym style={{ fontStyle: 'normal' }}>1</Sym>}
            bottom={
              <span>
                <Sym style={{ fontStyle: 'normal' }}>2π </Sym>
                <Sym color={TEAL}>f </Sym>
                <Sym color={VIOLET}>C</Sym>
              </span>
            }
          />
        </div>
      </Center>
      <Cap opacity={span(frame, T(0.2), T(4.8))} kicker="A capacitor has reactance too" title="But it behaves in the opposite way" />
      <Cap opacity={span(frame, T(5.0), T(14.3))} kicker="Raise the frequency: the plates charge and discharge more often" title="More charge moves each second, so the current is larger" />
      <Cap opacity={span(frame, T(14.5), T(20.6))} kicker="A larger capacitor holds more charge for the same voltage" title="So again the current is larger" />
      <Cap opacity={span(frame, T(30.9), T(37.4))} kicker="A hundred microfarads, at fifty hertz" title="About thirty-two ohms" />
      <Cap opacity={span(frame, T(37.6), T(40.5))} kicker="At five thousand hertz" title="A third of an ohm" />
      <Cap opacity={span(frame, T(40.7), T(52.1))} kicker="For a steady voltage, at zero frequency: no current at all" title="A capacitor blocks direct current and passes alternating current" />
      <Cap opacity={span(frame, T(52.5), T(59.6))} kicker="Set the two side by side" title="As frequency rises, the coil’s reactance climbs and the capacitor’s falls" />
      <Cap opacity={span(frame, T(59.8), T(200))} kicker="At one particular frequency they are equal" title="Something remarkable happens there. It has a video of its own" />
      <Timeline frame={frame} already={[0, 1, 2, 3]} />
    </AShell>
  );
};
