import { useMemo } from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import voice from '../../../public/voice/charge/ch6.json';
import { lerp, ramp, span } from '../../anim';
import { C } from '../../theme';
import { Panel } from '../../ui/hud';
import { Shell, T, chapterFrames } from '../../ui/Shell';
import { Kicker } from '../../ui/type';
import { drawArrow, drawCharge, drawFieldArrows, drawLines, fieldAt, FIELD, POS, traceLines, type Charge } from '../../world/field';
import { rgb, Stage3D } from '../../world/Stage3D';
import type { CameraPose } from '../../world/WireWorld';
import { at, Cap, Ink, Timeline, VOICE } from './kit';

// Chapter 6 - Field lines. Faraday's way of drawing the field, and what the
// drawing does and does not mean.
export const CHARGE6_FRAMES = chapterFrames(voice.duration);
const GRID = { x: [-7.2, 7.2] as [number, number], y: [-3.0, 3.6] as [number, number], spacing: 1.2 };

export const Charge6 = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // one charge; a second one arrives from the right; later it changes sign
  const arrive = ramp(frame, T(8.2), T(11.4), Easing.out(Easing.cubic));
  const second = at(frame, 8.2);
  const like = ramp(frame, T(31.4), T(33.0));
  const x2 = lerp(11, 3, arrive);
  const base: Charge = { x: lerp(0, -3, arrive), y: 0.3, z: 0, q: 1 };
  const unlike: Charge[] = second > 0 ? [base, { x: x2, y: 0.3, z: 0, q: -1 }] : [base];
  const both: Charge[] = [base, { x: x2, y: 0.3, z: 0, q: 1 }];
  const linesUnlike = useMemo(() => traceLines(unlike, { perCharge: 18, planar: true, bound: 12 }), [frame < T(11.6) ? frame : 0]);
  const linesLike = useMemo(() => traceLines([{ x: -3, y: 0.3, z: 0, q: 1 }, { x: 3, y: 0.3, z: 0, q: 1 }], { perCharge: 14, planar: true, bound: 12 }), []);

  const pose: CameraPose = { pos: [0, 0.3, 15.5], target: [0, 0.3, 0], fov: 34, focus: 15.5, dof: 0.06 };
  const cam = pose.pos;
  const toLines = ramp(frame, T(4.2), T(7.2));

  // a probe sliding along one line, showing that the line's direction is the field's
  const probe = (() => {
    const line = linesUnlike[Math.min(linesUnlike.length - 1, 3)];
    if (!line) return null;
    const n = line.points.length / 3;
    const i = Math.min(n - 2, Math.floor(ramp(frame, T(15.0), T(19.4), Easing.inOut(Easing.quad)) * (n - 2)));
    const p = [line.points[i * 3], line.points[i * 3 + 1]];
    const e = fieldAt(unlike, p[0], p[1], 0);
    return { p, e };
  })();
  const between = { x: 0, y: 2.25 };
  const eBetween = fieldAt(unlike, between.x, between.y, 0);

  return (
    <Shell
      voice={VOICE(6)}
      frames={CHARGE6_FRAMES}
      world={
        <AbsoluteFill>
          <Stage3D
            width={width}
            height={height}
            pose={pose}
            orbs={(add) => {
              drawCharge(add, () => {}, base, cam, 0.44);
              drawCharge(add, () => {}, unlike[1] ?? base, cam, 0.44, second * (1 - like));
              drawCharge(add, () => {}, both[1], cam, 0.44, like);
            }}
            glows={(add) => {
              drawCharge(() => {}, add, base, cam, 0.44);
              if (second > 0) drawCharge(() => {}, add, unlike[1], cam, 0.44, second * (1 - like));
              drawCharge(() => {}, add, both[1], cam, 0.44, like);
              drawFieldArrows(add, [base], GRID, 1 - toLines, FIELD);
              drawLines(add, linesUnlike, frame, toLines * (1 - like), FIELD, { reveal: frame < T(8.0) ? ramp(frame, T(4.2), T(7.6)) : 1, bold: true });
              drawLines(add, linesLike, frame, like, FIELD, { bold: true });
              // direction of the line = direction of the field
              const dir = span(frame, T(15.0), T(19.6), 10);
              if (probe && dir > 0) {
                add(probe.p[0], probe.p[1], 0, 0.5, rgb('#fff3c4'), 0.9 * dir);
                drawArrow(add, probe.p[0], probe.p[1], 0, probe.e[0], probe.e[1], 0, 1.4, '#fff3c4', dir, 0.13);
              }
              // the field is between the lines too
              const gap = at(frame, 50.2);
              if (gap > 0) {
                add(between.x, between.y, 0, 0.5, rgb('#fff3c4'), 0.9 * gap);
                drawArrow(add, between.x + 0.2, between.y, 0, eBetween[0], eBetween[1], 0, 1.5, POS, at(frame, 52.6), 0.13);
              }
            }}
          />
        </AbsoluteFill>
      }
    >
      <Cap opacity={span(frame, T(0.2), T(4.0))} kicker="Arrows at every point" title="quickly become a crowded picture" />
      <Cap opacity={span(frame, T(4.3), T(8.2))} kicker="So we draw the field the way Faraday did" title="with lines" />

      <Panel opacity={span(frame, T(8.6), T(25.4))} style={{ left: 110, top: 70 }}>
        <Kicker>Three rules</Kicker>
        <div style={{ fontSize: 44, fontWeight: 300, marginTop: 12, lineHeight: 1.45 }}>
          <div style={{ opacity: at(frame, 10.2) }}>
            A line begins on a <span style={{ color: POS }}>positive</span> charge and ends on a <span style={{ color: C.electron }}>negative</span> one
          </div>
          <div style={{ opacity: at(frame, 15.0) }}>Its direction is the direction of the field</div>
          <div style={{ opacity: at(frame, 19.5) }}>Close together: strong. Spread apart: weak.</div>
        </div>
      </Panel>

      <Cap opacity={span(frame, T(25.8), T(31.4))} kicker="A positive and a negative charge" title="The lines arc from one to the other" />
      <Cap opacity={span(frame, T(31.6), T(38.2))} kicker="Two positive charges" title="The lines swerve apart, as if the two patterns pushed on each other" />

      {/* lines never cross */}
      <Ink color="#ff6b6b" width={6} opacity={span(frame, T(40.4), T(43.8), 8)}>
        <path d="M 860 250 C 940 330, 1000 370, 1080 430 M 1080 250 C 1000 330, 940 370, 860 430" strokeDasharray="14 10" />
        <path d="M 920 290 l 100 100 m 0 -100 l -100 100" strokeWidth={9} />
      </Ink>
      <Cap opacity={span(frame, T(38.6), T(43.9))} kicker="Field lines never cross" title="At any point the field can only point one way" />

      {/* a drawing, not the thing */}
      <Ink opacity={span(frame, T(46.0), T(50.2), 10)} color="#d7e6ff" width={2.5}>
        {[1, 0.78, 0.56, 0.36, 0.18].map((k, i) => (
          <ellipse key={i} cx={1500 + i * 12} cy={220 - i * 5} rx={260 * k} ry={130 * k} />
        ))}
      </Ink>
      <Panel opacity={span(frame, T(46.0), T(50.2), 10)} style={{ left: 1190, top: 366, width: 620, textAlign: 'center', fontSize: 32, fontWeight: 300, color: C.dim }}>
        contour lines on a map of a hill
      </Panel>
      <Cap opacity={span(frame, T(44.3), T(50.2))} kicker="Remember what the lines are" title="A drawing, like the contours on a map" />
      <Cap opacity={span(frame, T(50.4), T(55.6))} kicker="The field is not only on the lines" title="It fills all of the space between them" />

      <Timeline frame={frame} already={[0, 1, 2, 3, 5, 7, 9, 10, 11]} />
    </Shell>
  );
};
