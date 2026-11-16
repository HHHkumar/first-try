import { useCurrentFrame } from 'remotion';
import voice from '../../../public/voice/inductance/ch7.json';
import { ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../../ui/Shell';
import { Frac, Kicker, Sym } from '../../ui/type';
import { CURRENT } from '../../world/magnet';
import { at, Cap, Ink, Timeline, VOICE, VOLT } from './kit';

// Chapter 7 - Inductors in circuits: the time constant, and direct against alternating current.
export const IND7_FRAMES = chapterFrames(voice.duration);
const OX = 380;
const OY = 780;
const GW = 1100;
const GH = 430;
const px = (t: number) => OX + (t / 6) * GW;
const py = (t: number) => OY - GH * (1 - Math.exp(-t));

const wave = (x0: number, x1: number, y: number, amp: number, k: number, phase: number) => {
  let d = '';
  for (let x = x0; x <= x1; x += 6) d += `${x === x0 ? 'M' : 'L'} ${x} ${(y - amp * Math.sin((x - x0) * k - phase)).toFixed(1)} `;
  return d;
};

export const Ind7 = () => {
  const frame = useCurrentFrame();
  const graph = span(frame, T(-1), T(29.9), 12);
  const acdc = span(frame, T(30.0), T(45.0), 12);
  const mirror = span(frame, T(45.1), T(70), 12);
  const drawn = ramp(frame, T(3.3), T(13.0)) * 6;
  let curve = '';
  for (let t = 0; t <= drawn; t += 0.05) curve += `${t === 0 ? 'M' : 'L'} ${px(t).toFixed(1)} ${py(t).toFixed(1)} `;
  const f = 1 + 3 * ramp(frame, T(39.5), T(44.4));
  const k = 0.022 * f;
  const held = 1 / Math.sqrt(1 + (f * 0.9) ** 2);

  return (
    <Shell voice={VOICE(7)} frames={IND7_FRAMES}>
      <Scene opacity={graph}>
        <Ink>
          <path d={`M ${OX} ${OY - GH - 50} V ${OY} H ${OX + GW + 40}`} strokeOpacity={0.6} />
          <path d={`M ${OX} ${OY - GH} H ${OX + GW}`} strokeDasharray="6 12" strokeOpacity={0.4} />
        </Ink>
        <Ink color={CURRENT} width={6}>{curve ? <path d={curve} /> : null}</Ink>
        <Ink color={C.electron} opacity={at(frame, 20.8)}>
          <path d={`M ${px(1)} ${OY} V ${py(1)} H ${OX}`} strokeDasharray="4 10" />
          <circle cx={px(1)} cy={py(1)} r={9} fill={C.electron} />
        </Ink>
        <Ink color={C.electron} opacity={at(frame, 26.2)}>
          <path d={`M ${px(5)} ${OY} V ${py(5)}`} strokeDasharray="4 10" />
          <circle cx={px(5)} cy={py(5)} r={9} fill={C.electron} />
        </Ink>
        <Panel opacity={1} style={{ left: OX - 250, top: OY - GH - 24, width: 230, textAlign: 'right' }}>
          <div style={{ fontSize: 28, fontWeight: 300, color: C.dim }}>final current</div>
        </Panel>
        <Panel opacity={at(frame, 20.8)} style={{ left: OX - 250, top: py(1) - 24, width: 230, textAlign: 'right' }}>
          <div style={{ fontSize: 34, color: C.electron }}>63 %</div>
        </Panel>
        <Panel opacity={at(frame, 20.8)} style={{ left: px(1) - 100, top: OY + 14, width: 200, textAlign: 'center' }}>
          <div style={{ fontSize: 30, color: C.electron }}>one time constant</div>
        </Panel>
        <Panel opacity={at(frame, 26.2)} style={{ left: px(5) - 100, top: OY + 14, width: 200, textAlign: 'center' }}>
          <div style={{ fontSize: 30, color: C.electron }}>five</div>
        </Panel>
        <Panel opacity={at(frame, 15.6)} style={{ right: 110, top: 70 }}>
          <Kicker>The time constant</Kicker>
          <div style={{ fontSize: 120, display: 'flex', alignItems: 'center', gap: 26 }}>
            <Sym color={C.electron}>τ</Sym>
            <Sym color={C.dim} style={{ fontStyle: 'normal' }}>
              =
            </Sym>
            <Frac width={110} top={<Sym color={CURRENT}>L</Sym>} bottom={<Sym color={VOLT}>R</Sym>} />
          </div>
        </Panel>
        <Panel opacity={span(frame, T(0.2), T(15.3))} style={{ left: 110, top: 90 }}>
          <Kicker>A coil and a resistor, connected to a battery</Kicker>
          <div style={{ fontSize: 50, fontWeight: 300, marginTop: 10, opacity: at(frame, 3.4) }}>The current cannot jump: it climbs</div>
        </Panel>
      </Scene>

      <Scene opacity={acdc}>
        {[0, 1].map((row) => {
          const y = 330 + row * 300;
          const ac = row === 1;
          return (
            <div key={row} style={{ opacity: ac ? at(frame, 35.6) : 1 }}>
              <Ink color={ac ? C.electron : CURRENT} width={5}>
                <path d={ac ? wave(240, 760, y, 80, k, frame * 0.25) : `M 240 ${y - 60} H 760`} />
                <path d={ac ? wave(1160, 1680, y, 80 * held, k, frame * 0.25 - 1) : `M 1160 ${y - 60} H 1680`} />
              </Ink>
              <Ink>
                <path d={`M 780 ${y} H 840 M 1080 ${y} H 1140`} strokeOpacity={0.5} />
                {Array.from({ length: 5 }, (_, i) => (
                  <path key={i} d={`M ${840 + i * 48} ${y} a 24 30 0 0 1 48 0`} />
                ))}
              </Ink>
              <Panel opacity={1} style={{ left: 240, top: y + 100, width: 1440, display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 34, fontWeight: 300 }}>{ac ? 'alternating current: always changing' : 'steady current: the coil is just a piece of wire'}</div>
                <div style={{ fontSize: 34, fontWeight: 300, color: ac ? C.electron : CURRENT }}>{ac ? 'held back, more as it alternates faster' : 'passes untouched'}</div>
              </Panel>
            </div>
          );
        })}
      </Scene>

      <Scene opacity={mirror}>
        <Panel opacity={1} style={{ left: 0, right: 0, top: 170, textAlign: 'center' }}>
          <Kicker>Mirror images</Kicker>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 110, marginTop: 50 }}>
            {[
              ['An inductor', 'passes direct current', 'holds back alternating current', CURRENT, 45.2],
              ['A capacitor', 'blocks direct current', 'passes alternating current', VOLT, 50.5],
            ].map(([name, a, b, color, t]) => (
              <div key={name as string} style={{ opacity: at(frame, t as number), width: 700 }}>
                <div style={{ fontSize: 84, fontWeight: 300, letterSpacing: -2, color: color as string }}>{name}</div>
                <div style={{ fontSize: 46, fontWeight: 300, marginTop: 26 }}>{a}</div>
                <div style={{ fontSize: 46, fontWeight: 300, marginTop: 10 }}>{b}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 40, fontWeight: 300, color: C.dim, marginTop: 80, opacity: at(frame, 55.4) }}>much of electrical engineering is built on playing one against the other</div>
        </Panel>
      </Scene>
      <Cap opacity={span(frame, T(30.2), T(35.4))} kicker="Once the current is steady" title="the coil does nothing at all" />
      <Timeline frame={frame} already={[0, 1, 2, 4, 5]} />
    </Shell>
  );
};
