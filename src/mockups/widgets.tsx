import { TrendingDown, TrendingUp } from 'lucide-react';
import { z } from 'zod';
import { asset, platformIcon, PLATFORMS } from '../lib/asset';
import { cn } from '../lib/cn';
import { usePiece } from '../lib/context';
import { Icon } from '../lib/icon';
import { localized, tr } from '../lib/i18n';
import { FLOAT_CARD } from './ui';

export const analyticsCardSchema = z.object({
  label: localized.default({ es: 'Seguidores', en: 'Followers' }),
  value: z.string().default('+344'),
  trend: z.enum(['up', 'down', 'none']).default('up'),
  /** bars = engagement-style bars · area = growth curve · none = number only. */
  chart: z.enum(['bars', 'area', 'none']).default('area'),
  /** Bar heights in % (bars chart). */
  bars: z.array(z.number()).default([30, 45, 70, 52, 95, 62, 58]),
  /** Index of the bar drawn in primary. */
  highlight: z.number().default(4),
  width: z.number().default(160),
});

/** A floating analytics tile (release visuals' "Tasa de interacción" / "Seguidores"). */
export function AnalyticsCard(input: z.input<typeof analyticsCardSchema>) {
  const p = analyticsCardSchema.parse(input);
  const { locale } = usePiece();
  const Trend = p.trend === 'down' ? TrendingDown : TrendingUp;
  return (
    <div className={cn(FLOAT_CARD, 'rounded-xl p-3 shadow-lg')} style={{ width: p.width }}>
      <p className="text-[11px] text-muted-foreground">{tr(p.label, locale)}</p>
      <p className="mt-0.5 flex items-center gap-1 text-sm font-semibold">
        {p.value}
        {p.trend !== 'none' && <Trend className={cn('size-3.5', p.trend === 'up' ? 'text-success' : 'text-destructive')} />}
      </p>
      {p.chart === 'bars' && (
        <div className="mt-2 flex h-10 items-end gap-1.5">
          {p.bars.map((h, i) => (
            <span key={i} style={{ height: `${h}%` }} className={cn('flex-1 rounded-sm', i === p.highlight ? 'bg-primary' : 'bg-muted-foreground/20')} />
          ))}
        </div>
      )}
      {p.chart === 'area' && (
        <svg viewBox="0 0 160 60" className="mt-2 h-12 w-full text-primary" preserveAspectRatio="none">
          <path d="M0 52 C 25 50, 40 44, 60 42 C 85 40, 95 30, 115 18 C 130 9, 145 6, 160 6 L160 60 L0 60 Z" fill="currentColor" fillOpacity="0.25" />
          <path d="M0 52 C 25 50, 40 44, 60 42 C 85 40, 95 30, 115 18 C 130 9, 145 6, 160 6" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      )}
    </div>
  );
}

export const notificationToastSchema = z.object({
  /**
   * pill  — rounded chip, one line ("Jueves 29 · 11:45", "Tu lugar está guardado")
   * toast — card with title + description (sonner toast shape)
   */
  variant: z.enum(['pill', 'toast']).default('pill'),
  title: localized,
  /** Muted text after the title (pill) or below it (toast). */
  meta: localized.optional(),
  /** lucide icon name, drawn in primary… */
  icon: z.string().optional(),
  /** …or a network logo. */
  platform: z.enum(PLATFORMS).optional(),
  /** Put the icon in a tinted circle (brand soft chip). */
  iconBadge: z.boolean().default(false),
  /** Font size in px at app scale. */
  size: z.number().default(14),
});

/** Floating notification: the scheduled-slot pill, a confirmation chip, or a toast. */
export function NotificationToast(input: z.input<typeof notificationToastSchema>) {
  const p = notificationToastSchema.parse(input);
  const { locale } = usePiece();
  const s = p.size;
  const glyph = p.platform ? (
    <img src={platformIcon(p.platform)} alt="" style={{ width: s * 1.45, height: s * 1.45 }} />
  ) : p.icon ? (
    <Icon name={p.icon} className={p.iconBadge ? 'text-brand' : 'text-primary'} size={p.iconBadge ? s * 0.86 : s * 1.15} strokeWidth={p.iconBadge ? 3 : 2} />
  ) : null;
  const icon =
    glyph && p.iconBadge ? (
      <span className="flex shrink-0 items-center justify-center rounded-full bg-brand-tint-2" style={{ width: s * 1.52, height: s * 1.52 }}>
        {glyph}
      </span>
    ) : (
      glyph
    );

  if (p.variant === 'toast') {
    return (
      <div className={cn(FLOAT_CARD, 'flex items-start gap-3 rounded-xl shadow-lg')} style={{ padding: s, width: s * 24, fontSize: s }}>
        {icon}
        <div className="min-w-0 flex-1">
          <p className="leading-tight font-semibold">{tr(p.title, locale)}</p>
          {p.meta && <p className="mt-1 leading-snug text-muted-foreground" style={{ fontSize: s * 0.9 }}>{tr(p.meta, locale)}</p>}
        </div>
      </div>
    );
  }
  return (
    <div
      className={cn(FLOAT_CARD, 'flex w-fit items-center rounded-full whitespace-nowrap shadow-lg')}
      style={
        p.iconBadge
          ? { fontSize: s, gap: s * 0.57, padding: `${s * 0.67}px ${s * 1.14}px ${s * 0.67}px ${s * 0.76}px`, letterSpacing: '-0.01em' }
          : { fontSize: s, gap: s * 0.57, padding: `${s * 0.43}px ${s}px` }
      }
    >
      {icon}
      <span className={p.iconBadge ? 'font-semibold' : 'font-medium'}>{tr(p.title, locale)}</span>
      {p.meta && <span className="text-muted-foreground">{tr(p.meta, locale)}</span>}
    </div>
  );
}

export const avatarStackSchema = z.object({
  people: z
    .array(z.object({ name: z.string(), image: z.string().optional() }))
    .default([{ name: 'Ana Pérez' }, { name: 'Tomás Ruiz' }, { name: 'Lucía Gómez' }]),
  /** "+N" bubble at the end. */
  extra: z.number().optional(),
  size: z.number().default(32),
  /** Text after the stack, e.g. "3 personas editando". */
  label: localized.optional(),
});

const initials = (n: string) => n.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

/** Overlapping avatars (spa Avatar: initials on a soft primary fill when no image). */
export function AvatarStack(input: z.input<typeof avatarStackSchema>) {
  const p = avatarStackSchema.parse(input);
  const { locale } = usePiece();
  const bubble = 'flex shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 ring-card font-medium';
  return (
    <div className="flex items-center" style={{ gap: p.size * 0.35 }}>
      <div className="flex" style={{ marginLeft: p.size * 0.2 }}>
        {p.people.map((x, i) => (
          <span key={i} className={cn(bubble, 'bg-brand-tint-2 text-brand-text')} style={{ width: p.size, height: p.size, marginLeft: -p.size * 0.2, fontSize: p.size * 0.36 }}>
            {x.image ? <img src={asset(x.image)} alt="" className="h-full w-full object-cover" /> : initials(x.name)}
          </span>
        ))}
        {p.extra ? (
          <span className={cn(bubble, 'bg-muted text-muted-foreground')} style={{ width: p.size, height: p.size, marginLeft: -p.size * 0.2, fontSize: p.size * 0.34 }}>
            +{p.extra}
          </span>
        ) : null}
      </div>
      {p.label && (
        <span className="whitespace-nowrap text-muted-foreground" style={{ fontSize: p.size * 0.42 }}>
          {tr(p.label, locale)}
        </span>
      )}
    </div>
  );
}
