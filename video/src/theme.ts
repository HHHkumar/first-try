// One palette for the whole film: copper warmth for the lattice, cold light for
// the electrons, deep blue-black space between them.
export const C = {
  bg0: '#03060d',
  bg1: '#0a1428',
  ion: '#ff8f4a',
  ionHot: '#ffc04d',
  ionDeep: '#7a2c0c',
  electron: '#6fe3ff',
  electronCore: '#f1fdff',
  field: '#b7a2ff',
  text: '#f2f5fb',
  dim: '#93a3c0',
  rho: '#ffb36b',
  shape: '#7fe7ff',
} as const;

export const hexToRgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

export const FPS = 30;
export const W = 1920;
export const H = 1080;
