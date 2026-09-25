/**
 * npm run sheet — every component on one page, named:
 *   docs/catalog/sheet-light.png, docs/catalog/sheet-dark.png
 * (Also live in Studio: Catalog → ComponentSheet.)
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { run } from './render';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const themes = process.argv.includes('--dark-only') ? ['dark'] : process.argv.includes('--light-only') ? ['light'] : ['light', 'dark'];

await run(
  themes.map((theme) => ({
    id: 'ComponentSheet',
    props: { theme },
    scale: 1,
    out: path.join(ROOT, 'docs/catalog', `sheet-${theme}.png`),
  })),
);
