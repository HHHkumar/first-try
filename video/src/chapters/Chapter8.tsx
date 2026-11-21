import { useMemo } from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../public/voice/ch8.json';
import { lerp, lerp3, ramp, span } from '../anim';
import { Caption } from '../scenes/overlays';
import { C } from '../theme';
import { Panel } from '../ui/hud';
import { CABLE_POINT, Room } from '../ui/Room';
import { Shell, T, TAIL } from '../ui/Shell';
import { Big, Center, Frac, Kicker, Sub, Sym } from '../ui/type';
import { simulate } from '../world/sim';
import { WireWorld, type CameraPose } from '../world/WireWorld';

// Chapter 8 - Recap. The whole journey in half a minute, the formula
// assembling as each idea returns, then back out of the wire to the lamp.
const END_CARD = 5.2; // seconds of picture after the last word
export const CH8_FRAMES = T(voice.duration + END_CARD) + TAIL;
const LATTICE = { nx: 41, ny: 9, nz: 9 };
const FIELD_ON = T(6.5);

const SIDE = { pos: [1.5, 6.4, 12.5], target: [0, -0.6, 0], focus: 13.2, dof: 0.2, fog: 0.045, slab: 1.5 };
const FAR = { pos: [0, 12, 52], target: [0, -0.5, 0], focus: 53, dof: 0.02, fog: 0.007, slab: 6 };

export const Chapter8 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const sim = useMemo(
    () =>
      simulate({
        seed: 81,
        count: 260,
        frames: CH8_FRAMES,
        substeps: 4,
        half: [20.5, 4.5, 4.5],
        thermalSpeed: 0.3,
        accel: (f) => 0.0062 * ramp(f, FIELD_ON, FIELD_ON + 30),
        tau: (f) => lerp(11, 5, ramp(f, T(21.7), T(23.6))),
      }),
    [],
  );

  const show = (t: number, d = 0.5) => ramp(frame, T(t), T(t + d));
  const heat = ramp(frame, T(21.7), T(23.6)) * (1 - ramp(frame, T(28.4), T(30.4)));
  const pull = ramp(frame, T(35.4), T(39.6), Easing.in(Easing.quad));
  const glide = frame * 0.004 * (1 - pull);
  const pose: CameraPose = {
    pos: lerp3([SIDE.pos[0] + glide, SIDE.pos[1], SIDE.pos[2]], FAR.pos, pull),
    target: lerp3([glide, SIDE.target[1], 0], FAR.target, pull),
    fov: 34,
    focus: lerp(SIDE.focus, FAR.focus, pull),
    dof: lerp(SIDE.dof, FAR.dof, pull),
  };
  const big = span(frame, T(28.4), T(36.5), 14);
  const out = ramp(frame, T(38.6), T(40.8), Easing.out(Easing.cubic));
  const roomOpacity = ramp(frame, T(38.6), T(39.6));
  const lit = (t: number) => lerp(0.14, 1, show(t, 0.4));

  const formula = (size: number, times: { R: number; eq: number; rho: number; L: number; A: number }) => (
    <div style={{ fontSize: size, display: 'flex', alignItems: 'center', gap: size * 0.22 }}>
      <Sym style={{ opacity: lit(times.R) }}>R</Sym>
      <Sym color={C.dim} style={{ fontStyle: 'normal', opacity: lit(times.eq) }}>
        =
      </Sym>
      <Sym color={C.rho} style={{ opacity: lit(times.rho) }}>
        ρ
      </Sym>
      <Frac
        color={C.shape}
        width={size * 0.82}
        top={
          <Sym color={C.shape} style={{ opacity: lit(times.L) }}>
            L
          </Sym>
        }
        bottom={
          <Sym color={C.shape} style={{ opacity: lit(times.A) }}>
            A
          </Sym>
        }
      />
    </div>
  );

  return (
    <Shell
      voice="ch8"
      frames={CH8_FRAMES}
      world={
        <>
          {frame < T(40.0) ? (
            <AbsoluteFill style={{ opacity: lerp(1, 0.4, big) * (1 - ramp(frame, T(38.9), T(39.9))) }}>
              <WireWorld
                frame={frame}
                width={width}
                height={height}
                lattice={LATTICE}
                sim={sim}
                pose={pose}
                look={{
                  temperature: heat * 0.85,
                  electronGain: lerp(1, 1.5, pull),
                  ionGain: 1.1 + 0.25 * heat,
                  fog: lerp(SIDE.fog, FAR.fog, pull),
                  slab: lerp(SIDE.slab, FAR.slab, pull),
                  flashes: 0.6 * show(8.6) * (1 - pull),
                  flashColor: frame > T(24.4) ? '#ffb36b' : '#ffffff',
                }}
              />
            </AbsoluteFill>
          ) : null}
          {roomOpacity > 0 ? (
            <AbsoluteFill
              style={{
                opacity: roomOpacity,
                transform: `scale(${Math.exp((1 - out) * Math.log(70))})`,
                transformOrigin: `${CABLE_POINT.x}px ${CABLE_POINT.y}px`,
                filter: out < 0.98 ? `blur(${(1 - out) * 5}px)` : undefined,
              }}
            >
              <Room frame={frame} on={1} race={0} />
            </AbsoluteFill>
          ) : null}
        </>
      }
    >
      <Caption opacity={span(frame, T(0.1), T(2.0), 10)} kicker="So" title="let’s put it all together" />
      <Caption opacity={span(frame, T(2.2), T(6.3))} kicker="A metal" title="is full of free electrons, always in motion" />
      <Caption opacity={span(frame, T(6.5), T(8.4), 10)} kicker="A voltage" title="makes them drift" />
      <Caption opacity={span(frame, T(8.6), T(13.9))} kicker="The disorder of the lattice" title="keeps interrupting that drift: resistance" />
      <Caption opacity={span(frame, T(14.1), T(16.0), 10)} kicker="A longer path" title="raises it" />
      <Caption opacity={span(frame, T(16.2), T(18.0), 10)} kicker="A wider path" title="lowers it" />
      <Caption opacity={span(frame, T(18.2), T(21.5))} kicker="The material" title="sets the scale, through its resistivity" />
      <Caption opacity={span(frame, T(21.7), T(24.2))} kicker="In metals" title="heat raises it further" />
      <Caption opacity={span(frame, T(24.4), T(28.3))} kicker="Every interruption" title="turns electrical energy into heat" />

      {/* the formula collects its terms as each idea returns */}
      <Panel opacity={span(frame, T(12.4), T(28.6))} style={{ right: 110, top: 90 }}>
        {formula(120, { R: 12.8, eq: 12.8, rho: 18.6, L: 14.2, A: 16.3 })}
      </Panel>
      <Center opacity={big}>
        <Kicker style={{ marginBottom: 44 }}>All of that, in one line</Kicker>
        {formula(240, { R: 30.5, eq: 30.9, rho: 31.3, L: 32.1, A: 32.8 })}
        <Sub style={{ marginTop: 56, opacity: show(34.6) }}>don’t just read it</Sub>
      </Center>
      <Center opacity={span(frame, T(36.8), T(39.3), 12)}>
        <Big size={170} style={{ textShadow: `0 0 80px ${C.electron}66` }}>
          See the wire.
        </Big>
      </Center>

      {/* end card */}
      <Panel opacity={ramp(frame, T(40.9), T(41.8))} style={{ left: 110, bottom: 96 }}>
        <Kicker>Resistance and resistivity</Kicker>
        <div style={{ fontSize: 96, fontWeight: 300, letterSpacing: -2, marginTop: 10 }}>Inside the Wire</div>
      </Panel>
    </Shell>
  );
};
