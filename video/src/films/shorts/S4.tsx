import { useCurrentFrame } from 'remotion';
import voice from '../../../public/voice/shorts/ch4.json';
import { lerp } from '../../anim';
import { BFIELD, CURRENT, drawNeedle } from '../../world/magnet';
import { rgb } from '../../world/Stage3D';
import { ring } from '../fields/kit';
import { drawCoilField, drawCore, drawTurns, useCoil } from '../inductance/kit';
import { AStage, MINT, shot, sway } from '../ac/kit';
import { keys, Pop, shortFrames, ShortShell, st, ta, upright } from './kit';

// Short 4 - Oersted's needle: a current makes circles of magnetic field; then the electromagnet.
export const S4_FRAMES = shortFrames(voice.duration);

export const S4 = () => {
  const frame = useCurrentFrame();
  const coil = useCoil(11, 6.4, 1.5);
  const sWire = shot(frame, (-1), (35.6));
  const sCoil = shot(frame, (35.4), (80));
  const wireMode = frame < st(35.5);
  const on = keys(frame, [[0, 0], [11.5, 0], [12.1, 1], [14.9, 1], [15.5, 0], [17.3, 0], [17.9, 1], [30.7, 1], [32.2, -1], [40, -1]]);
  const rings = ta(frame, 21.6, 1.2) * Math.abs(on);
  const core = keys(frame, [[0, 0], [43.6, 0], [46, 1], [80, 1]]);
  const current = ta(frame, 37.2, 1.5);

  return (
    <ShortShell
      n={4}
      voice={voice}
      endAt={62.3}
      headline={<>1820: a compass needle <span style={{ color: MINT }}>twitched</span></>}
      world={
        <AStage
          ground={false}
          opacity={Math.max(sWire, sCoil)}
          pose={wireMode ? { pos: [3 + sway(frame, 1.5), 4.5, 15], target: [0, 0.2, 0], fov: 40, focus: 15, dof: 0.02 } : { pos: [5 + sway(frame, 2), 3, 24], target: [0, 0.8, 0], fov: 40, focus: 24, dof: 0.02 }}
          orbs={(add) => {
            if (!wireMode) drawCore(upright(add), 6.4, core);
          }}
          scene={(add) => {
            if (wireMode) {
              // the wire, standing upright, with current running up or down it
              const dir = on >= 0 ? 1 : -1;
              for (let y = -6.5; y <= 6.5; y += 0.09) {
                const phase = (((y * 10 * dir - frame * 1.2) % 24) + 24) % 24;
                const bead = phase < 3 && Math.abs(on) > 0.3;
                add(0, y, 0, bead ? 0.26 : 0.17, bead ? rgb(CURRENT) : [0.85, 0.88, 0.95], bead ? Math.abs(on) : 0.75);
              }
              // circles of field around it
              for (let y = -5; y <= 5.01; y += 2.5) for (const r of [1.3, 2.2]) ring(add, 0, y, 0, 'y', r, frame, BFIELD, rings * 1.4, dir);
              // compass needles: north at rest, along the circle when current flows
              for (const y of [-3.2, 0, 3.2])
                for (let k = 0; k < 8; k++) {
                  const a = (k / 8) * Math.PI * 2;
                  const x = Math.cos(a) * 2.5;
                  const z = Math.sin(a) * 2.5;
                  const tx = -Math.sin(a) * on;
                  const tz = Math.cos(a) * on;
                  drawNeedle(add, x, y, z, lerp(1, tx, Math.min(1, Math.abs(on))) + 0.001, 0, lerp(0, tz, Math.min(1, Math.abs(on))), 1.8, ta(frame, 0.3));
                }
              return;
            }
            const up = upright(add);
            drawTurns(up, coil, frame * 0.8, current);
            drawCoilField(up, coil, frame, current, 1 + core * 1.2);
          }}
        />
      }
    >
      <Pop frame={frame} from={11.5} to={17.2} size={84}>current on → needle swings</Pop>
      <Pop frame={frame} from={17.3} to={21.5} color={MINT} size={84}>current makes magnetism</Pop>
      <Pop frame={frame} from={24.2} to={30.6} color={MINT} size={84}>circles round the wire</Pop>
      <Pop frame={frame} from={30.7} to={35.3} size={84}>reverse it → they all flip</Pop>
      <Pop frame={frame} from={43.6} to={47.7} size={84}>add iron: × hundreds</Pop>
      <Pop frame={frame} from={47.8} to={55.4} color={MINT} size={96}>electromagnet</Pop>
      <Pop frame={frame} from={55.5} to={62.2} size={84}>
        unit: the tesla
        <br />
        <span style={{ fontSize: 56, color: '#fff' }}>Earth ≈ 50 µT</span>
      </Pop>
    </ShortShell>
  );
};
