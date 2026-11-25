import { useCurrentFrame } from 'remotion';
import voice from '../../../public/voice/shorts/ch9.json';
import { sora } from '../../fonts';
import { ramp } from '../../anim';
import { AStage, CYAN, PINK, SUN, sway, VIOLET } from '../ac/kit';
import { COPPER, station, type Kind } from '../ac2/kit';
import { moved, Pop, shortFrames, ShortShell, st, tspan } from './kit';

// Short 9 - the current that runs late: R in step, L lags, C leads; CIVIL; reactance borrows energy.
export const S9_FRAMES = shortFrames(voice.duration);
const BEATS: [number, Kind][] = [[0, 'L'], [5.8, 'R'], [13, 'L'], [22.6, 'C'], [32.7, 'C'], [48.3, 'L']];

export const S9 = () => {
  const frame = useCurrentFrame();
  const t = (frame - st(0)) / 30;
  let bi = 0;
  BEATS.forEach(([s], i) => { if (t >= s) bi = i; });
  const kind = BEATS[bi][1];
  const next = BEATS[bi + 1]?.[0] ?? 99;
  const g = Math.min(ramp(frame, st(BEATS[bi][0]), st(BEATS[bi][0]) + 8), 1 - ramp(frame, st(next) - 8, st(next)));
  const civil = tspan(frame, 32.7, 48.2);
  const now = frame * 0.06;
  const power = t >= 48.3 ? 1 : 0;
  const name = { R: ['Resistor', 'in step', '#ffffff'], L: ['Coil', 'current lags 90°', COPPER], C: ['Capacitor', 'current leads 90°', VIOLET] }[kind];

  return (
    <ShortShell
      n={9}
      voice={voice}
      endAt={68.2}
      headline={<>The current that <span style={{ color: CYAN }}>runs late</span></>}
      world={
        <AStage
          ground={false}
          opacity={1 - 0.7 * civil}
          pose={{ pos: [sway(frame, 1.2), 1.2, 15.5], target: [0, 0.6, 0], fov: 40, focus: 15.5, dof: 0.02 }}
          scene={(add) => station(moved(add, 0, -0.6), 0, kind, now, frame, { gain: g, p: power, bus: 0 })}
        />
      }
    >
      <div style={{ position: 'absolute', left: 0, right: 0, top: 470, textAlign: 'center', fontFamily: sora, opacity: g * (1 - civil) * (t > 3.9 && t < 48.3 ? 1 : 0) }}>
        <div style={{ fontSize: 74, fontWeight: 700, color: name[2] }}>{name[0]}</div>
        <div style={{ fontSize: 44, fontWeight: 600, color: '#d9d4f5', marginTop: 6 }}>{name[1]}</div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1060, textAlign: 'center', fontFamily: sora, fontSize: 34, fontWeight: 600, opacity: (1 - civil) * (t > 3 && t < 66 ? 1 : 0) }}>
        <span style={{ color: PINK }}>voltage</span> · <span style={{ color: CYAN }}>current</span>
        {power ? <span style={{ color: SUN }}> · power</span> : null}
      </div>
      {civil > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', fontFamily: sora, opacity: civil }}>
          <div style={{ fontSize: 230, fontWeight: 700, letterSpacing: 14, lineHeight: 1 }}>
            <span style={{ color: t >= 36.3 && t < 42.3 ? VIOLET : '#fff' }}>C</span>
            <span style={{ color: t >= 36.3 && t < 42.3 ? CYAN : t >= 42.3 ? CYAN : '#fff' }}>I</span>
            <span style={{ color: t >= 36.3 ? PINK : '#fff' }}>V</span>
            <span style={{ color: t >= 42.3 ? CYAN : '#fff' }}>I</span>
            <span style={{ color: t >= 42.3 ? COPPER : '#fff' }}>L</span>
          </div>
          <div style={{ fontSize: 48, fontWeight: 600, marginTop: 30, color: '#d9d4f5' }}>{t < 42.3 ? 'Capacitor: I before V' : 'Inductor: V before I'}</div>
        </div>
      ) : null}
      <Pop frame={frame} from={51.5} to={60.1} size={80} color={SUN}>
        borrows energy,
        <br />
        hands it back
      </Pop>
      <Pop frame={frame} from={60.2} to={68.1} size={92} color={CYAN}>reactance</Pop>
    </ShortShell>
  );
};
