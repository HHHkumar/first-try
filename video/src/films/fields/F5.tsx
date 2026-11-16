import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/fields/ch5.json';
import { ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Scene, Shell, T, chapterFrames } from '../../ui/Shell';
import { Big, Center, Frac, Kicker, Sym } from '../../ui/type';
import { BFIELD } from '../../world/magnet';
import { rgb, Stage3D } from '../../world/Stage3D';
import { plate } from '../induction/kit';
import { at, Cap, EFIELD, GOLD, Timeline, VOICE } from './kit';

// Chapter 5 - The speed: two bench constants, and the speed of light.
export const F5_FRAMES = chapterFrames(voice.duration);
const n = (v: number) => Math.round(v).toLocaleString('en-US');

export const F5 = () => {
  const frame = useCurrentFrame();
  const consts = span(frame, T(-1), T(52.5), 12);
  const fizeau = span(frame, T(52.6), T(70.2), 12);
  const both = span(frame, T(70.3), T(79.4), 12);
  const final = ramp(frame, T(79.5), T(80.3));
  const speed = 310740 * ramp(frame, T(46.0), T(49.6));
  const light = 314858 * ramp(frame, T(64.8), T(68.6));
  const beam = ((frame - T(56)) * 26) % 2200;
  const bx3 = -6.3 + (beam < 1100 ? beam : 2200 - beam) * (15.3 / 1100);
  const { width, height } = useVideoConfig();

  return (
    <Shell
      voice={VOICE(5)}
      frames={F5_FRAMES}
      world={
        fizeau > 0 ? (
          <AbsoluteFill style={{ opacity: fizeau }}>
            <Stage3D
              width={width}
              height={height}
              pose={{ pos: [-3 + Math.sin(frame * 0.003), 3.2, 17], target: [1, 0.2, 0], fov: 34, focus: 17.5, dof: 0.03 }}
              glows={(add) => {
                // a lamp, a toothed wheel spinning in front of it, and a mirror far away
                add(-8.6, 1.7, 0, 1.6, rgb(GOLD), 0.9);
                const g = rgb('#d7e6ff');
                for (let i = 0; i < 48; i++) {
                  const a = (i / 48) * 6.283 + frame * 0.04;
                  for (let r = 1.3; r <= 2.0; r += 0.1) if (i % 2 === 0 || r < 1.5) add(-6.5, Math.cos(a) * r, Math.sin(a) * r, 0.14, g, 0.9);
                }
                plate(add, 9, 1.7, 0, 1.2, 1.2, 1.5, '#d7e6ff');
                for (let x = -6.3; x <= 9; x += 0.12) add(x, 1.7, 0, 0.06, rgb(GOLD), 0.5);
                add(bx3, 1.7, 0, 0.55, rgb(GOLD), 1);
              }}
            />
          </AbsoluteFill>
        ) : null
      }
    >
      <Scene opacity={consts}>
        <Panel opacity={at(frame, 6.7)} style={{ left: 0, right: 0, top: 130, display: 'flex', justifyContent: 'center', gap: 130 }}>
          <div style={{ width: 640, opacity: at(frame, 8.7) }}>
            <Kicker>From the capacitor formula</Kicker>
            <div style={{ fontSize: 170, lineHeight: 1.1 }}>
              <Sym color={EFIELD}>
                ε<sub style={{ fontSize: '0.45em', fontStyle: 'normal' }}>0</sub>
              </Sym>
            </div>
            <div style={{ fontSize: 34, fontWeight: 300, color: C.dim }}>how strong the electric field of a given charge is</div>
          </div>
          <div style={{ width: 640, opacity: at(frame, 16.7) }}>
            <Kicker>From the coil formula</Kicker>
            <div style={{ fontSize: 170, lineHeight: 1.1 }}>
              <Sym color={BFIELD}>
                μ<sub style={{ fontSize: '0.45em', fontStyle: 'normal' }}>0</sub>
              </Sym>
            </div>
            <div style={{ fontSize: 34, fontWeight: 300, color: C.dim }}>how strong the magnetic field of a given current is</div>
          </div>
        </Panel>
        <Panel opacity={at(frame, 41.3)} style={{ left: 0, right: 0, top: 480, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 60 }}>
          <div style={{ fontSize: 110, display: 'flex', alignItems: 'center', gap: 22 }}>
            <Sym color={GOLD}>speed</Sym>
            <Sym color={C.dim} style={{ fontStyle: 'normal' }}>
              =
            </Sym>
            <Frac
              width={300}
              top={<Sym>1</Sym>}
              bottom={
                <span>
                  <Sym style={{ fontStyle: 'normal' }}>√</Sym>
                  <Sym color={BFIELD}>
                    μ<sub style={{ fontSize: '0.45em', fontStyle: 'normal' }}>0</sub>
                  </Sym>
                  <Sym color={EFIELD}>
                    ε<sub style={{ fontSize: '0.45em', fontStyle: 'normal' }}>0</sub>
                  </Sym>
                </span>
              }
            />
          </div>
          <div style={{ fontSize: 110, fontWeight: 300, letterSpacing: -3, color: GOLD, opacity: at(frame, 45.8), fontVariantNumeric: 'tabular-nums', width: 760 }}>
            {n(speed)} <span style={{ fontSize: 44, color: C.dim }}>km/s</span>
          </div>
        </Panel>
        <Cap opacity={span(frame, T(0.2), T(8.4))} kicker="How fast does such a wave travel?" title="Maxwell needed only two numbers, and we have met both" />
        <Cap opacity={span(frame, T(24.7), T(34.4))} kicker="Neither has anything to do with waves, or with speed" title="You measure them on a bench: plates, coils and a balance" />
        <Cap opacity={span(frame, T(34.6), T(52.4))} kicker="1856 · Weber and Kohlrausch measure them" title="Maxwell puts their figures into his equations" />
      </Scene>

      <AbsoluteFill style={{ opacity: fizeau }}>
        <Panel opacity={1} style={{ left: 0, right: 0, top: 700, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 300, color: C.dim }}>8 kilometres to the mirror, and back</div>
        </Panel>
        <Panel opacity={at(frame, 64.6)} style={{ left: 0, right: 0, top: 150, textAlign: 'center' }}>
          <div style={{ fontSize: 110, fontWeight: 300, letterSpacing: -3, fontVariantNumeric: 'tabular-nums' }}>
            {n(light)} <span style={{ fontSize: 44, color: C.dim }}>km/s</span>
          </div>
        </Panel>
        <Cap opacity={1} kicker="France · 1849 · Hippolyte Fizeau" title="Light through the teeth of a spinning wheel: the speed of light, timed" />
      </AbsoluteFill>

      <Scene opacity={both}>
        <Panel opacity={1} style={{ left: 0, right: 0, top: 200, textAlign: 'center' }}>
          <Kicker>From charged plates and coils</Kicker>
          <div style={{ fontSize: 150, fontWeight: 300, letterSpacing: -4, color: GOLD }}>310,740 km/s</div>
          <div style={{ opacity: at(frame, 73.5), marginTop: 30 }}>
            <Kicker>From a light beam and a toothed wheel</Kicker>
            <div style={{ fontSize: 150, fontWeight: 300, letterSpacing: -4 }}>314,858 km/s</div>
          </div>
          <div style={{ fontSize: 46, fontWeight: 300, color: C.electron, marginTop: 30, opacity: at(frame, 76.9) }}>They agree to within two percent</div>
        </Panel>
      </Scene>

      <Center opacity={final}>
        <Kicker style={{ marginBottom: 24 }}>Maxwell: “we can scarcely avoid the conclusion”</Kicker>
        <Big size={104}>
          Light is an <span style={{ color: GOLD }}>electromagnetic wave</span>
        </Big>
        <div style={{ fontSize: 60, fontWeight: 300, marginTop: 60, opacity: at(frame, 86.9), color: C.dim }}>
          optics · electricity · magnetism
          <span style={{ opacity: at(frame, 93.0), color: C.text }}> → one subject</span>
        </div>
      </Center>
      <Timeline frame={frame} already={[0, 3]} events={[[2, 36.0], [1, 53.6]]} />
    </Shell>
  );
};
