import { useCurrentFrame } from 'remotion';
import voice from '../../../public/voice/shorts/ch8.json';
import { rgb } from '../../world/Stage3D';
import { AStage, CYAN, level, phaseColor, PINK, ribbon, SUN, sway, WHITE } from '../ac/kit';
import { Pop, shortFrames, ShortShell, st, ta, tspan, upright } from './kit';

// Short 8 - the mains: a turning arrow draws the wave; 325 V peak, 230 V RMS, 50 or 60 Hz.
export const S8_FRAMES = shortFrames(voice.duration);
const R = 2.3; // the arrow's length: 325 V
const TOP = 3.4; // where the wave starts, under the arrow

export const S8 = () => {
  const frame = useCurrentFrame();
  const th = frame * 0.07;
  const K = 0.95;
  const levels = tspan(frame, 31.9, 55.4);
  const rms = ta(frame, 40.6);
  const second = tspan(frame, 57.4, 66);
  const cy = TOP + 2.8;

  return (
    <ShortShell
      n={8}
      voice={voice}
      endAt={66.1}
      headline={<>Your socket flips <span style={{ color: SUN }}>100 times</span> a second</>}
      world={
        <AStage
          ground={false}
          pose={{ pos: [sway(frame, 1.5), 0.5, 24], target: [0, -0.4, 0], fov: 40, focus: 24, dof: 0.02 }}
          scene={(add) => {
            // the turning arrow, its tip handing its sideways position to the wave below
            const tx = -Math.sin(th) * R;
            const ty = cy + Math.cos(th) * R;
            for (let a = 0; a < 6.283; a += 0.05) add(Math.cos(a) * R, cy + Math.sin(a) * R, 0, 0.07, rgb(WHITE), 0.35);
            for (let s = 0; s <= 1; s += 0.03) add(tx * s, cy + (ty - cy) * s, 0, 0.2, rgb(PINK), 1);
            add(tx, ty, 0, 0.9, phaseColor(th / 6.283), 1);
            for (let y = TOP; y <= ty; y += 0.18) add(tx, y, 0, 0.06, rgb(WHITE), 0.5);
            // the wave, scrolling down the screen as time goes on
            const up = upright(add);
            ribbon(up, -8, TOP, (s) => R * Math.sin(th - (TOP - s) * K), (s) => phaseColor((th - (TOP - s) * K) / 6.283), { axis: 0 });
            if (second > 0.01) ribbon(up, -8, TOP, (s) => R * Math.sin(th * 1.2 - (TOP - s) * K * 1.2), () => rgb(CYAN), { axis: 0, fill: false, gain: second });
            // peak and RMS
            level(up, R, -8, TOP, PINK, levels);
            level(up, -R, -8, TOP, PINK, levels * 0.6);
            level(up, R * 0.7071, -8, TOP, SUN, levels * rms);
            level(up, -R * 0.7071, -8, TOP, SUN, levels * rms * 0.6);
          }}
        />
      }
    >
      <Pop frame={frame} from={12.2} to={20.1} size={84}>
        50 Hz = 50 cycles
        <br />= 100 reversals
      </Pop>
      <Pop frame={frame} from={20.2} to={30.1} size={80} color={CYAN}>
        electrons just
        <br />
        shuffle on the spot
      </Pop>
      <Pop frame={frame} from={31.9} to={40.5} size={100} color={PINK}>peak: 325 V</Pop>
      <Pop frame={frame} from={40.6} to={55.4} size={100}>RMS: 230 V</Pop>
      <Pop frame={frame} from={55.6} to={66} size={84}>
        <span style={{ color: SUN }}>50 Hz</span> or <span style={{ color: CYAN }}>60 Hz</span>
        {frame >= st(63.8) ? (
          <>
            <br />
            <span style={{ fontSize: 56, color: '#fff' }}>Japan uses both</span>
          </>
        ) : null}
      </Pop>
    </ShortShell>
  );
};
