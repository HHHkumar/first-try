import { useCurrentFrame } from 'remotion';
import voice from '../../../public/voice/shorts/ch1.json';
import { lerp } from '../../anim';
import { rgb } from '../../world/Stage3D';
import { AStage, CYAN, SUN, sway } from '../ac/kit';
import { keys, Pop, shortFrames, ShortShell, st, ta, tspan } from './kit';

// Short 1 - the snail in your wire: slow drift, instant push, collisions make heat.
export const S1_FRAMES = shortFrames(voice.duration);
const COPPER = [1, 0.62, 0.38];
const HOT = [1, 0.78, 0.45];

export const S1 = () => {
  const frame = useCurrentFrame();
  const t = (frame - st(0)) / 30;
  const half = keys(frame, [[0, 5.2], [46, 5.2], [48.5, 6.6], [65, 6.6]]);
  const R = keys(frame, [[0, 1.25], [50.6, 1.25], [53, 1.9], [65, 1.9]]);
  const heat = keys(frame, [[0, 0.15], [36, 0.15], [40, 0.45], [46, 0.3], [55, 0.3], [58, 1], [65, 1]]);
  const push = (t - 24.6) / 1.3; // the push races up the wire
  const lamp = ta(frame, 25.6, 0.6);
  const sparks = tspan(frame, 36, 46);

  return (
    <ShortShell
      n={1}
      voice={voice}
      endAt={65.3}
      headline={<>Electrons are slower than a <span style={{ color: SUN }}>snail</span></>}
      world={
        <AStage
          ground={false}
          pose={{ pos: [6 + sway(frame, 2), 2.5, 21], target: [0, 0.3, 0], fov: 40, focus: 21, dof: 0.02 }}
          orbs={(add) => {
            // the metal ions, shaking harder as the wire warms
            const c = COPPER.map((v, i) => lerp(v, HOT[i], Math.max(0, heat - 0.3) / 0.7));
            for (let y = -half; y <= half + 0.01; y += 0.72)
              for (let x = -R; x <= R + 0.01; x += 0.72)
                for (let z = -R; z <= R + 0.01; z += 0.72) {
                  if (x * x + z * z > R * R + 0.05) continue;
                  const k = x * 7.1 + y * 3.3 + z * 5.7;
                  const j = 0.05 + 0.18 * heat;
                  add(x + Math.sin(frame * 0.9 + k) * j, y + Math.cos(frame * 1.1 + k * 1.3) * j, z + Math.sin(frame * 0.7 + k * 2.1) * j, 0.42, c, 1);
                }
          }}
          scene={(add) => {
            const cyan = rgb(CYAN);
            // electrons: a fast jitter on top of a slow creep upward
            for (let i = 0; i < 260; i++) {
              const a = i * 2.39996;
              const r = R * 0.95 * Math.sqrt(((i * 0.618) % 1) + 0.02);
              const y0 = (((i * 0.37) % 1) * 2 - 1) * half;
              const y = ((((y0 + half + t * 0.18) % (2 * half)) + 2 * half) % (2 * half)) - half;
              const jx = Math.sin(frame * 0.8 + i) * 0.16;
              const jz = Math.cos(frame * 0.9 + i * 1.7) * 0.16;
              const lit = push > 0 && push < 1.6 ? Math.exp(-(((y + half) / (2 * half) - push) ** 2) * 40) : 0;
              add(Math.cos(a) * r + jx, y, Math.sin(a) * r + jz, 0.2 + 0.25 * lit, lit > 0.3 ? [1, 1, 1] : cyan, 0.85);
            }
            // the push, a bright band racing up the wire
            if (push > 0 && push < 1.15) {
              const y = -half + push * 2 * half;
              for (let k = 0; k < 60; k++) add(Math.cos((k / 60) * 6.283) * (R + 0.2), y, Math.sin((k / 60) * 6.283) * (R + 0.2), 0.3, [1, 0.95, 0.7], 0.9);
            }
            // collisions: brief flashes where electrons strike ions
            if (sparks > 0.01)
              for (let k = 0; k < 14; k++) {
                const s = Math.floor(frame / 4) * 13 + k * 7;
                const y = ((((s * 0.618) % 1) * 2) - 1) * half;
                const a = s * 2.4;
                add(Math.cos(a) * R * 0.6, y, Math.sin(a) * R * 0.6, 0.7, rgb(SUN), sparks * 0.8);
              }
            // the wire's glow as it heats
            if (heat > 0.35) for (let y = -half; y <= half; y += 0.5) add(0, y, 0, R * 3.2, HOT, 0.08 * (heat - 0.3));
            // the lamp at the top
            add(0, half + 1.6, 0, 1.1, [1, 0.95, 0.8], 0.3 + 0.7 * lamp);
            add(0, half + 1.6, 0, 6 * lamp + 0.01, rgb(SUN), 0.35 * lamp);
          }}
        />
      }
    >
      <Pop frame={frame} from={5.2} to={14.2}>
        under 1 mm
        <br />
        per second
      </Pop>
      <Pop frame={frame} from={24.6} to={35.8} color={CYAN} size={80}>
        the push travels
        <br />
        near light speed
      </Pop>
      <Pop frame={frame} from={44.1} to={45.9}>that’s resistance</Pop>
      <Pop frame={frame} from={46} to={50.5} size={84}>longer → more R</Pop>
      <Pop frame={frame} from={50.6} to={54.9} size={84} color={CYAN}>thicker → less R</Pop>
      <Pop frame={frame} from={55} to={65} size={84}>hotter → more R</Pop>
    </ShortShell>
  );
};
