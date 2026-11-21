import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/capacitance/ch6.json';
import { lerp, ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../../ui/Shell';
import { Frac, Kicker, Meter, Sym } from '../../ui/type';
import { drawArrow, POS } from '../../world/field';
import { rgb, Stage3D } from '../../world/Stage3D';
import { at, Cap, drawPlates, GOLD, Ink, PLATES, shot, Timeline, VOICE } from './kit';

// Chapter 6 - Where the energy is. Half C V squared, stored in the field.
export const CAPAC6_FRAMES = chapterFrames(voice.duration);

export const Capac6 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const sWorld = Math.max(shot(frame, -1, 13.4), shot(frame, 26.2, 37.4));
  const tri = span(frame, T(13.2), T(26.4), 12);
  const uses = ramp(frame, T(37.2), T(37.9));
  const flash = span(frame, T(37.2), T(45.2), 10);
  const defib = ramp(frame, T(45.0), T(45.6));

  // carrying charge across, one piece at a time: each one is harder than the last
  const filled = ramp(frame, T(1.4), T(11.6), Easing.linear);
  const n = Math.floor(filled * 6);
  const leg = (filled * 6) % 1;
  const cx = lerp(2.6, -2.6, leg);
  const glowE = ramp(frame, T(29.6), T(33.4));

  const charging = ramp(frame, T(46.6), T(48.6), Easing.out(Easing.quad));
  const shock = T(49.9);
  const fired = frame >= shock;
  const bang = fired ? Math.max(0, 1 - (frame - shock) / 14) : 0;
  const ecg = Array.from({ length: 220 }, (_, i) => {
    const x = 240 + i * 6.6;
    const tx = i / 220;
    const head = ramp(frame, T(45.6), T(53.0), Easing.linear);
    if (tx > head) return null;
    const after = frame >= shock && tx > (shock - T(45.6)) / (T(53.0) - T(45.6));
    let y = 0;
    if (after) {
      const ph = (i % 44) / 44;
      y = ph > 0.42 && ph < 0.46 ? -22 : ph >= 0.46 && ph < 0.5 ? 120 : ph >= 0.5 && ph < 0.55 ? -40 : ph > 0.7 && ph < 0.82 ? 16 : 0;
    } else y = 34 * Math.sin(i * 1.9) * Math.sin(i * 0.53 + 1) + 16 * Math.sin(i * 3.7);
    return `${x} ${800 - y}`;
  }).filter(Boolean);

  return (
    <Shell
      voice={VOICE(6)}
      frames={CAPAC6_FRAMES}
      world={
        uses < 1 ? (
          <AbsoluteFill style={{ opacity: sWorld }}>
            <Stage3D
              width={width}
              height={height}
              pose={{ ...PLATES, pos: [PLATES.pos[0] + Math.sin(frame * 0.004), PLATES.pos[1], PLATES.pos[2]] }}
              fog={0.012}
              orbs={(add) => {
                drawPlates(add, null, frame, {});
                if (frame < T(13.3) && filled < 1) add(cx, 0.3, 1.6, 0.6, rgb(POS), 1);
              }}
              glows={(add) => {
                const level = frame < T(13.3) ? 0.15 + 0.85 * (n / 6) : 1;
                drawPlates(null, add, frame, { charge: level, lineGain: 0.3 + 0.7 * level });
                if (frame < T(13.3) && filled < 1) {
                  add(cx, 0.3, 1.6, 2.2, rgb(POS), 0.3);
                  drawArrow(add, cx - 0.5, 0.3, 1.6, -1, 0, 0, 0.5 + 0.35 * n, '#fff3c4', 1, 0.14);
                }
                // the energy lives in the field itself: the space between the plates
                if (glowE > 0) {
                  const g = rgb(GOLD);
                  for (let x = -2.6; x <= 2.61; x += 0.65) for (let y = -2.6; y <= 2.61; y += 0.65) for (let z = -2.4; z <= 2.41; z += 1.2) add(x, y, z, 1.5, g, 0.05 * glowE * (0.8 + 0.2 * Math.sin(frame * 0.1 + x + y)));
                }
              }}
            />
          </AbsoluteFill>
        ) : null
      }
    >
      <Panel opacity={span(frame, T(1.4), T(13.2))} style={{ right: 110, top: 80, display: 'flex', gap: 56 }}>
        <Meter label="Charge carried across" value={`${n} of 6`} color={C.electron} size={72} />
        <Meter label="Push needed for the next" value={`× ${n + 1}`} color={GOLD} size={72} />
      </Panel>
      <Cap opacity={span(frame, T(0.2), T(5.2))} kicker="Charging a capacitor takes work" title="The first bit of charge crosses easily" />
      <Cap opacity={span(frame, T(5.5), T(13.2))} kicker="Each one after it" title="must be pushed against the voltage already there" />

      {/* the triangle: average push is half the final voltage */}
      <Scene opacity={tri}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute' }}>
          <g transform="translate(240,250)">
            <line x1={0} y1={520} x2={700} y2={520} stroke={C.dim} strokeWidth={2} />
            <line x1={0} y1={520} x2={0} y2={0} stroke={C.dim} strokeWidth={2} />
            <polygon points={`0,520 ${640 * ramp(frame, T(14.0), T(17.6))},520 ${640 * ramp(frame, T(14.0), T(17.6))},${520 - 440 * ramp(frame, T(14.0), T(17.6))}`} fill={GOLD} fillOpacity={0.3} />
            <line x1={0} y1={520} x2={640} y2={80} stroke={C.rho} strokeWidth={4} />
            <text x={700} y={566} fill={C.electron} fontSize={34} fontFamily="Sora" textAnchor="end">
              charge Q
            </text>
            <text x={-14} y={-18} fill={C.rho} fontSize={34} fontFamily="Sora">
              voltage V
            </text>
            <text x={420} y={420} fill={GOLD} fontSize={38} fontFamily="Sora" opacity={at(frame, 17.6)}>
              work = ½ Q V
            </text>
          </g>
        </svg>
        <Panel opacity={at(frame, 20.4)} style={{ left: 1040, top: 300 }}>
          <Kicker color={GOLD}>Energy stored</Kicker>
          <div style={{ fontSize: 170, display: 'flex', alignItems: 'center', gap: 34, marginTop: 10 }}>
            <Sym color={GOLD}>W</Sym>
            <Sym color={C.dim} style={{ fontStyle: 'normal' }}>
              =
            </Sym>
            <Frac width={90} show={at(frame, 22.4, 0.3)} top={<Sym>1</Sym>} bottom={<Sym>2</Sym>} />
            <Sym show={at(frame, 23.6, 0.3)}>C</Sym>
            <Sym color={C.rho} show={at(frame, 24.8, 0.3)}>
              V<sup style={{ fontSize: '0.5em', fontStyle: 'normal' }}>2</sup>
            </Sym>
          </div>
        </Panel>
        <Cap opacity={span(frame, T(13.7), T(20.2))} kicker="The voltage climbs steadily from zero" title="so the average push is half the final voltage" />
      </Scene>

      <Cap opacity={span(frame, T(26.7), T(29.4))} kicker="Where is that energy?" title="Not in the metal" />
      <Cap opacity={span(frame, T(29.7), T(37.2))} kicker="1860s · James Clerk Maxwell" title="It is in the field itself: empty space, holding energy" />

      <Scene opacity={uses}>
        {/* camera flash */}
        <AbsoluteFill style={{ opacity: flash }}>
          <AbsoluteFill style={{ background: `radial-gradient(circle 700px at 960px 470px, rgba(255,250,235,${frame % 40 < 4 ? 0.85 : 0.04}), rgba(255,250,235,0) 100%)` }} />
          <Ink>
            <rect x={740} y={360} width={440} height={260} rx={30} fill="rgba(215,230,255,0.04)" />
            <circle cx={960} cy={490} r={86} />
            <circle cx={960} cy={490} r={50} strokeOpacity={0.5} />
            <rect x={780} y={300} width={120} height={60} rx={10} />
          </Ink>
          <Panel opacity={1} style={{ left: 110, top: 80 }}>
            <Kicker>And it can come back very fast</Kicker>
            <div style={{ fontSize: 60, fontWeight: 300, letterSpacing: -1, marginTop: 10 }}>
              Seconds to charge, <span style={{ color: C.electron }}>a thousandth of a second to fire</span>
            </div>
          </Panel>
        </AbsoluteFill>

        {/* defibrillator */}
        <AbsoluteFill style={{ opacity: defib }}>
          <AbsoluteFill style={{ background: `rgba(255,250,235,${0.6 * bang})` }} />
          <Ink color="#ff8a8a" width={5}>
            <path d="M 960 560 C 860 470, 760 400, 800 310 C 840 230, 940 260, 960 330 C 980 260, 1080 230, 1120 310 C 1160 400, 1060 470, 960 560 Z" fill={`rgba(255,107,107,${0.12 + 0.3 * bang})`} transform={`translate(960 420) scale(${1 + (fired ? 0.06 * Math.max(0, Math.sin((frame - shock) * 0.43)) : 0)}) translate(-960 -420)`} />
          </Ink>
          <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute' }}>
            <polyline points={ecg.join(' ')} fill="none" stroke={fired ? '#7dffb0' : '#ff8a8a'} strokeWidth={4} strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 8px currentColor)' }} />
          </svg>
          <Panel opacity={1} style={{ right: 110, top: 80, width: 420 }}>
            <Meter label={fired ? 'Delivered' : 'Charging'} value={`${Math.round(200 * charging)}`} unit="J" color={GOLD} size={110} />
            <div style={{ position: 'relative', height: 20, borderRadius: 10, background: 'rgba(147,163,192,0.16)', marginTop: 10 }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(fired ? 0 : charging) * 100}%`, borderRadius: 10, background: GOLD }} />
            </div>
          </Panel>
          <Panel opacity={1} style={{ left: 110, top: 80 }}>
            <Kicker>A defibrillator</Kicker>
            <div style={{ fontSize: 56, fontWeight: 300, letterSpacing: -1, marginTop: 10, width: 1100 }}>A couple of hundred joules, in a few thousandths of a second</div>
          </Panel>
        </AbsoluteFill>
      </Scene>

      <Timeline frame={frame} already={[0, 1, 2, 5, 7]} events={[[6, 29.8]]} />
    </Shell>
  );
};
