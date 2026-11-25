import { useMemo } from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/charge/ch3.json';
import { lerp, ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../../ui/Shell';
import { Tube } from '../../ui/Tube';
import { Big, Center, Kicker, Meter, Sub } from '../../ui/type';
import { drawArrow, drawCharge, fibSphere, FIELD, NEG, POS } from '../../world/field';
import { mulberry32 } from '../../world/rng';
import { rgb, Stage3D } from '../../world/Stage3D';
import type { CameraPose } from '../../world/WireWorld';
import { at, Cap, drawPairs, Ink, shot, Timeline, VOICE } from './kit';

// Chapter 3 - Charge. Two kinds, conserved, quantised, and measured in coulombs.
export const CHARGE3_FRAMES = chapterFrames(voice.duration);
const HOPS = 12;

export const Charge3 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const lump = useMemo(() => fibSphere(420), []);
  const nucleus = useMemo(() => {
    const rand = mulberry32(4);
    return fibSphere(12).map((d, i) => ({ p: [d[0] * 0.42, d[1] * 0.42, d[2] * 0.42] as [number, number, number], proton: i % 2 === 0, j: rand() }));
  }, []);
  const hops = useMemo(() => {
    const rand = mulberry32(12);
    return Array.from({ length: HOPS }, (_, i) => ({ y: 250 + i * 46 + rand() * 12, t: 50.4 + i * 0.3 + rand() * 0.2 }));
  }, []);

  const sMass = shot(frame, -1, 14.1);
  const sKinds = shot(frame, 13.9, 35.8);
  const sAtom = shot(frame, 35.6, 49.5);
  const bench = ramp(frame, T(49.3), T(49.9));
  const hair = span(frame, T(49.3), T(66.4), 12);
  const thomson = span(frame, T(66.4), T(89.1), 12);
  const steps = span(frame, T(89.1), T(109.9), 12);
  const coulomb = ramp(frame, T(109.9), T(110.5));
  const pairs = frame >= T(29.2);

  const pose: CameraPose = { pos: [Math.sin(frame * 0.004) * 1.2, 0.8, 13], target: [0, 0, 0], fov: 34, focus: 13, dof: 0.09 };
  const cam = pose.pos;
  const arrived = hops.filter((h) => frame >= T(h.t + 1.3)).length;
  const typed = Math.round(6 * ramp(frame, T(113.6), T(116.0), Easing.linear));
  const bend = ramp(frame, T(74.2), T(76.6));
  const step = Math.min(5, Math.floor(ramp(frame, T(91.4), T(96.0), Easing.linear) * 5.99));

  return (
    <Shell
      voice={VOICE(3)}
      frames={CHARGE3_FRAMES}
      world={
        bench < 1 ? (
          <AbsoluteFill style={{ opacity: Math.max(sMass, sKinds, sAtom) }}>
            <Stage3D
              width={width}
              height={height}
              pose={pose}
              orbs={(add) => {
                if (frame < T(14.0)) {
                  drawCharge(add, () => {}, { x: 3.4, y: 1.4, z: 0, q: 1 }, cam, 0.5, at(frame, 9.6));
                } else if (frame < T(35.7)) {
                  if (pairs) drawPairs(add, null, cam, frame, at(frame, 29.4), at(frame, 33.0));
                  else {
                    drawCharge(add, () => {}, { x: -2.6, y: 0.3, z: 0, q: 1 }, cam, 0.62, at(frame, 21.6));
                    drawCharge(add, () => {}, { x: 2.6, y: 0.3, z: 0, q: -1 }, cam, 0.62, at(frame, 24.0));
                  }
                } else {
                  const grey = rgb('#9aa6c0');
                  const p = rgb(POS);
                  for (const n of nucleus) add(n.p[0], n.p[1], n.p[2], 0.42, n.proton ? p : grey, 1);
                }
              }}
              glows={(add) => {
                if (frame < T(14.0)) {
                  // mass answers to gravity...
                  const grey = rgb('#aab6d0');
                  for (let i = 0; i < lump.length; i++) add(-3.4 + lump[i][0] * 1.1, 1.4 + lump[i][1] * 1.1, lump[i][2] * 1.1, 0.14, grey, 0.75 * at(frame, 5.6));
                  drawArrow(add, -3.4, 0.1, 0, 0, -1, 0, 1.3, '#aab6d0', at(frame, 7.4), 0.12);
                  // ...and charge answers to the electric force
                  drawCharge(() => {}, add, { x: 3.4, y: 1.4, z: 0, q: 1 }, cam, 0.5, at(frame, 9.6));
                  drawArrow(add, 4.2, 1.4, 0, 1, 0, 0, 1.8, FIELD, at(frame, 11.6), 0.12);
                } else if (frame < T(35.7)) {
                  if (pairs) drawPairs(null, add, cam, frame, at(frame, 29.4), at(frame, 33.0));
                  else {
                    drawCharge(() => {}, add, { x: -2.6, y: 0.3, z: 0, q: 1 }, cam, 0.62, at(frame, 21.6));
                    drawCharge(() => {}, add, { x: 2.6, y: 0.3, z: 0, q: -1 }, cam, 0.62, at(frame, 24.0));
                  }
                } else {
                  // an atom: six electrons around six protons
                  add(0, 0, 0, 3.4, rgb(POS), 0.3);
                  const e = rgb(NEG);
                  const white = rgb('#eafcff');
                  for (let k = 0; k < 6; k++) {
                    const R = k < 2 ? 1.9 : 3.3;
                    const tilt = k * 1.05;
                    for (let j = 0; j < 46; j++) {
                      const a = frame * (k < 2 ? 0.11 : 0.07) + k * 2.1 - j * 0.045;
                      const x = Math.cos(a) * R;
                      const y0 = Math.sin(a) * R;
                      const y = y0 * Math.cos(tilt);
                      const z = y0 * Math.sin(tilt);
                      const t = 1 - j / 46;
                      if (j === 0) {
                        add(x, y, z, 0.6, e, 0.7);
                        add(x, y, z, 0.2, white, 1);
                      } else add(x, y, z, 0.05 + 0.08 * t, e, 0.4 * t * t);
                    }
                  }
                }
              }}
            />
          </AbsoluteFill>
        ) : null
      }
    >
      {/* mass and charge */}
      <Panel opacity={span(frame, T(5.4), T(13.9))} style={{ left: 250, top: 730, width: 440, textAlign: 'center' }}>
        <Big size={64}>Mass</Big>
        <Sub style={{ marginTop: 6, fontSize: 32 }}>how strongly it answers gravity</Sub>
      </Panel>
      <Panel opacity={span(frame, T(9.6), T(13.9))} style={{ left: 1230, top: 730, width: 440, textAlign: 'center' }}>
        <Big size={64} style={{ color: POS }}>
          Charge
        </Big>
        <Sub style={{ marginTop: 6, fontSize: 32 }}>how strongly it answers the electric force</Sub>
      </Panel>
      <Cap opacity={span(frame, T(0.1), T(5.2))} kicker="The source" title="A property of matter called charge" />

      {/* two kinds */}
      <Cap opacity={span(frame, T(14.6), T(21.4))} kicker="But charge comes in two kinds" title="and that changes everything" />
      <Panel opacity={span(frame, T(21.7), T(29.2))} style={{ left: 330, top: 640, width: 520, textAlign: 'center' }}>
        <Big size={64} style={{ color: POS }}>
          Proton
        </Big>
        <Sub style={{ marginTop: 6, fontSize: 34, opacity: at(frame, 27.2) }}>+ 1.6 × 10⁻¹⁹ C</Sub>
      </Panel>
      <Panel opacity={span(frame, T(24.0), T(29.2))} style={{ left: 1070, top: 640, width: 520, textAlign: 'center' }}>
        <Big size={64} style={{ color: NEG }}>
          Electron
        </Big>
        <Sub style={{ marginTop: 6, fontSize: 34, opacity: at(frame, 27.2) }}>− 1.6 × 10⁻¹⁹ C</Sub>
      </Panel>
      <Cap opacity={span(frame, T(27.0), T(29.2), 8)} kicker="Opposite in kind" title="Exactly equal in size" />
      <Panel opacity={span(frame, T(29.6), T(35.6))} style={{ left: 0, right: 0, top: 100, textAlign: 'center' }}>
        <div style={{ fontSize: 44, fontWeight: 300 }}>the same kind: they push apart</div>
      </Panel>
      <Panel opacity={span(frame, T(33.2), T(35.6), 8)} style={{ left: 0, right: 0, top: 520, textAlign: 'center' }}>
        <div style={{ fontSize: 44, fontWeight: 300, color: C.electron }}>opposite kinds: they pull together</div>
      </Panel>

      {/* the neutral atom */}
      <Panel opacity={span(frame, T(38.0), T(49.3))} style={{ right: 110, top: 86, display: 'flex', gap: 50 }}>
        <Meter label="Protons" value="+6" color={POS} size={84} />
        <Meter label="Electrons" value="−6" color={NEG} size={84} />
        <div style={{ opacity: at(frame, 40.4) }}>
          <Meter label="Net charge" value="0" size={84} />
        </div>
      </Panel>
      <Cap opacity={span(frame, T(36.2), T(43.0))} kicker="An ordinary atom" title="As many electrons as protons: neutral" />
      <Cap opacity={span(frame, T(43.3), T(49.2))} kicker="Charging an object" title="creates nothing. It only moves electrons." />

      <Scene opacity={bench}>
        {/* hair and balloon */}
        <AbsoluteFill style={{ opacity: hair }}>
          <Ink>
            {Array.from({ length: 12 }, (_, i) => (
              <path key={i} d={`M 120 ${240 + i * 46} C 300 ${230 + i * 46}, 420 ${262 + i * 46}, 560 ${250 + i * 46 + 8 * Math.sin(frame * 0.06 + i)}`} strokeWidth={3} />
            ))}
          </Ink>
          <Ink color={NEG} width={5}>
            <path d="M 1560 110 C 1260 300, 1260 720, 1560 900" fill="none" />
            <path d="M 1560 110 C 1260 300, 1260 720, 1560 900 L 1920 900 L 1920 110 Z" fill={`${NEG}18`} stroke="none" />
          </Ink>
          <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute' }}>
            {hops.map((h, i) => {
              const t = ramp(frame, T(h.t), T(h.t + 1.3), Easing.inOut(Easing.cubic));
              const x = lerp(560, 1350 + Math.abs(i - 5.5) * 9, t);
              const y = h.y - Math.sin(t * Math.PI) * 60;
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r={20} fill={NEG} opacity={0.25} />
                  <circle cx={x} cy={y} r={8} fill="#eafcff" />
                </g>
              );
            })}
          </svg>
          <Panel opacity={at(frame, 51.0)} style={{ left: 640, top: 60, display: 'flex', gap: 70 }}>
            <Meter label="Your hair" value={`+${arrived}`} color={POS} size={90} />
            <Meter label="The balloon" value={`−${arrived}`} color={NEG} size={90} />
            <div style={{ opacity: at(frame, 59.2) }}>
              <Meter label="Total" value="0" size={90} />
            </div>
          </Panel>
          <Cap opacity={span(frame, T(49.9), T(61.4))} kicker="Rub the balloon" title="Electrons leave your hair and settle on the rubber" />
          <Cap opacity={span(frame, T(61.7), T(66.2))} kicker="Charge is never made, never destroyed" title="It is only moved" />
        </AbsoluteFill>

        {/* Thomson and the direction of current */}
        <AbsoluteFill style={{ opacity: thomson }}>
          <AbsoluteFill style={{ opacity: 1 - ramp(frame, T(81.4), T(82.0)) }}>
            <Ink opacity={at(frame, 72.4)}>
              <path d="M 300 420 H 1100 C 1260 420, 1380 300, 1560 300 V 760 C 1380 760, 1260 640, 1100 640 H 300 Z" fill="rgba(147,163,192,0.05)" />
              <path d="M 360 480 V 580" strokeWidth={9} />
              <path d="M 520 440 V 505 M 520 555 V 620" strokeWidth={7} />
              <path d="M 760 440 H 1000 M 760 620 H 1000" strokeWidth={7} />
            </Ink>
            <Ink color={NEG} width={6} opacity={at(frame, 73.0)}>
              <path d={`M 370 530 H 760 Q 1000 530 1520 ${lerp(530, 372, bend)}`} />
              <circle cx={1528} cy={lerp(530, 370, bend)} r={16} fill={NEG} />
            </Ink>
            <Panel opacity={at(frame, 74.0)} style={{ left: 760, top: 350, width: 240, textAlign: 'center', fontSize: 44, color: POS }}>
              +
            </Panel>
            <Panel opacity={at(frame, 74.0)} style={{ left: 760, top: 640, width: 240, textAlign: 'center', fontSize: 44, color: NEG }}>
              −
            </Panel>
            <Cap opacity={span(frame, T(72.6), T(81.2))} kicker="1897 · J. J. Thomson" title="The thing that moves is the electron, and it is negative" />
            <Center opacity={span(frame, T(67.0), T(72.2), 10)}>
              <Kicker>Franklin had to guess which way it flowed</Kicker>
              <Big size={110}>He guessed wrong</Big>
            </Center>
          </AbsoluteFill>
          <AbsoluteFill style={{ opacity: ramp(frame, T(81.6), T(82.2)) }}>
            <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute' }}>
              <Tube x={420} y={520} length={1080} radius={62} frame={frame} flow={-2.2} density={5} seed={3} />
              <path d="M 520 360 H 1380 M 1340 330 L 1384 360 L 1340 390" fill="none" stroke={C.rho} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 1400 690 H 540 M 580 660 L 536 690 L 580 720" fill="none" stroke={NEG} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" opacity={at(frame, 85.8)} />
            </svg>
            <Panel opacity={1} style={{ left: 0, right: 0, top: 260, textAlign: 'center', fontSize: 46, fontWeight: 300, color: C.rho }}>
              the current we draw
            </Panel>
            <Panel opacity={at(frame, 85.8)} style={{ left: 0, right: 0, top: 730, textAlign: 'center', fontSize: 46, fontWeight: 300, color: NEG }}>
              the electrons that carry it
            </Panel>
          </AbsoluteFill>
        </AbsoluteFill>

        {/* whole steps */}
        <AbsoluteFill style={{ opacity: steps }}>
          <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute' }}>
            <g transform="translate(170,300)">
              <line x1={0} y1={420} x2={640} y2={420} stroke={C.dim} strokeWidth={2} />
              <line x1={0} y1={420} x2={0} y2={0} stroke={C.dim} strokeWidth={2} />
              {[1, 2, 3, 4, 5].map((k) => (
                <g key={k}>
                  <text x={-18} y={420 - k * 76 + 8} fill={C.dim} fontSize={26} fontFamily="Sora" textAnchor="end">
                    {k} e
                  </text>
                  <path d={`M ${(k - 1) * 120} ${420 - (k - 1) * 76} H ${k * 120} V ${420 - k * 76}`} fill="none" stroke={k <= step ? C.electron : 'rgba(147,163,192,0.35)'} strokeWidth={5} strokeLinejoin="round" />
                </g>
              ))}
              <circle cx={step * 120 - (step > 0 ? 60 : 0) + (step === 0 ? 0 : 0)} cy={420 - step * 76} r={13} fill="#eafcff" style={{ filter: `drop-shadow(0 0 10px ${C.electron})` }} />
              <g opacity={at(frame, 96.3)}>
                <text x={300} y={420 - 2.5 * 76 + 10} fill="#ff6b6b" fontSize={34} fontFamily="Sora">
                  2½ e ?
                </text>
                <path d={`M 290 ${420 - 2.5 * 76 - 22} l 150 40 m 0 -40 l -150 40`} stroke="#ff6b6b" strokeWidth={4} />
              </g>
            </g>
            {/* Millikan's oil drop */}
            <g opacity={at(frame, 99.4)} transform="translate(1040,0)">
              <line x1={60} y1={330} x2={700} y2={330} stroke={POS} strokeWidth={9} strokeLinecap="round" />
              <line x1={60} y1={760} x2={700} y2={760} stroke={NEG} strokeWidth={9} strokeLinecap="round" />
              <g transform={`translate(380, ${545 + 6 * Math.sin(frame * 0.07)})`}>
                <circle r={26} fill="#f7ecc0" fillOpacity={0.85} style={{ filter: 'drop-shadow(0 0 14px #f7ecc0)' }} />
                <path d="M 0 -40 V -130 M -14 -112 L 0 -134 L 14 -112" fill="none" stroke={C.electron} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 0 40 V 130 M -14 112 L 0 134 L 14 112" fill="none" stroke={C.dim} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
              </g>
              <text x={420} y={470} fill={C.electron} fontSize={28} fontFamily="Sora">
                electric pull
              </text>
              <text x={420} y={650} fill={C.dim} fontSize={28} fontFamily="Sora">
                weight
              </text>
            </g>
          </svg>
          <Panel opacity={1} style={{ left: 110, top: 80 }}>
            <Kicker>Charge comes in whole steps</Kicker>
            <div style={{ fontSize: 62, fontWeight: 300, letterSpacing: -1, marginTop: 10 }}>
              One, two, a billion: <span style={{ color: C.electron, opacity: at(frame, 96.2) }}>never half</span>
            </div>
          </Panel>
          <Panel opacity={at(frame, 105.0)} style={{ left: 1100, top: 820 }}>
            <Kicker color={C.dim}>Charge on each drop</Kicker>
            <div style={{ fontSize: 50, fontWeight: 300, marginTop: 8 }}>3 e · 5 e · 2 e · 8 e · 4 e</div>
          </Panel>
          <Cap opacity={span(frame, T(98.0), T(109.6))} kicker="About 1910 · Robert Millikan" title="Oil drops balanced between two plates" />
        </AbsoluteFill>

        {/* the coulomb */}
        <AbsoluteFill style={{ opacity: coulomb }}>
          <Panel opacity={1} style={{ left: 110, top: 200 }}>
            <Kicker>The unit of charge</Kicker>
            <div style={{ fontSize: 130, fontWeight: 300, letterSpacing: -3, marginTop: 6 }}>1 coulomb</div>
            <div style={{ fontSize: 66, fontWeight: 300, color: C.electron, marginTop: 20, fontVariantNumeric: 'tabular-nums', height: 84, opacity: typed > 0 ? 1 : 0 }}>
              = 6{',000'.repeat(typed)}
            </div>
            <div style={{ fontSize: 40, fontWeight: 300, color: C.dim, opacity: at(frame, 115.6) }}>electrons: about six billion billion</div>
          </Panel>
          <Ink color="#fff3c4" width={7} opacity={at(frame, 119.2, 0.2)} style={{ filter: 'drop-shadow(0 0 22px #ffe08a)' }}>
            <path d="M 1520 60 L 1430 330 L 1540 350 L 1400 620 L 1500 640 L 1380 900" />
            <path d="M 1430 330 L 1330 440 M 1400 620 L 1560 760" strokeWidth={4} />
          </Ink>
          <Panel opacity={at(frame, 119.8)} style={{ left: 880, top: 640, width: 520 }}>
            <Kicker color="#ffe08a">A whole lightning bolt</Kicker>
            <div style={{ fontSize: 76, fontWeight: 300 }}>about 15 C</div>
          </Panel>
        </AbsoluteFill>
      </Scene>

      <Timeline frame={frame} already={[0, 1, 2, 3]} events={[[10, 76.4], [11, 97.9]]} />
    </Shell>
  );
};
