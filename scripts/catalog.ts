/**
 * npm run catalog — renders the thumbnails CATALOG.md shows:
 *   docs/catalog/template-<Name>.png   every template with its content/_catalog demo
 *   docs/catalog/<Name>.png            every primitive + mockup on its own (Specimen)
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { splitContent, type ContentFile } from '../src/lib/content';
import { TEMPLATES } from '../src/templates';
import { run, type Job } from './render';
import { SPECIMENS, specimenName } from '../src/catalog/specimens';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'docs/catalog');


const jobs: Job[] = [];
for (const t of TEMPLATES) {
  const file = path.join(ROOT, 'content/_catalog', `${t.file}.json`);
  const { props } = splitContent(JSON.parse(readFileSync(file, 'utf8')) as ContentFile);
  jobs.push({ id: t.id, props: { ...props, locale: 'es', theme: 'light' }, scale: 0.5, out: path.join(OUT, `template-${t.id}.png`) });
}
SPECIMENS.forEach((s, i) => {
  const { group, note, ...spec } = s;
  void group, void note;
  jobs.push({ id: 'Specimen', props: { zoom: 1, surface: 'card', ...spec }, scale: 1, out: path.join(OUT, `${specimenName(s, i)}.png`) });
});
await run(jobs);
