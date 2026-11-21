import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import voice from '../../../public/voice/magnetism/ch3.json';
import { ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../../ui/Shell';
import { Big, Center, Kicker } from '../../ui/type';
import { NEG, POS } from '../../world/field';
import { NORTH, SOUTH } from '../../world/magnet';
import { at, Cap, Timeline, VOICE } from './kit';

// Chapter 3 - Poles, and why they come in pairs.
export const MAG3_FRAMES = chapterFrames(voice.duration);

export const Mag3 = () => {
  const frame = useCurrentFrame();
  // 1, 2, 4, 8 pieces: every piece keeps both poles
  const cuts = [16.6, 17.6, 18.6].filter((t) => frame >= T(t)).length;
  const pieces = 2 ** cuts;
  const spread = ramp(frame, T(16.6), T(20.0), Easing.out(Easing.cubic));
  const total = 800;
  const w = total / pieces;
  const apart = ramp(frame, T(8.6), T(12.0), Easing.out(Easing.cubic));
  const question = span(frame, T(21.4), T(31.4), 12);

  return (
    <Shell voice={VOICE(3)} frames={MAG3_FRAMES}>
      <Scene opacity={1}>
        <AbsoluteFill style={{ opacity: 1 - question * 0.92 }}>
          <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute' }}>
            {/* charges can be separated */}
            <g opacity={span(frame, T(8.0), T(21.2), 12)}>
              <circle cx={1440 - 130 * apart} cy={330} r={46} fill={POS} />
              <circle cx={1440 + 130 * apart} cy={330} r={46} fill={NEG} />
              <path d={`M ${1426 - 130 * apart} 330 h 28 m -14 -14 v 28 M ${1426 + 130 * apart} 330 h 28`} stroke="#03060d" strokeWidth={6} />
            </g>
            {/* a magnet cannot */}
            {Array.from({ length: pieces }, (_, i) => {
              const gap = 26 * spread * (cuts > 0 ? 1 : 0);
              const x = 560 + i * w + (i - (pieces - 1) / 2) * gap;
              return (
                <g key={i}>
                  <rect x={x} y={560} width={w / 2} height={130} fill={NORTH} opacity={0.9} />
                  <rect x={x + w / 2} y={560} width={w / 2} height={130} fill={SOUTH} opacity={0.9} />
                  <rect x={x} y={560} width={w} height={130} fill="none" stroke="#d7e6ff" strokeWidth={3} />
                  {w > 150 ? (
                    <g fill="#03060d" fontSize={Math.min(64, w / 4)} fontFamily="Sora" fontWeight={600} textAnchor="middle">
                      <text x={x + w / 4} y={648}>
                        N
                      </text>
                      <text x={x + (3 * w) / 4} y={648}>
                        S
                      </text>
                    </g>
                  ) : null}
                </g>
              );
            })}
          </svg>
          <Panel opacity={span(frame, T(8.0), T(21.2), 12)} style={{ left: 1140, top: 180, width: 600, textAlign: 'center', fontSize: 40, fontWeight: 300 }}>
            a charge can exist alone
          </Panel>
          <Panel opacity={at(frame, 12.6)} style={{ left: 0, right: 0, top: 740, textAlign: 'center', fontSize: 46, fontWeight: 300 }}>
            nobody has ever found a north pole on its own
          </Panel>
          <Cap opacity={span(frame, T(0.2), T(7.8))} kicker="Every magnet has two poles" title="And here magnetism differs sharply from electricity" />
        </AbsoluteFill>
        <Center opacity={question}>
          <Kicker style={{ marginBottom: 26 }}>A clue</Kicker>
          <Big size={92}>Magnetism does not come from magnetic charge</Big>
          <Big size={92} style={{ color: C.electron, marginTop: 18, opacity: at(frame, 28.0) }}>
            It comes from something else
          </Big>
        </Center>
      </Scene>
      <Timeline frame={frame} already={[0, 1, 2, 3, 4]} />
    </Shell>
  );
};
