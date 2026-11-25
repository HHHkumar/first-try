import { useMemo } from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/charge/ch4.json';
import { lerp, ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../../ui/Shell';
import { Big, Center, Frac, Kicker, Meter, Sub, Sym } from '../../ui/type';
import { drawArrow, drawCharge, fibSphere, FIELD, POS, type Charge } from '../../world/field';
import { rgb, Stage3D } from '../../world/Stage3D';
import type { CameraPose } from '../../world/WireWorld';
import { at, Cap, Ink, shot, Timeline, VOICE } from './kit';

// Chapter 4 - Coulomb's law. The torsion balance, the two rules, and why the
// force falls with the square of the distance.
export const CHARGE4_FRAMES = chapterFrames(voice.duration);

export const Charge4 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const shell = useMemo(() => fibSphere(520), []);

  const balance = 1 - ramp(frame, T(26.4), T(27.0));
  const sRules = shot(frame, 26.6, 53.0);
  const sShells = shot(frame, 52.8, 71.6);
  const formula = span(frame, T(71.4), T(82.2), 12);
  const sBig = shot(frame, 82.0, 96.0);
  const sAdd = shot(frame, 95.8, 200);

  // the two rules
  const q1 = 1 + ramp(frame, T(32.6), T(33.6));
  const q2 = 1 + ramp(frame, T(35.4), T(36.4));
  const reset = ramp(frame, T(38.6), T(39.6));
  const dist = 1 + ramp(frame, T(43.8), T(45.6)) + ramp(frame, T(48.2), T(49.4));
  const a = lerp(q1, 1, reset);
  const b = lerp(q2, 1, reset);
  const force = (a * b) / (dist * dist);
  const half = 1.3 * dist;
  const fmt = (v: number) => (v >= 0.99 ? `${v.toFixed(v % 1 > 0.05 ? 1 : 0)} F` : v > 0.2 ? '¼ F' : '⅑ F');

  // torsion balance
  const near = ramp(frame, T(15.0), T(17.6), Easing.inOut(Easing.cubic));
  const twist = ramp(frame, T(17.6), T(19.4), Easing.out(Easing.cubic)) * 0.9;
  const ballX = 760 + Math.cos(twist) * 250;
  const ballY = 640 - Math.sin(twist) * 62;
  const tailX = 760 - Math.cos(twist) * 250;
  const tailY = 640 + Math.sin(twist) * 62;

  const orbit = frame * 0.004;
  const pose: CameraPose =
    frame < T(52.9)
      ? { pos: [0, 1.5, 15], target: [0, 0.2, 0], fov: 34, focus: 15, dof: 0.07 }
      : frame < T(71.5)
        ? { pos: [Math.sin(orbit) * 9, 5, Math.cos(orbit) * 9 + 9], target: [0, 0, 0], fov: 36, focus: 17, dof: 0.045 }
        : { pos: [0, 1.5, 15], target: [0, 0, 0], fov: 34, focus: 15, dof: 0.07 };
  const cam = pose.pos;

  const pair: Charge[] = [{ x: -half, y: 0.6, z: 0, q: 1 }, { x: half, y: 0.6, z: 0, q: 1 }];
  const three: Charge[] = [{ x: -3.2, y: -1.4, z: 0, q: 1 }, { x: 3.2, y: -1.4, z: 0, q: -1 }, { x: 0, y: 1.6, z: 0, q: 1 }];

  return (
    <Shell
      voice={VOICE(4)}
      frames={CHARGE4_FRAMES}
      world={
        frame > T(26.2) ? (
          <AbsoluteFill style={{ opacity: Math.max(sRules, sShells, sBig, sAdd) * (formula > 0 ? 1 - formula : 1) }}>
            <Stage3D
              width={width}
              height={height}
              pose={pose}
              fog={frame >= T(52.9) && frame < T(71.5) ? 0.012 : 0.02}
              orbs={(add) => {
                if (frame < T(52.9)) {
                  drawCharge(add, () => {}, pair[0], cam, 0.36 * Math.cbrt(a));
                  drawCharge(add, () => {}, pair[1], cam, 0.36 * Math.cbrt(b));
                } else if (frame < T(71.5)) drawCharge(add, () => {}, { x: 0, y: 0, z: 0, q: 1 }, cam, 0.5, 1, false);
                else if (frame < T(95.9)) for (const c of [{ x: -2.4, y: 0.6, z: 0, q: 1 }, { x: 2.4, y: 0.6, z: 0, q: 1 }]) drawCharge(add, () => {}, c, cam, 0.5);
                else three.forEach((c, i) => drawCharge(add, () => {}, c, cam, 0.42, i < 2 ? 1 : at(frame, 96.4)));
              }}
              glows={(add) => {
                if (frame < T(52.9)) {
                  drawCharge(() => {}, add, pair[0], cam, 0.36 * Math.cbrt(a));
                  drawCharge(() => {}, add, pair[1], cam, 0.36 * Math.cbrt(b));
                  const len = Math.min(3.4, 1.15 * force);
                  drawArrow(add, -half - 0.7, 0.6, 0, -1, 0, 0, len, POS, 1, 0.12);
                  drawArrow(add, half + 0.7, 0.6, 0, 1, 0, 0, len, POS, 1, 0.12);
                  // a ruler under the charges
                  const dim = rgb('#93a3c0');
                  for (let i = -60; i <= 60; i++) add(i * 0.13, -1.1, 0, 0.05, dim, 0.4);
                  for (let k = -3; k <= 3; k++) for (let j = 0; j < 5; j++) add(k * 2.6, -1.1 + j * 0.07, 0, 0.05, dim, 0.6);
                } else if (frame < T(71.5)) {
                  // the same influence, spread over bigger and bigger spheres
                  drawCharge(() => {}, add, { x: 0, y: 0, z: 0, q: 1 }, cam, 0.5, 1, false);
                  const c = rgb(FIELD);
                  const white = rgb('#f1eaff');
                  [2, 4, 6].forEach((R, k) => {
                    const seen = at(frame, 57.4 + k * 1.6, 1.0);
                    for (const d of shell) add(d[0] * R, d[1] * R, d[2] * R, 0.11, c, 0.75 * seen);
                  });
                  const R = ((frame * 0.045) % 6.4) + 0.5;
                  for (const d of shell) add(d[0] * R, d[1] * R, d[2] * R, 0.07, white, 0.4 * (1 - R / 7));
                } else if (frame < T(95.9)) {
                  for (const c of [{ x: -2.4, y: 0.6, z: 0, q: 1 }, { x: 2.4, y: 0.6, z: 0, q: 1 }]) drawCharge(() => {}, add, c, cam, 0.5);
                  const grow = ramp(frame, T(88.8), T(91.4), Easing.out(Easing.cubic));
                  drawArrow(add, -3.2, 0.6, 0, -1, 0, 0, 0.6 + 5.4 * grow, POS, 1, 0.16);
                  drawArrow(add, 3.2, 0.6, 0, 1, 0, 0, 0.6 + 5.4 * grow, POS, 1, 0.16);
                } else {
                  three.forEach((c, i) => drawCharge(() => {}, add, c, cam, 0.42, i < 2 ? 1 : at(frame, 96.4)));
                  // forces on the top charge from each of the others, then their sum
                  const f1 = at(frame, 99.6);
                  const f2 = at(frame, 100.6);
                  const sum = at(frame, 102.2);
                  drawArrow(add, 0.35, 2.0, 0, 3.2, 3.0, 0, 1.7, POS, f1, 0.1);
                  drawArrow(add, 0.4, 1.3, 0, 3.2, -3.0, 0, 1.7, POS, f2, 0.1);
                  drawArrow(add, 0.6, 1.6, 0, 1, 0, 0, 2.5, '#eafcff', sum, 0.15);
                }
              }}
            />
          </AbsoluteFill>
        ) : null
      }
    >
      {/* Coulomb's torsion balance */}
      <Scene opacity={balance}>
        <Ink>
          {/* glass case */}
          <path d="M 420 300 V 800 M 1100 300 V 800" strokeOpacity={0.55} />
          <ellipse cx={760} cy={300} rx={340} ry={70} strokeOpacity={0.55} />
          <path d="M 420 800 A 340 70 0 0 0 1100 800" strokeOpacity={0.55} />
          <path d="M 700 300 V 110 H 820 V 300" strokeOpacity={0.55} />
          {/* the fine wire and the twist head */}
          <path d="M 760 90 V 640" strokeWidth={1.6} />
          <circle cx={760} cy={90} r={22} />
          <path d={`M 760 90 l ${Math.sin(twist) * 46} ${-Math.cos(twist) * 46}`} strokeWidth={5} />
          {/* the light rod */}
          <path d={`M ${tailX} ${tailY} L ${ballX} ${ballY}`} strokeWidth={5} />
          <circle cx={tailX} cy={tailY} r={12} fill="#93a3c0" />
        </Ink>
        <Ink color={POS} width={4}>
          <circle cx={ballX} cy={ballY} r={30} fill={`${POS}55`} />
          {/* the second charged ball, lowered in beside the first */}
          <g opacity={at(frame, 14.6)}>
            <path d={`M 1090 ${lerp(-200, 120, near)} V ${lerp(280, 600, near)}`} stroke="#d7e6ff" />
            <circle cx={1090} cy={lerp(310, 640, near)} r={30} fill={`${POS}55`} />
          </g>
        </Ink>
        <Panel opacity={at(frame, 19.0)} style={{ left: 1240, top: 300, width: 560 }}>
          <Kicker>The twist in the wire</Kicker>
          <div style={{ fontSize: 56, fontWeight: 300, marginTop: 10, lineHeight: 1.2 }}>measures the force between the two charges</div>
        </Panel>
        <Cap opacity={span(frame, T(3.0), T(26.2))} kicker="1785 · Charles Coulomb" title="A balance fine enough to weigh the electric force" />
      </Scene>

      {/* rule one and rule two */}
      <Panel opacity={span(frame, T(29.2), T(52.8))} style={{ left: 110, top: 80 }}>
        <Kicker>{frame < T(38.8) ? 'First rule' : 'Second rule'}</Kicker>
        <div style={{ fontSize: 60, fontWeight: 300, letterSpacing: -1, marginTop: 10 }}>{frame < T(38.8) ? 'The force grows with each charge' : 'The force falls with distance, and fast'}</div>
      </Panel>
      <Panel opacity={span(frame, T(29.2), T(52.8))} style={{ right: 110, top: 80, display: 'flex', gap: 60 }}>
        <Meter label="Charges" value={`${a.toFixed(a % 1 > 0.05 ? 1 : 0)} q · ${b.toFixed(b % 1 > 0.05 ? 1 : 0)} q`} size={62} />
        <Meter label="Distance" value={`${dist.toFixed(dist % 1 > 0.05 ? 1 : 0)} r`} size={62} />
        <Meter label="Force" value={fmt(force)} color={C.rho} size={62} />
      </Panel>
      <Cap opacity={span(frame, T(50.8), T(52.8), 8)} kicker="This is" title="an inverse square law" />

      {/* why the square */}
      <Cap opacity={span(frame, T(53.4), T(60.4))} kicker="Why that shape?" title="Picture the influence of a charge spreading evenly outward" />
      <Cap opacity={span(frame, T(60.6), T(71.4))} kicker="The area of a sphere grows with r²" title="The same influence, spread four times as thin" />
      <Panel opacity={span(frame, T(57.4), T(71.4))} style={{ right: 110, top: 86, textAlign: 'right', fontSize: 46, fontWeight: 300, lineHeight: 1.5 }}>
        <div style={{ opacity: at(frame, 57.4) }}>
          at r <span style={{ color: C.rho }}>full strength</span>
        </div>
        <div style={{ opacity: at(frame, 59.0) }}>
          at 2 r <span style={{ color: C.rho }}>one quarter</span>
        </div>
        <div style={{ opacity: at(frame, 60.6) }}>
          at 3 r <span style={{ color: C.rho }}>one ninth</span>
        </div>
      </Panel>

      {/* the law */}
      <Scene opacity={formula}>
        <Center>
          <Kicker style={{ marginBottom: 40 }}>Coulomb’s law</Kicker>
          <div style={{ fontSize: 210, display: 'flex', alignItems: 'center', gap: 44 }}>
            <Sym color={C.rho} show={at(frame, 74.9, 0.4)}>
              F
            </Sym>
            <Sym color={C.dim} show={at(frame, 75.3, 0.4)} style={{ fontStyle: 'normal' }}>
              =
            </Sym>
            <Sym show={at(frame, 76.2, 0.4)}>k</Sym>
            <Frac
              width={420}
              show={at(frame, 77.4, 0.4)}
              top={
                <span>
                  <Sym color={POS}>
                    q<sub style={{ fontSize: '0.45em' }}>1</sub>
                  </Sym>{' '}
                  <Sym color={POS} show={at(frame, 78.7, 0.4)}>
                    q<sub style={{ fontSize: '0.45em' }}>2</sub>
                  </Sym>
                </span>
              }
              bottom={
                <Sym color={C.shape} show={at(frame, 79.8, 0.4)}>
                  r<sup style={{ fontSize: '0.5em', fontStyle: 'normal' }}>2</sup>
                </Sym>
              }
            />
          </div>
        </Center>
      </Scene>

      {/* the size of the constant */}
      <Panel opacity={span(frame, T(82.4), T(95.8))} style={{ left: 110, top: 80 }}>
        <Kicker>The constant is huge</Kicker>
        <div style={{ fontSize: 96, fontWeight: 300, letterSpacing: -2, marginTop: 6 }}>
          k = 9,000,000,000 <span style={{ fontSize: 40, color: C.dim }}>N·m²/C²</span>
        </div>
      </Panel>
      <Panel opacity={span(frame, T(85.8), T(95.8))} style={{ left: 0, right: 0, top: 640, textAlign: 'center' }}>
        <Sub style={{ marginTop: 0 }}>two charges of one coulomb each, one metre apart</Sub>
        <Big size={84} style={{ color: C.rho, opacity: at(frame, 90.2) }}>
          a push of nearly a million tonnes
        </Big>
      </Panel>

      {/* more than two charges */}
      <Cap opacity={span(frame, T(96.4), T(103.8))} kicker="More than two charges?" title="Find each force separately, then add them as arrows" />

      <Timeline frame={frame} already={[0, 1, 2, 3, 10, 11]} events={[[5, 3.1]]} />
    </Shell>
  );
};
