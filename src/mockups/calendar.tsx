import { CalendarDays, Clock, GripVertical, MoreHorizontal, Plus, SquareCheck } from 'lucide-react';
import { z } from 'zod';
import { asset, platformIcon, PLATFORMS } from '../lib/asset';
import { cn } from '../lib/cn';
import { usePiece } from '../lib/context';
import { localized, tr, type Locale } from '../lib/i18n';
import { ApprovedBadge, Badge, FormatBadge, postFormat, postStatus, StatusBadge } from './ui';

const TINTS = {
  violet: 'bg-gradient-to-br from-violet-400 to-fuchsia-300',
  amber: 'bg-gradient-to-br from-amber-300 to-orange-400',
  teal: 'bg-gradient-to-br from-teal-300 to-cyan-500',
  rose: 'bg-gradient-to-br from-rose-300 to-pink-500',
  slate: 'bg-gradient-to-br from-slate-300 to-slate-500',
  lime: 'bg-gradient-to-br from-lime-300 to-emerald-400',
};

export const publicationCardSchema = z.object({
  caption: localized,
  time: z.string().default('18:30'),
  platform: z.enum(PLATFORMS).default('instagram'),
  format: postFormat.default('post'),
  status: postStatus.default('scheduled'),
  approved: z.boolean().default(false),
  /** Thumbnail under public/; falls back to a gradient `tint`. */
  image: z.string().optional(),
  tint: z.enum(['violet', 'amber', 'teal', 'rose', 'slate', 'lime']).default('violet'),
  /** Card width in px (app scale). */
  width: z.number().default(220),
  /** Hide the caption/badges row, e.g. inside narrow calendar columns. */
  compactFooter: z.boolean().default(false),
});
export type PublicationCardProps = z.input<typeof publicationCardSchema>;

/** Status → border colour, copied from the spa's post-card.tsx. */
const BORDER: Record<string, string> = {
  scheduled: 'border-primary/20',
  published: 'border-[color:var(--success)]/20',
  manual: 'border-violet-400/40',
};

/** A scheduled post as it appears in Planer's calendar (spa `WeekContentCard`). */
export function PublicationCard(input: PublicationCardProps) {
  const p = publicationCardSchema.parse(input);
  const { locale } = usePiece();
  return (
    <div
      className={cn('flex flex-col gap-2 rounded-lg border bg-card p-3 text-left text-card-foreground', BORDER[p.status] ?? 'border-border')}
      style={{ width: p.width }}
    >
      <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-md bg-muted">
        {p.image ? (
          <img src={asset(p.image)} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className={cn('h-full w-full', TINTS[p.tint])} />
        )}
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-gradient-to-t from-black/60 to-transparent px-2 pt-4 pb-1.5">
          <Clock className="h-2.5 w-2.5 text-white/80" />
          <span className="text-[10px] font-medium text-white">{p.time}</span>
        </div>
      </div>
      <p className={cn('text-foreground', p.compactFooter ? 'line-clamp-2 text-xs leading-tight' : 'line-clamp-2 text-sm')}>
        {tr(p.caption, locale)}
      </p>
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5">
          <img src={platformIcon(p.platform)} alt="" className="h-4 w-4 shrink-0 rounded object-contain" />
          {!p.compactFooter && <FormatBadge format={p.format} locale={locale} />}
        </div>
        <div className="flex items-center gap-1.5">
          <StatusBadge status={p.status} locale={locale} />
          {p.approved && <ApprovedBadge locale={locale} />}
        </div>
      </div>
    </div>
  );
}

const WEEKDAYS: Record<Locale, string[]> = {
  es: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
  en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
};

export const calendarWeekSchema = z.object({
  /** Day-of-month of the Monday. */
  startDay: z.number().default(3),
  /** Day-of-month highlighted as today. */
  today: z.number().default(4),
  /** Posts, by day-of-month. */
  posts: z
    .array(publicationCardSchema.omit({ width: true, compactFooter: true }).extend({ day: z.number() }))
    .default([]),
  /** How many columns to draw (7 = full week; 3–5 for tight crops). */
  days: z.number().min(1).max(7).default(7),
  columnWidth: z.number().default(150),
  height: z.number().default(420),
});

