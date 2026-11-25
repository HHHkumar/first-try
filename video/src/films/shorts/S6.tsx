import { useCurrentFrame } from 'remotion';
import voice from '../../../public/voice/shorts/ch6.json';
import { BFIELD } from '../../world/magnet';
import { drawArrow } from '../../world/field';
import { drawWave, EFIELD, ring } from '../fields/kit';
import { AStage, CYAN, MINT, shot, SUN, sway, VIOLET } from '../ac/kit';
import { keys, Pop, shortFrames, ShortShell, st, upright } from './kit';

// Short 6 - light is electricity and magnetism: each changing field makes the other, and the pair travels.
export const S6_FRAMES = shortFrames(voice.duration);

export const S6 = () => {
  const frame = useCurrentFrame();
  const sPair = shot(frame, -1, 19.0);
  const sWave = shot(frame, 18.8, 90);
  const waveMode = frame >= st(18.9);
  const swap = frame >= st(11.6);
  const pulse = 0.6 + 0.4 * Math.sin(frame * 0.12);
  const front = keys(frame, [[0, -2], [18.9, -2], [30.2, 8.6], [90, 8.6]]);
  const k = keys(frame, [[0, 1.3], [51.8, 1.3], [53.8, 0.55], [56.8, 0.55], [59, 2.6], [61, 6], [64, 6], [66, 1.6]]);
  const band = k < 0.8 ? 'radio · Wi-Fi' : k < 2 ? 'infrared' : k < 4 ? 'visible light' : k < 5.6 ? 'ultraviolet' : 'X-rays';

  return (
    <ShortShell
      n={6}
      voice={voice}
      endAt={66.0}
      headline={<>Light is <span style={{ color: VIOLET }}>electricity</span> and <span style={{ color: MINT }}>magnetism</span></>}
      world={
        <AStage
          ground={false}
          opacity={Math.max(sPair, sWave)}
          pose={waveMode ? { pos: [6 + sway(frame, 2), 2, 21], target: [0, 0.4, 0], fov: 40, focus: 21, dof: 0.02 } : { pos: [4 + sway(frame, 2), 4, 16], target: [0, 0.5, 0], fov: 40, focus: 16, dof: 0.02 }}
          scene={(add) => {
            if (!waveMode) {
              // a changing field along the axis, and the other field curling round it
              const [axisCol, ringCol] = swap ? [EFIELD, BFIELD] : [BFIELD, EFIELD];
              for (const dx of [-0.12, 0, 0.12]) drawArrow(add, dx, -3.4, 0, 0, 1, 0, 3.4 + 3.4 * pulse, axisCol, 1.3);
              for (const y of [-1.6, 0.6, 2.8]) for (const r of [1.6, 2.6]) ring(add, 0, y, 0, 'y', r, frame, ringCol, 1.6, swap ? -1 : 1);
              return;
            }
            drawWave(upright(add), -7.2, 8.6, frame, { front, amp: 3, k, gain: 1.5 });
          }}
        />
      }
    >
      <Pop frame={frame} from={5} to={11.5} size={80}>
        changing <span style={{ color: MINT }}>magnetic</span> field
        <br />→ <span style={{ color: VIOLET }}>electric</span> field
      </Pop>
      <Pop frame={frame} from={11.6} to={18.8} size={80}>
        changing <span style={{ color: VIOLET }}>electric</span> field
        <br />→ <span style={{ color: MINT }}>magnetic</span> field
      </Pop>
      <Pop frame={frame} from={33.4} to={37.8} size={110} color={CYAN}>a wave</Pop>
      <Pop frame={frame} from={37.9} to={45.7} size={84}>
        300 000 km/s
        <br />
        <span style={{ fontSize: 60, color: '#fff' }}>the speed of light</span>
      </Pop>
      <Pop frame={frame} from={45.8} to={51.7} size={84} color="#ffffff">Hertz, 1887</Pop>
      <Pop frame={frame} from={53.8} to={62.3} size={92} color={SUN}>{band}</Pop>
      <Pop frame={frame} from={62.4} to={65.9} size={76}>same wave, different size</Pop>
    </ShortShell>
  );
};
