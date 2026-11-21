import { useMemo } from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/induction/ch2.json';
import { lerp, ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Shell, T, chapterFrames } from '../../ui/Shell';
import { Meter, Sym } from '../../ui/type';
import { BFIELD } from '../../world/magnet';
import { mulberry32 } from '../../world/rng';
import { rgb, Stage3D } from '../../world/Stage3D';
import { at, Cap, orbit, ringLoop, shot, Timeline, VOICE, xField } from './kit';

// Chapter 2 - Flux: how much field passes through a loop.
export const I2_FRAMES = chapterFrames(voice.duration);

export const I2 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const drops = useMemo(() => {
    const r = mulberry32(9);
    return Array.from({ length: 260 }, () => ({ x: r() * 14 - 7, z: r() * 8 - 4, p: r() * 9 }));
  }, []);
  const sA = shot(frame, -1, 15.0);
  const sRain = shot(frame, 14.8, 30.7);
  const sB = shot(frame, 30.5, 90);
  const rain = frame >= T(14.9) && frame < T(30.6);
  // the window: bigger, then turned edge-on to the rain
  const big = ramp(frame, T(22.9), T(24.2), Easing.inOut(Easing.quad));
  const tiltW = ramp(frame, T(26.4), T(29.6), Easing.inOut(Easing.quad)) * 1.45;
  const heavy = ramp(frame, T(21.1), T(22.4));
  // the loop: stronger field, larger loop, then turned
  const strong = ramp(frame, T(35.6), T(37.6), Easing.inOut(Easing.quad));
  const large = ramp(frame, T(37.8), T(39.6), Easing.inOut(Easing.quad));
  const turn = ramp(frame, T(39.9), T(42.4), Easing.inOut(Easing.quad)) - ramp(frame, T(43.0), T(45.0), Easing.inOut(Easing.quad));
  const tilt = turn * 1.4;
  const r = lerp(1.6, 2.3, large);
  const B = lerp(0.5, 1, strong);
  const flux = B * r * r * Math.cos(tilt);
  const wx = 2.4 * (1 + 0.5 * big);
  const wz = 1.6 * (1 + 0.5 * big);

  return (
    <Shell
      voice={VOICE(2)}
      frames={I2_FRAMES}
      world={
        <AbsoluteFill style={{ opacity: Math.max(sA, sRain, sB) }}>
          <Stage3D
            width={width}
            height={height}
            pose={rain ? { pos: [6, 3.2, 14], target: [0, 0.4, 0], fov: 34, focus: 15, dof: 0.04 } : orbit(frame)}
            glows={(add) => {
              if (rain) {
                const c = rgb('#9fd4ff');
                const n = Math.round(lerp(110, 260, heavy));
                for (let i = 0; i < n; i++) {
                  const d = drops[i];
                  const y = 5 - ((frame * 0.16 + d.p) % 9);
                  for (let k = 0; k < 5; k++) add(d.x, y + k * 0.13, d.z, 0.12, c, 0.9 - k * 0.15);
                }
                // an open window frame, lying flat, then tilted on edge
                const g = rgb('#f4ead2');
                const co = Math.cos(tiltW);
                const si = Math.sin(tiltW);
                for (let i = 0; i <= 60; i++) {
                  const u = -1 + (i / 60) * 2;
                  for (const s of [-1, 1]) {
                    add(u * wx * co, u * wx * si, s * wz, 0.2, g, 0.95);
                    add(s * wx * co, s * wx * si, u * wz, 0.2, g, 0.95);
                  }
                }
              } else {
                xField(add, frame, frame < T(30.6) ? 0.8 : 0.5 + 0.5 * B);
                ringLoop(add, 0, 0, 0, frame < T(30.6) ? 1.9 : r, frame < T(30.6) ? 0 : tilt, frame, 0);
              }
            }}
          />
        </AbsoluteFill>
      }
    >
      <Cap opacity={span(frame, T(0.2), T(8.6))} kicker="Last time" title="A steady field through a coil does nothing. A changing one drives a current" />
      <Cap opacity={span(frame, T(8.8), T(14.7))} kicker="To make that exact" title="How much magnetic field passes through a loop of wire?" />
      <Cap opacity={span(frame, T(15.1), T(20.9))} kicker="Think of an open window in the rain" title="How much rain comes through?" />
      <Cap opacity={span(frame, T(21.1), T(26.9))} kicker="How hard it is raining" title="How big the window is" />
      <Cap opacity={span(frame, T(27.0), T(30.5), 8)} kicker="And how the window is facing" title="Edge-on to the rain, almost nothing comes through" />
      <Panel opacity={span(frame, T(19.0), T(30.5), 8)} style={{ right: 110, top: 70 }}>
        <Meter label="Rain through the window" value={`${Math.round(100 * (0.5 + 0.5 * heavy) * (1 + 0.5 * big) ** 2 * Math.cos(tiltW))}`} color="#9fd4ff" size={96} align="right" />
      </Panel>

      <Cap opacity={span(frame, T(30.8), T(41.8))} kicker="A loop of wire in a magnetic field is the same" title="How strong the field, how large the loop, how the loop is turned" />
      <Cap opacity={span(frame, T(42.0), T(50.2))} kicker="We call that amount" title="the magnetic flux" />
      <Cap opacity={span(frame, T(50.4), T(55.8))} kicker="Picture the field as lines" title="The flux is the number of lines passing through the loop" />
      <Cap opacity={span(frame, T(56.0), T(75))} kicker="Its unit: the weber, after Wilhelm Weber" title="One tesla, over one square metre, is one weber" />
      <Panel opacity={span(frame, T(33.0), T(75))} style={{ right: 110, top: 70 }}>
        <Meter label="Flux through the loop" value={(flux * 4.7).toFixed(1)} unit="Wb" color={BFIELD} size={96} align="right" />
      </Panel>
      <Panel opacity={span(frame, T(45.0), T(75))} style={{ left: 110, top: 70 }}>
        <div style={{ fontSize: 124, display: 'flex', alignItems: 'baseline', gap: 26 }}>
          <Sym color={BFIELD}>Φ</Sym>
          <Sym color={C.dim} style={{ fontStyle: 'normal' }}>
            =
          </Sym>
          <Sym color={BFIELD}>B</Sym>
          <Sym color={C.shape}>A</Sym>
        </div>
        <div style={{ fontSize: 30, fontWeight: 300, color: C.dim, opacity: at(frame, 46.4) }}>field × area, for a loop facing the field</div>
      </Panel>
      <Timeline frame={frame} already={[0]} />
    </Shell>
  );
};
