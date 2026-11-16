import { useCurrentFrame } from 'remotion';
import voice from '../../../public/voice/inductance/ch4.json';
import { span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../../ui/Shell';
import { Big, Frac, Kicker, Sub, Sym } from '../../ui/type';
import { CURRENT } from '../../world/magnet';
import { at, Cap, Ink, Timeline, VOICE, VOLT } from './kit';

// Chapter 4 - Inductance: the flywheel, the definition, the word and the unit.
export const IND4_FRAMES = chapterFrames(voice.duration);

export const Ind4 = () => {
  const frame = useCurrentFrame();
  const wheel = span(frame, T(-1), T(14.4), 12);
  const define = span(frame, T(14.5), T(33.6), 12);
  const names = span(frame, T(33.7), T(51.9), 12);
  const unit = span(frame, T(52.0), T(70), 12);
  // a heavy wheel: slow to start, then it keeps going
  const s = (frame - T(2.2)) / 30;
  const angle = s < 0 ? 0 : s < 3.6 ? (0.5 * 200 * s * s) / 3.6 : 200 * (s - 1.8);

  return (
    <Shell voice={VOICE(4)} frames={IND4_FRAMES}>
      <Scene opacity={wheel}>
        <Ink width={5}>
          <path d="M 960 470 L 860 800 H 1060 Z" strokeOpacity={0.5} />
          <g transform={`rotate(${angle} 960 470)`}>
            <circle cx={960} cy={470} r={270} strokeWidth={34} />
            <circle cx={960} cy={470} r={36} />
            {[0, 60, 120].map((a) => (
              <path key={a} d="M 690 470 H 1230" transform={`rotate(${a} 960 470)`} />
            ))}
            <circle cx={960} cy={200} r={15} fill={CURRENT} stroke={CURRENT} />
          </g>
        </Ink>
        <Cap opacity={span(frame, T(0.2), T(6.6))} kicker="Think of a heavy flywheel" title="Hard to get turning, and once turning, hard to stop" />
        <Cap opacity={span(frame, T(7.0), T(11.5))} kicker="It does not object to spinning" title="It objects to changing its speed" />
        <Cap opacity={span(frame, T(11.8), T(14.4), 8)} kicker="A coil" title="treats current the same way" />
      </Scene>

      <Scene opacity={define}>
        <Panel opacity={1} style={{ left: 0, right: 0, top: 150, textAlign: 'center' }}>
          <Kicker>How strongly it objects is its inductance, written L</Kicker>
          <div style={{ fontSize: 170, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 36, marginTop: 50, opacity: at(frame, 18.2) }}>
            <Sym color={VOLT}>V</Sym>
            <Sym color={C.dim} style={{ fontStyle: 'normal' }}>
              =
            </Sym>
            <span style={{ opacity: at(frame, 23.4) }}>
              <Sym>L</Sym>
            </span>
            <Frac
              width={250}
              top={
                <span>
                  <Sym style={{ fontStyle: 'normal' }}>Δ</Sym>
                  <Sym color={CURRENT}>I</Sym>
                </span>
              }
              bottom={
                <span>
                  <Sym style={{ fontStyle: 'normal' }}>Δ</Sym>
                  <Sym color={C.shape}>t</Sym>
                </span>
              }
            />
          </div>
          <div style={{ fontSize: 44, fontWeight: 300, marginTop: 50, opacity: at(frame, 27.6) }}>
            <span style={{ color: VOLT }}>voltage across the coil</span> = inductance × <span style={{ color: CURRENT }}>how fast the current is changing</span>
          </div>
        </Panel>
        <Cap opacity={span(frame, T(18.0), T(23.0))} kicker="The faster you try to change the current" title="the larger the voltage the coil produces" />
      </Scene>

      <Scene opacity={names}>
        <Panel opacity={1} style={{ left: 200, top: 190, width: 1500 }}>
          <Kicker>The word</Kicker>
          <div style={{ fontSize: 84, fontWeight: 300, letterSpacing: -2, marginTop: 8 }}>
            “inductance” · <span style={{ color: C.electron }}>Oliver Heaviside, 1886</span>
          </div>
          <Sub style={{ textAlign: 'left', opacity: at(frame, 37.6) }}>a self-taught English engineer</Sub>
          <div style={{ opacity: at(frame, 43.2), marginTop: 70 }}>
            <Kicker>The unit</Kicker>
            <div style={{ fontSize: 84, fontWeight: 300, letterSpacing: -2, marginTop: 8 }}>
              the <span style={{ color: CURRENT }}>henry</span> · Chicago, 1893
            </div>
            <Sub style={{ textAlign: 'left', opacity: at(frame, 49.4) }}>International Electrical Congress: named after the man who saw the spark</Sub>
          </div>
        </Panel>
      </Scene>

      <Scene opacity={unit}>
        <Panel opacity={1} style={{ left: 0, right: 0, top: 130, textAlign: 'center' }}>
          <Kicker>One henry means this</Kicker>
          <Big size={92} style={{ marginTop: 16 }}>
            <span style={{ color: CURRENT }}>1 ampere each second</span>
            <span style={{ opacity: at(frame, 57.6) }}>
              {' '}
              → <span style={{ color: VOLT }}>1 volt</span>
            </span>
          </Big>
        </Panel>
        <Panel opacity={at(frame, 60.0)} style={{ left: 0, right: 0, top: 400, display: 'flex', justifyContent: 'center', gap: 90 }}>
          {[
            ['1 H', 'henry', 'a mains transformer winding', 60.0],
            ['1 mH', 'a thousandth', 'a power-supply choke', 62.6],
            ['1 µH', 'a millionth', 'a radio-frequency inductor', 64.2],
          ].map(([v, n, what, t]) => (
            <div key={v as string} style={{ textAlign: 'center', opacity: at(frame, t as number), width: 430 }}>
              <div style={{ fontSize: 110, fontWeight: 300, letterSpacing: -3, color: CURRENT }}>{v}</div>
              <div style={{ fontSize: 34, fontWeight: 300 }}>{n}</div>
              <div style={{ fontSize: 28, fontWeight: 300, color: C.dim, marginTop: 8 }}>{what}</div>
            </div>
          ))}
        </Panel>
      </Scene>
      <Timeline frame={frame} already={[0, 1, 2]} events={[[4, 35.6], [5, 46.6]]} />
    </Shell>
  );
};
