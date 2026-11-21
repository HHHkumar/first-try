import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/charge/ch8.json';
import { lerp, ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../../ui/Shell';
import { Big, Center, Frac, Kicker, Meter, Sym } from '../../ui/type';
import { drawArrow, FIELD, POS } from '../../world/field';
import { rgb, Stage3D } from '../../world/Stage3D';
import type { CameraPose } from '../../world/WireWorld';
import { at, Cap, drawPlates, Ink, shot, Timeline, VOICE } from './kit';

// Chapter 8 - Field and voltage. Work against the field, the volt, E = V/d,
// and the limit at which air gives way.
export const CHARGE8_FRAMES = chapterFrames(voice.duration);
const GOLD = '#ffe08a';

export const Charge8 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const sWork = shot(frame, -1, 12.0);
  const volta = span(frame, T(11.8), T(37.2), 14);
  const sPlates = shot(frame, 37.0, 78.2);
  const rules = ramp(frame, T(77.9), T(78.6));

  // pushing a positive charge against the field, then letting go
  const pushed = ramp(frame, T(1.4), T(7.6), Easing.inOut(Easing.quad));
  const back = ramp(frame, T(9.4), T(10.8), Easing.in(Easing.quad));
  const cx = lerp(lerp(2.4, -2.4, pushed), 2.4, back);
  const stored = pushed * (1 - back);

  // squeezing the gap
  const squeeze = ramp(frame, T(57.8), T(67.6), Easing.inOut(Easing.quad));
  const half = frame < T(37.1) ? 3.4 : lerp(3.4, 1.25, squeeze);
  const gapMm = lerp(3, 1, squeeze);
  const fieldMV = 3 / gapMm; // 3,000 V across the gap, in millions of volts per metre
  const breakdown = frame >= T(68.6) && frame < T(74.6);
  const flick = frame % 7 < 4 ? 1 : 0.3;
  const lightning = frame >= T(75.6) && frame < T(77.8) ? (frame % 12 < 4 ? 1 : 0.2) : 0;

  const pose: CameraPose = { pos: [6.5 + Math.sin(frame * 0.004), 4.2, 19], target: [0, -0.3, 0], fov: 34, focus: 20.4, dof: 0.03 };

  return (
    <Shell
      voice={VOICE(8)}
      frames={CHARGE8_FRAMES}
      world={
        rules < 1 ? (
          <AbsoluteFill style={{ opacity: Math.max(sWork, sPlates) }}>
            <Stage3D
              width={width}
              height={height}
              pose={pose}
              fog={0.015}
              orbs={(add) => {
                drawPlates(add, null, frame, { half });
                if (frame < T(12.0)) add(cx, 0.3, 1.4, 0.7, rgb(POS), 1);
              }}
              glows={(add) => {
                drawPlates(null, add, frame, { half, lineGain: frame < T(37.1) ? 0.8 : 0.8 + 0.5 * squeeze });
                if (frame < T(12.0)) {
                  add(cx, 0.3, 1.4, 2.6, rgb(POS), 0.3);
                  // the push needed to move it against the field
                  drawArrow(add, cx - 0.5, 0.3, 1.4, -1, 0, 0, 1.5, '#fff3c4', span(frame, T(1.4), T(8.0), 10), 0.14);
                }
                if (breakdown) {
                  // the air gives way
                  const gold = rgb(GOLD);
                  const white = rgb('#ffffff');
                  for (let b = 0; b < 3; b++) {
                    let y = (b - 1) * 1.6;
                    const seed = Math.floor(frame / 7) * 3.1 + b * 7.7;
                    for (let i = 0; i <= 60; i++) {
                      const t = i / 60;
                      y += Math.sin(seed + i * 2.3) * 0.07 * (i % 3 === 0 ? 1 : 0);
                      const x = lerp(-half + 0.6, half - 0.6, t);
                      add(x, y, 0.4 * (b - 1), 0.34, gold, 0.5 * flick);
                      add(x, y, 0.4 * (b - 1), 0.1, white, flick);
                    }
                  }
                }
              }}
            />
          </AbsoluteFill>
        ) : null
      }
    >
      {/* work against the field */}
      <Panel opacity={span(frame, T(1.6), T(11.8))} style={{ right: 110, top: 86, width: 460 }}>
        <Kicker>Energy stored</Kicker>
        <div style={{ position: 'relative', height: 26, borderRadius: 13, background: 'rgba(147,163,192,0.16)', marginTop: 16 }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${stored * 100}%`, borderRadius: 13, background: `linear-gradient(90deg, ${C.rho}, ${GOLD})`, boxShadow: `0 0 24px ${GOLD}88` }} />
        </div>
      </Panel>
      <Cap opacity={span(frame, T(0.2), T(6.4))} kicker="Moving a charge against a field" title="takes work, like lifting a weight against gravity" />
      <Cap opacity={span(frame, T(6.7), T(11.8))} kicker="That work is not lost" title="It is stored, ready to be given back" />

      {/* the volt */}
      <Scene opacity={volta}>
        <Ink>
          {Array.from({ length: 9 }, (_, i) => (
            <g key={i}>
              <ellipse cx={520} cy={760 - i * 58} rx={150} ry={26} fill={`${C.ion}55`} stroke={C.ion} />
              <ellipse cx={520} cy={742 - i * 58} rx={150} ry={26} fill="rgba(147,163,192,0.28)" stroke="#93a3c0" />
              <ellipse cx={520} cy={724 - i * 58} rx={150} ry={26} fill="rgba(215,230,255,0.06)" strokeOpacity={0.35} />
            </g>
          ))}
          <path d="M 340 240 V 800 M 700 240 V 800" strokeOpacity={0.4} />
          <path d="M 520 232 V 150 H 800 M 520 786 V 860 H 800" stroke={GOLD} />
        </Ink>
        <Panel opacity={at(frame, 24.4)} style={{ left: 760, top: 420, width: 300, fontSize: 30, fontWeight: 300, color: C.dim, lineHeight: 1.5 }}>
          <div style={{ color: C.rho }}>copper</div>
          <div>zinc</div>
          <div style={{ opacity: 0.6 }}>card soaked in brine</div>
        </Panel>
        <Panel opacity={at(frame, 13.0)} style={{ left: 1120, top: 130, width: 700 }}>
          <Kicker>Work needed for each coulomb of charge</Kicker>
          <div style={{ fontSize: 76, fontWeight: 300, letterSpacing: -1, marginTop: 8, opacity: at(frame, 15.4) }}>Potential difference</div>
          <div style={{ fontSize: 120, fontWeight: 300, letterSpacing: -3, color: C.electron, opacity: at(frame, 18.6) }}>Voltage</div>
          <div style={{ marginTop: 60, opacity: at(frame, 32.6) }}>
            <Kicker color={C.rho}>One volt</Kicker>
            <div style={{ fontSize: 56, fontWeight: 300, marginTop: 8 }}>one joule of work for each coulomb moved</div>
          </div>
        </Panel>
        <Cap opacity={span(frame, T(20.6), T(32.4))} kicker="1800 · Alessandro Volta" title="The first battery: a steady source of electrical push" />
      </Scene>

      {/* E = V / d */}
      <Panel opacity={span(frame, T(45.6), T(77.8))} style={{ left: 110, top: 70 }}>
        <div style={{ fontSize: 130, display: 'flex', alignItems: 'center', gap: 30 }}>
          <Sym color={FIELD}>E</Sym>
          <Sym color={C.dim} show={at(frame, 46.2, 0.3)} style={{ fontStyle: 'normal' }}>
            =
          </Sym>
          <Frac width={120} show={at(frame, 46.6, 0.3)} top={<Sym color={C.rho}>V</Sym>} bottom={<Sym color={C.shape} show={at(frame, 47.4, 0.3)}>d</Sym>} />
        </div>
        <div style={{ fontSize: 34, fontWeight: 300, color: C.dim, marginTop: 12, opacity: at(frame, 50.6) }}>volts per metre</div>
      </Panel>
      <Cap opacity={span(frame, T(37.4), T(51.8))} kicker="Between our two plates" title="The field equals the voltage divided by the gap" />
      <Cap opacity={span(frame, T(52.0), T(57.6))} kicker="One volt across a one-millimetre gap" title="is a field of a thousand volts per metre" />
      <Panel opacity={span(frame, T(58.0), T(77.8))} style={{ right: 110, top: 80, display: 'flex', gap: 56 }}>
        <Meter label="Voltage" value="3,000" unit="V" size={70} />
        <Meter label="Gap" value={gapMm.toFixed(1)} unit="mm" color={C.shape} size={70} />
        <Meter label="Field" value={fieldMV.toFixed(1)} unit="MV / m" color={fieldMV > 2.9 ? '#ff6b6b' : FIELD} size={70} />
      </Panel>
      <Cap opacity={span(frame, T(57.9), T(62.0))} kicker="Squeeze the same voltage into a smaller gap" title="and the field grows" />
      <Cap opacity={span(frame, T(62.2), T(68.0))} kicker="Every insulator has a limit" title="For air: about three million volts per metre" />
      <Cap opacity={span(frame, T(68.2), T(74.4))} kicker="Push past it" title="and the air is torn apart and conducts: a spark" />
      <AbsoluteFill style={{ background: 'rgba(255,244,214,0.5)', opacity: lightning * 0.6 }} />
      <Ink color={GOLD} width={9} opacity={lightning} style={{ filter: `drop-shadow(0 0 30px ${GOLD})` }}>
        <path d="M 1050 0 L 960 260 L 1080 290 L 930 560 L 1040 590 L 900 900" />
      </Ink>
      <Cap opacity={span(frame, T(74.7), T(77.8), 8)} kicker="On a much larger scale" title="that is lightning" />

      {/* keeping the field below the limit */}
      <Scene opacity={rules}>
        <Ink>
          {/* insulation thickness */}
          <circle cx={400} cy={480} r={150} strokeOpacity={0.6} />
          <circle cx={400} cy={480} r={46} fill={`${POS}55`} stroke={POS} />
          {/* spacing between conductors */}
          <g opacity={at(frame, 80.2)}>
            <circle cx={820} cy={480} r={40} fill={`${POS}55`} stroke={POS} />
            <circle cx={1100} cy={480} r={40} fill={`${POS}55`} stroke={POS} />
            <path d="M 872 480 H 1048 M 892 462 L 872 480 L 892 498 M 1028 462 L 1048 480 L 1028 498" stroke={C.shape} />
          </g>
          {/* smooth shapes */}
          <g opacity={at(frame, 82.0)}>
            <path d="M 1520 660 V 520" strokeWidth={10} />
            <ellipse cx={1520} cy={430} rx={150} ry={96} fill="rgba(215,230,255,0.05)" />
            <path d="M 1380 700 H 1660" />
          </g>
        </Ink>
        {[
          { x: 400, label: 'insulation thickness', t: 78.6 },
          { x: 960, label: 'spacing between conductors', t: 80.2 },
          { x: 1520, label: 'smooth, rounded shapes', t: 82.0 },
        ].map((it) => (
          <div key={it.label} style={{ position: 'absolute', left: it.x - 260, width: 520, top: 760, textAlign: 'center', fontFamily: 'Sora', fontSize: 38, fontWeight: 300, color: C.text, opacity: at(frame, it.t) }}>
            {it.label}
          </div>
        ))}
        <Center opacity={at(frame, 86.0)} style={{ justifyContent: 'flex-start', paddingTop: 90 }}>
          <Kicker>Never arbitrary</Kicker>
          <Big size={84}>All ways of keeping the field below the limit</Big>
        </Center>
      </Scene>

      <Timeline frame={frame} already={[0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11]} events={[[6, 20.4]]} />
    </Shell>
  );
};
