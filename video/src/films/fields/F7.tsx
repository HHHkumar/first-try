import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/fields/ch7.json';
import { ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../../ui/Shell';
import { Big, Kicker, Sym } from '../../ui/type';
import { POS } from '../../world/field';
import { BFIELD, drawNeedle } from '../../world/magnet';
import { rgb, Stage3D, type Add } from '../../world/Stage3D';
import { at, B, Cap, E, EFIELD, GOLD, ring, shot, Timeline, VOICE } from './kit';

// Chapter 7 - One field, two faces.
export const F7_FRAMES = chapterFrames(voice.duration);

// a charge and its electric field, reaching straight out in every direction
const radial = (glow: Add, cx: number, cy: number, frame: number, gain = 1) => {
  const e = rgb(EFIELD);
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    for (let j = 6; j < 34; j++) {
      const r = j * 0.085;
      const phase = (((j - frame * 0.5 + i * 7) % 20) + 20) % 20;
      const pulse = Math.exp(-(phase * phase) / 8);
      glow(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0, 0.1 + 0.1 * pulse, e, (0.6 + 0.4 * pulse) * gain * (1 - j / 50));
    }
  }
  glow(cx, cy, 0, 2, rgb(POS), 0.4 * gain);
};

export const F7 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const sViews = shot(frame, -1, 34.1);
  const einstein = span(frame, T(34.1), T(58.4), 12);
  const sCoin = shot(frame, 58.3, 74.5);
  const four = span(frame, T(74.5), T(100), 12);
  const coin = frame >= T(58.4);
  const friend = at(frame, 16.3);
  const drift = ((frame * 0.03) % 3) - 1.5;
  const swung = at(frame, 25.7);
  const angle = frame < T(60.8) ? 0 : frame < T(65.2) ? Math.min((frame - T(60.8)) * 0.03, Math.PI / 2) : (frame - T(65.2)) * 0.04 + Math.PI / 2;
  const fold = ramp(frame, T(83.0), T(86.0));
  const EQS: [React.ReactNode, string][] = [
    [<span key="a">∇ · <Sym color={EFIELD}>E</Sym> = ρ / ε₀</span>, 'charge makes an electric field'],
    [<span key="b">∇ · <Sym color={BFIELD}>B</Sym> = 0</span>, 'there are no single magnetic poles'],
    [<span key="c">∇ × <Sym color={EFIELD}>E</Sym> = − ∂<Sym color={BFIELD}>B</Sym> / ∂t</span>, 'a changing magnetic field makes an electric field'],
    [<span key="d">∇ × <Sym color={BFIELD}>B</Sym> = μ₀ J + μ₀ ε₀ ∂<Sym color={EFIELD}>E</Sym> / ∂t</span>, 'a current, or a changing electric field, makes a magnetic field'],
  ];

  return (
    <Shell
      voice={VOICE(7)}
      frames={F7_FRAMES}
      world={
        frame < T(74.6) ? (
          <AbsoluteFill style={{ opacity: Math.max(sViews, sCoin) * (1 - einstein) }}>
            <Stage3D
              width={width}
              height={height}
              pose={coin ? { pos: [0, 1.2, 12], target: [0, 0.6, 0], fov: 34, focus: 12, dof: 0.03 } : { pos: [0, 1.6, 17], target: [0, 0.2, 0], fov: 34, focus: 17, dof: 0.03 }}
              orbs={(add) => {
                if (coin) return;
                add(-5, 1.2, 0, 0.8, rgb(POS), at(frame, 4.1));
                add(5 + drift, 1.2, 0, 0.8, rgb(POS), friend);
              }}
              glows={(add) => {
                if (coin) {
                  // a coin, turned from face-on to edge-on and round again
                  const g = rgb(GOLD);
                  const co = Math.cos(angle);
                  const si = Math.sin(angle);
                  for (let i = 0; i < 700; i++) {
                    const r = 2.4 * Math.sqrt((i + 0.5) / 700);
                    const a = i * 2.39996;
                    add(Math.cos(a) * r * co, 0.6 + Math.sin(a) * r, Math.cos(a) * r * si, 0.16, g, 0.65);
                  }
                  for (let i = 0; i < 160; i++) add(Math.cos((i / 160) * 6.283) * 2.45 * co, 0.6 + Math.sin((i / 160) * 6.283) * 2.45, Math.cos((i / 160) * 6.283) * 2.45 * si, 0.2, g, 1);
                  return;
                }
                // you, beside the charge: an electric field only, and a compass that does nothing
                radial(add, -5, 1.2, frame, at(frame, 4.1));
                drawNeedle(add, -5, -2.4, 0, 1, 0, 0, 2.2, at(frame, 13.4));
                ring(add, -5, -2.4, 0, 'z', 1.35, 0, '#c8d4ea', 0.6 * at(frame, 13.4));
                ring(add, 5, -2.4, 0, 'z', 1.35, 0, '#c8d4ea', 0.6 * friend);
                // your friend, walking past: the same charge, now moving, with rings of magnetic field too
                radial(add, 5 + drift, 1.2, frame, friend);
                for (const dx of [-1.6, 0, 1.6]) ring(add, 5 + drift + dx, 1.2, 0, 'x', 1.9, frame, BFIELD, at(frame, 21.9));
                drawNeedle(add, 5, -2.4, 0, Math.cos(swung * 1.1 + 0.05 * Math.sin(frame * 0.3)), Math.sin(swung * 1.1 + 0.05 * Math.sin(frame * 0.3)), 0, 2.2, friend);
              }}
            />
          </AbsoluteFill>
        ) : null
      }
    >
      <Panel opacity={span(frame, T(4.1), T(34.0))} style={{ left: 120, top: 70, width: 800, textAlign: 'center' }}>
        <Kicker>You, standing beside the charge</Kicker>
        <div style={{ fontSize: 32, fontWeight: 300, marginTop: 6, opacity: at(frame, 8.8) }}>
          an <E>electric field</E>, and no magnetic field
        </div>
      </Panel>
      <Panel opacity={span(frame, T(16.3), T(34.0))} style={{ left: 1000, top: 70, width: 800, textAlign: 'center' }}>
        <Kicker>Your friend, walking past</Kicker>
        <div style={{ fontSize: 32, fontWeight: 300, marginTop: 6, opacity: at(frame, 21.9) }}>
          the charge is moving: a <B>magnetic field</B> too
        </div>
      </Panel>
      <Cap opacity={span(frame, T(28.5), T(32.5), 8)} kicker="Who is right?" title="Is there a magnetic field or not?" />
      <Cap opacity={span(frame, T(32.7), T(34.0), 6)} kicker="The answer" title="Both are right" />

      <Scene opacity={einstein}>
        <Panel opacity={1} style={{ left: 0, right: 0, top: 210, textAlign: 'center' }}>
          <Kicker>1905 · Albert Einstein opens his most famous paper with this puzzle</Kicker>
          <div style={{ fontSize: 52, fontWeight: 300, marginTop: 60, opacity: at(frame, 41.4), color: C.dim }}>
            The <E>electric</E> and <B>magnetic</B> fields are not two separate things
          </div>
          <Big size={100} style={{ marginTop: 40, opacity: at(frame, 47.4) }}>
            Two faces of one <span style={{ color: GOLD }}>electromagnetic field</span>
          </Big>
          <div style={{ fontSize: 44, fontWeight: 300, marginTop: 50, opacity: at(frame, 52.2), color: C.dim }}>how much of each you find depends on how you are moving</div>
        </Panel>
      </Scene>

      <Cap opacity={span(frame, T(58.6), T(64.9))} kicker="Like looking at a coin" title="From the front you see a circle. From the edge, a line" />
      <Cap opacity={span(frame, T(65.2), T(68.3))} kicker="The coin has not changed" title="You have" />
      <Cap opacity={span(frame, T(68.5), T(74.4), 8)} kicker="That is why the two fields are bound so tightly" title="They were never really two" />

      <Scene opacity={four}>
        <Panel opacity={1 - fold} style={{ left: 460, top: 150, width: 1000 }}>
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} style={{ height: 10, margin: '15px 0', width: `${55 + ((i * 37) % 45)}%`, background: 'rgba(215,230,255,0.28)', borderRadius: 5 }} />
          ))}
        </Panel>
        <Panel opacity={fold} style={{ left: 240, top: 150, width: 1440 }}>
          {EQS.map(([eq, words], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 50, marginTop: 26 }}>
              <div style={{ fontFamily: 'STIX Two Text', fontSize: 68, width: 760, whiteSpace: 'nowrap' }}>{eq}</div>
              <div style={{ fontSize: 30, fontWeight: 300, color: C.dim }}>{words}</div>
            </div>
          ))}
        </Panel>
        <Cap opacity={span(frame, T(74.7), T(87.2))} kicker="1884 · Oliver Heaviside" title="Maxwell’s twenty equations, reduced to four short lines" />
        <Cap opacity={span(frame, T(87.5), T(100))} kicker="Four lines" title="Every electrical machine ever built obeys them" />
      </Scene>
      <Timeline frame={frame} already={[0, 1, 2, 3, 5, 6]} events={[[7, 35.0], [4, 80.2]]} />
    </Shell>
  );
};
