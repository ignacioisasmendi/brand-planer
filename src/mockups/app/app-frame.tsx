import * as React from 'react'
import {
  BarChart3,
  Calendar as CalendarIcon,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Home,
  ImageIcon,
  Images,
  LayoutGrid,
  LayoutList,
  MessageSquareWarning,
  Plus,
  Share2,
  Smartphone,
  Sparkles,
  Wrench,
} from 'lucide-react'

import { Avatar, AvatarFallback } from './ui'
import { Badge } from './ui'
import { Button } from './ui'
import { cn } from '../../lib/cn'

import { PLATFORM_ICON } from './platform-icons'

/**
 * Static app chrome for design-system screens — a faithful mirror of
 * `components/dashboard/app-shell.tsx`.
 *
 * The sidebar copies `components/dashboard/sidebar.tsx`: same `w-64` / `bg-card`
 * shell, same client-selector block, same `gap-3 rounded-lg px-3 py-2.5` nav
 * rows with `h-5 w-5` icons and the `bg-secondary` active state, same channels
 * list with 28px platform icons, same profile footer, same collapse handle.
 *
 * **One deliberate deviation:** the real sidebar ends its nav with a
 * "Próximamente" group (Automatizaciones, Campañas) rendered at
 * `text-muted-foreground/50`. It is dropped here — designs built from this
 * library should not advertise unshipped features. Restore it from
 * `mainNavItems` (`comingSoon: true`) if that ever changes.
 *
 * The topbar follows the shell's real rule: **on desktop only the calendar
 * route renders one** (`isCalendar && !isFullScreen`) — every other page puts
 * content straight under the sidebar, because the shell's other header is
 * `lg:hidden`. So `topbar` defaults to `'none'`, and `'calendar'` reproduces
 * `components/dashboard/topbar.tsx`: the `‹ Hoy › label` pager on the left,
 * then Filtrar / Medios / Vista del feed / Compartir and the Semana|Mes
 * toggle. The compose CTA and the notification bell are commented out in the
 * real topbar, so they are absent here too.
 *
 * What it deliberately drops: routing, tooltips, dropdown menus, data fetching
 * and the collapsed (`w-20`) variant — none of which a static screen needs.
 * Labels are the real `dict.sidebar.*` / `dict.topbar.*` Spanish strings.
 */

export type AppNavKey =
  | 'home'
  | 'tasks'
  | 'calendar'
  | 'media'
  | 'tools'
  | 'feedback'
  | 'analytics'
  | 'upgrade'

/** Same order and labels as mainNavItems + dict.sidebar.navigation. */
const NAV: { key: AppNavKey; label: string; icon: React.ElementType }[] = [
  { key: 'home', label: 'Inicio', icon: Home },
  { key: 'tasks', label: 'Tareas', icon: LayoutList },
  { key: 'calendar', label: 'Calendario', icon: CalendarDays },
  { key: 'media', label: 'Biblioteca de medios', icon: Images },
  { key: 'tools', label: 'Herramientas', icon: Wrench },
  { key: 'feedback', label: 'Reportes y feedback', icon: MessageSquareWarning },
  { key: 'analytics', label: 'Analíticas', icon: BarChart3 },
  { key: 'upgrade', label: 'Plan y facturación', icon: Sparkles },
]

export type PlatformKey = keyof typeof PLATFORM_ICON

const PLATFORM_NAME: Record<string, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  twitter: 'X (Twitter)',
  canva: 'Canva',
}

export interface AppFrameChannel {
  platform: PlatformKey
  /** Rendered as @handle under the platform name. */
  handle?: string
  needsReauth?: boolean
}

export interface AppFrameProps extends React.ComponentProps<'div'> {
  /** Which nav row renders as current. */
  active?: AppNavKey
  /**
   * Which chrome sits above the content. `'none'` (the default) is what every
   * page except the calendar shows on desktop; `'calendar'` renders the real
   * calendar pager topbar.
   */
  topbar?: 'none' | 'calendar'
  /** Period label in the calendar pager, e.g. `Agosto 2026`. */
  calendarLabel?: string
  /** Which segment of the Semana|Mes toggle is pressed. */
  calendarView?: 'week' | 'month'
  /** Active filter count shown as a badge on Filtrar. 0 hides it. */
  filterCount?: number
  /** Client shown in the sidebar selector. */
  client?: string
  /** Plan line under the client name — `dict.sidebar.client.planLabel`. */
  plan?: string
  /** Connected channels. */
  channels?: AppFrameChannel[]
  /** Signed-in user shown in the sidebar footer. */
  user?: { name: string; email: string }
  /** Hide the chrome and render children full-bleed. */
  bare?: boolean
}

/**
 * One channel by default — that is what a real workspace shows, and the nav is
 * tall enough that a 780-820px frame only has room for one row before the
 * profile footer. Pass `channels` for a multi-channel workspace and give the
 * frame more height (h-[900px]+) so the rows aren't cut.
 */
const DEFAULT_CHANNELS: AppFrameChannel[] = [
  { platform: 'instagram', handle: 'estudio.norte' },
]

