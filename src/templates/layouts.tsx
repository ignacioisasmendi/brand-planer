/**
 * The two layout families every template is built from:
 *   SplitLayout  — copy column + brand stage side by side (landscape formats)
 *   PosterLayout — full-bleed background, copy block + free layers (social formats)
 * Templates are thin: a size, a type scale and defaults on top of these.
 */
import type { ReactNode } from 'react';
import { AbsoluteFill } from 'remotion';
import { z } from 'zod';
import { PieceProvider } from '../lib/context';
import { baseProps, localized, tr, type Locale, type Theme } from '../lib/i18n';
import { cn } from '../lib/cn';
import {
  Background,
  backgroundSchema,
  BigStat,
  bigStatSchema,
  Cta,
  ctaSchema,
  Eyebrow,
  Headline,
  Logo,
  LogoLockup,
  Pill,
  pillSchema,
  Subhead,
  Wordmark,
} from '../primitives';
import { PLATFORMS } from '../lib/asset';
import { Layers, layersSchema } from './stage';

// ── shared schema pieces ─────────────────────────────────────────────────────

export const copyFields = {
  /** Brand header above the copy. lockup = Planer ⇄ partner (release style). */
  brand: z.enum(['wordmark', 'lockup', 'logo', 'none']).default('wordmark'),
  partner: z.object({ platform: z.enum(PLATFORMS).optional(), icon: z.string().optional() }).optional(),
  pill: pillSchema.partial({ tone: true, size: true }).optional(),
  eyebrow: localized.optional(),
  /** Supports **bold**, [[brand accent]] and \n. */
  headline: localized.optional(),
  /** Oversized number headline ("30%" + "OFF"); replaces `headline`. */
  bigStat: bigStatSchema.partial({ size: true }).optional(),
  body: localized.optional(),
  cta: ctaSchema.partial({ variant: true, size: true, icon: true }).optional(),
  /** Override the template's headline size (px) when copy runs long. */
  headlineSize: z.number().optional(),
  bodySize: z.number().optional(),
};

export const stageSchema = z
  .object({
    background: backgroundSchema.partial().default({ variant: 'gradient' }),
    /**
     * Optional design canvas the layers are laid out on; it is scaled to fit
     * the stage (like the spa's ScaledCanvas). Without it, layer x/y are stage px.
     */
    canvas: z.object({ width: z.number(), height: z.number() }).optional(),
    layers: layersSchema,
  })
  .default({});

export const pieceBase = { ...baseProps, ...copyFields };

export type CopyScale = {
  brand: number;
  pill: number;
  headline: number;
  bigStat: number;
  body: number;
  cta: number;
  /** Pill padding: regular (campaign capsule) or compact (the spa's badge, px-3 py-1). */
  pillDensity?: 'regular' | 'compact';
  /** Vertical rhythm in px: after the brand header, after pill/eyebrow, before body, before CTA. */
  space: { brand: number; pill: number; body: number; cta: number };
};

type CopyProps = z.input<z.ZodObject<typeof copyFields>>;

// ── building blocks ─────────────────────────────────────────────────────────

export function Piece({ theme, locale, children }: { theme: Theme; locale: Locale; children: ReactNode }) {
  return (
    <PieceProvider theme={theme} locale={locale}>
      <AbsoluteFill className={cn(theme === 'dark' && 'dark')} style={{ fontFamily: 'Inter' }}>
        {/* A `.dark` element's own variables apply to itself, so the surface flips too. */}
        <AbsoluteFill
          className="bg-card text-foreground"
          style={{
            fontFamily: 'Helvetica'
          }}
        >{children}</AbsoluteFill>
      </AbsoluteFill>
    </PieceProvider>
  );
}

export function CopyBlock({
  copy,
  scale,
  locale,
  align = 'left',
}: {
  copy: CopyProps;
  scale: CopyScale;
  locale: Locale;
  align?: 'left' | 'center';
}) {
  const s = scale;
  const brand = copy.brand ?? 'wordmark';
  return (
    <div className={cn('flex flex-col', align === 'center' ? 'items-center text-center' : 'items-start')}>
      {brand === 'wordmark' && (
        <div style={{ marginBottom: s.space.brand }}>
          <Wordmark size={s.brand} />
        </div>
      )}
      {brand === 'logo' && (
        <div style={{ marginBottom: s.space.brand }}>
          <Logo size={s.brand} />
        </div>
      )}
      {brand === 'lockup' && (
        <div style={{ marginBottom: s.space.brand }}>
          <LogoLockup size={s.brand} platform={copy.partner?.platform} icon={copy.partner?.icon} />
        </div>
      )}
      {copy.pill && (
        <div style={{ marginBottom: s.space.pill }}>
          <Pill size={s.pill} {...copy.pill} density={copy.pill.density ?? s.pillDensity} />
        </div>
      )}
      {copy.eyebrow && (
        <div style={{ marginBottom: s.space.pill }}>
          <Eyebrow label={copy.eyebrow} size={s.pill} />
        </div>
      )}
      {copy.bigStat ? (
        <BigStat size={s.bigStat} {...copy.bigStat} />
      ) : copy.headline ? (
        <Headline text={copy.headline} size={copy.headlineSize ?? s.headline} align={align} />
      ) : null}
      {copy.body && (
        <div style={{ marginTop: s.space.body }}>
          <Subhead text={copy.body} size={copy.bodySize ?? s.body} align={align} />
        </div>
      )}
      {copy.cta && (
        <div style={{ marginTop: s.space.cta }}>
          <Cta size={s.cta} {...copy.cta} label={tr(copy.cta.label, locale)} />
        </div>
      )}
    </div>
  );
}

