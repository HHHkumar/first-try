import { useMemo } from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/capacitance/ch4.json';
import { lerp, lerp3, ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../../ui/Shell';
import { Frac, Kicker, Meter, Sub, Sym, Center, Big } from '../../ui/type';
import { NEG } from '../../world/field';
import { mulberry32 } from '../../world/rng';
import { rgb, Stage3D } from '../../world/Stage3D';
import type { CameraPose } from '../../world/WireWorld';
import { at, Cap, drawPlates, PLATES, shot, Timeline, VOICE } from './kit';

// Chapter 4 - What sets it. Area, gap, and why a farad is so large.
export const CAPAC4_FRAMES = chapterFrames(voice.duration);

export const Capac4 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const city = useMemo(() => {
    const rand = mulberry32(14);
    const pts: { x: number; z: number; b: number }[] = [];
    for (let i = 0; i < 2600; i++) {
      // lights along a street grid, with a few denser districts
      const onStreet = rand() < 0.7;
      let x = (rand() * 2 - 1) * 30;
      let z = (rand() * 2 - 1) * 22;
      if (onStreet) {
        if (rand() < 0.5) x = Math.round(x / 2.5) * 2.5;
        else z = Math.round(z / 2.5) * 2.5;
      }
      pts.push({ x, z, b: 0.4 + rand() * 0.6 });
    }
    return pts;
  }, []);

  const sPlates = shot(frame, -1, 34.4);
  const formula = span(frame, T(34.2), T(54.6), 12);
  const sCity = shot(frame, 54.3, 200);
  const grow = ramp(frame, T(8.0), T(11.0), Easing.inOut(Easing.cubic));
  const back = ramp(frame, T(14.0), T(15.2));
  const size = 1 + 0.42 * grow * (1 - back);
  const close = ramp(frame, T(22.6), T(27.0), Easing.inOut(Easing.cubic));
  const half = lerp(3.4, 1.7, close);
  const cap = (size * size > 1.9 ? 2 : size * size) * (3.4 / half);
  const sweep = ramp(frame, T(56.6), T(60.8), Easing.inOut(Easing.cubic));

  const platePose: CameraPose = { ...PLATES, pos: [PLATES.pos[0] + Math.sin(frame * 0.004), PLATES.pos[1] + 0.6, PLATES.pos[2] + 3], focus: 23.6 };
  const cityPose: CameraPose = { pos: lerp3([0, 14, 34], [0, 30, 44], sweep), target: [0, 0, 0], fov: 38, focus: 46, dof: 0.012 };
  const pose = frame >= T(54.4) ? cityPose : platePose;

  return (
    <Shell
      voice={VOICE(4)}
      frames={CAPAC4_FRAMES}
      world={
        <AbsoluteFill style={{ opacity: Math.max(sPlates, sCity) * (1 - formula) }}>
          <Stage3D
            width={width}
            height={height}
            pose={pose}
            fog={frame >= T(54.4) ? 0.001 : 0.012}
            orbs={(add) => {
              if (frame < T(54.4)) drawPlates(add, null, frame, { size, half });
            }}
            glows={(add) => {
              if (frame < T(54.4)) drawPlates(null, add, frame, { size, half, charge: 0.55 * (3.4 / half), lineGain: 0.8 });
              else {
                const warm = rgb('#ffcf8a');
                for (const p of city) add(p.x, 0, p.z, 0.55, warm, p.b);
                // one plate of a one-farad capacitor, spreading out over the city
                const plate = rgb(NEG);
                const hx = 28 * sweep;
                const hz = 20 * sweep;
                if (sweep > 0.01)
                  for (let i = 0; i <= 44; i++)
                    for (let j = 0; j <= 32; j++) add(-hx + (i / 44) * 2 * hx, 2.2, -hz + (j / 32) * 2 * hz, 0.5, plate, 0.85);
              }
            }}
          />
        </AbsoluteFill>
      }
    >
      <Panel opacity={span(frame, T(6.4), T(34.2))} style={{ right: 110, top: 80, display: 'flex', gap: 56 }}>
        <Meter label="Plate area" value={`× ${(size * size > 1.9 ? 2 : size * size).toFixed(1)}`} color={C.shape} size={76} />
        <Meter label="Gap" value={`× ${(half / 3.4).toFixed(2)}`} color={C.shape} size={76} />
        <Meter label="Capacitance" value={`× ${cap.toFixed(1)}`} color={C.electron} size={76} />
      </Panel>
      <Cap opacity={span(frame, T(0.2), T(6.2))} kicker="What decides the capacitance of two plates?" title="Only their shape, and what lies between them" />
      <Cap opacity={span(frame, T(6.5), T(14.2))} kicker="Make the plates larger" title="More room for charge: double the area, double the capacitance" />
      <Cap opacity={span(frame, T(14.5), T(22.4))} kicker="Bring the plates closer" title="The voltage is the field multiplied by the gap" />
      <Cap opacity={span(frame, T(22.8), T(30.8))} kicker="A smaller gap" title="The same charge now makes a smaller voltage" />
      <Cap opacity={span(frame, T(31.0), T(34.2), 8)} kicker="Halve the gap" title="and the capacitance doubles" />

      <Scene opacity={formula}>
        <Center style={{ justifyContent: 'flex-start', paddingTop: 90 }}>
          <div style={{ fontSize: 230, display: 'flex', alignItems: 'center', gap: 46 }}>
            <Sym show={at(frame, 34.9, 0.4)}>C</Sym>
            <Sym color={C.dim} show={at(frame, 35.6, 0.4)} style={{ fontStyle: 'normal' }}>
              =
            </Sym>
            <Sym color={C.rho} show={at(frame, 36.4, 0.4)}>
              ε<sub style={{ fontSize: '0.45em', fontStyle: 'normal' }}>0</sub>
            </Sym>
            <Frac color={C.shape} width={190} show={at(frame, 37.4, 0.4)} top={<Sym color={C.shape}>A</Sym>} bottom={<Sym color={C.shape} show={at(frame, 38.7, 0.4)}>d</Sym>} />
          </div>
          <Sub style={{ marginTop: 50, opacity: at(frame, 40.6) }}>
            <span style={{ color: C.rho }}>ε₀</span>, the permittivity of free space: 8.85 × 10⁻¹² farads per metre
          </Sub>
        </Center>
        <Panel opacity={at(frame, 46.0)} style={{ left: 0, right: 0, top: 780, textAlign: 'center' }}>
          <Kicker>Two plates, one metre square, one millimetre apart</Kicker>
          <Big size={84} style={{ marginTop: 10, color: C.electron, opacity: at(frame, 51.4) }}>
            8.85 nF: less than nine billionths of a farad
          </Big>
        </Panel>
      </Scene>

      <Cap opacity={span(frame, T(54.8), T(62.2))} kicker="For one farad, with that one-millimetre gap" title="plates covering more than a hundred square kilometres" />
      <Timeline frame={frame} already={[0, 1, 2, 7]} />
    </Shell>
  );
};
