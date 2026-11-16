import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/fields/ch8.json';
import { ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../../ui/Shell';
import { BFIELD, CURRENT } from '../../world/magnet';
import { rgb, Stage3D } from '../../world/Stage3D';
import { at, Cap, drawWave, EFIELD, Ink, shot, Timeline, VOICE } from './kit';

// Chapter 8 - What engineers do with it.
export const F8_FRAMES = chapterFrames(voice.duration);

export const F8 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const pad = span(frame, T(-1), T(25.1), 12);
  const trafo = span(frame, T(25.2), T(35.1), 10);
  const antenna = shot(frame, 35.1, 55.9);
  const cable = span(frame, T(56.0), T(73.5), 12);
  const line = span(frame, T(73.6), T(100), 12);
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.4);
  const fill = ramp(frame, T(13.3), T(24.0));
  const packet = 300 + (((frame - T(56)) * 40) % 1500);
  const wave = (ph: number) => {
    let d = '';
    for (let x = 200; x <= 1720; x += 8) d += `${x === 200 ? 'M' : 'L'} ${x} ${(470 - 150 * Math.sin(((x - 200) / 1520) * Math.PI * 2 - ph)).toFixed(1)} `;
    return d;
  };

  return (
    <Shell
      voice={VOICE(8)}
      frames={F8_FRAMES}
      world={
        antenna > 0 ? (
          <AbsoluteFill style={{ opacity: antenna }}>
            <Stage3D
              width={width}
              height={height}
              pose={{ pos: [2 + Math.sin(frame * 0.003) * 1.5, 3.4, 17], target: [0, 0, 0], fov: 34, focus: 17.5, dof: 0.04 }}
              glows={(add) => {
                // two antennas: charge driven up and down the first, pushed back and forth in the second
                for (const [x, g] of [[-8.5, 1], [8.5, at(frame, 45.7)]] as [number, number][])
                  for (let i = 0; i <= 60; i++) {
                    const y = -2.4 + i * 0.08;
                    const bead = Math.abs(y - 2 * Math.sin(frame * 0.13 - (x > 0 ? 25.5 : 0))) < 0.2;
                    add(x, y, 0, bead ? 0.4 : 0.17, rgb(bead ? CURRENT : '#c8d4ea'), (bead ? 1 : 0.8) * g);
                  }
                drawWave(add, -8.2, 8.2, frame, { front: -8.2 + 17 * ramp(frame, T(40.0), T(46.0)) });
              }}
            />
          </AbsoluteFill>
        ) : null
      }
    >
      <Scene opacity={pad}>
        <Ink>
          <rect x={560} y={640} width={800} height={90} rx={30} />
          <rect x={640} y={420} width={640} height={160} rx={26} opacity={at(frame, 10.5)} />
          <rect x={1100} y={460} width={130} height={80} rx={8} opacity={at(frame, 10.5)} />
        </Ink>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute', opacity: at(frame, 13.3) }}>
          <rect x={1106} y={466} width={118 * fill} height={68} rx={5} fill="#34c759" opacity={0.8} />
        </svg>
        <Ink color={CURRENT} width={5}>
          {Array.from({ length: 8 }, (_, i) => (
            <circle key={i} cx={720 + i * 68} cy={685} r={16} />
          ))}
        </Ink>
        <Ink color="#ffb36b" width={5} opacity={at(frame, 10.5)}>
          {Array.from({ length: 6 }, (_, i) => (
            <circle key={i} cx={720 + i * 56} cy={540} r={13} />
          ))}
        </Ink>
        <Ink color={BFIELD} opacity={at(frame, 13.3) * (0.4 + 0.6 * pulse)}>
          {[110, 190, 270].map((r) => (
            <ellipse key={r} cx={950} cy={615} rx={r} ry={r * 0.6} strokeDasharray="5 12" />
          ))}
        </Ink>
        <Panel opacity={1} style={{ left: 1400, top: 660 }}>
          <div style={{ fontSize: 30, fontWeight: 300, color: CURRENT }}>coil in the pad</div>
        </Panel>
        <Panel opacity={at(frame, 10.5)} style={{ left: 1320, top: 470 }}>
          <div style={{ fontSize: 30, fontWeight: 300, color: '#ffb36b' }}>coil in the phone</div>
        </Panel>
        <Cap opacity={span(frame, T(0.2), T(5.7))} kicker="For an engineer" title="This changes how you look at every circuit" />
        <Cap opacity={span(frame, T(5.9), T(20.7))} kicker="A wireless charging pad" title="The changing field of one coil drives a current in the other" />
        <Cap opacity={span(frame, T(20.9), T(25.1), 8)} kicker="Nothing touches" title="The energy crosses the gap as field" />
      </Scene>

      <Scene opacity={trafo}>
        <Ink>
          <rect x={700} y={300} width={520} height={380} strokeWidth={40} stroke="#9aa6c0" strokeOpacity={0.85} />
        </Ink>
        <Ink color={CURRENT} width={5}>
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} d={`M 668 ${400 + i * 22} h 64`} />
          ))}
        </Ink>
        <Ink color="#ffb36b" width={5}>
          {Array.from({ length: 5 }, (_, i) => (
            <path key={i} d={`M 1188 ${440 + i * 26} h 64`} />
          ))}
        </Ink>
        <Ink color={BFIELD} opacity={0.4 + 0.6 * pulse}>
          <rect x={700} y={300} width={520} height={380} strokeDasharray="6 14" strokeDashoffset={-frame * 2} />
        </Ink>
        <Cap opacity={1} kicker="A transformer: the same idea, for a whole town" title="Two coils that never touch, linked only by a changing magnetic field" />
      </Scene>

      <Cap opacity={span(frame, T(35.3), T(45.6))} kicker="An antenna goes one step further" title="Charge driven so quickly that its fields break away as waves" />
      <Cap opacity={span(frame, T(45.8), T(55.9))} kicker="Far away, a second antenna sits in the passing wave" title="Its charges are pushed back and forth: that is your radio signal" />

      <Scene opacity={cable}>
        <Ink>
          <path d="M 200 380 H 1720 M 200 560 H 1720" strokeWidth={10} stroke="#ffb36b" />
        </Ink>
        <Ink color={EFIELD} width={4}>
          {Array.from({ length: 9 }, (_, i) => {
            const x = packet + i * 26;
            const a = Math.sin((i / 8) * Math.PI);
            return <path key={i} d={`M ${x} 396 V 544 M ${x - 9} 528 L ${x} 544 L ${x + 9} 528`} strokeOpacity={a} />;
          })}
        </Ink>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute' }}>
          {Array.from({ length: 30 }, (_, i) => (
            <circle key={i} cx={220 + ((i * 51 + frame * 0.25) % 1490)} cy={i % 2 ? 380 : 560} r={5} fill={C.electron} />
          ))}
        </svg>
        <Panel opacity={1} style={{ left: 200, top: 250 }}>
          <div style={{ fontSize: 34, fontWeight: 300, color: EFIELD }}>the field between the conductors: close to the speed of light</div>
        </Panel>
        <Panel opacity={at(frame, 69.0)} style={{ left: 200, top: 600 }}>
          <div style={{ fontSize: 34, fontWeight: 300, color: C.electron }}>the electrons: barely crawling</div>
        </Panel>
        <Cap opacity={1} kicker="Even in an ordinary cable" title="The energy travels in the fields around the conductors, not inside the copper" />
      </Scene>

      <Scene opacity={line}>
        <Ink>
          <path d="M 200 470 H 1720" strokeOpacity={0.4} />
          <path d="M 200 700 H 1720 M 200 680 V 720 M 1720 680 V 720" strokeOpacity={0.6} />
        </Ink>
        <Ink color={CURRENT} width={5}>
          <path d={wave(frame * 0.12)} />
        </Ink>
        <Panel opacity={1} style={{ left: 200, top: 720, width: 1520, textAlign: 'center' }}>
          <div style={{ fontSize: 44, fontWeight: 300 }}>
            one wavelength at 50 Hz: <span style={{ color: CURRENT }}>6,000 km</span>
          </div>
        </Panel>
        <Panel opacity={at(frame, 82.3)} style={{ left: 200, top: 190, width: 1520, display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 32, fontWeight: 300, color: C.dim }}>near end</div>
          <div style={{ fontSize: 32, fontWeight: 300, color: C.dim }}>far end: out of step</div>
        </Panel>
        <Cap opacity={1} kicker="That speed, though enormous, is not infinite" title="On a very long line, power engineers have to design for it" />
      </Scene>
      <Timeline frame={frame} already={[0, 1, 2, 3, 4, 5, 6, 7]} />
    </Shell>
  );
};
