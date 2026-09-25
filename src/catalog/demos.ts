import type { z } from 'zod';
import { splitContent, type ContentFile } from '../lib/content';

// Bundled at build time by webpack — only usable inside the Remotion bundle.
const demos = (require as any).context('../../content/_catalog', false, /\.json$/);

/**
 * A template's demo from content/_catalog/<file>.json, parsed through its schema
 * so every `.default()` is filled (Studio's props editor needs complete objects).
 */
export function demoFor(file: string, schema: z.AnyZodObject): Record<string, unknown> {
  const key = `./${file}.json`;
  const raw = demos.keys().includes(key) ? splitContent(demos(key) as ContentFile).props : {};
  return schema.parse(raw);
}
