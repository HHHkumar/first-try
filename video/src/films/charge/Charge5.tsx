import { useMemo } from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/charge/ch5.json';
import { ramp, span } from '../../anim';
import { stix } from '../../fonts';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../../ui/Shell';
import { Big, Center, Frac, Kicker, Sym } from '../../ui/type';
import { drawArrow, drawCharge, drawFieldArrows, drawLines, fieldAt, FIELD, NEG, POS, traceLines, type Charge } from '../../world/field';
import { rgb, Stage3D } from '../../world/Stage3D';
import type { CameraPose } from '../../world/WireWorld';
import { at, Cap, Ink, shot, Timeline, VOICE } from './kit';

// Chapter 5 - The field. A charge changes the space around it.
export const CHARGE5_FRAMES = chapterFrames(voice.duration);
const GRID = { x: [-7.2, 7.2] as [number, number], y: [-3.0, 3.6] as [number, number], spacing: 1.2 };
const TEST = { x: 3.6, y: 1.8 };

export const Charge5 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const dipole: Charge[] = useMemo(() => [{ x: -3, y: 0.3, z: 0, q: 1 }, { x: 3, y: 0.3, z: 0, q: -1 }], []);
  const dipoleLines = useMemo(() => traceLines(dipole, { perCharge: 40, bound: 13 }), [dipole]);

  const sTwo = shot(frame, -1, 11.3);
  const sField = Math.max(shot(frame, 11.1, 36.2), shot(frame, 67.3, 100.2), shot(frame, 119.0, 400));
  const faraday = span(frame, T(36.2), T(54.6), 14);
  const sMaxwell = shot(frame, 54.3, 67.5);
  const sWind = shot(frame, 100.0, 119.2);

  const plus: Charge[] = [{ x: 0, y: 0.3, z: 0, q: 1 }];
  const minus: Charge[] = [{ x: 0, y: 0.3, z: 0, q: -1 }];
  const flip = ramp(frame, T(123.6), T(124.8));
  const pose: CameraPose =
    frame >= T(54.3) && frame < T(67.4)
      ? { pos: [Math.sin(frame * 0.004) * 3, 3.2, 13.5], target: [0, 0.3, 0], fov: 34, focus: 13.6, dof: 0.1 }
      : { pos: [0, 0.3, 15.5], target: [0, 0.3, 0], fov: 34, focus: 15.5, dof: 0.06 };
  const cam = pose.pos;

  const wiggle = Math.sin((frame - T(3.4)) * 0.35) * 0.8 * span(frame, T(3.4), T(6.6), 10);
  const answer = Math.sin((frame - T(4.2)) * 0.35) * 0.5 * span(frame, T(4.2), T(7.4), 10);
  const eTest = fieldAt(plus, TEST.x, TEST.y, 0);
  const testOn = Math.min(at(frame, 68.6), 1 - at(frame, 95.0));
  const ghost = span(frame, T(27.4), T(31.8), 12);
  const draw = ramp(frame, T(50.2), T(54.2), Easing.inOut(Easing.quad));

  return (
    <Shell
      voice={VOICE(5)}
      frames={CHARGE5_FRAMES}
      world={
        <AbsoluteFill style={{ opacity: Math.max(sTwo, sField, sMaxwell, sWind) }}>
          <Stage3D
            width={width}
            height={height}
            pose={pose}
            orbs={(add) => {
              if (frame < T(11.2)) {
                drawCharge(add, () => {}, { x: -5, y: 0.3 + wiggle, z: 0, q: 1 }, cam, 0.44);
                drawCharge(add, () => {}, { x: 5, y: 0.3 + answer, z: 0, q: -1 }, cam, 0.44);
              } else if (frame >= T(54.3) && frame < T(67.4)) {
                for (const c of dipole) drawCharge(add, () => {}, c, cam, 0.4);
              } else if (frame >= T(100.1) && frame < T(119.1)) {
                drawCharge(add, () => {}, { x: -1 + 0.02 * (frame - T(108.6)), y: 0.4, z: 0, q: 1 }, cam, 0.4, at(frame, 108.4));
              } else {
                drawCharge(add, () => {}, plus[0], cam, 0.46, 1 - flip);
                drawCharge(add, () => {}, minus[0], cam, 0.46, flip);
                if (testOn > 0) add(TEST.x, TEST.y, 0, 0.36, rgb('#fff3c4'), testOn);
              }
            }}
            glows={(add) => {
              if (frame < T(11.2)) {
                drawCharge(() => {}, add, { x: -5, y: 0.3 + wiggle, z: 0, q: 1 }, cam, 0.44);
                drawCharge(() => {}, add, { x: 5, y: 0.3 + answer, z: 0, q: -1 }, cam, 0.44);
              } else if (frame >= T(54.3) && frame < T(67.4)) {
                for (const c of dipole) drawCharge(() => {}, add, c, cam, 0.4);
                drawLines(add, dipoleLines, frame, 1);
              } else if (frame >= T(100.1) && frame < T(119.1)) {
                // a weather map: wind arrows everywhere, whether or not a kite is flying
                const wind = (x: number, y: number): [number, number] => [1, 0.55 * Math.sin(x * 0.45 + frame * 0.02) + 0.25 * Math.cos(y * 0.9 - frame * 0.015)];
                for (let x = GRID.x[0]; x <= GRID.x[1] + 0.01; x += 1.2)
                  for (let y = GRID.y[0]; y <= GRID.y[1] + 0.01; y += 1.2) {
                    const v = wind(x, y);
                    drawArrow(add, x - 0.4, y, 0, v[0], v[1], 0, 0.9, FIELD, 1, 0.11);
                  }
                const cx = -1 + 0.02 * (frame - T(108.6));
                const v = wind(cx, 0.4);
                drawCharge(() => {}, add, { x: cx, y: 0.4, z: 0, q: 1 }, cam, 0.4, at(frame, 108.4));
                drawArrow(add, cx + 0.55, 0.4 + 0.55 * v[1], 0, v[0], v[1], 0, 1.7, POS, at(frame, 110.4), 0.13);
              } else {
                drawCharge(() => {}, add, plus[0], cam, 0.46, 1 - flip);
                drawCharge(() => {}, add, minus[0], cam, 0.46, flip);
                const dim = testOn > 0 ? 0.5 : 1;
                const lift = frame >= T(95.0) && frame < T(100.2) ? 1.25 : 1;
                drawFieldArrows(add, plus, GRID, (1 - flip) * dim * lift, FIELD, frame < T(36.2) ? ramp(frame, T(20.0), T(24.6)) : 1);
                drawFieldArrows(add, minus, GRID, flip, FIELD);
                // "if a charge were placed here": one spot singled out
                if (ghost > 0) {
                  add(TEST.x, TEST.y, 0, 1.3, rgb('#fff3c4'), 0.35 * ghost);
                  drawArrow(add, TEST.x, TEST.y, 0, eTest[0], eTest[1], 0, 1.3, '#fff3c4', ghost, 0.12);
                }
                if (testOn > 0) {
                  add(TEST.x, TEST.y, 0, 1.4, rgb('#fff3c4'), 0.3 * testOn);
                  drawArrow(add, TEST.x + 0.3, TEST.y + 0.15, 0, eTest[0], eTest[1], 0, 1.9, POS, testOn * at(frame, 71.8), 0.14);
                }
              }
            }}
          />
        </AbsoluteFill>
      }
    >
      {/* the puzzle */}
      <Center opacity={span(frame, T(7.9), T(11.1), 10)}>
        <Big size={260} style={{ color: C.electron, textShadow: `0 0 60px ${C.electron}88` }}>
          ?
        </Big>
      </Center>
      <Cap opacity={span(frame, T(0.2), T(7.6))} kicker="Coulomb’s law gives the size of the force" title="But how does one charge push on another without touching it?" />
      <Cap opacity={span(frame, T(8.0), T(11.1), 8)} kicker="Across empty space" title="How does the second charge know the first is there?" />

      {/* the idea */}
      <Cap opacity={span(frame, T(16.4), T(22.8))} kicker="A charge does not act on other charges directly" title="It changes the space around itself" />
      <Cap opacity={span(frame, T(23.2), T(32.2))} kicker="Every point now carries an instruction" title="A charge placed here would be pushed this hard, this way" />
      <Center opacity={span(frame, T(32.5), T(36.0), 10)} style={{ justifyContent: 'flex-start', paddingTop: 70 }}>
        <Kicker>That condition of space is called</Kicker>
        <Big size={150} style={{ textShadow: `0 0 80px ${FIELD}88` }}>
          the electric field
        </Big>
      </Center>

      {/* Faraday */}
      <Scene opacity={faraday}>
        <Ink>
          {/* the page of a notebook */}
          <path d="M 980 190 L 1760 240 L 1700 860 L 920 800 Z" fill="rgba(215,230,255,0.04)" strokeOpacity={0.6} />
        </Ink>
        <Ink color={POS} width={4} opacity={at(frame, 49.4)}>
          <circle cx={1150} cy={520} r={30} fill={`${POS}44`} />
          <path d="M 1136 520 h 28 M 1150 506 v 28" />
        </Ink>
        <Ink color={NEG} width={4} opacity={at(frame, 49.4)}>
          <circle cx={1530} cy={545} r={30} fill={`${NEG}44`} />
          <path d="M 1516 545 h 28" />
        </Ink>
        <Ink width={3} color="#d7e6ff">
          {[
            'M 1182 518 C 1300 505, 1400 520, 1498 542',
            'M 1176 498 C 1280 400, 1430 410, 1508 520',
            'M 1176 542 C 1270 650, 1420 660, 1506 570',
            'M 1162 488 C 1220 300, 1500 300, 1524 512',
            'M 1160 552 C 1200 760, 1500 780, 1526 578',
            'M 1128 500 C 1010 400, 1000 330, 1060 250',
            'M 1126 544 C 1000 640, 990 720, 1040 790',
            'M 1556 524 C 1660 430, 1690 350, 1680 270',
            'M 1556 566 C 1650 660, 1670 740, 1640 830',
          ].map((d, i) => (
            <path key={i} d={d} pathLength={1} strokeDasharray="1" strokeDashoffset={1 - Math.min(1, Math.max(0, draw * 1.6 - i * 0.07))} />
          ))}
        </Ink>
        <Panel opacity={at(frame, 37.0)} style={{ left: 110, top: 130, width: 760 }}>
          <Kicker>1830s and 1840s</Kicker>
          <div style={{ fontSize: 96, fontWeight: 300, letterSpacing: -2, marginTop: 6 }}>Michael Faraday</div>
          <div style={{ fontSize: 40, fontWeight: 300, color: C.dim, marginTop: 26, lineHeight: 1.5 }}>
            <div style={{ opacity: at(frame, 41.0) }}>a blacksmith’s son</div>
            <div style={{ opacity: at(frame, 42.9) }}>left school at thirteen, to work for a bookbinder</div>
            <div style={{ opacity: at(frame, 46.4) }}>never learned advanced mathematics</div>
            <div style={{ opacity: at(frame, 49.2), color: C.electron }}>so he thought in pictures</div>
          </div>
        </Panel>
        <Cap opacity={span(frame, T(51.4), T(54.4), 8)} kicker="Where others saw empty space" title="he saw lines of force" />
      </Scene>

      {/* Maxwell */}
      <Panel opacity={span(frame, T(59.0), T(67.3))} style={{ right: 110, top: 86, textAlign: 'right' }}>
        <Kicker>1860s · James Clerk Maxwell</Kicker>
        <div style={{ fontFamily: stix, fontSize: 64, marginTop: 18, lineHeight: 1.5, color: C.text }}>
          <div style={{ opacity: at(frame, 60.8) }}>
            ∇ · <i>E</i> = <i>ρ</i> / <i>ε</i>₀
          </div>
          <div style={{ opacity: at(frame, 61.8) }}>
            ∇ × <i>E</i> = − ∂<i>B</i> / ∂<i>t</i>
          </div>
        </div>
      </Panel>
      <Cap opacity={span(frame, T(57.8), T(67.3))} kicker="Twenty years later" title="Faraday’s pictures became equations" />

      {/* measuring it */}
      <Cap opacity={span(frame, T(67.9), T(77.2))} kicker="To measure the field" title="Place a small positive test charge and see what force it feels" />
      <Panel opacity={span(frame, T(73.8), T(95.0))} style={{ right: 110, top: 70 }}>
        <div style={{ fontSize: 130, display: 'flex', alignItems: 'center', gap: 30 }}>
          <Sym color={FIELD} show={at(frame, 85.8)}>
            E
          </Sym>
          <Sym color={C.dim} style={{ fontStyle: 'normal' }}>
            =
          </Sym>
          <Frac width={120} top={<Sym color={POS}>F</Sym>} bottom={<Sym color="#fff3c4">q</Sym>} />
        </div>
        <div style={{ fontSize: 34, fontWeight: 300, color: C.dim, marginTop: 14, opacity: at(frame, 83.4) }}>newtons per coulomb</div>
      </Panel>
      <Cap opacity={span(frame, T(77.4), T(87.4))} kicker="Divide by the test charge" title="What is left belongs to the place, not to the tester" />

      {/* it is there anyway */}
      <Cap opacity={span(frame, T(87.7), T(100.0))} kicker="What textbooks rarely say plainly" title="The field is there, whether or not anything is around to feel it" />

      {/* the weather map */}
      <Ink color="#fff3c4" width={4} opacity={span(frame, T(104.4), T(108.6), 12)}>
        <g transform={`translate(${1280 + 40 * Math.sin(frame * 0.05)}, ${300 + 26 * Math.cos(frame * 0.07)}) rotate(${-18 + 6 * Math.sin(frame * 0.06)})`}>
          <path d="M 0 -70 L 46 0 L 0 90 L -46 0 Z M 0 -70 V 90 M -46 0 H 46" fill="rgba(255,243,196,0.12)" />
          <path d="M 0 90 q -30 40 0 70 q 30 30 0 70" />
        </g>
      </Ink>
      <Cap opacity={span(frame, T(100.6), T(108.4))} kicker="Think of a weather map" title="The wind is there at every spot, kite or no kite" />
      <Cap opacity={span(frame, T(108.7), T(118.9))} kicker="A charge placed in a field" title="simply feels the arrow at the place where it sits" />
      <Panel opacity={span(frame, T(114.0), T(118.9))} style={{ right: 110, top: 70 }}>
        <div style={{ fontSize: 130, display: 'flex', alignItems: 'baseline', gap: 30 }}>
          <Sym color={POS}>F</Sym>
          <Sym color={C.dim} style={{ fontStyle: 'normal' }}>
            =
          </Sym>
          <Sym color="#fff3c4" show={at(frame, 117.3, 0.3)}>
            q
          </Sym>
          <Sym color={FIELD} show={at(frame, 117.7, 0.3)}>
            E
          </Sym>
        </div>
      </Panel>

      {/* one charge */}
      <Cap opacity={span(frame, T(119.5), T(123.6))} kicker="A positive charge" title="The field points straight away from it" />
      <Cap opacity={span(frame, T(124.2), T(126.8), 8)} kicker="A negative charge" title="The field points straight in toward it" />
      <Cap opacity={span(frame, T(127.0), T(131.6), 8)} kicker="And it weakens" title="with the square of the distance, as Coulomb found" />

      <Timeline frame={frame} already={[0, 1, 2, 3, 5, 10, 11]} events={[[7, 36.5], [9, 57.8]]} />
    </Shell>
  );
};
