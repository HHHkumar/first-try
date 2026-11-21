import { useCurrentFrame } from 'remotion';
import voice from '../../../public/voice/shorts/ch5.json';
import { sora } from '../../fonts';
import { mulberry32 } from '../../world/rng';
import { drawCoilField, drawTurns, useCoil } from '../inductance/kit';
import { AStage, CYAN, MINT, SUN, sway } from '../ac/kit';
import { Pop, shortFrames, ShortShell, st, upright } from './kit';

// Short 5 - why switches spark: the current climbs slowly, then the collapsing field fires a spark.
export const S5_FRAMES = shortFrames(voice.duration);
const ON = 12.0;
const OFF = 24.6;
const current = (t: number) => {
  if (t < ON) return 0;
  const up = 1 - Math.exp(-(t - ON) / 2.6);
  if (t < OFF) return up;
  const at = 1 - Math.exp(-(OFF - ON) / 2.6);
  return at * Math.exp(-(t - OFF) / 0.5) + (t > 54.5 ? (1 - Math.exp(-(t - 54.5) / 1.5)) * 0.8 : 0);
};

export const S5 = () => {
  const frame = useCurrentFrame();
  const t = (frame - st(0)) / 30;
  const coil = useCoil(12, 7, 1.6);
  const i = current(t);
  const closed = (t >= ON && t < OFF) || t >= 54.5;
  const spark = t >= OFF && t < OFF + 1.4 ? 1 : t >= 31.4 && t < 40.5 ? (Math.floor(t * 6) % 3 === 0 ? 1 : 0.35) : 0;

  return (
    <ShortShell
      n={5}
      voice={voice}
      endAt={63.7}
      headline={<>Why switches <span style={{ color: SUN }}>spark</span></>}
      world={
        <AStage
          ground={false}
          pose={{ pos: [6 + sway(frame, 2), 3, 25], target: [0, 2.2, 0], fov: 40, focus: 25, dof: 0.02 }}
          scene={(add) => {
            const up = upright(add);
            drawTurns(up, coil, frame * 0.9 * i, i);
            drawCoilField(up, coil, frame, i, 1.2);
            // leads up to a switch above the coil
            for (let y = 3.6; y <= 5.4; y += 0.08) for (const x of [-0.7, 0.7]) add(x, y, 0, 0.12, [0.85, 0.85, 1], 0.6);
            const lever = closed ? 0 : 0.7;
            for (let s = 0; s <= 1.4; s += 0.05) add(-0.7 + Math.cos(lever) * s, 5.4 + Math.sin(lever) * s, 0, 0.16, [1, 1, 1], 0.95);
            add(0.7, 5.4, 0, 0.3, [1, 1, 1], 0.9);
            // the spark across the open contacts
            if (spark > 0) {
              const r = mulberry32(frame * 7 + 3);
              add(0.7, 5.6, 0, 3.4, [0.56, 0.82, 1], 0.5 * spark);
              add(0.7, 5.6, 0, 0.9, [1, 1, 1], spark);
              for (let k = 0; k < 9; k++) {
                const a = r() * Math.PI * 2;
                const L = 0.6 + r() * 1.6;
                for (let s = 0; s < 1; s += 0.08) add(0.7 + Math.cos(a) * L * s + (r() - 0.5) * 0.12, 5.6 + Math.sin(a) * L * s + (r() - 0.5) * 0.12, 0, 0.12, [0.92, 0.97, 1], spark);
              }
            }
          }}
        />
      }
    >
      {/* a current meter on the left */}
      <div style={{ position: 'absolute', left: 70, top: 640, width: 46, height: 460, borderRadius: 23, border: '3px solid rgba(255,255,255,0.35)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: `${Math.min(1, i) * 100}%`, background: `linear-gradient(0deg, ${CYAN}, ${MINT})`, boxShadow: `0 0 30px ${CYAN}` }} />
      </div>
      <div style={{ position: 'absolute', left: 40, top: 1116, width: 110, textAlign: 'center', fontFamily: sora, fontSize: 28, fontWeight: 600, color: CYAN }}>current</div>
      <Pop frame={frame} from={15.3} to={23.5} color={CYAN} size={84}>it climbs slowly</Pop>
      <Pop frame={frame} from={25} to={31.3} color={MINT} size={84}>the field collapses</Pop>
      <Pop frame={frame} from={31.4} to={40.8} size={92}>thousands of volts</Pop>
      <Pop frame={frame} from={40.9} to={48.9} color={MINT} size={84}>
        inductance
        <br />
        <span style={{ fontSize: 56, color: '#fff' }}>unit: the henry</span>
      </Pop>
      <Pop frame={frame} from={54.5} to={63.6} size={84}>car ignition coils</Pop>
    </ShortShell>
  );
};
