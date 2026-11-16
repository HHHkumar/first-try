import { useCurrentFrame } from 'remotion';
import voice from '../../../public/voice/ac1/ch4.json';
import { span } from '../../anim';
import { Panel } from '../../ui/hud';
import { T, chapterFrames } from '../../ui/Shell';
import { Meter } from '../../ui/type';
import { rgb } from '../../world/Stage3D';
import { AShell, AStage, at, Cap, CYAN, MINT, phaseColor, PINK, ribbon, shot, SUN, sway, TEAL, Timeline, VIOLET, WHITE } from '../ac/kit';
import { VOICE } from './A1';

// Chapter 4 - Why a sine: the one shape that coils and capacitors do not distort.
export const A4_FRAMES = chapterFrames(voice.duration);
const frac = (v: number) => v - Math.floor(v);
const SHAPES = {
  sine: (u: number) => Math.sin(u * 6.283),
  square: (u: number) => (frac(u) < 0.5 ? 1 : -1),
  triangle: (u: number) => 1 - 4 * Math.abs(frac(u + 0.25) - 0.5),
  saw: (u: number) => 2 * frac(u + 0.5) - 1,
};
// what comes out the far side of a coil and a capacitor
const OUT = {
  sine: (u: number) => 0.62 * Math.sin((u - 0.17) * 6.283),
  square: (u: number) => {
    const t = frac(u) < 0.5 ? frac(u) : frac(u) - 0.5;
    return (frac(u) < 0.5 ? 1 : -1) * (0.45 + 1.1 * Math.exp(-t * 26) - 0.5 * Math.exp(-t * 7));
  },
  triangle: (u: number) => 0.8 * Math.sin((u - 0.1) * 6.283) + 0.06 * Math.sin(u * 18.85),
  saw: (u: number) => 0.55 * Math.sin((u - 0.2) * 6.283) + 0.35 * Math.sin(u * 12.566) - 0.9 * Math.exp(-frac(u + 0.5) * 22),
};
type Kind = keyof typeof SHAPES;

