import { useMemo } from 'react';
import { Easing, useCurrentFrame } from 'remotion';
import voice from '../../../public/voice/ac1/ch1.json';
import { lerp, lerp3, ramp, span } from '../../anim';
import { Panel } from '../../ui/hud';
import { T, chapterFrames } from '../../ui/Shell';
import { Big, Center, Kicker, Meter } from '../../ui/type';
import { fibSphere } from '../../world/field';
import { mulberry32 } from '../../world/rng';
import { rgb, type Add } from '../../world/Stage3D';
import type { CameraPose } from '../../world/WireWorld';
import { AShell, AStage, at, Cap, CYAN, PINK, shot, SUN, sway, TEAL, Timeline, WHITE } from '../ac/kit';

// Chapter 1 - Behind the wall socket: a current that keeps changing its mind.
export const A1_FRAMES = chapterFrames(voice.duration);
export const VOICE = (n: number) => `ac1/ch${n}`;

// the electrons in a wire on alternating current: they surge one way, stop, and surge back
export const useCloud = (count = 170, half = 9, radius = 1.1) =>
  useMemo(() => {
    const r = mulberry32(21);
    return Array.from({ length: count }, () => {
      const a = r() * 6.283;
      const d = Math.sqrt(r()) * radius;
      return { x: (r() * 2 - 1) * half, y: Math.cos(a) * d, z: Math.sin(a) * d, j: r() * 6.283 };
    });
  }, [count, half, radius]);
export const drawCloud = (orb: Add, cloud: ReturnType<typeof useCloud>, frame: number, swing: number, cy = 0, gain = 1, rate = 0.105) => {
  const v = Math.cos(frame * rate);
  const d = Math.sin(frame * rate) * swing;
  const c = v >= 0 ? rgb(PINK) : rgb(CYAN);
  for (const e of cloud) orb(e.x + d, cy + e.y + 0.04 * Math.sin(frame * 0.3 + e.j), e.z, 0.24, c, gain);
};
export const drawWireShell = (glow: Add, half: number, cy = 0, gain = 1, radius = 1.45) => {
  const c = rgb('#b78bff');
  for (let x = -half; x <= half; x += 0.5) for (let k = 0; k < 18; k++) glow(x, cy + Math.cos((k / 18) * 6.283) * radius, Math.sin((k / 18) * 6.283) * radius, 0.1, c, 0.4 * gain);
};

