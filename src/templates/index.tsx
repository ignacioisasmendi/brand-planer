/**
 * One template per format. Each is a <Still> with a zod schema; all accept
 * `theme` (light|dark) and `locale` (es|en). Sizes and type scales live here;
 * layout lives in ./layouts.
 */
import type { ComponentType } from 'react';
import { z } from 'zod';
import { baseProps, localized, tr } from '../lib/i18n';
import { Icon } from '../lib/icon';
import { IntegrationHandoff, IntegrationTiles, integrationTilesSchema } from '../primitives';
import { Piece, PosterLayout, posterSchema, SplitLayout, splitSchema, type CopyScale } from './layouts';

// ── split (landscape) ───────────────────────────────────────────────────────

const RELEASE_SCALE: CopyScale = {
  // The spa ReleaseScreen's `fixed` layout (44px headline, size-9 logos…)
  // blown up ×1.47 to a 1600×900 frame, as the original exports were.
  brand: 53, pill: 17.5, headline: 65, bigStat: 180, body: 29, cta: 24, pillDensity: 'compact',
  space: { brand: 23.5, pill: 17.5, body: 23.5, cta: 35 },
};
export const releaseHeroSchema = splitSchema;
export function ReleaseHero(props: z.input<typeof releaseHeroSchema>) {
  return <SplitLayout props={releaseHeroSchema.parse(props)} width={1600} height={900} stageWidth={800} padX={74} scale={RELEASE_SCALE} />;
}

const EMAIL_SCALE: CopyScale = {
  brand: 46, pill: 17, headline: 62, bigStat: 190, body: 30, cta: 24,
  space: { brand: 34, pill: 18, body: 24, cta: 30 },
};
export const emailBannerSchema = splitSchema;
export function EmailBanner(props: z.input<typeof emailBannerSchema>) {
  return <SplitLayout props={emailBannerSchema.parse(props)} width={1200} height={600} stageWidth={540} padX={64} scale={EMAIL_SCALE} />;
}

const LINKEDIN_SCALE: CopyScale = {
  brand: 42, pill: 15, headline: 56, bigStat: 170, body: 25, cta: 22,
  space: { brand: 30, pill: 16, body: 20, cta: 28 },
};
export const linkedInPostSchema = splitSchema;
export function LinkedInPost(props: z.input<typeof linkedInPostSchema>) {
  return <SplitLayout props={linkedInPostSchema.parse(props)} width={1200} height={627} stageWidth={560} padX={64} scale={LINKEDIN_SCALE} />;
}

export const ogImageSchema = splitSchema;
export function OgImage(props: z.input<typeof ogImageSchema>) {
  return <SplitLayout props={ogImageSchema.parse(props)} width={1200} height={630} stageWidth={520} padX={64} scale={LINKEDIN_SCALE} />;
}

// ── poster (social) ─────────────────────────────────────────────────────────

const POST_SCALE: CopyScale = {
  brand: 56, pill: 22, headline: 84, bigStat: 240, body: 34, cta: 32,
  space: { brand: 44, pill: 24, body: 24, cta: 40 },
};
export const igPostSchema = posterSchema;
export function IgPost(props: z.input<typeof igPostSchema>) {
  return <PosterLayout props={igPostSchema.parse(props)} pad={88} scale={POST_SCALE} />;
}

export const igCarouselSlideSchema = posterSchema.extend({
  /** 1-based slide number and total, drawn as "02 / 05". */
  slide: z.number().default(1),
  total: z.number().default(5),
  /** "Deslizá →" hint at the bottom-right; hidden on the last slide. */
  swipeHint: localized.optional(),
});
function SlideChrome({ slide, total, hint }: { slide: number; total: number; hint?: string }) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <>
      <div className="absolute font-semibold text-muted-foreground tabular-nums" style={{ top: 88, right: 88, fontSize: 24, letterSpacing: '0.08em' }}>
        {pad(slide)} / {pad(total)}
      </div>
      {hint && slide < total && (
        <div className="absolute flex items-center gap-2 font-semibold text-brand-text" style={{ bottom: 80, right: 88, fontSize: 26 }}>
          {hint} <Icon name="ArrowRight" size={28} strokeWidth={2.4} />
        </div>
      )}
    </>
  );
}
export function IgCarouselSlide(props: z.input<typeof igCarouselSlideSchema>) {
  const p = igCarouselSlideSchema.parse(props);
  return (
    <PosterLayout
      props={p}
      pad={88}
      scale={POST_SCALE}
      extra={<SlideChrome slide={p.slide} total={p.total} hint={p.swipeHint ? tr(p.swipeHint, p.locale) : undefined} />}
    />
  );
}