function Stage({ stage, width, height }: { stage: z.output<typeof stageSchema>; width: number; height: number }) {
  const c = stage.canvas;
  const k = c ? Math.min(width / c.width, height / c.height) : 1;
  return (
    <div className="relative overflow-hidden" style={{ width, height }}>
      <Background {...stage.background} />
      {c ? (
        <div
          className="absolute"
          style={{
            width: c.width,
            height: c.height,
            // CSS zoom also scales the element's own offsets, so divide them back.
            left: (width - c.width * k) / 2 / k,
            top: (height - c.height * k) / 2 / k,
            zoom: k,
          }}
        >
          <Layers layers={stage.layers} />
        </div>
      ) : (
        <Layers layers={stage.layers} />
      )}
    </div>
  );
}

// ── SplitLayout ─────────────────────────────────────────────────────────────

export const splitFields = {
  ...pieceBase,
  stage: stageSchema,
  /** Stage width in px (the copy column takes the rest). */
  stageWidth: z.number().optional(),
  /** Copy column background. */
  copyBackground: backgroundSchema.partial().default({ variant: 'flat' }),
};
export const splitSchema = z.object(splitFields);

export function SplitLayout({
  props,
  width,
  height,
  stageWidth,
  padX,
  scale,
}: {
  props: z.output<typeof splitSchema>;
  width: number;
  height: number;
  stageWidth: number;
  padX: number;
  scale: CopyScale;
}) {
  const sw = props.stageWidth ?? stageWidth;
  return (
    <Piece theme={props.theme} locale={props.locale}>
      <div className="relative flex h-full w-full">
        <div className="relative flex h-full flex-col justify-center" style={{ width: width - sw, paddingLeft: padX, paddingRight: padX * 0.6 }}>
          <Background {...props.copyBackground} />
          <div className="relative">
            <CopyBlock copy={props} scale={scale} locale={props.locale} />
          </div>
        </div>
        <Stage stage={props.stage} width={sw} height={height} />
      </div>
    </Piece>
  );
}

// ── PosterLayout ────────────────────────────────────────────────────────────

export const posterFields = {
  ...pieceBase,
  background: backgroundSchema.partial().default({ variant: 'glow' }),
  /** Where the copy block sits; layers are free on the whole canvas. */
  copyPosition: z.enum(['top', 'center', 'bottom']).default('top'),
  align: z.enum(['left', 'center']).default('left'),
  layers: layersSchema,
  /** Small text at the bottom-right (e.g. "planer.com.ar"). */
  footer: localized.optional(),
};
export const posterSchema = z.object(posterFields);

export function PosterLayout({
  props,
  pad,
  safeTop = 0,
  safeBottom = 0,
  scale,
  extra,
}: {
  props: z.output<typeof posterSchema>;
  pad: number;
  safeTop?: number;
  safeBottom?: number;
  scale: CopyScale;
  extra?: ReactNode;
}) {
  const justify = { top: 'justify-start', center: 'justify-center', bottom: 'justify-end' }[props.copyPosition];
  return (
    <Piece theme={props.theme} locale={props.locale}>
      <Background {...props.background} />
      <Layers layers={props.layers} />
      <div
        className={cn('absolute inset-0 flex flex-col', justify)}
        style={{ padding: pad, paddingTop: pad + safeTop, paddingBottom: pad + safeBottom }}
      >
        <CopyBlock copy={props} scale={scale} locale={props.locale} align={props.align} />
      </div>
      {props.footer && (
        <div className="absolute font-medium text-muted-foreground" style={{ right: pad, bottom: pad * 0.6 + safeBottom, fontSize: scale.pill * 1.1 }}>
          {tr(props.footer, props.locale)}
        </div>
      )}
      {extra}
    </Piece>
  );
}
