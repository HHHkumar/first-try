import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/capacitance/ch1.json';
import { lerp, ramp, span } from '../../anim';
import { stix } from '../../fonts';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../../ui/Shell';
import { Big, Center, Kicker, Sub } from '../../ui/type';
import { NEG } from '../../world/field';
import { rgb, Stage3D } from '../../world/Stage3D';
import type { CameraPose } from '../../world/WireWorld';
import { at, Cap, GOLD, Ink, shot, Timeline, VOICE } from './kit';

// Chapter 1 - Lightning in a jar. Leiden 1746, and Nollet's ring of soldiers.
export const CAPAC1_FRAMES = chapterFrames(voice.duration);
const N = 180;

export const Capac1 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const jar = 1 - ramp(frame, T(31.2), T(31.9));
  const sRing = shot(frame, 31.4, 45.6);
  const title = ramp(frame, T(45.3), T(46.0));
  const zap = frame >= T(9.9) && frame < T(11.6) ? (frame % 6 < 3 ? 1 : 0.35) : 0;
  const reach = ramp(frame, T(7.0), T(9.9), Easing.inOut(Easing.quad));

  const fire = T(43.5);
  const since = frame - fire;
  const pose: CameraPose = { pos: [Math.sin(frame * 0.003) * 3, lerp(13, 9, ramp(frame, T(31.4), T(45))), 19], target: [0, 0, 0], fov: 36, focus: 21, dof: 0.03 };

  return (
    <Shell
      voice={VOICE(1)}
      frames={CAPAC1_FRAMES}
      world={
        frame > T(31.0) ? (
          <AbsoluteFill style={{ opacity: Math.max(sRing, title * 0.5) }}>
            <Stage3D
              width={width}
              height={height}
              pose={pose}
              fog={0.01}
              glows={(add) => {
                const body = rgb('#d7e6ff');
                const hot = rgb(GOLD);
                for (let i = 0; i < N; i++) {
                  const a = (i / N) * Math.PI * 1.96 + 0.06;
                  const x = Math.cos(a) * 9;
                  const z = Math.sin(a) * 9;
                  // the shock runs round the ring far faster than anyone can react
                  const hit = since >= 0 ? Math.max(0, 1 - Math.abs(since - 2 - (i / N) * 4) / 3) : 0;
                  const jump = since >= 0 ? Math.max(0, Math.sin(Math.min(Math.PI, Math.max(0, since - 3) * 0.35))) * 0.9 : 0;
                  const seen = ramp(frame, T(34.8) + i * 0.6, T(35.4) + i * 0.6);
                  const c = hit > 0.2 ? hot : body;
                  add(x, 1.5 + jump, z, 0.34, c, 0.9 * seen);
                  add(x, 0.9 + jump, z, 0.3, c, 0.7 * seen);
                  add(x, 0.4 + jump, z, 0.26, c, 0.6 * seen);
                  if (hit > 0) add(x, 1.0 + jump, z, 1.4, hot, 0.5 * hit);
                }
                // the jar, at the gap in the ring
                add(9, 1.0, 0.2, 1.6, rgb(NEG), 0.8);
                add(9, 1.0, 0.2, 0.5, rgb('#eafcff'), 1);
                if (since >= 0 && since < 8) add(9, 1.0, 0.2, 9, hot, 0.5 * (1 - since / 8));
              }}
            />
          </AbsoluteFill>
        ) : null
      }
    >
      <Scene opacity={jar}>
        <AbsoluteFill style={{ background: `radial-gradient(circle 420px at 800px 330px, rgba(255,244,214,${0.5 * zap}), rgba(255,244,214,0) 100%)` }} />
        <Ink>
          {/* the jar, its water, the cork and the wire */}
          <path d="M 560 380 Q 560 330 620 320 V 290 H 800 V 320 Q 860 330 860 380 V 800 Q 860 840 820 840 H 600 Q 560 840 560 800 Z" fill="rgba(215,230,255,0.04)" />
          <path d="M 562 560 H 858" strokeOpacity={0.5} />
          <path d="M 562 560 V 800 Q 562 838 600 838 H 820 Q 858 838 858 800 V 560 Z" fill={`${NEG}22`} stroke="none" />
          <path d="M 710 700 V 190 M 690 190 H 730" strokeWidth={5} />
          <circle cx={710} cy={176} r={16} />
          {/* a hand cupped round the jar, and another reaching for the wire */}
          <path d="M 470 880 C 430 760, 470 640, 548 620 M 548 620 C 520 700, 520 780, 560 850" strokeOpacity={0.8} />
          <path d={`M ${lerp(1100, 800, reach)} ${lerp(60, 150, reach)} l -52 26 m 52 -26 l 300 -110`} strokeOpacity={0.8} strokeWidth={5} />
        </Ink>
        <Ink color={GOLD} width={7} opacity={zap} style={{ filter: `drop-shadow(0 0 24px ${GOLD})` }}>
          <path d="M 728 172 L 742 160 L 736 176 L 750 168" />
        </Ink>
        <Panel opacity={span(frame, T(12.0), T(17.2))} style={{ left: 980, top: 300, width: 820 }}>
          <div style={{ fontFamily: stix, fontStyle: 'italic', fontSize: 64, lineHeight: 1.25, color: C.text }}>“I would not take a second shock for the whole kingdom of France.”</div>
        </Panel>
        <Panel opacity={span(frame, T(17.4), T(31.2))} style={{ left: 980, top: 240, width: 840 }}>
          <Kicker>Something new</Kicker>
          <div style={{ fontSize: 72, fontWeight: 300, letterSpacing: -1, marginTop: 10, lineHeight: 1.15 }}>
            For the first time, electricity could be
            <div style={{ color: C.electron }}>
              <span style={{ opacity: at(frame, 27.8) }}>collected, </span>
              <span style={{ opacity: at(frame, 28.6) }}>kept, </span>
              <span style={{ opacity: at(frame, 29.6) }}>released</span>
            </div>
          </div>
        </Panel>
        <Cap opacity={span(frame, T(0.2), T(17.0))} kicker="January 1746 · Leiden" title="A glass jar of water in one hand, a wire in the other" />
        <Cap opacity={span(frame, T(17.4), T(31.0))} kicker="Pieter van Musschenbroek · Ewald von Kleist" title="Two men stumbled onto it, a few months apart" />
      </Scene>

      <Panel opacity={span(frame, T(35.6), T(45.4))} style={{ right: 110, top: 86, textAlign: 'right' }}>
        <Kicker>Soldiers of the royal guard, hand in hand</Kicker>
        <div style={{ fontSize: 150, fontWeight: 300, letterSpacing: -4 }}>{Math.round(180 * ramp(frame, T(35.8), T(39.6), Easing.linear))}</div>
      </Panel>
      <Cap opacity={span(frame, T(34.6), T(43.4))} kicker="1746 · Paris · the Abbé Nollet" title="One jar, discharged through all of them" />
      <Cap opacity={span(frame, T(43.6), T(45.4), 8)} kicker="The shock" title="They jumped as one" />

      <Center opacity={title}>
        <Kicker style={{ marginBottom: 26 }}>Capacitance</Kicker>
        <Big size={170} style={{ textShadow: `0 0 80px ${C.electron}55` }}>
          The Space Between
        </Big>
        <Sub style={{ opacity: at(frame, 48.4) }}>the Leyden jar was the first capacitor</Sub>
      </Center>

      <Timeline frame={frame} already={[]} events={[[1, 17.3], [0, 22.7], [2, 34.6]]} opacity={ramp(frame, T(16.4), T(17.4))} />
    </Shell>
  );
};
