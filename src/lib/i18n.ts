import { z } from 'zod';

export const LOCALES = ['es', 'en'] as const;
export const THEMES = ['light', 'dark'] as const;
export type Locale = (typeof LOCALES)[number];
export type Theme = (typeof THEMES)[number];

/**
 * A piece of copy: either one string (same in every locale) or one per
 * locale. Content JSON uses the object form for bilingual pieces.
 */
export const localized = z.union([z.string(), z.object({ es: z.string(), en: z.string() })]);
export type Localized = z.infer<typeof localized>;

export function tr(value: Localized | undefined, locale: Locale): string {
  if (value === undefined) return '';
  return typeof value === 'string' ? value : value[locale] ?? value.es;
}

/** Fields every template accepts. */
export const baseProps = {
  theme: z.enum(THEMES).default('light'),
  locale: z.enum(LOCALES).default('es'),
};
