import { useCurrentFrame } from 'remotion';
import voice from '../../../public/voice/fields/ch7.json';
import { ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../../ui/Shell';
import { Big, Kicker, Sym } from '../../ui/type';
import { POS } from '../../world/field';
import { BFIELD, NORTH, SOUTH } from '../../world/magnet';
import { at, B, Cap, E, EFIELD, GOLD, Ink, Timeline, VOICE } from './kit';

// Chapter 7 - One field, two faces.
export const F7_FRAMES = chapterFrames(voice.duration);

const View = ({ cx, moving, frame, swing }: { cx: number; moving: boolean; frame: number; swing: number }) => {
  const drift = moving ? ((frame * 2.2) % 240) - 120 : 0;
  return (
    <>
      <Ink color={EFIELD} width={3}>
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return <path key={i} d={`M ${cx + drift + Math.cos(a) * 46} ${450 + Math.sin(a) * 46} L ${cx + drift + Math.cos(a) * 170} ${450 + Math.sin(a) * 170}`} />;
        })}
      </Ink>
      {moving ? (
        <Ink color={BFIELD} width={3}>
          {[-130, 0, 130].map((dx) => (
            <ellipse key={dx} cx={cx + drift + dx} cy={450} rx={30} ry={200} strokeDasharray="6 12" strokeDashoffset={-frame * 2} />
          ))}
        </Ink>
      ) : null}
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute' }}>
        <circle cx={cx + drift} cy={450} r={34} fill={POS} style={{ filter: `drop-shadow(0 0 18px ${POS})` }} />
        <g transform={`translate(${cx}, 760) rotate(${swing})`}>
          <circle r={62} fill="none" stroke="#d7e6ff" strokeWidth={3} />
          <path d="M 0 -9 L 50 0 L 0 9 Z" fill={NORTH} />
          <path d="M 0 -9 L -50 0 L 0 9 Z" fill={SOUTH} />
        </g>
      </svg>
    </>
  );
};

export const F7 = () => {
  const frame = useCurrentFrame();
  const views = span(frame, T(-1), T(34.0), 12);
  const einstein = span(frame, T(34.1), T(58.4), 12);
  const coin = span(frame, T(58.5), T(74.4), 12);
  const four = span(frame, T(74.5), T(100), 12);
  const friend = at(frame, 16.3);
  const angle = (frame - T(60.8)) * 0.045;
  const squash = frame < T(60.8) ? 1 : frame < T(65.2) ? Math.max(0.03, Math.abs(Math.cos(Math.min(angle, Math.PI / 2)))) : Math.abs(Math.cos(angle));
  const fold = ramp(frame, T(83.0), T(86.0));
  const EQS: [React.ReactNode, string][] = [
    [<span key="a">∇ · <Sym color={EFIELD}>E</Sym> = ρ / ε₀</span>, 'charge makes an electric field'],
    [<span key="b">∇ · <Sym color={BFIELD}>B</Sym> = 0</span>, 'there are no single magnetic poles'],
    [<span key="c">∇ × <Sym color={EFIELD}>E</Sym> = − ∂<Sym color={BFIELD}>B</Sym> / ∂t</span>, 'a changing magnetic field makes an electric field'],
    [<span key="d">∇ × <Sym color={BFIELD}>B</Sym> = μ₀ J + μ₀ ε₀ ∂<Sym color={EFIELD}>E</Sym> / ∂t</span>, 'a current, or a changing electric field, makes a magnetic field'],
  ];

  return (
    <Shell voice={VOICE(7)} frames={F7_FRAMES}>
      <Scene opacity={views}>
        <div style={{ opacity: at(frame, 4.1) }}>
          <View cx={520} moving={false} frame={frame} swing={0} />
          <Panel opacity={1} style={{ left: 120, top: 70, width: 800, textAlign: 'center' }}>
            <Kicker>You, standing beside the charge</Kicker>
            <div style={{ fontSize: 32, fontWeight: 300, marginTop: 6, opacity: at(frame, 8.8) }}>
              an <E>electric field</E>, and no magnetic field
            </div>
          </Panel>
        </div>
        <div style={{ opacity: friend }}>
          <View cx={1400} moving frame={frame} swing={-50 * at(frame, 25.7) + 4 * Math.sin(frame * 0.3)} />
          <Panel opacity={1} style={{ left: 1000, top: 70, width: 800, textAlign: 'center' }}>
            <Kicker>Your friend, walking past</Kicker>
            <div style={{ fontSize: 32, fontWeight: 300, marginTop: 6, opacity: at(frame, 21.9) }}>
              the charge is moving: a <B>magnetic field</B> too
            </div>
          </Panel>
        </div>
        <Cap opacity={span(frame, T(28.5), T(32.5), 8)} kicker="Who is right?" title="Is there a magnetic field or not?" />
        <Cap opacity={span(frame, T(32.7), T(34.0), 6)} kicker="The answer" title="Both are right" />
      </Scene>

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

      <Scene opacity={coin}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: 'absolute', filter: `drop-shadow(0 0 30px ${GOLD}88)` }}>
          <ellipse cx={960} cy={440} rx={210 * squash} ry={210} fill="rgba(255,215,130,0.25)" stroke={GOLD} strokeWidth={8} />
          <ellipse cx={960} cy={440} rx={160 * squash} ry={160} fill="none" stroke={GOLD} strokeWidth={3} opacity={0.6} />
        </svg>
        <Cap opacity={span(frame, T(58.6), T(64.9))} kicker="Like looking at a coin" title="From the front you see a circle. From the edge, a line" />
        <Cap opacity={span(frame, T(65.2), T(68.3))} kicker="The coin has not changed" title="You have" />
        <Cap opacity={span(frame, T(68.5), T(74.4), 8)} kicker="That is why the two fields are bound so tightly" title="They were never really two" />
      </Scene>

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
