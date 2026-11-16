import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/inductance/ch6.json';
import { ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../../ui/Shell';
import { Frac, Kicker, Meter, Sym } from '../../ui/type';
import { BFIELD, CURRENT } from '../../world/magnet';
import { rgb, Stage3D } from '../../world/Stage3D';
import { at, Cap, coilPose, drawCoilField, drawTurns, GOLD, shot, Timeline, useCoil, VOICE, VOLT } from './kit';

// Chapter 6 - Where the energy is, and why the switch sparks.
export const IND6_FRAMES = chapterFrames(voice.duration);

const Half = ({ a, b, bColor, power = true }: { a: string; b: string; bColor: string; power?: boolean }) => (
  <div style={{ fontSize: 124, display: 'flex', alignItems: 'center', gap: 24 }}>
    <Sym color={GOLD}>W</Sym>
    <Sym color={C.dim} style={{ fontStyle: 'normal' }}>
      =
    </Sym>
    <Frac width={70} top={<Sym>1</Sym>} bottom={<Sym>2</Sym>} />
    <Sym>{a}</Sym>
    <Sym color={bColor}>
      {b}
      {power ? <sup style={{ fontSize: '0.5em', fontStyle: 'normal' }}>2</sup> : null}
    </Sym>
  </div>
);

export const Ind6 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const coil = useCoil();
  const sA = shot(frame, -1, 15.0);
  const compare = span(frame, T(14.9), T(32.5), 12);
  const sB = shot(frame, 32.4, 80);
  const climb = ramp(frame, T(3.5), T(12.0), Easing.inOut(Easing.quad));
  const collapse = ramp(frame, T(38.2), T(41.0), Easing.in(Easing.quad));
  const second = frame >= T(32.4);
  const current = second ? 1 - collapse : climb;
  const flash = span(frame, T(40.4), T(51.5), 4) * (0.5 + 0.5 * Math.sin(frame * 2.1) ** 2);
  const volts = second ? 12 + 2400 * span(frame, T(39.6), T(51.5), 10) : 0;

  return (
    <Shell
      voice={VOICE(6)}
      frames={IND6_FRAMES}
      world={
        <AbsoluteFill style={{ opacity: Math.max(sA, sB) }}>
          <Stage3D
            width={width}
            height={height}
            pose={coilPose(frame)}
            glows={(add) => {
              drawTurns(add, coil, frame * 0.8 * current, current);
              drawCoilField(add, coil, frame, current, 1, second ? 1 - 0.8 * collapse : 1);
              // the open switch, off to one side: the energy comes out here
              if (flash > 0.01) {
                add(5.2, 2.2, 0, 3.4, rgb('#9fdcff'), 0.55 * flash);
                add(5.2, 2.2, 0, 1.0, [1, 1, 1], flash);
                for (let i = 0; i < 26; i++) {
                  const a = i * 2.4 + frame;
                  const r = 0.3 + ((i * 37 + frame * 13) % 17) / 17;
                  add(5.2 + Math.cos(a) * r, 2.2 + Math.sin(a) * r, 0, 0.16, [1, 1, 1], flash);
                }
              }
            }}
          />
        </AbsoluteFill>
      }
    >
      <Panel opacity={span(frame, T(2.5), T(14.9))} style={{ right: 110, top: 70, display: 'flex', gap: 56 }}>
        <Meter label="Current" value={`${Math.round(climb * 100)} %`} color={CURRENT} size={84} />
        <Meter label="Energy stored" value={`${Math.round(climb * climb * 100)} %`} color={GOLD} size={84} />
      </Panel>
      <Panel opacity={span(frame, T(8.4), T(14.9))} style={{ left: 110, top: 70 }}>
        <Half a="L" b="I" bColor={CURRENT} />
      </Panel>
      <Cap opacity={span(frame, T(0.2), T(8.0))} kicker="How much energy does the field hold?" title="Work is done against the coil’s voltage as the current climbs" />
      <Cap opacity={span(frame, T(8.4), T(14.8))} kicker="Add it all up" title="One half, times the inductance, times the current squared" />

      <Scene opacity={compare}>
        <Panel opacity={1} style={{ left: 0, right: 0, top: 210, display: 'flex', justifyContent: 'center', gap: 150 }}>
          <div style={{ opacity: at(frame, 17.1) }}>
            <Kicker>The capacitor</Kicker>
            <Half a="C" b="V" bColor={VOLT} />
            <div style={{ fontSize: 40, fontWeight: 300, color: C.field, marginTop: 14 }}>in an electric field</div>
            <div style={{ fontSize: 46, fontWeight: 300, marginTop: 60, opacity: at(frame, 27.3) }}>
              stores energy in <span style={{ color: VOLT }}>voltage</span>
            </div>
          </div>
          <div style={{ opacity: at(frame, 22.3) }}>
            <Kicker>The inductor</Kicker>
            <Half a="L" b="I" bColor={CURRENT} />
            <div style={{ fontSize: 40, fontWeight: 300, color: BFIELD, marginTop: 14 }}>in a magnetic field</div>
            <div style={{ fontSize: 46, fontWeight: 300, marginTop: 60, opacity: at(frame, 30.2) }}>
              stores energy in <span style={{ color: CURRENT }}>current</span>
            </div>
          </div>
        </Panel>
      </Scene>

      <Panel opacity={span(frame, T(35.3), T(60))} style={{ right: 110, top: 70, display: 'flex', gap: 56 }}>
        <Meter label="Current" value={`${Math.round(current * 100)} %`} color={CURRENT} size={84} />
        <Meter label="Voltage at the switch" value={Math.round(volts).toLocaleString('en-US')} unit="V" color={VOLT} size={84} />
      </Panel>
      <Cap opacity={span(frame, T(32.7), T(38.0))} kicker="Now Henry’s spark makes sense" title="Open the switch, and the current must stop" />
      <Cap opacity={span(frame, T(38.2), T(42.7))} kicker="The field collapses" title="All its energy has to go somewhere, at once" />
      <Cap opacity={span(frame, T(43.0), T(60))} kicker="The coil makes whatever voltage it takes" title="Hundreds or thousands of volts: enough to cross the open switch" />
      <Timeline frame={frame} already={[0, 1, 2, 4, 5]} />
    </Shell>
  );
};