export const A1 = () => {
  const frame = useCurrentFrame();
  const cloud = useCloud();
  const bulb = useMemo(() => fibSphere(420), []);
  const which = frame < T(7.3) ? 0 : frame < T(36.6) ? 1 : 2;
  const vis = Math.max(shot(frame, -1, 7.4), shot(frame, 7.2, 36.7), shot(frame, 36.5, 120));
  const push = ramp(frame, T(1.0), T(7.4), Easing.in(Easing.quad));
  const title = ramp(frame, T(50.8), T(51.6));
  const reversals = Math.min(100, Math.floor(Math.max(0, frame - T(19.7)) * 1.1));
  const poses: CameraPose[] = [
    { pos: lerp3([2, 0.6, 16], [0.3, 0.1, 4.6], push), target: [0, 0, 0], fov: 34, focus: lerp(16, 5, push), dof: 0.03 },
    { pos: [4 + sway(frame, 2), 2.4, 12], target: [0, 0, 0], fov: 34, focus: 13, dof: 0.045 },
    { pos: [3 + sway(frame), 1.8, 15], target: [0, 0.6, 0], fov: 34, focus: 15.5, dof: 0.04 },
  ];

  return (
    <AShell
      voice={VOICE(1)}
      frames={A1_FRAMES}
      world={
        <AStage
          opacity={vis * lerp(1, 0.3, title)}
          pose={poses[which]}
          ground={which !== 0}
          orbs={(add) => {
            if (which === 1) drawCloud(add, cloud, frame, 1.7);
            if (which === 2) drawCloud(add, cloud, frame, 0.5, -2.3, 1, 0.105);
          }}
          scene={(add) => {
            if (which === 0) {
              // a socket faceplate: a rounded plate with two openings
              const c = rgb(WHITE);
              for (let i = 0; i < 240; i++) {
                const a = (i / 240) * 6.283;
                const s = Math.max(Math.abs(Math.cos(a)), Math.abs(Math.sin(a)));
                add((Math.cos(a) / s) * 3.2, (Math.sin(a) / s) * 3.2, 0, 0.16, c, 0.8);
              }
              for (let i = 0; i < 90; i++) add(Math.cos((i / 90) * 6.283) * 2.2, Math.sin((i / 90) * 6.283) * 2.2, 0, 0.13, rgb(TEAL), 0.8);
              for (const sx of [-0.9, 0.9]) for (let i = 0; i < 40; i++) add(sx + Math.cos((i / 40) * 6.283) * 0.3, Math.sin((i / 40) * 6.283) * 0.3, 0, 0.14, rgb(sx < 0 ? PINK : CYAN), 1);
              for (const sx of [-0.9, 0.9]) add(sx, 0, -0.4, 1.4, rgb(sx < 0 ? PINK : CYAN), 0.5 + 0.4 * Math.sin(frame * 0.2));
            }
            if (which === 1) drawWireShell(add, 9);
            if (which === 2) {
              // a lamp on the same circuit, glowing steadily
              drawWireShell(add, 9, -2.3, 0.6);
              for (const p of bulb) add(p[0] * 2.1, 1.6 + p[1] * 2.1, p[2] * 2.1, 0.09, rgb(WHITE), 0.4);
              for (let i = 0; i <= 60; i++) add(-0.9 + i * 0.03, 1.5 + 0.35 * Math.sin(i * 0.9), 0, 0.2, rgb(SUN), 1);
              add(0, 1.6, 0, 6, rgb(SUN), 0.5);
              for (const sx of [-0.9, 0.9]) for (let y = -2.3; y <= 1.3; y += 0.1) add(sx, y, 0, 0.1, rgb(WHITE), 0.6);
            }
          }}
        />
      }
    >
      <Panel opacity={span(frame, T(13.4), T(36.4))} style={{ right: 110, top: 70, display: 'flex', gap: 56 }}>
        <Meter label="The current now" value={Math.abs(Math.cos(frame * 0.105)) < 0.18 ? 'stopped' : Math.cos(frame * 0.105) > 0 ? 'one way →' : '← the other'} color={Math.cos(frame * 0.105) > 0 ? PINK : CYAN} size={70} />
        <div style={{ opacity: at(frame, 19.7) }}>
          <Meter label="Reversals this second" value={`${reversals}`} color={TEAL} size={70} />
        </div>
      </Panel>
      <Cap opacity={span(frame, T(0.2), T(7.2))} kicker="Behind every wall socket" title="A pair of wires, and something odd going on inside them" />
      <Cap opacity={span(frame, T(7.5), T(13.1))} kicker="Not round and round, like water in a pipe" title="The current does not simply flow out to your lamp and back" />
      <Cap opacity={span(frame, T(13.4), T(19.5))} kicker="It flows one way, then stops" title="Then it flows the other way, and stops again" />
      <Cap opacity={span(frame, T(19.7), T(24.8))} kicker="In most of the world" title="It changes direction a hundred times every second" />
      <Cap opacity={span(frame, T(25.0), T(34.0))} kicker="Alternating current: AC" title="What every power station makes, and every home receives" />
      <Cap opacity={span(frame, T(36.8), T(40.4))} kicker="Fair questions" title="If the current keeps reversing, how does anything get done?" />
      <Cap opacity={span(frame, T(40.7), T(47.1))} kicker="If the voltage is always changing" title="what does “230 volts” mean?" />
      <Cap opacity={span(frame, T(47.3), T(50.6))} kicker="And" title="why did the world choose something this strange?" />
      <Center opacity={title}>
        <Kicker style={{ marginBottom: 24, color: TEAL }}>A new series · alternating current, one idea at a time</Kicker>
        <Big size={130} style={{ textShadow: `0 0 80px ${PINK}66` }}>
          We start with its <span style={{ color: PINK }}>sh</span>
          <span style={{ color: '#c58bff' }}>a</span>
          <span style={{ color: CYAN }}>pe</span>
        </Big>
      </Center>
      <Timeline frame={frame} already={[]} />
    </AShell>
  );
};
