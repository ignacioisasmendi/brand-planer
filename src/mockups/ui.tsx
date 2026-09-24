/**
 * Small UI atoms copied (styles only) from the spa so mockups read as the real
 * product: components/ui/badge.tsx and design-system/composites/post-status-badge.tsx.
 */
import type { ReactNode } from 'react';
import { Check } from 'lucide-react';
import { z } from 'zod';
import { cn } from '../lib/cn';
import type { Locale } from '../lib/i18n';

const BADGE =
  'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 overflow-hidden';
const BADGE_VARIANT = {
  default: 'border-transparent bg-primary text-primary-foreground',
  secondary: 'border-transparent bg-secondary text-secondary-foreground',
  destructive: 'border-transparent bg-destructive text-white dark:bg-destructive/60',
  outline: 'text-foreground',
};

export function Badge({
  variant = 'default',
  className,
  children,
}: {
  variant?: keyof typeof BADGE_VARIANT;
  className?: string;
  children: ReactNode;
}) {
  return <span className={cn(BADGE, BADGE_VARIANT[variant], className)}>{children}</span>;
}

export const postStatus = z.enum(['draft', 'scheduled', 'published', 'paused', 'manual', 'error']);
export type PostStatus = z.infer<typeof postStatus>;

const STATUS: Record<PostStatus, { className: string; label: Record<Locale, string> }> = {
  draft: { className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200', label: { es: 'Borrador', en: 'Draft' } },
  scheduled: { className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200', label: { es: 'Programado', en: 'Scheduled' } },
  published: { className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200', label: { es: 'Publicado', en: 'Published' } },
  paused: { className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200', label: { es: 'Pausado', en: 'Paused' } },
  manual: { className: 'gap-1 bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-200', label: { es: 'Manual', en: 'Manual' } },
  error: { className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200', label: { es: 'Error', en: 'Error' } },
};

export function StatusBadge({ status, locale }: { status: PostStatus; locale: Locale }) {
  const s = STATUS[status];
  return <Badge className={cn('h-5 border-transparent text-[10px] font-medium', s.className)}>{s.label[locale]}</Badge>;
}

export function ApprovedBadge({ locale }: { locale: Locale }) {
  return (
    <Badge className="h-5 gap-0.5 border-transparent bg-green-100 px-1.5 text-[10px] font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
      <Check className="h-2.5 w-2.5" />
      {locale === 'en' ? 'Approved' : 'Aprobado'}
    </Badge>
  );
}

export const postFormat = z.enum(['post', 'feed', 'story', 'reel', 'carousel']);
export type PostFormat = z.infer<typeof postFormat>;
const FORMAT: Record<PostFormat, Record<Locale, string>> = {
  post: { es: 'Publicación', en: 'Post' },
  feed: { es: 'Feed', en: 'Feed' },
  story: { es: 'Historia', en: 'Story' },
  reel: { es: 'Reel', en: 'Reel' },
  carousel: { es: 'Carrusel', en: 'Carousel' },
};

export function FormatBadge({ format, locale }: { format: PostFormat; locale: Locale }) {
  return (
    <Badge variant="secondary" className="h-5 text-[10px] font-medium">
      {FORMAT[format][locale]}
    </Badge>
  );
}

/** Card surface used by floating mockups (the release visuals' `border-border/60 bg-card`). */
export const FLOAT_CARD = 'border border-border/60 bg-card text-card-foreground';
