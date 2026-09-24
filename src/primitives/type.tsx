import { z } from 'zod';
import { usePiece } from '../lib/context';
import { localized, tr } from '../lib/i18n';
import { rich } from '../lib/rich';
import { cn } from '../lib/cn';
import { Icon } from '../lib/icon';

const tone = z.enum(['brand', 'muted', 'outline', 'solid']);

export const pillSchema = z.object({
  label: localized,
  /** brand = tinted violet (default) · muted · outline · solid (filled brand). */
  tone: tone.default('brand'),
  /** Font size in px; padding scales with it. */
  size: z.number().default(16),
  icon: z.string().optional(),
  density: z.enum(['regular', 'compact']).optional(),
});

const PILL_TONE: Record<z.infer<typeof tone>, string> = {
  brand: 'bg-brand-tint-2 text-brand-text',
  muted: 'bg-muted text-muted-foreground',
  outline: 'border bg-card text-foreground',
  solid: 'bg-brand text-white',
};

/** Uppercase, tracked label in a rounded capsule ("NUEVO", "SOLO LISTA DE ESPERA"). */
export function Pill({ label, tone = 'brand', size = 16, icon, density = 'regular' }: z.input<typeof pillSchema>) {
  const { locale } = usePiece();
  return (
    <span
      className={cn('inline-flex w-fit items-center rounded-full font-semibold uppercase', PILL_TONE[tone])}
      style={{
        fontSize: size,
        letterSpacing: density === 'compact' ? '0.12em' : '0.14em',
        padding: density === 'compact' ? `${size / 3}px ${size}px` : `${size * 0.55}px ${size * 1.15}px`,
        gap: size * 0.5,
        lineHeight: 1,
      }}
    >
      {icon && <Icon name={icon} size={size * 1.05} strokeWidth={2.4} />}
      {tr(label, locale)}
    </span>
  );
}

export const eyebrowSchema = z.object({
  label: localized,
  size: z.number().default(14),
  tone: z.enum(['brand', 'muted']).default('brand'),
});

/** Small uppercase kicker above a title. */
export function Eyebrow({ label, size = 14, tone = 'brand' }: z.input<typeof eyebrowSchema>) {
  const { locale } = usePiece();
  return (
    <span
      className={cn('block font-semibold uppercase', tone === 'brand' ? 'text-brand-text' : 'text-muted-foreground')}
      style={{ fontSize: size, letterSpacing: '0.2em', lineHeight: 1.2 }}
    >
      {tr(label, locale)}
    </span>
  );
}

export const headlineSchema = z.object({
  /** Supports **bold**, [[brand accent]] and \n. */
  text: localized,
  size: z.number().default(88),
  weight: z.number().default(800),
  align: z.enum(['left', 'center']).default('left'),
});

/** Display headline — Inter extra-bold, tight tracking like the release screen. */
export function Headline({ text, size = 88, weight = 800, align = 'left' }: z.input<typeof headlineSchema>) {
  const { locale } = usePiece();
  return (
    <h1
      className="m-0 text-foreground"
      style={{
        fontSize: size,
        fontWeight: weight,
        letterSpacing: '-0.025em', // the spa's tracking-tight
        lineHeight: 1.05,
        textAlign: align,
        textWrap: 'balance',
      }}
    >
      {rich(tr(text, locale))}
    </h1>
  );
}

export const subheadSchema = z.object({
  /** Supports **bold** (foreground), [[brand]] and \n. */
  text: localized,
  size: z.number().default(32),
  align: z.enum(['left', 'center']).default('left'),
});

/** Supporting paragraph in the muted foreground. */
export function Subhead({ text, size = 32, align = 'left' }: z.input<typeof subheadSchema>) {
  const { locale } = usePiece();
  return (
    <p
      className="m-0 text-muted-foreground"
      style={{ fontSize: size, lineHeight: 1.36, letterSpacing: '-0.01em', textAlign: align, textWrap: 'pretty' }}
    >
      {rich(tr(text, locale))}
    </p>
  );
}

export const bigStatSchema = z.object({
  /** The number, e.g. "30%". */
  value: localized,
  /** Raised brand-coloured suffix, e.g. "OFF". */
  suffix: localized.optional(),
  size: z.number().default(190),
});

/** Oversized figure with a superscript suffix — the "30% OFF" headline. */
export function BigStat({ value, suffix, size = 190 }: z.input<typeof bigStatSchema>) {
  const { locale } = usePiece();
  return (
    <div className="flex items-start text-foreground" style={{ lineHeight: 0.9, fontWeight: 820 }}>
      <span style={{ fontSize: size, letterSpacing: '-0.055em' }}>{tr(value, locale)}</span>
      {suffix && (
        <span
          className="text-brand"
          style={{ fontSize: size * 0.34, letterSpacing: '-0.03em', marginTop: size * 0.126, marginLeft: -2 }}
        >
          {tr(suffix, locale)}
        </span>
      )}
    </div>
  );
}

export const ctaSchema = z.object({
  label: localized,
  variant: z.enum(['brand', 'outline', 'foreground']).default('brand'),
  size: z.number().default(24),
  /** Trailing lucide icon; "none" to drop it. */
  icon: z.string().default('ArrowRight'),
});

const CTA_VARIANT = {
  brand: 'bg-brand text-white',
  outline: 'border-2 bg-card text-foreground',
  foreground: 'bg-foreground text-background',
};

/** Call-to-action button (Button's shape, scaled for artwork). */
export function Cta({ label, variant = 'brand', size = 24, icon = 'ArrowRight' }: z.input<typeof ctaSchema>) {
  const { locale } = usePiece();
  return (
    <span
      className={cn('inline-flex w-fit items-center font-semibold', CTA_VARIANT[variant])}
      style={{
        fontSize: size,
        gap: size * 0.45,
        padding: `${size * 0.7}px ${size * 1.25}px`,
        borderRadius: size * 0.55,
        letterSpacing: '-0.01em',
        lineHeight: 1,
      }}
    >
      {tr(label, locale)}
      {icon !== 'none' && <Icon name={icon} size={size * 1.05} strokeWidth={2.4} />}
    </span>
  );
}
