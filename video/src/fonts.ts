import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

// Fonts ship with the project (public/fonts) so a render never depends on the
// network. Sora for labels, STIX Two for mathematics.
const load = (family: string, file: string, weight: string, style: 'normal' | 'italic' = 'normal') =>
  loadFont({ family, url: staticFile(`fonts/${file}`), weight, style, format: 'woff2' });

for (const w of ['300', '400', '600']) load('Sora', `sora-latin-${w}-normal.woff2`, w);
for (const w of ['400', '500'])
  for (const st of ['normal', 'italic'] as const) {
    load('STIX Two', `stix-two-text-latin-${w}-${st}.woff2`, w, st);
    load('STIX Two Greek', `stix-two-text-greek-${w}-${st}.woff2`, w, st);
  }

export const sora = "'Sora', 'Helvetica Neue', Arial, sans-serif";
export const stix = "'STIX Two', 'STIX Two Greek', 'Times New Roman', serif";
