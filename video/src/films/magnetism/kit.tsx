import { Timeline as BaseTimeline } from '../charge/kit';

// Pieces shared by every chapter of "The Second Field" (magnetism).
export { at, Cap, Ink, shot } from '../charge/kit';
export { EndCard, GOLD } from '../capacitance/kit';
export const VOICE = (n: number) => `magnetism/ch${n}`;

export const TIMELINE = [
  { year: '600 BC', name: 'Magnesia' },
  { year: '1088', name: 'Shen Kuo' },
  { year: '1269', name: 'Peregrinus' },
  { year: '1600', name: 'Gilbert' },
  { year: '1820', name: 'Oersted' },
  { year: '1820', name: 'Ampère' },
  { year: '1825', name: 'Sturgeon' },
  { year: '1831', name: 'Henry' },
  { year: '1832', name: 'Gauss' },
  { year: '1895', name: 'Curie' },
  { year: '1907', name: 'Weiss' },
  { year: '1960', name: 'The tesla' },
] as const;

export const Timeline = (props: { frame: number; already: number[]; events?: [number, number][]; opacity?: number }) => <BaseTimeline {...props} entries={TIMELINE} />;
