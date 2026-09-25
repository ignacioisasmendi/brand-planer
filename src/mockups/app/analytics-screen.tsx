import * as React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import { ArrowDownRight, ArrowUpRight, Download } from 'lucide-react'

import { Badge } from './ui'
import { Button } from './ui'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from './ui'
import { ChartContainer } from './ui'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui'
import { Tabs, TabsList, TabsTrigger } from './ui'
import { cn } from '../../lib/cn'

import { AppFrame, type AppFrameProps } from './app-frame'

/**
 * The Instagram analytics screen, as a static screen.
 *
 * Mirrors `components/dashboard/analytics/instagram-analytics.tsx`: account
 * picker + period tabs, a four-KPI row (reach / impressions / followers /
 * engagement rate), the reach-vs-impressions trend, and top performing posts.
 *
 * The trend uses `--chart-reach` / `--chart-views` rather than --chart-1/2 —
 * app/globals.css defines that pair precisely because chart-1..5 are one violet
 * ramp and measure ΔE 6.0 against each other.
 */

export interface AnalyticsKpi {
  label: string
  value: string
  delta: string
  up: boolean
}

export interface AnalyticsTrendPoint {
  day: string
  reach: number
  views: number
}

export interface AnalyticsTopPost {
  title: string
  reach: string
  engagement: string
}

export interface AnalyticsScreenProps extends Omit<AppFrameProps, 'active' | 'topbar'> {
  account?: string
  kpis?: AnalyticsKpi[]
  trend?: AnalyticsTrendPoint[]
  topPosts?: AnalyticsTopPost[]
  /** Chart width in px — recharts needs a number in a still (brand-only prop). */
  chartWidth?: number
}

const DEFAULT_KPIS: AnalyticsKpi[] = [
  { label: 'Alcance', value: '48.2K', delta: '+18,4%', up: true },
  { label: 'Impresiones', value: '71.9K', delta: '+12,1%', up: true },
  { label: 'Seguidores', value: '4.821', delta: '+236', up: true },
  { label: 'Tasa de interacción', value: '5,8%', delta: '-0,4%', up: false },
]

const DEFAULT_TREND: AnalyticsTrendPoint[] = [
  { day: '1 ago', reach: 3200, views: 5100 },
  { day: '5 ago', reach: 4100, views: 6400 },
  { day: '9 ago', reach: 3800, views: 5900 },
  { day: '13 ago', reach: 5300, views: 7800 },
  { day: '17 ago', reach: 6100, views: 8900 },
  { day: '21 ago', reach: 5800, views: 8400 },
  { day: '25 ago', reach: 7200, views: 10200 },
  { day: '29 ago', reach: 6900, views: 9800 },
]

const DEFAULT_TOP: AnalyticsTopPost[] = [
  { title: 'Lanzamiento colección primavera', reach: '12.4K', engagement: '7,2%' },
  { title: 'Behind the scenes del estudio', reach: '9.8K', engagement: '6,4%' },
  { title: 'Carrusel: 5 tips de contenido', reach: '8.1K', engagement: '5,9%' },
]

const chartConfig = {
  reach: { label: 'Alcance', color: 'var(--chart-reach)' },
  views: { label: 'Impresiones', color: 'var(--chart-views)' },
}

export function AnalyticsScreen({
  account = '@estudio.norte',
  kpis = DEFAULT_KPIS,
  trend = DEFAULT_TREND,
  topPosts = DEFAULT_TOP,
  chartWidth = 850,
  ...frame
}: AnalyticsScreenProps) {
  return (
    <AppFrame active="analytics" {...frame}>
      <div className="h-full overflow-hidden p-4">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3">
          {/* Page header — the real page carries its own; the shell has no
              topbar on this route (see AppFrame). */}
          <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card/60 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Analíticas</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Seguí el rendimiento de tu cuenta de Instagram
                </p>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl">
                <Download className="mr-2 size-4" /> Descargar reporte
              </Button>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <Select defaultValue="norte">
                <SelectTrigger size="sm" className="w-56">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="norte">{account}</SelectItem>
                </SelectContent>
              </Select>
              <Tabs defaultValue="30d">
                <TabsList>
                  <TabsTrigger value="7d">7 días</TabsTrigger>
                  <TabsTrigger value="30d">30 días</TabsTrigger>
                  <TabsTrigger value="90d">90 días</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* KPI row */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {kpis.map((k) => (
              <Card key={k.label} className="gap-0 py-3">
                <CardContent className="px-4">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    {k.label}
                  </p>
                  <p className="mt-1.5 text-2xl font-semibold tabular-nums">{k.value}</p>
                  <p
                    className={cn(
                      'mt-1 flex items-center gap-1 text-xs tabular-nums',
                      k.up ? 'text-[color:var(--success)]' : 'text-destructive',
                    )}
                  >
                    {k.up ? (
                      <ArrowUpRight className="size-3.5" />
                    ) : (
                      <ArrowDownRight className="size-3.5" />
                    )}
                    {k.delta}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trend */}
          <Card className="gap-3">
            <CardHeader className="pb-0">
              <CardTitle className="text-base font-medium">Alcance vs. impresiones</CardTitle>
              <p className="text-xs text-muted-foreground">Últimos 30 días</p>
            </CardHeader>
            <CardContent>
              {/* Sized against the 812px preview frame — see the height-budget
                  note in NOTES.md; growing this clips the top-posts card. */}
              <ChartContainer config={chartConfig} className="h-[170px] w-full" width={chartWidth} height={170}>
                <AreaChart data={trend}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                  <Area
                    dataKey="views"
                    type="natural"
                    stroke="var(--color-views)"
                    fill="var(--color-views)"
                    fillOpacity={0.18}
                    isAnimationActive={false}
                  />
                  <Area
                    dataKey="reach"
                    type="natural"
                    stroke="var(--color-reach)"
                    fill="var(--color-reach)"
                    fillOpacity={0.25}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ChartContainer>
              <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-[color:var(--chart-reach)]" /> Alcance
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-[color:var(--chart-views)]" /> Impresiones
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Top posts */}
          <Card className="gap-3">
            <CardHeader className="pb-0">
              <CardTitle className="text-base font-medium">Posts con mejor rendimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                {topPosts.map((p, i) => (
                  <div
                    key={p.title}
                    className={cn('flex items-center gap-3 py-2', i > 0 && 'border-t')}
                  >
                    <div className="size-9 shrink-0 rounded-md bg-gradient-to-br from-primary/25 to-primary/5" />
                    <p className="min-w-0 flex-1 truncate text-sm">{p.title}</p>
                    <Badge variant="secondary" className="tabular-nums">
                      {p.reach}
                    </Badge>
                    <span className="w-12 text-right text-xs tabular-nums text-muted-foreground">
                      {p.engagement}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppFrame>
  )
}
