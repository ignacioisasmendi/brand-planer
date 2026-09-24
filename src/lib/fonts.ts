import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

/**
 * Inter (variable, 100–900) from the spa's own woff2 — never Google Fonts or a
 * system face. Geist Mono only for code / tabular numbers. Remotion's loadFont
 * holds the render until the faces are ready.
 */
export const fontsReady = Promise.all([
  loadFont({
    family: 'Inter',
    url: staticFile('fonts/InterVariable.woff2'),
    weight: '100 900',
    format: 'woff2',
  }),
  loadFont({
    family: 'Geist Mono',
    url: staticFile('fonts/GeistMonoVF.woff2'),
    weight: '100 900',
    format: 'woff2',
  }),
]);
