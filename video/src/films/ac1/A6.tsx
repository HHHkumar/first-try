import { Easing, useCurrentFrame } from 'remotion';
import voice from '../../../public/voice/ac1/ch6.json';
import { lerp, ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { T, chapterFrames } from '../../ui/Shell';
import { Big, Center, Frac, Kicker, Meter, Sym } from '../../ui/type';
import { rgb, type Add } from '../../world/Stage3D';
import { AShell, AStage, at, Cap, CYAN, level, MINT, phaseColor, PINK, ribbon, shot, SUN, sway, TEAL, Timeline, VIOLET, WHITE } from '../ac/kit';
import { VOICE } from './A1';

// Chapter 6 - The number that matters: the average is zero; the RMS value is what does the work.
export const A6_FRAMES = chapterFrames(voice.duration);
const R = 2.6;

// a beaker of water with a heater in it and a thermometer beside it
const beaker = (add: Add, cx: number, temp: number, color: string, frame: number) => {
  for (let y = -2.6; y <= 0.6; y += 0.32) for (let i = 0; i < 44; i++) add(cx + Math.cos((i / 44) * 6.283) * 1.7, y, Math.sin((i / 44) * 6.283) * 1.7, 0.1, rgb(WHITE), 0.5);
  for (let i = 0; i < 90; i++) {
    const a = i * 2.39996;
    const r = 1.55 * Math.sqrt((i + 0.5) / 90);
    add(cx + Math.cos(a) * r, -0.2 + 0.05 * Math.sin(frame * 0.2 + i), Math.sin(a) * r, 0.14, rgb(CYAN), 0.5);
  }
  for (let i = 0; i <= 50; i++) add(cx - 1 + i * 0.04, -1.9 + 0.3 * Math.sin(i * 0.9), 0, 0.2, rgb(color), 0.5 + 0.5 * temp);
  add(cx, -1.9, 0, 3.2, rgb(color), 0.15 + 0.3 * temp);
  for (let y = -2.4; y <= 1.6; y += 0.08) add(cx + 2.3, y, 0, 0.1, rgb(WHITE), 0.5);
  for (let y = -2.4; y <= -2.4 + 3.6 * temp; y += 0.06) add(cx + 2.3, y, 0, 0.22, rgb(PINK), 1);
};

export const A6 = () => {
  const frame = useCurrentFrame();
  const run = frame * 0.012;
  const sWave = Math.max(shot(frame, -1, 27.0), shot(frame, 48.4, 200));
  const sHeat = shot(frame, 26.8, 48.6);
  const heaters = frame >= T(26.9) && frame < T(48.5);
  const words = span(frame, T(72.0), T(88.2), 12);
  // matching the two heaters: the steady voltage is turned up until they keep pace
  const dc = lerp(120, 230, ramp(frame, T(34.0), T(41.0), Easing.inOut(Easing.quad)));
  const heatAC = ramp(frame, T(31.0), T(48.5)) * 0.9;
  const heatDC = heatAC * Math.min(1, (dc / 230) ** 2 + 0.25 * ramp(frame, T(41.0), T(46.0)));
  // working it out: square the wave, take its mean, take the root
  const sq = ramp(frame, T(53.4), T(57.0), Easing.inOut(Easing.quad));
  const mean = ramp(frame, T(65.2), T(68.6), Easing.inOut(Easing.quad));
  const root = ramp(frame, T(69.4), T(71.8), Easing.inOut(Easing.quad));
  const back = 1 - ramp(frame, T(87.4), T(88.4));
  const y = (x: number) => {
    const s = Math.sin((x * 0.11 - run) * 6.283);
    const squared = lerp(s, s * s, sq * back) * R;
    return lerp(lerp(squared, R * 0.5, mean * back), R * 0.7071, root * back);
  };

  return (
    <AShell
      voice={VOICE(6)}
      frames={A6_FRAMES}
      world={
        <AStage
          opacity={Math.max(sWave, sHeat) * lerp(1, 0.3, words)}
          pose={heaters ? { pos: [1 + sway(frame), 2.6, 17], target: [0, -0.6, 0], fov: 34, focus: 17.5, dof: 0.035 } : { pos: [1 + sway(frame), 2.4, 24], target: [0, -0.3, 0], fov: 34, focus: 24, dof: 0.025 }}
          scene={(add) => {
            if (heaters) {
              beaker(add, -4.6, heatDC, SUN, frame);
              beaker(add, 4.2, heatAC, VIOLET, frame);
              // what feeds each one: a steady level, and a wave
              level(add, 1.2 + (dc / 230) * 0.6, -6.6, -2.6, SUN, 1);
              ribbon(add, 2.2, 6.4, (x) => 1.4 + Math.sin((x * 0.5 - run * 4) * 6.283) * 0.6, (x) => phaseColor(x * 0.5 - run * 4), { axis: 1.4, fill: false });
              return;
            }
            const early = frame < T(27);
            ribbon(add, -12, 12, y, (x) => (back > 0.5 && (sq > 0.5 || mean > 0) ? rgb(mean > 0.5 ? SUN : PINK) : phaseColor(x * 0.11 - run)), { fill: mean * back < 0.9 });
            // above the line and below it, in equal measure: the average is zero
            if (early) level(add, 0, -12, 12, WHITE, at(frame, 13.2));
            level(add, R, -12, 12, PINK, at(frame, 88.4) * 0.8);
            level(add, R * 0.7071, -12, 12, SUN, Math.max(at(frame, 81.8), 0) * (1 - mean * (1 - root)));
          }}
        />
      }
    >
      <Panel opacity={span(frame, T(7.7), T(26.8))} style={{ right: 110, top: 60 }}>
        <Meter label="The average of the wave" value="0" unit="V" color={TEAL} size={110} align="right" />
      </Panel>
      <Panel opacity={span(frame, T(29.4), T(48.4))} style={{ left: 0, right: 0, top: 60, display: 'flex', justifyContent: 'center', gap: 260 }}>
        <Meter label="Steady voltage, adjusted" value={`${Math.round(dc)}`} unit="V" color={SUN} size={84} align="center" />
        <Meter label="Alternating supply" value="230" unit="V" color={VIOLET} size={84} align="center" />
      </Panel>
      <Panel opacity={span(frame, T(53.4), T(71.9))} style={{ right: 110, top: 60, textAlign: 'right' }}>
        <div style={{ fontSize: 60, fontWeight: 300, color: PINK, opacity: at(frame, 53.4) }}>square it</div>
        <div style={{ fontSize: 60, fontWeight: 300, color: SUN, opacity: at(frame, 65.2) }}>take the mean</div>
        <div style={{ fontSize: 60, fontWeight: 300, color: MINT, opacity: at(frame, 69.4) }}>take the root</div>
      </Panel>
      <Cap opacity={span(frame, T(0.2), T(7.4))} kicker="A voltage that never stands still" title="What single number should describe it? The average?" />
      <Cap opacity={span(frame, T(7.7), T(14.9))} kicker="As much time below zero as above it" title="Its average is zero" />
      <Cap opacity={span(frame, T(15.2), T(20.0))} kicker="That cannot be right" title="A voltage whose average is zero still boils a kettle" />
      <Cap opacity={span(frame, T(20.5), T(26.8))} kicker="So try a different test" title="Do not ask what the voltage is. Ask what it can do" />
      <Cap opacity={span(frame, T(27.1), T(41.3))} kicker="Two identical heaters: one on alternating current, one on steady" title="Adjust the steady voltage until both give heat at the same rate" />
      <Cap opacity={span(frame, T(41.5), T(48.4))} kicker="That steady voltage is the fair measure of the alternating one" title="We call it the effective value" />
      <Cap opacity={span(frame, T(48.7), T(55.2))} kicker="We can work it out" title="Heat in a resistor depends on the voltage squared: so square the wave" />
      <Cap opacity={span(frame, T(55.4), T(65.0))} kicker="Squaring makes every part positive, dips as well as crests" title="Right, because a heater warms whichever way the current flows" />
      <Cap opacity={span(frame, T(65.2), T(71.9))} kicker="Take the mean of the squared wave" title="Then the square root, to undo the squaring" />
      <Center opacity={words}>
        <Kicker style={{ marginBottom: 20, color: TEAL }}>Root, of the mean, of the square</Kicker>
        <Big size={150}>
          <span style={{ color: MINT }}>R</span> <span style={{ color: SUN }}>M</span> <span style={{ color: PINK }}>S</span>
        </Big>
        <div style={{ fontSize: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26, marginTop: 40, opacity: at(frame, 81.8) }}>
          <Sym color={SUN}>
            V<sub style={{ fontSize: '0.4em', fontStyle: 'normal' }}>rms</sub>
          </Sym>
          <Sym color={C.dim} style={{ fontStyle: 'normal' }}>
            =
          </Sym>
          <Frac
            width={260}
            top={
              <Sym color={PINK}>
                V<sub style={{ fontSize: '0.4em', fontStyle: 'normal' }}>peak</sub>
              </Sym>
            }
            bottom={<Sym style={{ fontStyle: 'normal' }}>√2</Sym>}
          />
          <span style={{ fontFamily: 'Sora', fontSize: 50, fontWeight: 300, color: C.dim, opacity: at(frame, 86.2) }}>≈ 70 % of the peak</span>
        </div>
      </Center>
      <Panel opacity={span(frame, T(88.4), T(200))} style={{ right: 110, top: 60, display: 'flex', gap: 56 }}>
        <Meter label="RMS: what it can do" value="230" unit="V" color={SUN} size={96} />
        <div style={{ opacity: at(frame, 105.0) }}>
          <Meter label="Peak: what it reaches" value="325" unit="V" color={PINK} size={96} />
        </div>
      </Panel>
      <Cap opacity={span(frame, T(88.4), T(98.2))} kicker="So 230 volts is an RMS value" title="It heats a resistor exactly as a steady 230 volts would" />
      <Cap opacity={span(frame, T(98.4), T(104.8))} kicker="When an engineer quotes an alternating voltage or current" title="and says nothing else, RMS is what they mean" />
      <Cap opacity={span(frame, T(105.0), T(200))} kicker="But the peak is still there" title="Insulation has to withstand 325 volts, not 230" />
      <Timeline frame={frame} already={[0]} />
    </AShell>
  );
};