export const A4 = () => {
  const frame = useCurrentFrame();
  const kind: Kind = frame < T(7.6) ? 'sine' : frame < T(12.0) ? 'square' : frame < T(13.5) ? 'triangle' : frame < T(56.3) ? 'sine' : frame < T(60.2) ? 'square' : frame < T(64.0) ? 'saw' : 'sine';
  const through = frame >= T(56.3) && frame < T(78.4);
  const swinging = frame >= T(78.5);
  const vis = Math.max(shot(frame, -1, 7.7), shot(frame, 7.5, 12.1), shot(frame, 11.9, 13.6), shot(frame, 13.4, 56.4), shot(frame, 56.2, 60.3), shot(frame, 60.1, 64.1), shot(frame, 63.9, 78.5), shot(frame, 78.3, 150));
  const run = frame * 0.012;
  const rate = at(frame, 41.6);
  const col = (k: Kind) => (k === 'sine' ? (x: number) => phaseColor(x * 0.13 - run) : () => rgb(k === 'square' ? PINK : k === 'triangle' ? SUN : CYAN));
  const a = Math.sin(frame * 0.08);

  return (
    <AShell
      voice={VOICE(4)}
      frames={A4_FRAMES}
      world={
        <AStage
          opacity={vis}
          pose={{ pos: [1 + sway(frame), 2.4, 24], target: [0, -0.4, 0], fov: 34, focus: 24, dof: 0.025 }}
          orbs={(add) => {
            if (swinging) {
              add(-7 + Math.sin(a * 0.6) * 4.2, 3.4 - Math.cos(a * 0.6) * 4.2, 0, 1.0, rgb(PINK), 1);
              add(-1.5, 0.2 + a * 1.5, 0, 1.0, rgb(SUN), 1);
            }
          }}
          scene={(add) => {
            if (swinging) {
              // a pendulum and a weight on a spring, each tracing its own height against time
              for (let i = 0; i < 40; i++) add(-7 + (Math.sin(a * 0.6) * 4.2 * i) / 40, 3.4 - (Math.cos(a * 0.6) * 4.2 * i) / 40, 0, 0.08, rgb(WHITE), 0.7);
              for (let i = 0; i < 60; i++) add(-1.5 + 0.25 * Math.sin(i * 1.2), 3.4 - ((3.2 - a * 1.5) * i) / 60, 0, 0.1, rgb(WHITE), 0.8);
              ribbon(add, 2, 13, (x) => Math.sin((frame - (x - 2) * 9) * 0.08) * 1.5 + 0.2, (x) => phaseColor(x * 0.11 - run), { axis: 0.2 });
              return;
            }
            const x0 = through ? -12 : -11;
            const x1 = through ? -2.4 : 11;
            ribbon(add, x0, x1, (x) => SHAPES[kind](x * 0.13 - run) * 2.2, col(kind), { fill: kind === 'sine' });
            // how fast the sine is changing at each moment: another sine, shifted along
            if (kind === 'sine' && !through) ribbon(add, -11, 11, (x) => Math.cos((x * 0.13 - run) * 6.283) * 2.2, () => rgb(MINT), { fill: false, gain: 0.9 * rate, z: -1.5, size: 0.16 });
            if (through) {
              // a coil and a capacitor in the way
              for (let k = 0; k < 6; k++) for (let i = 0; i < 40; i++) add(-1.4 + k * 0.3, Math.cos((i / 40) * 6.283) * 1.0, Math.sin((i / 40) * 6.283) * 1.0, 0.14, rgb(SUN), 0.9);
              for (const x of [0.9, 1.5]) for (let y = -1.2; y <= 1.21; y += 0.2) for (let z = -1.2; z <= 1.21; z += 0.2) add(x, y, z, 0.13, rgb(x < 1 ? PINK : CYAN), 0.8);
              ribbon(add, 2.4, 12, (x) => OUT[kind](x * 0.13 - run) * 2.2, col(kind), { fill: kind === 'sine' });
            }
          }}
        />
      }
    >
      <Panel opacity={span(frame, T(56.5), T(78.2))} style={{ right: 110, top: 70, display: 'flex', gap: 56 }}>
        <Meter label="Going in" value={kind === 'sine' ? 'a sine' : kind === 'square' ? 'a square' : 'a sawtooth'} color={TEAL} size={66} />
        <Meter label="Coming out" value={kind === 'sine' ? 'still a sine' : 'distorted'} color={kind === 'sine' ? MINT : PINK} size={66} />
      </Panel>
      <Panel opacity={span(frame, T(41.6), T(56.2))} style={{ right: 110, top: 70, textAlign: 'right' }}>
        <div style={{ fontSize: 36, fontWeight: 300, color: VIOLET }}>the sine wave</div>
        <div style={{ fontSize: 36, fontWeight: 300, color: MINT, opacity: at(frame, 46.6) }}>how fast it is changing: another sine</div>
      </Panel>
      <Cap opacity={span(frame, T(0.2), T(7.5))} kicker="The curve has a name: a sine wave" title="Why should the mains have this particular shape?" />
      <Cap opacity={span(frame, T(7.8), T(13.4))} kicker="Why not a square wave, switching sharply?" title="Or a zigzag?" />
      <Cap opacity={span(frame, T(13.6), T(19.6))} kicker="One reason we have seen" title="It is what steady rotation gives, and generators rotate" />
      <Cap opacity={span(frame, T(20.0), T(27.9))} kicker="But there is a deeper reason" title="It is why engineers love this curve" />
      <Cap opacity={span(frame, T(28.3), T(41.4))} kicker="A coil and a capacitor both respond to the rate of change" title="How fast the current, or the voltage, is changing" />
      <Cap opacity={span(frame, T(41.6), T(56.2))} kicker="Ask how fast a sine wave is changing at each moment" title="You get another sine wave: same shape, same frequency, shifted along" />
      <Cap opacity={span(frame, T(56.5), T(63.9))} kicker="No other repeating shape does this" title="A square wave comes out distorted, with spikes and rounded corners" />
      <Cap opacity={span(frame, T(64.1), T(72.4))} kicker="Put a sine wave in, and a sine wave comes out" title="Smaller, perhaps, and shifted in time. But its shape survives" />
      <Cap opacity={span(frame, T(72.6), T(78.3))} kicker="That is why a system built on sine waves" title="stays tidy from the generator to your socket" />
      <Cap opacity={span(frame, T(78.6), T(150))} kicker="It is also the natural shape of anything that swings" title="A pendulum, a weight on a spring, a child on a swing" />
      <Timeline frame={frame} already={[0]} />
    </AShell>
  );
};
