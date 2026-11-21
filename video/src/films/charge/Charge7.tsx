import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/charge/ch7.json';
import { lerp, ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../../ui/Shell';
import { Big, Center, Kicker } from '../../ui/type';
import { FIELD, NEG, POS } from '../../world/field';
import { rgb, Stage3D } from '../../world/Stage3D';
import type { CameraPose } from '../../world/WireWorld';
import { at, Cap, drawPlates, Ink, Timeline, VOICE } from './kit';

// Chapter 7 - Uniform fields and conductors. Two plates, a metal block,
// Faraday's cage, a car in a storm, and what sharp points do.
export const CHARGE7_FRAMES = chapterFrames(voice.duration);
const GOLD = '#ffe08a';

const bolt = (x0: number, y0: number, x1: number, y1: number, seed: number, kinks = 7) => {
  let d = `M ${x0} ${y0}`;
  for (let i = 1; i <= kinks; i++) {
    const t = i / kinks;
    const j = i === kinks ? 0 : Math.sin(seed * 12.9898 + i * 78.233) * 70;
    d += ` L ${lerp(x0, x1, t) + j} ${lerp(y0, y1, t)}`;
  }
  return d;
};

export const Charge7 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const world = 1 - ramp(frame, T(58.2), T(58.9));
  const cage = span(frame, T(58.4), T(81.6), 14);
  const car = span(frame, T(81.2), T(101.0), 14);
  const points = ramp(frame, T(100.6), T(101.3));
  const tip = span(frame, T(100.6), T(110.6), 12);
  const rod = span(frame, T(110.2), T(124.2), 12);
  const corona = ramp(frame, T(123.8), T(124.6));

  // --- plates, an electron, a block of metal --------------------------------
  const appear = ramp(frame, T(4.6), T(7.4));
  const charge = ramp(frame, T(8.2), T(11.2));
  const lines = ramp(frame, T(11.8), T(15.2));
  const fly = ramp(frame, T(28.6), T(33.0), Easing.in(Easing.quad));
  const electron = span(frame, T(27.8), T(36.8), 10);
  const drop = ramp(frame, T(38.2), T(40.8), Easing.out(Easing.cubic));
  const polar = ramp(frame, T(44.6), T(49.6));
  const pose: CameraPose = { pos: [6.5 + Math.sin(frame * 0.004), 4.2, 19], target: [0, -0.3, 0], fov: 34, focus: 20.4, dof: 0.03 };

  // --- lightning and sparks --------------------------------------------------
  const flick = (period: number, on: number) => (frame % period < on ? 1 : 0);
  const sparks = at(frame, 73.8) * (0.35 + 0.65 * flick(9, 4));
  const strike = frame >= T(86.0) ? Math.max(flick(38, 5), 0.25 * flick(38, 9)) : 0;
  const rodStrike = frame >= T(117.6) ? Math.max(flick(44, 5), 0.25 * flick(44, 10)) : 0;
  const body = 'M 500 760 L 500 680 Q 520 640 620 630 L 760 540 Q 800 510 880 510 L 1160 510 Q 1230 510 1280 560 L 1360 630 Q 1440 640 1440 700 L 1440 760 Z';

  return (
    <Shell
      voice={VOICE(7)}
      frames={CHARGE7_FRAMES}
      world={
        world > 0 ? (
          <AbsoluteFill style={{ opacity: world }}>
            <Stage3D
              width={width}
              height={height}
              pose={pose}
              fog={0.015}
              orbs={(add) => {
                drawPlates(add, null, frame, { appear });
                if (drop > 0) {
                  const copper = rgb(C.ion);
                  const lit = rgb('#ffc38a');
                  for (let x = -0.8; x <= 0.81; x += 0.8)
                    for (let y = -2; y <= 2; y++)
                      for (let z = -1.5; z <= 1.51; z += 1.5) {
                        // the face left short of electrons shows its positive ions
                        const bare = x > 0.5 ? polar : 0;
                        const c = [lerp(copper[0], lit[0], bare), lerp(copper[1], lit[1], bare), lerp(copper[2], lit[2], bare)];
                        add(x, y + (1 - drop) * 9, z, 0.6, c, drop);
                      }
                }
              }}
              glows={(add) => {
                drawPlates(null, add, frame, { appear, charge, lines, hide: { from: -1.35, to: 1.35, amount: polar * drop } });
                if (electron > 0) {
                  // released in the gap, it accelerates toward the positive plate
                  const e = rgb(NEG);
                  const white = rgb('#eafcff');
                  const x = lerp(2.4, -2.5, fly);
                  for (let j = 0; j < 40; j++) {
                    const back = lerp(2.4, -2.5, Math.max(0, fly - j * 0.012 * (0.2 + fly)));
                    add(back, 0.3, 1.4, 0.06 + 0.1 * (1 - j / 40), e, 0.5 * (1 - j / 40) * electron);
                  }
                  add(x, 0.3, 1.4, 0.8, e, 0.7 * electron);
                  add(x, 0.3, 1.4, 0.22, white, electron);
                }
                if (polar > 0) {
                  // free electrons crowd the face nearest the positive plate
                  const e = rgb(NEG);
                  const white = rgb('#eafcff');
                  for (let i = 0; i < 34; i++) {
                    const y = ((i * 0.618034) % 1) * 4.6 - 2.3;
                    const z = ((i * 0.754878 + 0.2) % 1) * 3.6 - 1.8;
                    const x = lerp(((i * 0.7548) % 1) * 1.6 - 0.8, -1.22, polar);
                    add(x, y, z, 0.5, e, 0.6 * drop);
                    add(x, y, z, 0.14, white, drop);
                  }
                }
              }}
            />
          </AbsoluteFill>
        ) : null
      }
    >
      <Cap opacity={span(frame, T(0.2), T(11.6))} kicker="One arrangement matters more than any other" title="Two flat metal plates: one positive, one negative" />
      <Cap opacity={span(frame, T(11.8), T(20.6))} kicker="Between them" title="The field lines run straight across, evenly spaced" />
      <Center opacity={span(frame, T(21.0), T(27.6), 10)} style={{ justifyContent: 'flex-start', paddingTop: 70 }}>
        <Kicker>Same strength, same direction, everywhere in the gap</Kicker>
        <Big size={130} style={{ textShadow: `0 0 70px ${FIELD}88` }}>
          a uniform field
        </Big>
      </Center>
      <Cap opacity={span(frame, T(27.9), T(37.8))} kicker="Release an electron" title="It accelerates toward the positive plate, against the field arrows" />
      <Cap opacity={span(frame, T(38.2), T(50.6))} kicker="Now put a piece of metal into the field" title="Its free electrons shift, until their own field cancels the field inside" />
      <Cap opacity={span(frame, T(50.9), T(58.2))} kicker="In a fraction of a second" title="The field inside a conductor is zero; extra charge sits on its surface" />

      {/* Faraday's cage */}
      <Scene opacity={cage}>
        <Ink>
          {/* a wooden cube, covered in foil and wire */}
          <path d="M 560 330 H 1120 V 830 H 560 Z" fill="rgba(215,230,255,0.03)" />
          <path d="M 560 330 L 760 210 H 1320 L 1120 330 M 1320 210 V 710 L 1120 830" />
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} d={`M ${616 + i * 56} 330 V 830`} strokeOpacity={0.22} strokeWidth={2} />
          ))}
          {Array.from({ length: 8 }, (_, i) => (
            <path key={`h${i}`} d={`M 560 ${386 + i * 56} H 1120`} strokeOpacity={0.22} strokeWidth={2} />
          ))}
          {/* Faraday, seated inside with an electroscope */}
          <circle cx={800} cy={540} r={34} />
          <path d="M 800 574 V 690 M 800 690 H 880 V 790 M 800 620 L 880 640 L 930 610 M 740 800 H 820" />
          <path d="M 950 520 V 610 M 920 520 H 980 M 950 610 l -8 70 M 950 610 l 8 70" strokeWidth={3} />
          <ellipse cx={950} cy={640} rx={52} ry={66} strokeOpacity={0.5} strokeWidth={2} />
        </Ink>
        <Ink color={GOLD} width={5} opacity={sparks} style={{ filter: `drop-shadow(0 0 16px ${GOLD})` }}>
          <path d={bolt(1120, 420, 1500, 300, Math.floor(frame / 9), 5)} />
          <path d={bolt(560, 560, 240, 480, Math.floor(frame / 9) + 3, 5)} />
          <path d={bolt(1000, 240, 1090, 60, Math.floor(frame / 9) + 7, 4)} />
          <path d={bolt(1320, 600, 1640, 700, Math.floor(frame / 9) + 11, 5)} />
        </Ink>
        <Panel opacity={at(frame, 65.4)} style={{ left: 1400, top: 420, width: 420 }}>
          <Kicker>A cube, twelve feet on each side</Kicker>
          <div style={{ fontSize: 40, fontWeight: 300, marginTop: 10, lineHeight: 1.3 }}>covered in metal foil and wire</div>
        </Panel>
        <Cap opacity={span(frame, T(59.0), T(77.8))} kicker="1836 · Michael Faraday" title="He sat inside, while his assistants charged the outside" />
        <Cap opacity={span(frame, T(78.2), T(81.4), 8)} kicker="Inside" title="he could detect nothing at all" />
      </Scene>

      {/* a car in a thunderstorm */}
      <Scene opacity={car}>
        <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 50% at 52% 10%, rgba(255,240,200,${0.35 * strike}), rgba(255,240,200,0) 70%)` }} />
        <Ink color="#93a3c0" width={3}>
          <path d="M 520 150 q -90 -10 -80 -70 q 10 -60 110 -50 q 40 -60 150 -30 q 90 -50 180 10 q 110 -30 150 40 q 90 0 80 60 q -10 50 -100 40 Z" fill="rgba(147,163,192,0.08)" />
          <path d="M 0 822 H 1920" strokeOpacity={0.5} />
        </Ink>
        {/* the field of the storm ends on the metal shell; none gets inside */}
        <Ink color={FIELD} width={2.5} opacity={0.8}>
          {[620, 760, 900, 1040, 1180, 1320].map((x, i) => (
            <path key={x} d={`M ${x} 170 C ${x} 330, ${lerp(x, 970, 0.25)} 400, ${[650, 790, 900, 1040, 1200, 1330][i]} ${[622, 524, 510, 510, 514, 606][i]}`} strokeDasharray="4 12" strokeDashoffset={-frame * 0.9} />
          ))}
        </Ink>
        <Ink color={strike > 0.5 ? GOLD : '#d7e6ff'} width={strike > 0.5 ? 7 : 4} style={{ filter: `drop-shadow(0 0 ${8 + 26 * strike}px ${strike > 0.2 ? GOLD : '#d7e6ff'})` }}>
          <path d={body} fill="rgba(3,6,13,0.9)" />
          <circle cx={690} cy={760} r={62} fill="#03060d" />
          <circle cx={1250} cy={760} r={62} fill="#03060d" />
        </Ink>
        <Ink width={3}>
          <path d="M 780 620 L 850 545 H 1000 V 620 Z M 1030 545 H 1160 Q 1210 550 1260 620 H 1030 Z" strokeOpacity={0.6} />
          <circle cx={930} cy={592} r={22} strokeOpacity={0.8} />
          <path d="M 900 620 q 30 -22 60 0" strokeOpacity={0.8} />
        </Ink>
        <Ink color={GOLD} width={8} opacity={strike} style={{ filter: `drop-shadow(0 0 26px ${GOLD})` }}>
          <path d={bolt(880, 190, 1010, 508, Math.floor(frame / 38), 6)} />
          <path d="M 690 822 v 20 m -22 -10 l 44 -6 M 1250 822 v 20 m -22 -10 l 44 -6" strokeWidth={5} />
        </Ink>
        <Panel opacity={at(frame, 91.2)} style={{ left: 760, top: 660, width: 440, textAlign: 'center', fontSize: 30, fontWeight: 300, color: C.electron }}>
          inside: field close to zero
        </Panel>
        {/* a screened cable, for the same reason */}
        <Ink opacity={at(frame, 96.6)} color="#d7e6ff" width={3}>
          <circle cx={1660} cy={380} r={120} strokeDasharray="10 7" />
          <circle cx={1660} cy={380} r={88} strokeOpacity={0.45} />
          <circle cx={1660} cy={380} r={30} fill={`${POS}66`} stroke={POS} />
        </Ink>
        <Panel opacity={at(frame, 96.6)} style={{ left: 1480, top: 520, width: 360, textAlign: 'center' }}>
          <Kicker>A screened cable</Kicker>
          <div style={{ fontSize: 30, fontWeight: 300, color: C.dim, marginTop: 6 }}>metal braid around the signal wire</div>
        </Panel>
        <Cap opacity={span(frame, T(81.6), T(94.4))} kicker="A Faraday cage on wheels" title="The metal body carries the charge around you" />
        <Cap opacity={span(frame, T(94.6), T(100.8))} kicker="Engineers call this" title="shielding" />
      </Scene>

      {/* sharp points */}
      <Scene opacity={points}>
        <AbsoluteFill style={{ opacity: tip }}>
          <Ink color={POS} width={4}>
            <path d="M 420 540 C 420 380, 700 400, 900 470 L 1240 540 L 900 610 C 700 680, 420 700, 420 540 Z" fill={`${POS}22`} />
          </Ink>
          <Ink color={FIELD} width={3} opacity={at(frame, 104.4)}>
            {Array.from({ length: 15 }, (_, i) => {
              const a = (-70 + i * 10) * (Math.PI / 180);
              return <path key={i} d={`M ${1250 + Math.cos(a) * 12} ${540 + Math.sin(a) * 12} l ${Math.cos(a) * 330} ${Math.sin(a) * 330}`} strokeDasharray="4 12" strokeDashoffset={-frame * 0.9} />;
            })}
            {[0, 1, 2, 3].map((i) => (
              <path key={`s${i}`} d={`M ${500 + i * 110} ${410 - i * 2} l -30 -210 M ${500 + i * 110} ${670 + i * 2} l -30 210`} strokeDasharray="4 12" strokeDashoffset={-frame * 0.9} />
            ))}
          </Ink>
          <Panel opacity={at(frame, 106.6)} style={{ left: 1420, top: 250, width: 420 }}>
            <Kicker color={FIELD}>At the point</Kicker>
            <div style={{ fontSize: 46, fontWeight: 300, marginTop: 8 }}>the field becomes intense</div>
          </Panel>
          <Cap opacity={1} kicker="One more thing to notice" title="On a conductor, charge crowds onto sharp points and edges" />
        </AbsoluteFill>

        {/* Franklin's lightning rod */}
        <AbsoluteFill style={{ opacity: rod }}>
          <AbsoluteFill style={{ background: `radial-gradient(ellipse 50% 50% at 50% 8%, rgba(255,240,200,${0.3 * rodStrike}), rgba(255,240,200,0) 70%)` }} />
          <Ink>
            <path d="M 700 822 V 520 L 960 340 L 1220 520 V 822 Z" fill="rgba(215,230,255,0.03)" />
            <path d="M 880 822 V 640 H 1040 V 822 M 0 822 H 1920" strokeOpacity={0.6} />
          </Ink>
          <Ink color={rodStrike > 0.5 ? GOLD : C.rho} width={5} style={{ filter: `drop-shadow(0 0 ${8 + 20 * rodStrike}px ${GOLD})` }}>
            <path d="M 960 340 V 180 M 960 340 L 1250 540 V 822 M 1220 846 h 60 M 1232 862 h 36 M 1244 878 h 12" />
          </Ink>
          <Ink color={GOLD} width={8} opacity={rodStrike} style={{ filter: `drop-shadow(0 0 26px ${GOLD})` }}>
            <path d={bolt(860, 0, 960, 180, Math.floor(frame / 44) + 2, 5)} />
          </Ink>
          <Panel opacity={at(frame, 117.4)} style={{ left: 1320, top: 300, width: 480 }}>
            <Kicker color={C.rho}>A pointed rod, wired to the ground</Kicker>
            <div style={{ fontSize: 44, fontWeight: 300, marginTop: 8, lineHeight: 1.25 }}>The strike takes the rod, not the roof</div>
          </Panel>
          <Cap opacity={1} kicker="1752 · Benjamin Franklin" title="Lightning is electricity, so give it a point to aim for" />
        </AbsoluteFill>

        {/* corona on a high-voltage line */}
        <AbsoluteFill style={{ opacity: corona }}>
          <Ink color="#5b6c91" width={5}>
            <path d="M 300 822 L 344 462 H 376 L 420 822 M 308 752 L 404 682 M 412 752 L 316 682 M 190 520 H 530 L 376 480 H 344 Z" />
            <path d="M 1500 822 L 1544 462 H 1576 L 1620 822 M 1508 752 L 1604 682 M 1612 752 L 1516 682 M 1390 520 H 1730 L 1576 480 H 1544 Z" />
            <path d="M 0 822 H 1920" strokeOpacity={0.5} />
          </Ink>
          {[0, 1].map((k) => {
            const d = k ? 'M -300 600 Q 0 640 190 524 M 1730 524 Q 1900 640 2220 600' : 'M 530 524 Q 960 700 1390 524';
            const pulse = 0.55 + 0.45 * Math.sin(frame * 0.5 + k * 2) * Math.sin(frame * 0.17 + k);
            return (
              <svg key={k} viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
                <path d={d} fill="none" stroke="#a98bff" strokeWidth={26} opacity={0.3 * pulse} style={{ filter: 'blur(12px)' }} />
                <path d={d} fill="none" stroke="#d9ccff" strokeWidth={3} />
              </svg>
            );
          })}
          <Panel opacity={at(frame, 129.6)} style={{ left: 0, right: 0, top: 150, textAlign: 'center' }}>
            <Big size={120} style={{ color: '#c9b8ff', textShadow: '0 0 60px #a98bff' }}>
              corona
            </Big>
          </Panel>
          <Cap opacity={1} kicker="A high-voltage line at night" title="The faint glow and the crackle are wasted energy" />
        </AbsoluteFill>
      </Scene>

      <Timeline frame={frame} already={[0, 1, 2, 3, 5, 7, 9, 10, 11]} events={[[8, 58.9], [4, 112.4]]} />
    </Shell>
  );
};
