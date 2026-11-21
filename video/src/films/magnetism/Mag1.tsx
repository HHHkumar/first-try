import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import voice from '../../../public/voice/magnetism/ch1.json';
import { lerp, ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../../ui/Shell';
import { Big, Center, Kicker, Sub } from '../../ui/type';
import { BFIELD, CURRENT, NORTH, SOUTH } from '../../world/magnet';
import { at, Cap, Ink, Timeline, VOICE } from './kit';

// Chapter 1 - The needle that moved. Oersted's lecture, spring 1820.
export const MAG1_FRAMES = chapterFrames(voice.duration);

export const Mag1 = () => {
  const frame = useCurrentFrame();
  const on = at(frame, 13.9, 0.2);
  const swing = ramp(frame, T(15.6), T(17.4), Easing.out(Easing.back(2.2)));
  const angle = lerp(0, 78, swing) + 2 * Math.sin(frame * 0.3) * (1 - swing);
  const bench = 1 - ramp(frame, T(25.4), T(26.0));
  const wall = span(frame, T(25.6), T(37.6), 12);
  const crack = ramp(frame, T(34.8), T(36.4));
  const title = ramp(frame, T(37.4), T(38.0));

  return (
    <Shell voice={VOICE(1)} frames={MAG1_FRAMES}>
      <Scene opacity={1}>
        <AbsoluteFill style={{ opacity: bench }}>
          <Ink>
            {/* battery */}
            <rect x={250} y={520} width={200} height={260} rx={14} fill="rgba(215,230,255,0.04)" />
            <path d="M 310 520 V 480 M 390 520 V 480" strokeWidth={6} />
            {/* the bench */}
            <path d="M 150 800 H 1770" strokeOpacity={0.5} />
            {/* compass under the wire */}
            <circle cx={1060} cy={560} r={150} fill="rgba(215,230,255,0.03)" />
            <circle cx={1060} cy={560} r={8} fill="#d7e6ff" />
          </Ink>
          {/* the wire: up from the battery, over the compass, and back */}
          <Ink color={on > 0.5 ? CURRENT : '#93a3c0'} width={6} style={{ filter: on > 0.5 ? `drop-shadow(0 0 12px ${CURRENT})` : undefined }}>
            <path d="M 310 480 V 400 H 1500 V 700 H 620" />
            <path d={`M 390 480 V 440 H 520 ${on > 0.5 ? 'L 620 440' : 'L 600 400'} M 620 440 V 700`} />
          </Ink>
          <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute' }}>
            <g transform={`rotate(${angle} 1060 560)`}>
              <polygon points="1060,548 1190,560 1060,572" fill={NORTH} />
              <polygon points="1060,548 930,560 1060,572" fill={SOUTH} />
            </g>
          </svg>
          <Panel opacity={at(frame, 17.8)} style={{ left: 1180, top: 110, width: 640 }}>
            <Kicker color={BFIELD}>Nothing was touching it</Kicker>
            <div style={{ fontSize: 50, fontWeight: 300, marginTop: 8, lineHeight: 1.2 }}>A current in a wire had turned a magnet</div>
          </Panel>
          <Cap opacity={span(frame, T(0.2), T(13.4))} kicker="Copenhagen · spring 1820 · Hans Christian Oersted" title="A battery, a length of wire, and, by chance, a compass" />
          <Cap opacity={span(frame, T(13.8), T(25.2))} kicker="He closed the circuit" title="And the compass needle moved" />
        </AbsoluteFill>

        {/* two subjects, and the wall between them */}
        <AbsoluteFill style={{ opacity: wall }}>
          <Center>
            <div style={{ display: 'flex', alignItems: 'center', gap: 70, fontSize: 130, fontWeight: 300, letterSpacing: -3 }}>
              <span style={{ color: CURRENT, transform: `translateX(${crack * 40}px)` }}>Electricity</span>
              <span style={{ width: 6, height: 300 * (1 - crack), background: C.dim, opacity: 1 - crack }} />
              <span style={{ color: BFIELD, transform: `translateX(${-crack * 40}px)` }}>Magnetism</span>
            </div>
            <Sub style={{ marginTop: 50, opacity: at(frame, 27.6) }}>for two thousand years, two separate things</Sub>
          </Center>
        </AbsoluteFill>

        <Center opacity={title}>
          <Kicker style={{ marginBottom: 26 }}>Magnetism and the magnetic field</Kicker>
          <Big size={170} style={{ textShadow: `0 0 80px ${BFIELD}55` }}>
            The Second Field
          </Big>
        </Center>
      </Scene>
      <Timeline frame={frame} already={[]} events={[[4, 0.8]]} opacity={ramp(frame, T(0.4), T(1.4))} />
    </Shell>
  );
};
