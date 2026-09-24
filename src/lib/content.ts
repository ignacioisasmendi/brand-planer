import { LOCALES, THEMES, type Locale, type Theme } from './i18n';

/**
 * A content file is a template's props plus a few render-only keys:
 *   variants: { locale?: [...], theme?: [...] }  — which combinations to render
 *   scale: 3                                     — pixel density of the PNG
 */
export interface ContentFile {
  variants?: { locale?: Locale[]; theme?: Theme[] };
  scale?: number;
  [prop: string]: unknown;
}

export function splitContent(file: ContentFile) {
  const { variants, scale, $schema, ...props } = file as ContentFile & { $schema?: string };
  const locales = variants?.locale ?? [((props.locale as Locale) ?? 'es')];
  const themes = variants?.theme ?? [((props.theme as Theme) ?? 'light')];
  for (const l of locales) if (!LOCALES.includes(l)) throw new Error(`unknown locale ${l}`);
  for (const t of themes) if (!THEMES.includes(t)) throw new Error(`unknown theme ${t}`);
  return { props, locales, themes, scale: scale ?? 1 };
}
