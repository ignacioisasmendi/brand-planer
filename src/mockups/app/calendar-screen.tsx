import * as React from 'react'
import { Clock } from 'lucide-react'

import { Badge } from './ui'
import { cn } from '../../lib/cn'

import { AppFrame, type AppFrameProps } from './app-frame'

/**
 * The content calendar, as a static screen — both of the app's views.
 *
 * `view="month"` mirrors `components/dashboard/calendar/month-view.tsx`
 * (7-column auto-rows grid, bordered day cells, outside days muted).
 * `view="week"` mirrors `calendar/week-view.tsx`: seven full-height day
 * columns, each with a sticky header carrying the weekday abbreviation and a
 * date circle (filled for today), past days on `bg-muted/30`, today on
 * `bg-primary/5`, and a dashed "add" box on empty future days.
 *
 * Cards follow the status border language of `calendar/post-card.tsx`:
 * scheduled = primary, published = success, draft = dashed. The week card is
 * `WeekContentCard`'s desktop shape — square thumbnail with a time overlay,
 * caption, then platform and status. It drops the format/objective badges and
 * the dropdown, which need data this static screen has no source for.
 *
 * The pager, Hoy and the Semana|Mes toggle live in the topbar, so `view` also
 * drives `AppFrame`'s `calendarView` and swaps the period label.
 */

export type CalendarPostStatus = 'scheduled' | 'published' | 'draft'

export interface CalendarPost {
  day: number
  time: string
  title: string
  channel: 'ig' | 'tt' | 'li'
  status: CalendarPostStatus
}

export interface CalendarScreenProps extends Omit<AppFrameProps, 'active' | 'topbar' | 'calendarLabel' | 'calendarView'> {
  /** Which of the app's two views to render. Drives the topbar toggle too. */
  view?: 'month' | 'week'
  monthLabel?: string
  /** Period label shown in the topbar when `view="week"`. */
  weekLabel?: string
  /** 1-indexed weekday the month starts on (1 = Monday). */
  startWeekday?: number
  daysInMonth?: number
  todayDay?: number
  /** Day-of-month the week view starts on — its Monday. */
  weekStartDay?: number
  posts?: CalendarPost[]
}

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const CHANNEL_TINT: Record<CalendarPost['channel'], string> = {
  ig: 'bg-gradient-to-br from-fuchsia-500 to-amber-400',
  tt: 'bg-foreground',
  li: 'bg-sky-600',
}

const STATUS_BORDER: Record<CalendarPostStatus, string> = {
  scheduled: 'border-primary/30 bg-card',
  published: 'border-[color:var(--success)]/30 bg-card',
  draft: 'border-dashed border-muted-foreground/30 bg-card',
}

/** post-card.tsx uses /20 on the week card and /30 on the month chip. */
const WEEK_CARD_BORDER: Record<CalendarPostStatus, string> = {
  scheduled: 'border-primary/20 bg-card',
  published: 'border-[color:var(--success)]/20 bg-card',
  draft: 'border-dashed border-muted-foreground/30 bg-card',
}

const STATUS_LABEL: Record<CalendarPostStatus, string> = {
  scheduled: 'Programado',
  published: 'Publicado',
  draft: 'Borrador',
}

const STATUS_VARIANT: Record<CalendarPostStatus, 'default' | 'secondary' | 'outline'> = {
  published: 'default',
  scheduled: 'secondary',
  draft: 'outline',
}

const DEFAULT_POSTS: CalendarPost[] = [
  { day: 3, time: '09:30', title: 'Colección primavera', channel: 'ig', status: 'published' },
  { day: 4, time: '09:30', title: 'Lanzamiento', channel: 'ig', status: 'scheduled' },
  { day: 4, time: '18:00', title: 'Behind the scenes', channel: 'tt', status: 'scheduled' },
  { day: 5, time: '11:00', title: 'Testimonio', channel: 'ig', status: 'draft' },
  { day: 6, time: '10:00', title: '5 tips de contenido', channel: 'ig', status: 'scheduled' },
  { day: 11, time: '12:00', title: 'Reel receta', channel: 'tt', status: 'scheduled' },
  { day: 12, time: '09:00', title: 'Carrusel producto', channel: 'ig', status: 'scheduled' },
  { day: 14, time: '17:30', title: 'Caso de éxito', channel: 'li', status: 'draft' },
  { day: 18, time: '10:15', title: 'Encuesta stories', channel: 'ig', status: 'scheduled' },
  { day: 21, time: '19:00', title: 'Live Q&A', channel: 'ig', status: 'scheduled' },
  { day: 25, time: '08:45', title: 'Resumen del mes', channel: 'li', status: 'draft' },
]

