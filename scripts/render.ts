/**
 * npm run render -- content/<folder> [more folders or single .json files]
 *
 * Renders every content JSON to out/<folder>/<file>-<locale>-<theme>.png.
 * The file name picks the template (email-banner.json → EmailBanner;
 * ig-carousel-slide-02.json → IgCarouselSlide). Props are validated against
 * the template's zod schema before anything is rendered.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bundle } from '@remotion/bundler';
import { openBrowser, renderStill, selectComposition } from '@remotion/renderer';
import { webpackOverride } from '../src/bundler-override';
import { splitContent, type ContentFile } from '../src/lib/content';
import { templateForFile } from '../src/templates';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Keep bundles out of the system /tmp, and clean them up after each run.
const TMP = path.join(ROOT, '.cache/tmp');
mkdirSync(TMP, { recursive: true });
process.env.TMPDIR = TMP;

export interface Job {
  id: string;
  props: Record<string, unknown>;
  out: string;
  scale: number;
}

export function jobsFor(target: string): Job[] {
  const abs = path.resolve(ROOT, target);
  const files = statSync(abs).isDirectory()
    ? readdirSync(abs).filter((f) => f.endsWith('.json')).map((f) => path.join(abs, f))
    : [abs];
  const folder = path.relative(path.join(ROOT, 'content'), statSync(abs).isDirectory() ? abs : path.dirname(abs));
  const jobs: Job[] = [];
  for (const file of files.sort()) {
    const name = path.basename(file, '.json');
    const tpl = templateForFile(name);
    if (!tpl) throw new Error(`${path.relative(ROOT, file)}: no template matches "${name}" — expected one of release-hero, ig-post, ig-carousel-slide, ig-story, linkedin-post, email-banner, og-image`);
    const { props, locales, themes, scale } = splitContent(JSON.parse(readFileSync(file, 'utf8')) as ContentFile);
    for (const locale of locales) {
      for (const theme of themes) {
        const full = { ...props, locale, theme };
        const check = tpl.schema.safeParse(full);
        if (!check.success) {
          const msg = check.error.issues.map((i) => `  ${i.path.join('.')}: ${i.message}`).join('\n');
          throw new Error(`${path.relative(ROOT, file)} is not a valid ${tpl.id}:\n${msg}`);
        }
        jobs.push({ id: tpl.id, props: full, scale, out: path.join(ROOT, 'out', folder, `${name}-${locale}-${theme}.png`) });
      }
    }
  }
  return jobs;
}

export async function run(jobs: Job[]) {
  const serveUrl = await bundle({
    entryPoint: path.join(ROOT, 'src/index.ts'),
    webpackOverride,
    publicDir: path.join(ROOT, 'public'),
  });
  const browser = await openBrowser('chrome');
  try {
    for (const job of jobs) {
      const composition = await selectComposition({ serveUrl, id: job.id, inputProps: job.props, puppeteerInstance: browser });
      mkdirSync(path.dirname(job.out), { recursive: true });
      await renderStill({
        composition,
        serveUrl,
        output: job.out,
        inputProps: job.props,
        scale: job.scale,
        imageFormat: 'png',
        puppeteerInstance: browser,
      });
      console.log(`✓ ${path.relative(ROOT, job.out)}  (${composition.width * job.scale}×${composition.height * job.scale})`);
    }
  } finally {
    await browser.close({ silent: true });
    rmSync(serveUrl, { recursive: true, force: true });
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const targets = process.argv.slice(2);
  if (!targets.length) {
    console.error('usage: npm run render -- content/<folder> [...]');
    process.exit(1);
  }
  for (const t of targets) if (!existsSync(path.resolve(ROOT, t))) throw new Error(`not found: ${t}`);
  const jobs = targets.flatMap(jobsFor);
  await run(jobs);
}
