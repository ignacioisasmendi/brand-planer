import * as React from 'react'
import {
  ArrowRight,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Images,
  ListTodo,
  Plus,
  Users,
  Wrench,
} from 'lucide-react'

import { Badge } from './ui'
import { Button } from './ui'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from './ui'
import { cn } from '../../lib/cn'

import { AppFrame, type AppFrameProps } from './app-frame'

/**
 * The Planer home dashboard, as a static screen.
 *
 * Mirrors `components/dashboard/welcome/welcome-dashboard.tsx`: gradient
 * greeting header, four stat tiles, then upcoming posts beside quick actions.
 * Every value is a prop so the screen can be re-shot for launch material
 * without touching product code.
 */

export type StatAccent = 'violet' | 'emerald' | 'sky' | 'amber'
export type PostStatus = 'scheduled' | 'draft' | 'published'

export interface DashboardStat {
  label: string
  value: string
  hint: string
  accent: StatAccent
}

export interface UpcomingPost {
  title: string
  when: string
  channel: string
  status: PostStatus
}

export interface DashboardScreenProps extends Omit<AppFrameProps, 'active' | 'topbar'> {
  greeting?: string
  dateLabel?: string
  stats?: DashboardStat[]
  upcoming?: UpcomingPost[]
}

// Measured off the running app: each stat card carries a 4px left accent bar
// plus a rounded-full p-2.5 icon chip in the matching hue.
const ACCENT_BAR: Record<StatAccent, string> = {
  violet: 'bg-violet-500',
  emerald: 'bg-emerald-500',
  sky: 'bg-sky-500',
  amber: 'bg-amber-500',
}

const ACCENT_CHIP: Record<StatAccent, string> = {
  violet: 'bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400',
  emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
  sky: 'bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400',
  amber: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
}

const STATUS_LABEL: Record<PostStatus, string> = {
  scheduled: 'Programado',
  draft: 'Borrador',
  published: 'Publicado',
}

const STATUS_VARIANT: Record<PostStatus, 'default' | 'secondary' | 'outline'> = {
  published: 'default',
  scheduled: 'secondary',
  draft: 'outline',
}

const DEFAULT_STATS: DashboardStat[] = [
  { label: 'Próximos posteos', value: '12', hint: 'Esperando publicación', accent: 'violet' },
  { label: 'Clientes activos', value: '3', hint: 'En tu espacio de trabajo', accent: 'emerald' },
  { label: 'Publicados este mes', value: '48', hint: 'Posteos publicados este mes', accent: 'sky' },
  { label: 'Tareas pendientes', value: '5', hint: 'En todos tus clientes', accent: 'amber' },
]

const STAT_ICONS = [CalendarClock, Users, CheckCircle2, ListTodo]

const DEFAULT_UPCOMING: UpcomingPost[] = [
  { title: 'Lanzamiento colección primavera', when: 'Hoy · 09:30', channel: 'Instagram', status: 'scheduled' },
  { title: 'Behind the scenes del estudio', when: 'Hoy · 18:00', channel: 'TikTok', status: 'scheduled' },
  { title: 'Testimonio de cliente', when: 'Mañana · 11:00', channel: 'Instagram', status: 'draft' },
  { title: 'Carrusel: 5 tips de contenido', when: 'Jue 6 · 10:00', channel: 'Instagram', status: 'scheduled' },
]

export function DashboardScreen({
  greeting = 'Buenas tardes, Ignacio',
  dateLabel = 'martes, 4 de agosto de 2026',
  stats = DEFAULT_STATS,
  upcoming = DEFAULT_UPCOMING,
  ...frame
}: DashboardScreenProps) {
  return (
    <AppFrame active="home" {...frame}>
      <div className="h-full overflow-hidden p-6">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
          {/* Greeting */}
          <header className="flex flex-col gap-4 rounded-xl border bg-gradient-to-br from-primary/10 to-transparent p-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">{greeting}</h1>
              <p className="text-sm text-muted-foreground/80 first-letter:uppercase">{dateLabel}</p>
              <p className="text-sm text-muted-foreground">
                Aquí tienes un resumen de tu actividad.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <CalendarDays /> Abrir calendario
              </Button>
              <Button size="sm">
                <Plus /> Nueva tarea
              </Button>
            </div>
          </header>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((s, i) => {
              const Icon = STAT_ICONS[i % STAT_ICONS.length]
              return (
                <Card key={s.label} className="relative gap-0 overflow-hidden">
                  <span className={cn('absolute inset-y-0 left-0 w-1', ACCENT_BAR[s.accent])} />
                  <CardContent>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
                        <p className="mt-1 text-3xl font-semibold tabular-nums">{s.value}</p>
                      </div>
                      <span className={cn('shrink-0 rounded-full p-2.5', ACCENT_CHIP[s.accent])}>
                        <Icon className="size-5" />
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{s.hint}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Upcoming + quick actions */}
          <div className="grid gap-5 lg:grid-cols-5">
            <Card className="gap-3 lg:col-span-3">
              <CardHeader className="pb-0">
                <CardTitle className="text-base font-semibold">Próximos posteos</CardTitle>
                <p className="text-xs text-muted-foreground">Lo que se publicará pronto</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-col">
                  {upcoming.map((p, i) => (
                    <div
                      key={p.title}
                      className={cn(
                        'flex items-center gap-3 py-2.5',
                        i > 0 && 'border-t',
                      )}
                    >
                      <div className="size-10 shrink-0 rounded-lg bg-gradient-to-br from-primary/25 to-primary/5" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{p.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.when} · {p.channel}
                        </p>
                      </div>
                      <Badge variant={STATUS_VARIANT[p.status]}>{STATUS_LABEL[p.status]}</Badge>
                    </div>
                  ))}
                </div>
                <Button variant="link" size="sm" className="mt-1 h-auto p-0 text-muted-foreground">
                  Ver todos <ArrowRight className="size-3" />
                </Button>
              </CardContent>
            </Card>

            <Card className="gap-3 lg:col-span-2">
              <CardHeader className="pb-0">
                <CardTitle className="text-base font-semibold">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                {[
                  { icon: Plus, label: 'Nuevo post' },
                  { icon: CalendarDays, label: 'Calendario' },
                  { icon: Images, label: 'Subir media' },
                  { icon: Wrench, label: 'Herramientas' },
                ].map((a) => (
                  <div
                    key={a.label}
                    className="flex flex-col items-center gap-2 rounded-lg border p-3 text-center"
                  >
                    <a.icon className="size-4 text-muted-foreground" />
                    <span className="text-xs font-medium">{a.label}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppFrame>
  )
}