export function AppFrame({
  active = 'home',
  topbar = 'none',
  calendarLabel = 'Agosto 2026',
  calendarView = 'month',
  filterCount = 0,
  client = 'Estudio Norte',
  plan = 'Plan Pro',
  channels = DEFAULT_CHANNELS,
  user = { name: 'Nacho Isasmendi', email: 'nacho@planer.app' },
  bare = false,
  className,
  children,
  ...props
}: AppFrameProps) {
  if (bare) {
    return (
      <div className={cn('bg-background text-foreground', className)} {...props}>
        {children}
      </div>
    )
  }

  const initials = client.substring(0, 2).toUpperCase()
  const userInitials = user.name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div
      data-slot="app-frame"
      className={cn(
        'flex h-full min-h-0 w-full overflow-hidden rounded-xl border bg-background text-foreground',
        className,
      )}
      {...props}
    >
      {/* ── Sidebar (mirrors components/dashboard/sidebar.tsx) ───────────── */}
      <aside className="relative flex h-full w-64 shrink-0 flex-col border-r border-border bg-card">
        <div className="flex h-full min-h-0 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto">
            {/* Client selector */}
            <div className="border-b border-border p-4">
              <div className="flex h-auto w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 hover:bg-muted">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {initials}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">{client}</p>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      {plan}
                    </span>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {/* Main navigation */}
            <div className="p-3">
              <nav className="space-y-1">
                {NAV.map((item) => (
                  <div
                    key={item.key}
                    aria-current={active === item.key ? 'page' : undefined}
                    className={cn(
                      'flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      active === item.key
                        ? 'bg-secondary text-secondary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {item.label}
                  </div>
                ))}
              </nav>
            </div>

            {/* Channels — the real sidebar pins this block to min-h-[220px];
                dropped here because a static 780-820px frame is shorter than a
                real viewport, and the min-height pushed the last channel row
                under the profile footer (it read as a clipped card). */}
            <div className="flex-1 overflow-hidden border-t border-border">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Canales
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  aria-label="Conectar redes sociales"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="px-3">
                <div className="space-y-1 pb-3">
                  {channels.map((c) => (
                    <div
                      key={c.platform + (c.handle ?? '')}
                      className={cn(
                        'flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted hover:text-foreground',
                        c.needsReauth && 'opacity-70',
                      )}
                    >
                      <div className="relative shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={PLATFORM_ICON[c.platform]}
                          alt={`${PLATFORM_NAME[c.platform]} icon`}
                          width={28}
                          height={28}
                          className="object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <p className="text-sm font-medium text-foreground">
                          {PLATFORM_NAME[c.platform]}
                        </p>
                        {c.needsReauth ? (
                          <p className="truncate text-xs text-yellow-500">
                            Necesita reautorización
                          </p>
                        ) : (
                          c.handle && (
                            <p className="truncate text-xs text-muted-foreground">
                              @{c.handle}
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Profile footer */}
          <div className="border-t border-border p-3">
            <div className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-xs text-primary">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden text-left">
                <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Collapse handle */}
        <div className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background shadow-sm">
          <ChevronLeft className="h-4 w-4" />
        </div>
      </aside>

      {/* ── Main column ──────────────────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Topbar — calendar route only (mirrors components/dashboard/topbar.tsx) */}
        {topbar === 'calendar' && (
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border bg-card px-3 sm:px-4 lg:px-6">
            {/* Calendar pager */}
            <div className="flex min-w-0 items-center gap-2 lg:gap-3">
              <div className="flex min-w-0 items-center gap-1 sm:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 shrink-0 p-0"
                  aria-label="Semana Anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="h-9 shrink-0 px-3">
                  Hoy
                </Button>
                <div className="min-w-0 truncate px-1 text-sm font-semibold text-foreground">
                  {calendarLabel}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 shrink-0 p-0"
                  aria-label="Próxima Semana"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-1 sm:gap-2 lg:gap-3">
              <Button variant="outline" size="sm" className="h-9 gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filtrar</span>
                {filterCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                    {filterCount}
                  </Badge>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="hidden h-9 gap-2 bg-transparent lg:flex"
              >
                <ImageIcon className="h-4 w-4" />
                Medios
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex h-9 items-center justify-center gap-2 bg-transparent px-3"
              >
                <Smartphone className="h-4 w-4" />
                <span className="hidden sm:inline">Vista del feed</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex h-9 items-center justify-center gap-2 bg-transparent px-3"
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Compartir</span>
              </Button>

              {/* Week / month toggle */}
              <div
                role="group"
                aria-label="Calendario"
                className="flex shrink-0 items-center rounded-md border border-border bg-transparent p-0.5"
              >
                <Button
                  variant={calendarView === 'week' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-8 gap-2 px-2 sm:px-3"
                  aria-pressed={calendarView === 'week'}
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span className="hidden sm:inline">Semana</span>
                </Button>
                <Button
                  variant={calendarView === 'month' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-8 gap-2 px-2 sm:px-3"
                  aria-pressed={calendarView === 'month'}
                >
                  <CalendarIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Mes</span>
                </Button>
              </div>
            </div>
          </header>
        )}

        <main className="min-h-0 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
