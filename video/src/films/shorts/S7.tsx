import { useCurrentFrame } from 'remotion';
import voice from '../../../public/voice/shorts/ch7.json';
import { drawGenerator } from '../induction/I1';
import { drawTransformer } from '../induction/I7';
import { ringLoop, rotMagnet } from '../induction/kit';
import { AStage, phaseColor, PINK, ribbon, shot, SUN, sway, TEAL } from '../ac/kit';
import { keys, moved, Pop, shortFrames, ShortShell, st, upright } from './kit';

// Short 7 - the generator and the transformer.
export const S7_FRAMES = shortFrames(voice.duration);
const magnetAt = (frame: number) => keys(frame, [[0, 6], [7.4, 6], [10.5, 0], [13.4, 0], [16.2, 6], [90, 6]]);

export const S7 = () => {
  const frame = useCurrentFrame();
  const mode = frame < st(7.4) ? 'gen' : frame < st(25.7) ? 'push' : frame < st(49) ? 'gen2' : 'tx';
  const sA = shot(frame, -1, 7.6);
  const sB = shot(frame, 7.2, 25.9);
  const sC = shot(frame, 25.5, 49.2);
  const sD = shot(frame, 48.8, 90);
  const angle = frame * 0.05;
  const m = magnetAt(frame);
  const current = (magnetAt(frame - 1) - magnetAt(frame + 1)) * 3;
  const n2 = frame < st(59.7) ? 8 : 16;

  return (
    <ShortShell
      n={7}
      voice={voice}
      endAt={66.4}
      headline={<>How a power station makes <span style={{ color: SUN }}>electricity</span></>}
      world={
        <AStage
          ground={false}
          opacity={Math.max(sA, sB, sC, sD)}
          pose={mode === 'push' ? { pos: [4 + sway(frame, 2), 3, 17], target: [0, 2.4, 0], fov: 40, focus: 17, dof: 0.02 } : mode === 'tx' ? { pos: [3 + sway(frame, 1.5), 3, 19], target: [0, 1.2, 0], fov: 40, focus: 19, dof: 0.02 } : { pos: [2 + sway(frame, 1.5), 1.5, 19], target: [0, mode === 'gen2' ? 0.4 : 1.6, 0], fov: 40, focus: 19, dof: 0.02 }}
          orbs={(add) => {
            if (mode === 'gen') drawGenerator(add, null, frame, angle);
            if (mode === 'gen2') drawGenerator(moved(add, 0, 1.4), null, frame, angle);
            if (mode === 'push') rotMagnet(upright(add), 0, 1.7, 1, m, 0);
            if (mode === 'tx') drawTransformer(add, null, frame, n2);
          }}
          scene={(add) => {
            if (mode === 'gen') drawGenerator(null, add, frame, angle);
            if (mode === 'gen2') {
              drawGenerator(null, moved(add, 0, 1.4), frame, angle);
              // the voltage it makes, unrolling beneath it
              ribbon(add, -3.8, 3.8, (x) => -4.4 + 1.3 * Math.sin(angle * 2 - (x + 3.8) * 1.3), (x) => phaseColor((angle * 2 - (x + 3.8) * 1.3) / 6.283), { axis: -4.4 });
            }
            if (mode === 'push') {
              const up = upright(add);
              for (let k = 0; k < 6; k++) ringLoop(up, -1.6 + k * 0.62, 0, 0, 1.75, 0, frame, Math.max(-1, Math.min(1, current)), 1);
            }
            if (mode === 'tx') drawTransformer(null, add, frame, n2);
          }}
        />
      }
    >
      <Pop frame={frame} from={7.4} to={16.7} size={80} color="#ffffff">Faraday, 1831</Pop>
      <Pop frame={frame} from={16.8} to={21.3} size={84}>magnet still → nothing</Pop>
      <Pop frame={frame} from={21.4} to={27.4} size={92} color={TEAL}>it’s the change</Pop>
      <Pop frame={frame} from={37} to={48.9} size={84} color={PINK}>
        a generator
        <br />
        <span style={{ fontSize: 56, color: '#fff' }}>coal · nuclear · wind · water</span>
      </Pop>
      <Pop frame={frame} from={49} to={59.6} size={92} color={TEAL}>the transformer</Pop>
      <Pop frame={frame} from={59.7} to={66.3} size={84}>more turns → more volts</Pop>
    </ShortShell>
  );
};
