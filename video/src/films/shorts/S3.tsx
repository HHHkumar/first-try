import { useCurrentFrame } from 'remotion';
import voice from '../../../public/voice/shorts/ch3.json';
import { rgb } from '../../world/Stage3D';
import { drawPlates } from '../charge/kit';
import { AStage, CYAN, PINK, sway, VIOLET } from '../ac/kit';
import { keys, Pop, shortFrames, ShortShell, ta, tspan, upright } from './kit';

// Short 3 - the capacitor: two plates, the field between them, and the flash.
export const S3_FRAMES = shortFrames(voice.duration);

export const S3 = () => {
  const frame = useCurrentFrame();
  const flash = tspan(frame, 43.4, 45.6, 3);
  const charge = keys(frame, [[0, 0], [12.3, 0], [18, 0.8], [30.2, 0.8], [33, 1.1], [36.2, 1.1], [38.5, 1.4], [43.3, 1.4], [43.8, 0], [46, 0], [48.5, 1], [70, 1]]);
  const half = keys(frame, [[0, 3.2], [31.9, 3.2], [34, 2.1], [70, 2.1]]);
  const size = keys(frame, [[0, 1], [30.2, 1], [32, 1.25], [70, 1.25]]);
  const lines = keys(frame, [[0, 0], [20.6, 0], [23.5, 1], [43.3, 1], [43.8, 0], [46, 0], [48.5, 1], [70, 1]]);
  const diel = ta(frame, 36.2, 1.2) * (1 - ta(frame, 54, 1));

  return (
    <ShortShell
      n={3}
      voice={voice}
      endAt={60.6}
      headline={<>Two plates that <span style={{ color: CYAN }}>never touch</span></>}
      world={
        <AStage
          ground={false}
          pose={{ pos: [5 + sway(frame, 2), 4.5, 29], target: [0, 1.3, 0], fov: 40, focus: 29, dof: 0.02 }}
          orbs={(add) => drawPlates(upright(add), null, frame, { half, size, appear: ta(frame, 0.2) })}
          scene={(add) => {
            const up = upright(add);
            drawPlates(null, up, frame, { half, size, charge, lines, lineGain: 1.2 });
            // a dielectric filling the gap: little molecules lining up with the field
            if (diel > 0.01)
              for (let x = -half + 0.9; x <= half - 0.9; x += 0.6)
                for (let y = -2.6 * size; y <= 2.6 * size; y += 0.75)
                  for (let z = -2.4; z <= 2.4; z += 1.2) {
                    up(x - 0.12, y, z, 0.22, rgb(CYAN), 0.6 * diel);
                    up(x + 0.12, y, z, 0.22, rgb(PINK), 0.6 * diel);
                  }
            // the flash
            if (flash > 0.01) {
              add(0, 0, 0, 22 * flash, [1, 0.97, 0.85], 0.5 * flash);
              add(0, 0, 0, 6, [1, 1, 1], 0.9 * flash);
            }
          }}
        />
      }
    >
      <Pop frame={frame} from={20.6} to={26.4} color={VIOLET} size={84}>
        the energy lives
        <br />
        in this field
      </Pop>
      <Pop frame={frame} from={28.2} to={30.1} size={84}>C = Q ÷ V</Pop>
      <Pop frame={frame} from={30.2} to={31.8} size={84}>bigger plates ↑</Pop>
      <Pop frame={frame} from={31.9} to={36.1} size={84}>smaller gap ↑</Pop>
      <Pop frame={frame} from={36.2} to={39.7} size={84} color={CYAN}>a dielectric ↑</Pop>
      <Pop frame={frame} from={44} to={47.7} size={120}>FLASH</Pop>
      <Pop frame={frame} from={54} to={60.5} size={70} color="#ffffff">
        1745: “lightning
        <br />
        in a jar”
      </Pop>
      {flash > 0.01 ? <div style={{ position: 'absolute', inset: 0, background: '#fff1c0', mixBlendMode: 'screen', opacity: flash * 0.18 }} /> : null}
    </ShortShell>
  );
};
