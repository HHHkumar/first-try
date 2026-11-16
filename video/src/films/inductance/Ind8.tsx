import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/inductance/ch8.json';
import { ramp, span } from '../../anim';
import { C } from '../../theme';
import { Scene, Shell, T, chapterFrames } from '../../ui/Shell';
import { CURRENT, drawRings, drawWire } from '../../world/magnet';
import { Stage3D } from '../../world/Stage3D';
import { at, Bolt, Cap, GOLD, Ink, shot, Spark, Timeline, VOICE, VOLT } from './kit';

// Chapter 8 - Everywhere: the induction coil, the flyback diode, the choke, Pupin's coils, the grid.
export const IND8_FRAMES = chapterFrames(voice.duration);

const ripple = (x0: number, x1: number, y: number, amp: number, phase: number) => {
  let d = '';
  for (let x = x0; x <= x1; x += 6) d += `${x === x0 ? 'M' : 'L'} ${x} ${(y - amp * Math.abs(Math.sin((x - x0) * 0.03 - phase))).toFixed(1)} `;
  return d;
};

export const Ind8 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const ruhm = span(frame, T(-1), T(17.1), 12);
  const relay = span(frame, T(17.2), T(35.8), 12);
  const choke = span(frame, T(35.9), T(42.8), 10);
  const pupin = span(frame, T(42.9), T(50.7), 10);
  const grid = shot(frame, 50.7, 80);
  const sparking = span(frame, T(8.6), T(17.0), 4) * (0.4 + 0.6 * Math.sin(frame * 1.9) ** 2);
  const opened = ramp(frame, T(21.0), T(21.4));
  const diode = at(frame, 27.4);
  const dash = -frame * 3;

  return (
    <Shell
      voice={VOICE(8)}
      frames={IND8_FRAMES}
      world={
        grid > 0 ? (
          <AbsoluteFill style={{ opacity: grid }}>
            <Stage3D
              width={width}
              height={height}
              pose={{ pos: [8 + Math.sin(frame * 0.003) * 1.5, 3.2, 13], target: [0, 0, 0], fov: 34, focus: 15, dof: 0.05 }}
              glows={(add) => {
                for (const z of [-2.6, 0, 2.6]) {
                  drawWire(add, 0, z, -10, 10, frame + z * 9, 1);
                  drawRings(add, 0, z, [-6, -2, 2, 6], [1.0], frame, 1, 0.8);
                }
              }}
            />
          </AbsoluteFill>
        ) : null
      }
    >
      {/* Ruhmkorff's induction coil */}
      <Scene opacity={ruhm}>
        <Ink>
          <path d="M 420 760 H 1500 M 480 760 V 700 M 1440 760 V 700" strokeOpacity={0.6} />
          <rect x={560} y={440} width={800} height={260} rx={20} fill="rgba(215,230,255,0.05)" />
          <path d="M 540 420 V 720 M 1380 420 V 720" strokeWidth={14} />
          {/* the two brass points above the bobbin */}
          <path d="M 640 440 V 250 H 800 M 1280 440 V 250 H 1120" />
          <circle cx={800} cy={250} r={10} fill={GOLD} stroke={GOLD} />
          <circle cx={1120} cy={250} r={10} fill={GOLD} stroke={GOLD} />
        </Ink>
        <Ink color={CURRENT} width={2}>
          {Array.from({ length: 56 }, (_, i) => (
            <path key={i} d={`M ${574 + i * 14} 446 V 694`} strokeOpacity={0.7} />
          ))}
        </Ink>
        <Bolt x0={810} x1={1110} y={250} frame={frame} opacity={sparking} />
        <div style={{ position: 'absolute', left: 1440, top: 220, fontFamily: 'Sora', fontSize: 34, fontWeight: 300, color: C.dim, width: 380, opacity: at(frame, 8.8) }}>
          a few volts in
          <br />
          <span style={{ color: C.text, fontSize: 46 }}>sparks many centimetres long</span>
        </div>
        <Cap opacity={span(frame, T(0.2), T(13.2))} kicker="Paris · 1851 · Heinrich Ruhmkorff" title="Engineers learned to use the spark: the induction coil" />
        <Cap opacity={span(frame, T(13.4), T(17.1), 8)} kicker="The same idea" title="fires the spark plugs in a petrol engine" />
      </Scene>

      {/* a relay coil, its switch, and the diode that protects it */}
      <Scene opacity={relay}>
        <Ink color={opened ? '#d7e6ff' : CURRENT}>
          <path d="M 620 700 V 300 H 900 M 1000 300 H 1300 V 380 M 1300 620 V 700 H 620" />
          <path d="M 560 470 H 680 M 590 510 H 650 M 560 550 H 680" strokeWidth={6} />
          <path d={`M 900 300 L ${900 + 100 * Math.cos(opened * 0.7)} ${300 - 100 * Math.sin(opened * 0.7)}`} strokeWidth={6} />
          {Array.from({ length: 6 }, (_, i) => (
            <path key={i} d={`M 1300 ${380 + i * 40} a 34 20 0 0 1 0 40`} />
          ))}
        </Ink>
        <Ink color={C.electron} opacity={diode}>
          <path d="M 1300 340 H 1520 V 460 M 1520 520 V 660 H 1300" />
          <path d="M 1484 520 H 1556 L 1520 462 Z M 1484 460 H 1556" fill="rgba(111,227,255,0.25)" />
        </Ink>
        <Ink color={CURRENT} width={6} opacity={diode * span(frame, T(32.0), T(35.8), 8)}>
          <path d="M 1300 380 V 340 H 1520 V 660 H 1300 V 620" strokeDasharray="14 22" strokeDashoffset={-dash} />
        </Ink>
        <Spark x={985} y={270} frame={frame} size={90} opacity={span(frame, T(21.3), T(27.0), 3) * (0.5 + 0.5 * Math.sin(frame * 2.3) ** 2)} />
        <div style={{ position: 'absolute', left: 1100, top: 470, fontFamily: 'Sora', fontSize: 30, fontWeight: 300, color: C.dim }}>relay coil</div>
        <div style={{ position: 'absolute', left: 1580, top: 470, fontFamily: 'Sora', fontSize: 30, fontWeight: 300, color: C.electron, opacity: diode }}>diode</div>
        <Cap opacity={span(frame, T(17.4), T(27.2))} kicker="They also learned to respect it" title="Switch off a coil carelessly, and its voltage can destroy the switch" />
        <Cap opacity={span(frame, T(27.4), T(35.8))} kicker="A diode across almost every relay coil" title="A safe path for the current while the field dies away" />
      </Scene>

      {/* a choke smoothing the current */}
      <Scene opacity={choke}>
        <Ink color={VOLT} width={5}>
          <path d={ripple(240, 760, 560, 130, frame * 0.2)} />
        </Ink>
        <Ink color={CURRENT} width={5}>
          <path d={ripple(1160, 1680, 520, 12, frame * 0.2)} />
        </Ink>
        <Ink>
          <path d="M 780 500 H 840 M 1080 500 H 1140" strokeOpacity={0.5} />
          {Array.from({ length: 5 }, (_, i) => (
            <path key={i} d={`M ${840 + i * 48} 500 a 24 30 0 0 1 48 0`} />
          ))}
        </Ink>
        <Cap opacity={1} kicker="In a power supply: the choke" title="It smooths the current, as a capacitor smooths the voltage" />
      </Scene>

      {/* Pupin's loading coils */}
      <Scene opacity={pupin}>
        <Ink>
          <path d="M 160 470 H 1760 M 160 560 H 1760" strokeOpacity={0.7} />
          {[380, 760, 1140, 1520].map((x) => (
            <g key={x}>
              {[470, 560].map((y) => Array.from({ length: 3 }, (_, i) => <path key={`${y}${i}`} d={`M ${x + i * 30} ${y} a 15 22 0 0 1 30 0`} stroke={CURRENT} />))}
            </g>
          ))}
        </Ink>
        <Ink color={C.electron} width={4}>
          <path d={ripple(160, 1760, 380, 0, 0)} strokeOpacity={0} />
        </Ink>
        <Cap opacity={1} kicker="1899 · Michael Pupin" title="Coils at intervals along telephone lines made long-distance calls possible" />
      </Scene>

      <Cap opacity={span(frame, T(50.9), T(70))} kicker="On the grid, the inductance of the lines and windings decides" title="how power flows, how far the voltage drops, how large a fault current grows" />
      <Timeline frame={frame} already={[0, 1, 2, 4, 5]} events={[[3, 3.2], [6, 43.2]]} />
    </Shell>
  );
};
