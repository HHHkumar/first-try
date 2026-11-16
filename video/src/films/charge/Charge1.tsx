import { useMemo } from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/charge/ch1.json';
import { lerp, lerp3, ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../../ui/Shell';
import { Big, Center, Kicker, Sub } from '../../ui/type';
import { drawArrow, drawCharge, drawLines, fibSphere, NEG, POS, sampleCapsules, traceLines, type Capsule, type Charge } from '../../world/field';
import { mulberry32 } from '../../world/rng';
import { rgb, Stage3D } from '../../world/Stage3D';
import type { CameraPose } from '../../world/WireWorld';
import { at, Cap, Ink, shot, VOICE } from './kit';

// Chapter 1 - A force across empty space.
export const CHARGE1_FRAMES = chapterFrames(voice.duration);

const person = (x: number, s: number): Capsule[] => [
  [x, 3.35, 0, x, 3.35, 0, 0.44],
  [x, 1.5, 0, x, 2.55, 0, 0.56],
  [x - 0.27, -1.3, 0, x - 0.27, 1.0, 0, 0.27],
  [x + 0.27, -1.3, 0, x + 0.27, 1.0, 0, 0.27],
  [x + 0.55 * s, 2.55, 0, x + 1.95 * s, 2.6, 0, 0.17],
  [x - 0.6 * s, 2.5, 0, x - 0.78 * s, 1.15, 0, 0.17],
];

export const Charge1 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const dipole: Charge[] = useMemo(() => [{ x: -3, y: 0, z: 0, q: 1 }, { x: 3, y: 0, z: 0, q: -1 }], []);
  const dipoleLines = useMemo(() => traceLines(dipole, { perCharge: 44, bound: 13 }), [dipole]);
  const bodies = useMemo(() => [sampleCapsules(person(-2.3, 1), 1000, 3), sampleCapsules(person(2.3, -1), 1000, 4)], []);
  const blob = useMemo(() => {
    const rand = mulberry32(9);
    return fibSphere(1300).map((d) => {
      const r = 2.6 * Math.cbrt(rand());
      return [d[0] * r, d[1] * r, d[2] * r] as [number, number, number];
    });
  }, []);
  const earth = useMemo(() => fibSphere(3200), []);

  // --- which shot is on -----------------------------------------------------
  const room = 1 - ramp(frame, T(10.9), T(11.6));
  const sDipole = shot(frame, 11.0, 31.2);
  const sBlob = shot(frame, 31.0, 37.5);
  const sPeople = shot(frame, 37.3, 49.9);
  const sTitle = ramp(frame, T(49.7), T(50.4));
  const zoomIn = ramp(frame, T(15.0), T(18.0));
  const pull = ramp(frame, T(45.2), T(49.2), Easing.inOut(Easing.cubic));
  const orbit = frame * 0.004;

  let pose: CameraPose;
  if (frame < T(31.1)) {
    pose = { pos: lerp3([Math.sin(orbit) * 3, 3.2, 13.5], [Math.sin(orbit) * 1.5, 1.6, 9.5], zoomIn), target: [0, 0, 0], fov: 34, focus: lerp(13.6, 9.6, zoomIn), dof: 0.1 };
  } else if (frame < T(37.4)) {
    pose = { pos: [Math.sin(orbit) * 2, 1.2, 10], target: [0, 0, 0], fov: 34, focus: 10, dof: 0.12 };
  } else if (frame < T(49.8)) {
    pose = { pos: lerp3([0.6, 2.4, 12.5], [0.6, -2, 40], pull), target: lerp3([0, 1.4, 0], [0, -6.2, 0], pull), fov: 34, focus: lerp(12.5, 41, pull), dof: lerp(0.1, 0.02, pull) };
  } else {
    pose = { pos: [Math.sin(orbit) * 3, 3.2, 14.5], target: [0, 0.6, 0], fov: 34, focus: 14.6, dof: 0.1 };
  }
  const cam = pose.pos;

  // --- hero numbers ---------------------------------------------------------
  const groups = [27.0, 27.5, 28.1, 28.8, 29.4].reduce((n, t, i) => (frame >= T(t) ? [1, 4, 7, 10, 13][i] : n), 0);
  const extra = at(frame, 42.3, 0.8);
  const push = at(frame, 44.4, 1.0);
  const rise = ramp(frame, T(45.6), T(49.2), Easing.out(Easing.cubic));
  const apart = 0.35 * push;

  // --- the balloon ----------------------------------------------------------
  const fly = ramp(frame, T(2.2), T(3.5), Easing.inOut(Easing.cubic));
  const rub = (1 - fly) * Math.sin(frame * 0.5) * 22;
  const bx = lerp(640 + rub, 1432, fly);
  const by = lerp(330, 470, fly);

  return (
    <Shell
      voice={VOICE(1)}
      frames={CHARGE1_FRAMES}
      world={
        frame > T(10.6) ? (
          <AbsoluteFill style={{ opacity: Math.max(sDipole, sBlob, sPeople, sTitle * 0.55) }}>
            <Stage3D
              width={width}
              height={height}
              pose={pose}
              fog={frame > T(37.4) && frame < T(49.8) ? 0.012 : 0.02}
              orbs={(add) => {
                if (frame < T(31.1) || frame >= T(49.8)) for (const c of dipole) drawCharge(add, () => {}, c, cam, 0.4);
              }}
              glows={(add) => {
                if (frame < T(31.1) || frame >= T(49.8)) {
                  for (const c of dipole) drawCharge(() => {}, add, c, cam, 0.4);
                  drawLines(add, dipoleLines, frame, 1, undefined, { reveal: frame >= T(49.8) ? 1 : ramp(frame, T(11.4), T(13.8)) });
                } else if (frame < T(37.4)) {
                  // ordinary matter: positive and negative, perfectly mixed
                  const p = rgb(POS);
                  const n = rgb(NEG);
                  for (let i = 0; i < blob.length; i++) {
                    const b = blob[i];
                    const wob = 0.06 * Math.sin(frame * 0.07 + i);
                    add(b[0] + wob, b[1] + 0.06 * Math.cos(frame * 0.06 + i * 1.7), b[2], 0.16, i % 2 ? p : n, 0.75);
                  }
                } else {
                  const p = rgb(POS);
                  const n = rgb(NEG);
                  const white = rgb('#e9fbff');
                  for (let k = 0; k < 2; k++) {
                    const pts = bodies[k];
                    const dx = (k === 0 ? -1 : 1) * apart;
                    for (let i = 0; i < pts.length / 3; i++) {
                      const isExtra = i % 100 === 7; // one in a hundred: the surplus electrons
                      const tw = 0.6 + 0.4 * Math.sin(frame * 0.12 + i * 2.3);
                      add(pts[i * 3] + dx, pts[i * 3 + 1], pts[i * 3 + 2], 0.13, i % 2 ? p : n, 0.7 * tw);
                      if (isExtra && extra > 0) {
                        add(pts[i * 3] + dx, pts[i * 3 + 1], pts[i * 3 + 2], 0.7, n, 0.8 * extra);
                        add(pts[i * 3] + dx, pts[i * 3 + 1], pts[i * 3 + 2], 0.2, white, extra);
                      }
                    }
                  }
                  // the push between them
                  drawArrow(add, -0.5, 4.6, 0, -1, 0, 0, 2.6 * push, POS, push, 0.14);
                  drawArrow(add, 0.5, 4.6, 0, 1, 0, 0, 2.6 * push, POS, push, 0.14);
                  // ...is enough to lift the Earth
                  if (rise > 0) {
                    const R = 7.2;
                    const cy = lerp(-22, -11.4, rise);
                    const sea = rgb('#2f7fe0');
                    const land = rgb('#5fd08f');
                    const spin = frame * 0.004;
                    for (let i = 0; i < earth.length; i++) {
                      const d = earth[i];
                      const cs = Math.cos(spin);
                      const sn = Math.sin(spin);
                      const x = d[0] * cs + d[2] * sn;
                      const z = -d[0] * sn + d[2] * cs;
                      const isLand = Math.sin(d[0] * 3.1 + 1) * Math.sin(d[1] * 4.3) * Math.cos(d[2] * 2.7 + 2) > 0.08;
                      add(x * R, cy + d[1] * R, z * R, 0.3, isLand ? land : sea, 0.85 * rise);
                    }
                    add(0, cy, 0, R * 3.4, sea, 0.2 * rise);
                    // the line it hangs from
                    for (let i = 0; i < 40; i++) add(0, lerp(-1.4, cy + R, i / 39), 0, 0.07, white, 0.5 * rise);
                  }
                }
              }}
            />
          </AbsoluteFill>
        ) : null
      }
    >
      {/* the balloon on the wall */}
      <Scene opacity={room}>
        <Ink>
          {/* wall */}
          <path d="M 1520 110 V 930" strokeWidth={6} />
          {Array.from({ length: 8 }, (_, i) => (
            <path key={i} d={`M 1520 ${170 + i * 100} h 300 M ${1620 + (i % 2) * 90} ${170 + i * 100} v 100`} strokeOpacity={0.25} strokeWidth={2} />
          ))}
          {/* head and hair */}
          <circle cx={520} cy={620} r={120} />
          <path d="M 440 900 C 440 800, 600 800, 600 900" />
          {Array.from({ length: 11 }, (_, i) => {
            const a = -2.5 + i * 0.19;
            const lift = fly < 0.5 ? 1 : 0.35;
            return <path key={i} d={`M ${520 + Math.cos(a) * 118} ${620 + Math.sin(a) * 118} q ${Math.cos(a) * 30} ${-40 * lift} ${Math.cos(a) * 46 + 30 * lift} ${Math.sin(a) * 60 - 46 * lift}`} strokeWidth={2.5} />;
          })}
        </Ink>
        <Ink color={NEG} width={4}>
          <ellipse cx={bx} cy={by} rx={86} ry={108} fill={`${NEG}22`} />
          <path d={`M ${bx} ${by + 108} l -10 16 h 20 z M ${bx} ${by + 124} q 26 60 -6 130`} />
        </Ink>
        {/* the charges doing the work */}
        <Ink color={NEG} width={5} opacity={at(frame, 8.9)}>
          {[-56, -6, 44].map((dy) => (
            <path key={dy} d={`M ${bx + 34} ${by + dy} h 26`} />
          ))}
        </Ink>
        <Ink color={POS} width={5} opacity={at(frame, 9.4)}>
          {[-56, -6, 44].map((dy) => (
            <path key={dy} d={`M 1548 ${by + dy} h 26 M 1561 ${by + dy - 13} v 26`} />
          ))}
        </Ink>
        <Panel opacity={span(frame, T(4.4), T(10.9))} style={{ left: 110, top: 100 }}>
          <Kicker>Nothing is holding it</Kicker>
          <div style={{ fontSize: 56, fontWeight: 300, marginTop: 12, display: 'flex', gap: 44 }}>
            <span style={{ opacity: at(frame, 6.0) }}>no glue</span>
            <span style={{ opacity: at(frame, 6.9) }}>no string</span>
            <span style={{ opacity: at(frame, 7.9), color: C.electron }}>no contact</span>
          </div>
        </Panel>
      </Scene>

      <Cap opacity={span(frame, T(11.6), T(15.2))} kicker="Across empty space" title="Something is reaching out, and pulling" />

      {/* electric against gravity */}
      <Panel opacity={span(frame, T(20.4), T(31.0))} style={{ left: 110, right: 110, bottom: 130 }}>
        <Kicker>One electron and one proton</Kicker>
        <div style={{ display: 'flex', alignItems: 'center', gap: 30, marginTop: 22, fontSize: 36, fontWeight: 300 }}>
          <div style={{ width: 240 }}>Gravity</div>
          <div style={{ width: 4, height: 26, background: C.dim }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 30, marginTop: 14, fontSize: 36, fontWeight: 300, opacity: at(frame, 24.8) }}>
          <div style={{ width: 240 }}>Electric pull</div>
          <div style={{ flex: ramp(frame, T(25.4), T(27.0), Easing.out(Easing.cubic)), height: 26, borderRadius: 13, background: `linear-gradient(90deg, ${C.rho}, ${C.electron})`, boxShadow: `0 0 26px ${C.electron}88` }} />
          <div style={{ flex: 1 - ramp(frame, T(25.4), T(27.0), Easing.out(Easing.cubic)) }} />
        </div>
        <div style={{ marginTop: 22, fontSize: 43, fontWeight: 300, letterSpacing: 0.5, color: C.electron, fontVariantNumeric: 'tabular-nums', height: 54, opacity: groups > 0 ? 1 : 0 }}>
          × 1{',000'.repeat(groups)}
        </div>
      </Panel>

      <Cap opacity={span(frame, T(31.4), T(37.3))} kicker="So why don’t we feel it?" title="Matter is balanced, almost perfectly" />

      <Cap opacity={span(frame, T(37.8), T(44.3))} kicker="You and a friend, at arm’s length" title="Give each of you one percent more electrons…" />
      <Cap opacity={span(frame, T(44.6), T(49.8))} kicker="The push between you" title="would lift a weight equal to the entire Earth" />

      <Center opacity={sTitle}>
        <Kicker style={{ marginBottom: 26, opacity: at(frame, 51.0) }}>Charge and the electric field</Kicker>
        <Big size={170} style={{ textShadow: `0 0 80px ${C.electron}55` }}>
          The Invisible Push
        </Big>
        <Sub style={{ opacity: at(frame, 53.0) }}>every wire, every motor, every circuit runs on it</Sub>
      </Center>
    </Shell>
  );
};
