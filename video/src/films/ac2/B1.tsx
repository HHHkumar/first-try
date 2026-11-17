import { useCurrentFrame } from 'remotion';
import voice from '../../../public/voice/ac2/ch1.json';
import { span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { T, chapterFrames } from '../../ui/Shell';
import { AShell, AStage, at, Cap, CYAN, FLOOR, PINK, sway } from '../ac/kit';
import { COPPER, station, Timeline, VOICE, wire, type Kind } from './kit';

// Chapter 1 - Three components, one supply: in step, late, early.
export const B1_FRAMES = chapterFrames(voice.duration);
export const SPOTS: [Kind, number, string, number][] = [
  ['R', -9, 'Resistor', 325],
  ['L', 0, 'Coil', 960],
  ['C', 9, 'Capacitor', 1595],
];

export const B1 = () => {
  const frame = useCurrentFrame();
  const now = frame * 0.05;
  const hi = [span(frame, T(19.8), T(24.4), 10), span(frame, T(24.6), T(27.3), 10), span(frame, T(27.5), T(30.2), 10)];
  const any = Math.max(...hi);
  const comes = [4.6, 5.8, 6.7];
  const verdict = ['in step', 'the current runs late', 'the current runs early'];

  return (
    <AShell
      voice={VOICE(1)}
      frames={B1_FRAMES}
      world={
        <AStage
          pose={{ pos: [sway(frame), 2.2, 26], target: [0, -0.1, 0], fov: 34, focus: 26, dof: 0.022 }}
          scene={(add) => {
            // one supply: two rails along the floor, feeding all three
            wire(add, -13, FLOOR + 0.7, 13, FLOOR + 0.7, at(frame, 0.4));
            wire(add, -13, FLOOR + 0.3, 13, FLOOR + 0.3, at(frame, 0.4));
            SPOTS.forEach(([kind, cx], k) => station(add, cx, kind, now, frame, { comp: at(frame, comes[k]), v: at(frame, 8.1), i: at(frame, 10.4), bus: 1, gain: 1 - 0.75 * (any - hi[k]) }));
          }}
        />
      }
    >
      {SPOTS.map(([, , name, px], k) => (
        <Panel key={name} opacity={at(frame, comes[k]) * (1 - 0.7 * (any - hi[k]))} style={{ left: px - 250, width: 500, top: 54, textAlign: 'center' }}>
          <div style={{ fontSize: 44, fontWeight: 300, color: k === 0 ? C.text : k === 1 ? COPPER : '#b78bff' }}>{name}</div>
          <div style={{ fontSize: 28, fontWeight: 300, color: C.dim, marginTop: 2, opacity: at(frame, [19.8, 24.6, 27.5][k]) }}>{verdict[k]}</div>
        </Panel>
      ))}
      <Panel opacity={span(frame, T(8.1), T(37.0))} style={{ right: 110, top: 860, textAlign: 'right', fontSize: 30, fontWeight: 300 }}>
        <span style={{ color: PINK }}>voltage</span> · <span style={{ color: CYAN, opacity: at(frame, 10.4) }}>current</span>
      </Panel>
      <Cap opacity={span(frame, T(0.2), T(7.9))} kicker="Take one alternating supply" title="Connect three things to it: a resistor, a coil, a capacitor" />
      <Cap opacity={span(frame, T(8.1), T(17.8))} kicker="In all three, an alternating voltage makes an alternating current" title="Same frequency, same smooth shape" />
      <Cap opacity={span(frame, T(18.0), T(30.1))} kicker="But look at the timing" title={frame < T(24.6) ? 'Resistor: the current rises and falls with the voltage' : frame < T(27.5) ? 'Coil: the current runs late' : 'Capacitor: the current runs early'} />
      <Cap opacity={span(frame, T(30.3), T(37.1))} kicker="Last time we called that gap in timing phase" title="Now we find out where it comes from" />
      <Cap opacity={span(frame, T(37.3), T(41.6))} kicker="The answer explains" title="why a coil can limit a current without getting warm" />
      <Cap opacity={span(frame, T(41.8), T(46.0))} kicker="The answer explains" title="why a capacitor passes a current though nothing crosses its gap" />
      <Cap opacity={span(frame, T(46.2), T(90))} kicker="And why engineers talk about" title="a second kind of opposition that is not resistance at all" />
      <Timeline frame={frame} already={[]} />
    </AShell>
  );
};