export function CalendarScreen({
  view = 'month',
  monthLabel = 'Agosto 2026',
  weekLabel = '3 – 9 de agosto',
  startWeekday = 6,
  daysInMonth = 31,
  todayDay = 4,
  weekStartDay = 3,
  posts = DEFAULT_POSTS,
  ...frame
}: CalendarScreenProps) {
  const leading = startWeekday - 1
  const cells = 42
  const byDay = React.useMemo(() => {
    const m = new Map<number, CalendarPost[]>()
    for (const p of posts) {
      const list = m.get(p.day) ?? []
      list.push(p)
      m.set(p.day, list)
    }
    return m
  }, [posts])

  return (
    <AppFrame
      active="calendar"
      topbar="calendar"
      calendarLabel={view === 'week' ? weekLabel : monthLabel}
      calendarView={view}
      {...frame}
    >
      {/* The pager, Hoy and the Semana|Mes toggle live in the topbar — the real
          calendar page owns that state in ContentCalendar and mirrors it up,
          so neither view carries a toolbar of its own. */}
      {view === 'week' ? (
        <div className="flex h-full min-h-0 flex-col bg-background">
          <div className="grid min-h-0 flex-1 grid-cols-7 grid-rows-1">
            {WEEKDAYS.map((dayName, index) => {
              const day = weekStartDay + index
              const isToday = day === todayDay
              const isPast = day < todayDay
              const dayPosts = byDay.get(day) ?? []

              return (
                <div
                  key={dayName}
                  className={cn(
                    'flex min-h-0 flex-col border-r border-border last:border-r-0',
                    isPast && !isToday && 'bg-muted/30',
                    isToday && 'bg-primary/5',
                  )}
                >
                  {/* Day header */}
                  <div className="border-b border-border bg-card px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                          {dayName}
                        </div>
                        <div
                          className={cn(
                            'mt-1 flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold',
                            isToday
                              ? 'bg-primary text-primary-foreground'
                              : isPast
                                ? 'text-muted-foreground'
                                : 'text-foreground',
                          )}
                        >
                          {day}
                        </div>
                      </div>
                      {!isPast && (
                        <span className="flex h-7 w-7 items-center justify-center rounded-md text-lg leading-none text-muted-foreground">
                          +
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Posts */}
                  <div className="min-h-0 flex-1 overflow-hidden p-2">
                    {dayPosts.length === 0 ? (
                      isPast ? (
                        <div className="flex h-28 items-center justify-center">
                          <p className="text-xs text-muted-foreground/50">-</p>
                        </div>
                      ) : (
                        <div className="flex h-28 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/20 text-center">
                          <span className="px-2 text-xs font-medium text-primary">
                            + Agregar
                          </span>
                        </div>
                      )
                    ) : (
                      <div className="flex flex-col gap-2">
                        {dayPosts.map((p, k) => (
                          <div
                            key={k}
                            className={cn(
                              'flex w-full flex-col gap-2 rounded-lg border p-2 text-left',
                              WEEK_CARD_BORDER[p.status],
                            )}
                          >
                            <div className="relative aspect-square w-full overflow-hidden rounded-md bg-gradient-to-br from-primary/20 to-primary/5">
                              <div className="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-gradient-to-t from-black/60 to-transparent px-1.5 pb-1 pt-4">
                                <Clock className="h-2.5 w-2.5 text-white/80" />
                                <span className="text-[10px] font-medium text-white">
                                  {p.time}
                                </span>
                              </div>
                            </div>
                            <p className="line-clamp-2 text-xs leading-tight text-foreground">
                              {p.title}
                            </p>
                            <div className="flex items-center justify-between gap-1">
                              <span
                                className={cn(
                                  'size-2 shrink-0 rounded-full',
                                  CHANNEL_TINT[p.channel],
                                )}
                              />
                              <Badge
                                variant={STATUS_VARIANT[p.status]}
                                className="h-4 px-1 text-[9px]"
                              >
                                {STATUS_LABEL[p.status]}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
      <div className="flex h-full min-h-0 flex-col bg-background">
        {/* Weekday header */}
        <div className="grid shrink-0 grid-cols-7 border-b">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="px-2 py-1.5 text-center text-[11px] font-medium text-muted-foreground"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Month grid */}
        <div className="grid min-h-0 flex-1 auto-rows-fr grid-cols-7">
          {Array.from({ length: cells }, (_, i) => {
            const day = i - leading + 1
            const outside = day < 1 || day > daysInMonth
            const dayPosts = outside ? [] : (byDay.get(day) ?? [])
            const isToday = day === todayDay
            return (
              <div
                key={i}
                className={cn(
                  'flex min-h-0 min-w-0 flex-col gap-1 border-b border-r p-1.5',
                  outside && 'bg-muted/40',
                )}
              >
                <span
                  className={cn(
                    'text-[11px] tabular-nums',
                    outside && 'text-muted-foreground/50',
                    !outside && !isToday && 'text-muted-foreground',
                    isToday &&
                      'flex size-5 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground',
                  )}
                >
                  {outside ? '' : day}
                </span>

                <div className="flex min-h-0 flex-col gap-1 overflow-hidden">
                  {dayPosts.slice(0, 2).map((p, k) => (
                    <div
                      key={k}
                      className={cn(
                        'flex items-center gap-1.5 rounded-md border px-1.5 py-1',
                        STATUS_BORDER[p.status],
                      )}
                    >
                      <span
                        className={cn('size-2 shrink-0 rounded-full', CHANNEL_TINT[p.channel])}
                      />
                      <span className="truncate text-[10px] font-medium leading-tight">
                        {p.title}
                      </span>
                    </div>
                  ))}
                  {dayPosts.length > 2 && (
                    <span className="px-1 text-[10px] text-muted-foreground">
                      +{dayPosts.length - 2} más
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      )}
    </AppFrame>
  )
}