/** Planer's week view (spa calendar/week-view.tsx): day headers + post cards per column. */
export function CalendarWeek(input: z.input<typeof calendarWeekSchema>) {
  const p = calendarWeekSchema.parse(input);
  const { locale } = usePiece();
  const add = locale === 'en' ? '+ Add' : '+ Agregar';
  return (
    <div
      className="grid overflow-hidden rounded-xl border bg-background text-foreground shadow-2xl"
      style={{ gridTemplateColumns: `repeat(${p.days}, ${p.columnWidth}px)`, height: p.height }}
    >
      {WEEKDAYS[locale].slice(0, p.days).map((name, i) => {
        const day = p.startDay + i;
        const isToday = day === p.today;
        const isPast = day < p.today;
        const posts = p.posts.filter((x) => x.day === day);
        return (
          <div
            key={name}
            className={cn('flex min-h-0 flex-col border-r border-border last:border-r-0', isPast && 'bg-muted/30', isToday && 'bg-primary/5')}
          >
            <div className="border-b border-border bg-card px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">{name}</div>
                  <div
                    className={cn(
                      'mt-1 flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold',
                      isToday ? 'bg-primary text-primary-foreground' : isPast ? 'text-muted-foreground' : 'text-foreground',
                    )}
                  >
                    {day}
                  </div>
                </div>
                {!isPast && <span className="flex h-7 w-7 items-center justify-center text-lg leading-none text-muted-foreground">+</span>}
              </div>
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden p-2">
              {posts.length === 0 ? (
                isPast ? (
                  <div className="flex h-28 items-center justify-center text-xs text-muted-foreground/50">-</div>
                ) : (
                  <div className="flex h-28 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/20 text-xs font-medium text-primary">
                    {add}
                  </div>
                )
              ) : (
                posts.map((post, k) => (
                  <PublicationCard key={k} {...post} width={p.columnWidth - 16} compactFooter />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Kanban (tasks board) ────────────────────────────────────────────────────

const COVER = {
  gray: 'bg-muted',
  red: 'bg-red-500',
  orange: 'bg-orange-400',
  yellow: 'bg-yellow-400',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
};
const PRIORITY = {
  LOW: { variant: 'secondary', className: 'text-muted-foreground', label: { es: 'Baja', en: 'Low' } },
  MEDIUM: { variant: 'secondary', className: 'text-blue-600 dark:text-blue-400', label: { es: 'Media', en: 'Medium' } },
  HIGH: { variant: 'secondary', className: 'text-orange-600 dark:text-orange-400', label: { es: 'Alta', en: 'High' } },
  URGENT: { variant: 'destructive', className: '', label: { es: 'Urgente', en: 'Urgent' } },
} as const;

/** Same deterministic hash as the app, so a label lands on the same colour. */
function labelColor(label: string) {
  const colors = [
    'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  ];
  let h = 0;
  for (let i = 0; i < label.length; i++) h = ((h << 5) - h + label.charCodeAt(i)) | 0;
  return colors[Math.abs(h) % colors.length];
}

const task = z.object({
  title: localized,
  done: z.boolean().default(false),
  labels: z.array(z.string()).default([]),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  dueDate: z.string().optional(),
  checklistDone: z.number().optional(),
  checklistTotal: z.number().optional(),
  cover: z.enum(['gray', 'red', 'orange', 'yellow', 'green', 'blue', 'purple']).optional(),
});

export const kanbanColumnSchema = z.object({
  name: localized,
  tasks: z.array(task).default([]),
  width: z.number().default(288),
});

/** One list of Planer's task board (spa tasks/kanban). */
export function KanbanColumn(input: z.input<typeof kanbanColumnSchema>) {
  const p = kanbanColumnSchema.parse(input);
  const { locale } = usePiece();
  return (
    <div className="flex flex-col rounded-xl border bg-muted/40 text-foreground" style={{ width: p.width }}>
      <div className="flex items-center gap-1.5 px-3 py-2.5">
        <GripVertical className="size-4 shrink-0 text-muted-foreground/40" />
        <span className="flex-1 truncate text-sm font-semibold">{tr(p.name, locale)}</span>
        <span className="text-xs text-muted-foreground tabular-nums">{p.tasks.length}</span>
        <MoreHorizontal className="size-3.5 shrink-0 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-2 px-2 pb-2">
        {p.tasks.map((t, i) => {
          const total = t.checklistTotal ?? 0;
          const done = t.checklistDone ?? 0;
          return (
            <div key={i} className={cn('flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm', t.done && 'opacity-60')}>
              {t.cover && <div className={cn('h-2 w-full', COVER[t.cover])} />}
              <div className="flex flex-col gap-1.5 p-3">
                <div className="flex items-start gap-1.5">
                  <span
                    className={cn(
                      'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border-2',
                      t.done ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/40',
                    )}
                  >
                    {t.done && (
                      <svg viewBox="0 0 10 8" fill="none" className="size-2.5">
                        <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <GripVertical className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/40" />
                  <span className={cn('flex-1 text-sm leading-snug font-medium', t.done && 'text-muted-foreground line-through')}>
                    {tr(t.title, locale)}
                  </span>
                </div>
                {t.labels.length > 0 && (
                  <div className="ml-8 flex flex-wrap gap-1">
                    {t.labels.map((l) => (
                      <span key={l} className={cn('inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium', labelColor(l))}>
                        {l}
                      </span>
                    ))}
                  </div>
                )}
                {(t.priority || t.dueDate || total > 0) && (
                  <div className="mt-0.5 ml-8 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    {t.priority && (
                      <Badge variant={PRIORITY[t.priority].variant} className={cn('h-4 px-1.5 py-0 text-xs', PRIORITY[t.priority].className)}>
                        {PRIORITY[t.priority].label[locale]}
                      </Badge>
                    )}
                    {t.dueDate && (
                      <span className="flex items-center gap-1">
                        <CalendarDays className="size-3" /> {t.dueDate}
                      </span>
                    )}
                    {total > 0 && (
                      <span className={cn('flex items-center gap-1', done === total && 'text-green-600 dark:text-green-400')}>
                        <SquareCheck className="size-3" /> {done}/{total}
                      </span>
                    )}
                  </div>
                )}
              </div>
              {total > 0 && (
                <div className="h-1 w-full bg-muted">
                  <div className={cn('h-full', done === total ? 'bg-green-500' : 'bg-primary')} style={{ width: `${(done / total) * 100}%` }} />
                </div>
              )}
            </div>
          );
        })}
        <div className="flex h-8 items-center gap-1.5 px-3 text-xs text-muted-foreground">
          <Plus className="size-3.5" />
          {locale === 'en' ? 'Add a task' : 'Agregar una tarea'}
        </div>
      </div>
    </div>
  );
}
