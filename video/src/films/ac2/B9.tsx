import { useCurrentFrame } from 'remotion';
import voice from '../../../public/voice/ac2/ch9.json';
import { lerp, ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { T, TAIL } from '../../ui/Shell';
import { Big, Center, Frac, Kicker, Sub, Sym } from '../../ui/type';
import { AShell, AStage, at, Cap, CYAN, EndCard, PINK, SUN, sway, TEAL, VIOLET } from '../ac/kit';
import { SPOTS } from './B1';
import { COPPER, station, Timeline, VOICE } from './kit';

// Chapter 9 - Recap, a look ahead, and the closing card.
const END = 5.0;
export const B9_FRAMES = T(voice.duration + END) + TAIL;

export const B9 = () => {
  const frame = useCurrentFrame();
  const now = frame * 0.05;
  const hi = [span(frame, T(1.8), T(7.8), 10), span(frame, T(8.0), T(16.7), 10), span(frame, T(16.9), T(24.8), 10)];
  const any = Math.max(...hi);
  const formulas = span(frame, T(25.0), T(34.4), 12);
  const next = span(frame, T(39.5), T(62.3), 14);

  return (
    <AShell
      voice={VOICE(9)}
      frames={B9_FRAMES}
      world={
        <AStage
          opacity={lerp(1, 0.28, Math.max(formulas, next))}
          pose={{ pos: [sway(frame), 2.2, 26], target: [0, -0.1, 0], fov: 34, focus: 26, dof: 0.022 }}
          scene={(add) => SPOTS.forEach(([kind, cx], k) => station(add, cx, kind, now, frame, { p: 1, gain: 1 - 0.75 * (any - hi[k]) }))}
        />
      }
    >
      {SPOTS.map(([, , name, px], k) => (
        <Panel key={name} opacity={(1 - 0.7 * (any - hi[k])) * (1 - Math.max(formulas, next))} style={{ left: px - 250, width: 500, top: 54, textAlign: 'center' }}>
          <div style={{ fontSize: 44, fontWeight: 300, color: k === 0 ? C.text : k === 1 ? COPPER : VIOLET }}>{name}</div>
          <div style={{ fontSize: 28, fontWeight: 300, color: C.dim, marginTop: 2 }}>{['in step', 'current lags 90°', 'current leads 90°'][k]}</div>
        </Panel>
      ))}
      <Center opacity={formulas}>
        <Kicker style={{ marginBottom: 30, color: TEAL }}>Reactance, measured in ohms</Kicker>
        <div style={{ fontSize: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 150 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 22, opacity: at(frame, 29.6) }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, opacity: at(frame, 32.6) }}>
            <Sym color={SUN}>
              X<sub style={{ fontSize: '0.4em', fontStyle: 'normal' }}>C</sub>
            </Sym>
            <Sym color={C.dim} style={{ fontStyle: 'normal' }}>
              =
            </Sym>
            <Frac
              width={320}
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
        </div>
      </Center>
      <Cap opacity={span(frame, T(1.8), T(7.8))} kicker="In a resistor, the current keeps step with the voltage" title="and all the energy becomes heat" />
      <Cap opacity={span(frame, T(8.0), T(16.7))} kicker="In a coil, the voltage depends on how fast the current is changing" title="So the current lags the voltage by a quarter of a cycle" />
      <Cap opacity={span(frame, T(16.9), T(24.8))} kicker="In a capacitor, the current depends on how fast the voltage is changing" title="So the current leads by a quarter of a cycle" />
      <Cap opacity={span(frame, T(25.0), T(34.4))} kicker="Both oppose alternating current with reactance" title="A coil’s rises with frequency. A capacitor’s falls" />
      <Cap opacity={span(frame, T(34.6), T(39.3))} kicker="And reactance consumes no energy" title="It borrows it, and gives it back" />
      <Center opacity={next}>
        <Kicker style={{ marginBottom: 22, color: TEAL }}>Next time: resistance, inductance and capacitance, all at once</Kicker>
        <Big size={140} style={{ textShadow: `0 0 80px ${PINK}66` }}>
          <span style={{ color: PINK }}>Phasors</span> and <span style={{ color: CYAN }}>impedance</span>
        </Big>
        <Sub style={{ opacity: at(frame, 51.4), color: C.text }}>1893: every wave replaced by a simple turning arrow</Sub>
      </Center>
      <Timeline frame={frame} already={[0, 1, 2, 3]} events={[[4, 51.4]]} opacity={1 - ramp(frame, T(62.1), T(62.7))} />
      <EndCard frame={frame} from={62.5} />
    </AShell>
  );
};