const STORY_SCALE: CopyScale = {
  brand: 64, pill: 26, headline: 104, bigStat: 300, body: 40, cta: 38,
  space: { brand: 52, pill: 28, body: 30, cta: 48 },
};
export const igStorySchema = posterSchema;
export function IgStory(props: z.input<typeof igStorySchema>) {
  // Keep copy clear of Instagram's own chrome: ~250px top, ~340px bottom.
  return <PosterLayout props={igStorySchema.parse(props)} pad={96} safeTop={160} safeBottom={240} scale={STORY_SCALE} />;
}

// ── card (no copy) ──────────────────────────────────────────────────────────

export const integrationCardSchema = z.object({
  ...baseProps,
  /** tiles = two tiles joined by a badge (soft tint) · handoff = tilted chips linked by a hand-drawn curl (strong tint). */
  layout: z.enum(['tiles', 'handoff']).default('tiles'),
  ...integrationTilesSchema.omit({ size: true, panel: true }).shape,
});
/** "Planer ✓ Partner" card for integrations directories and the landing: tinted panel on the page surface. */
export function IntegrationCard(props: z.input<typeof integrationCardSchema>) {
  const { theme, locale, layout, left, right, icon } = integrationCardSchema.parse(props);
  return (
    <Piece theme={theme} locale={locale}>
      <div className="absolute inset-0 flex items-center justify-center bg-background">
        {layout === 'tiles' ? (
          <IntegrationTiles left={left} right={right} icon={icon} size={400} />
        ) : (
          <IntegrationHandoff from={left} to={right} width={1120} />
        )}
      </div>
    </Piece>
  );
}

// ── registry ────────────────────────────────────────────────────────────────

export interface TemplateDef {
  id: string;
  /** Content file name (kebab) that maps to this template: content/<piece>/<file>.json */
  file: string;
  width: number;
  height: number;
  schema: z.AnyZodObject;
  component: ComponentType<any>;
}

export const TEMPLATES: TemplateDef[] = [
  { id: 'ReleaseHero', file: 'release-hero', width: 1600, height: 900, schema: releaseHeroSchema, component: ReleaseHero },
  { id: 'IgPost', file: 'ig-post', width: 1080, height: 1080, schema: igPostSchema, component: IgPost },
  { id: 'IgCarouselSlide', file: 'ig-carousel-slide', width: 1080, height: 1350, schema: igCarouselSlideSchema, component: IgCarouselSlide },
  { id: 'IgStory', file: 'ig-story', width: 1080, height: 1920, schema: igStorySchema, component: IgStory },
  { id: 'LinkedInPost', file: 'linkedin-post', width: 1200, height: 627, schema: linkedInPostSchema, component: LinkedInPost },
  { id: 'EmailBanner', file: 'email-banner', width: 1200, height: 600, schema: emailBannerSchema, component: EmailBanner },
  { id: 'OgImage', file: 'og-image', width: 1200, height: 630, schema: ogImageSchema, component: OgImage },
  { id: 'IntegrationCard', file: 'integration-card', width: 1200, height: 750, schema: integrationCardSchema, component: IntegrationCard },
];

/** `ig-post.json`, `ig-carousel-slide-02.json` → template (suffixes allow several per folder). */
export function templateForFile(name: string): TemplateDef | undefined {
  const base = name.replace(/\.json$/, '');
  return [...TEMPLATES].sort((a, b) => b.file.length - a.file.length).find((t) => base === t.file || base.startsWith(`${t.file}-`) || base.startsWith(`${t.file}.`));
}
