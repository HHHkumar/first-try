import { useMemo } from 'react';
import { useCurrentFrame } from 'remotion';
import voice from '../../../public/voice/shorts/ch2.json';
import { drawArrow, drawCharge, drawLines, traceLines, type Charge, type Line } from '../../world/field';
import { AStage, CYAN, PINK, SUN, sway, VIOLET } from '../ac/kit';
import { keys, Pop, shortFrames, ShortShell, st, ta } from './kit';

// Short 2 - charge and field: attraction, the inverse square, field lines.
export const S2_FRAMES = shortFrames(voice.duration);
const SEPS = [2.2, 3.3, 4.4, 5.5, 6.6];

export const S2 = () => {
  const frame = useCurrentFrame();
  const like = frame >= st(20) && frame < st(22);
  const sep = keys(frame, [[0, 2.2], [24.2, 2.2], [26.6, 4.4], [30.5, 4.4], [32.5, 6.6], [37.5, 6.6], [40, 3.3], [70, 3.3]]);
  const sepQ = SEPS.reduce((a, b) => (Math.abs(b - sep) < Math.abs(a - sep) ? b : a));
  // field lines for each separation, opposite and like charges, traced once
  const traced = useMemo(() => {
    const m = new Map<string, Line[]>();
    for (const s of SEPS)
      for (const lk of [false, true]) {
        const cs: Charge[] = [{ x: 0, y: s / 2, z: 0, q: 1 }, { x: 0, y: -s / 2, z: 0, q: lk ? 1 : -1 }];
        m.set(`${s}-${lk}`, traceLines(cs, { perCharge: 22, planar: true, from: 'positive', bound: 12, maxSteps: 500 }));
      }
    return m;
  }, []);
  const lines = traced.get(`${sepQ}-${like}`) as Line[];
  const reveal = ta(frame, 9.8, 2.5);
  const bold = keys(frame, [[0, 0.8], [42.3, 0.8], [45, 1.6], [70, 1.6]]);
  const F = Math.min(3, 4.84 / (sep * sep));
  const top: Charge = { x: 0, y: sep / 2, z: 0, q: 1 };
  const bottom: Charge = { x: 0, y: -sep / 2, z: 0, q: like ? 1 : -1 };
  const cam: [number, number, number] = [sway(frame, 1.6), 0.6, 19];
  const arrows = ta(frame, 11.4);
  const dir = like ? 1 : -1;

  return (
    <ShortShell
      n={2}
      voice={voice}
      endAt={67.4}
      headline={<>The <span style={{ color: VIOLET }}>invisible push</span> that bends water</>}
      world={
        <AStage
          ground={false}
          pose={{ pos: cam, target: [0, 0.2, 0], fov: 40, focus: 19, dof: 0.02 }}
          orbs={(add) => {
            for (const c of [top, bottom]) add(c.x, c.y, c.z, 0.68, c.q > 0 ? [1, 0.31, 0.64] : [0.21, 0.79, 1], ta(frame, 0.3));
          }}
          scene={(add) => {
            drawLines(add, lines, frame, bold * reveal, VIOLET, { reveal, bold: true });
            for (const c of [top, bottom]) drawCharge(add, add, c, cam, 0.34, ta(frame, 0.3));
            // the force on each charge
            const L = 0.8 + F * 1.1;
            drawArrow(add, 0, top.y + dir * 0.7, 0, 0, dir, 0, L, SUN, arrows);
            drawArrow(add, 0, bottom.y - dir * 0.7, 0, 0, -dir, 0, L, SUN, arrows);
          }}
        />
      }
    >
      <Pop frame={frame} from={20} to={21.9} color={PINK} size={84}>like: push apart</Pop>
      <Pop frame={frame} from={22} to={24.1} color={CYAN} size={84}>opposite: pull together</Pop>
      <Pop frame={frame} from={26.6} to={30.4} size={84}>2× farther → ¼ force</Pop>
      <Pop frame={frame} from={30.5} to={37.9} size={84}>3× farther → 1/9</Pop>
      <Pop frame={frame} from={33} to={37.9} top={620} size={52} color="#ffffff">Coulomb, 1785</Pop>
      <Pop frame={frame} from={42.3} to={51.5} color={VIOLET} size={84}>Faraday: the field</Pop>
    </ShortShell>
  );
};
