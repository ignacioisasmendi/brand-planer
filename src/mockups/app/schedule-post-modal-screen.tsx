import * as React from 'react'
import {
  Bold,
  Bookmark,
  CalendarIcon,
  Eraser,
  Expand,
  Heart,
  ImageIcon,
  Italic,
  Maximize2,
  MessageCircleMore,
  Plus,
  Send,
  Smile,
  Tags,
  X,
} from 'lucide-react'

import { Button } from './ui'
import { Tabs, TabsList, TabsTrigger } from './ui'
import { cn } from '../../lib/cn'

import { PLATFORM_ICON } from './platform-icons'

/**
 * The schedule-post composer, as a static screen.
 *
 * Mirrors `components/dashboard/schedule-post-modal.tsx` and its parts in
 * `components/dashboard/schedule-post/`: the two-column dialog body
 * (`flex-1` editor column with `md:border-r`, fixed `md:w-[420px]` preview),
 * `ModalTopBar`, `AccountSelector` chip row, `FormatTabs`, `SectionTabs`,
 * `MediaSection`, `CaptionEditor` and `ModalFooter`, plus the Instagram
 * `PreviewPanel`.
 *
 * It ships with one **connected Instagram account** selected, which is the
 * state the composer is in for a normal workspace — an unconnected composer
 * shows only the "no active accounts" error and is useless as design material.
 *
 * Presentational only: no dnd-kit, no uploads, no SWR, no dictionary context.
 * Labels are the real `dict.dashboard.scheduleModal.*` Spanish strings.
 */

export type PostFormat = 'feed' | 'reel' | 'story'
export type ComposerTab = 'compose' | 'platform' | 'schedule'

export interface ComposerAccount {
  /** Key into PLATFORM_ICON — `instagram`, `tiktok`, `facebook`… */
  platform: string
  /** Rendered as @username on the chip. */
  username: string
  /** Selected chips carry the primary border/tint. */
  selected?: boolean
  /** Dimmed and struck from the run — the attached media rules it out. */
  incompatible?: boolean
}

export interface SchedulePostModalProps extends React.ComponentProps<'div'> {
  /** Connected accounts shown as chips. Defaults to one selected Instagram. */
  accounts?: ComposerAccount[]
  /** Which format tab is pressed. */
  format?: PostFormat
  /** Which section panel is showing. */
  activeTab?: ComposerTab
  /** Caption text in the editor. */
  caption?: string
  /** Number of attached media tiles. */
  mediaCount?: number
  /** Drives the footer's submit label. */
  publishMode?: 'now' | 'schedule'
  /** Handle shown in the preview card header. */
  previewHandle?: string
}

const FORMAT_LABEL: Record<PostFormat, string> = {
  feed: 'Publicación',
  reel: 'Reel',
  story: 'Historia',
}

const TAB_LABEL: Record<ComposerTab, string> = {
  compose: 'Contenido',
  platform: 'Por plataforma',
  schedule: 'Programación',
}

/** Same `TRIGGER_CLASS` as format-tabs.tsx. */
const TRIGGER_CLASS =
  'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-1.5 rounded-md text-sm font-medium'

const DEFAULT_ACCOUNTS: ComposerAccount[] = [
  { platform: 'instagram', username: 'estudio.norte', selected: true },
]

const DEFAULT_CAPTION =
  'Nueva colección primavera ya disponible ☀️\n\nDiseños pensados para el día a día, en algodón orgánico y tonos tierra. Envíos a todo el país.\n\n#primavera #slowfashion #hechoenargentina'

const CAPTION_MAX = 2200

export function SchedulePostModal({
  accounts = DEFAULT_ACCOUNTS,
  format = 'feed',
  activeTab = 'compose',
  caption = DEFAULT_CAPTION,
  mediaCount = 2,
  publishMode = 'schedule',
  previewHandle = 'estudio.norte',
  className,
  ...props
}: SchedulePostModalProps) {
  const selectedCount = accounts.filter((a) => a.selected).length
  const countLabel =
    selectedCount === 0
      ? 'Ninguna cuenta seleccionada'
      : selectedCount === 1
        ? '1 cuenta seleccionada'
        : `${selectedCount} cuentas seleccionadas`

  return (
    <div
      data-slot="schedule-post-modal"
      className={cn(
        'flex overflow-hidden rounded-xl border bg-card text-card-foreground shadow-lg',
        className,
      )}
      {...props}
    >
      {/* ── Editor column ────────────────────────────────────────────────── */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-r border-border">
        {/* Top bar */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-border px-4 py-3">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <Eraser className="h-4 w-4" />
            Limpiar
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <Tags className="h-4 w-4" />
            Agregar etiquetas
          </Button>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
              aria-label="Expandir"
            >
              <Expand className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Account chips */}
        <div className="flex-shrink-0 border-b border-border px-4 py-2.5">
          <div className="flex flex-wrap items-center gap-2">
            {accounts.map((account) => (
              <span
                key={account.platform + account.username}
                data-selected={account.selected}
                className={cn(
                  'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors',
                  account.selected
                    ? 'border-primary bg-primary/10 font-medium text-primary'
                    : account.incompatible
                      ? 'cursor-not-allowed border-border/50 bg-muted/30 text-muted-foreground/40'
                      : 'border-border text-muted-foreground',
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={PLATFORM_ICON[account.platform]}
                  alt={account.platform}
                  width={16}
                  height={16}
                  className={cn('h-4 w-4', account.incompatible && 'opacity-40')}
                />
                @{account.username}
              </span>
            ))}
          </div>
        </div>

        {/* Format tabs */}
        <div className="flex-shrink-0 border-b border-border px-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PLATFORM_ICON.instagram}
              alt="Instagram"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <Tabs defaultValue={format}>
              <TabsList className="h-auto gap-1 bg-transparent p-0">
                <TabsTrigger value="feed" className={TRIGGER_CLASS}>
                  {FORMAT_LABEL.feed}
                </TabsTrigger>
                <TabsTrigger value="reel" className={TRIGGER_CLASS}>
                  {FORMAT_LABEL.reel}
                </TabsTrigger>
                <TabsTrigger value="story" className={TRIGGER_CLASS}>
                  {FORMAT_LABEL.story}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Section tabs */}
        <div
          role="tablist"
          className="flex flex-shrink-0 items-stretch gap-1 border-b border-border px-2"
        >
          {(['compose', 'platform', 'schedule'] as ComposerTab[]).map((id) => (
            <span
              key={id}
              role="tab"
              aria-selected={id === activeTab}
              className={cn(
                '-mb-px flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm transition-colors',
                id === activeTab
                  ? 'border-primary font-medium text-foreground'
                  : 'border-transparent text-muted-foreground',
              )}
            >
              {TAB_LABEL[id]}
              {id === 'platform' && (
                <span
                  className={cn(
                    'inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-medium tabular-nums',
                    id === activeTab ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground',
                  )}
                >
                  1
                </span>
              )}
            </span>
          ))}
        </div>

        {/* Compose panel */}
        <div className="min-h-0 w-full flex-1 overflow-hidden">
          {/* Media */}
          <div className="border-b border-border p-4">
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: mediaCount }, (_, i) => (
                <div
                  key={i}
                  className="relative h-28 w-28 overflow-hidden rounded-lg border border-border bg-gradient-to-br from-primary/25 to-primary/5"
                >
                  <span className="absolute bottom-1.5 left-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    {i + 1}
                  </span>
                </div>
              ))}
              <div className="flex h-28 w-28 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border bg-muted/30">
                <Plus className="h-8 w-8 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">Agregar media</span>
              </div>
            </div>
          </div>

          {/* Caption */}
          <div className="border-b border-border p-4">
            <textarea
              readOnly
              value={caption}
              rows={6}
              className="w-full resize-none border-none bg-transparent text-sm leading-relaxed text-foreground outline-none"
            />
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <div className="flex items-center gap-1">
                <span className="text-xs tabular-nums text-muted-foreground">
                  {caption.length}/{CAPTION_MAX}
                </span>
                <span className="ml-2 rounded p-1.5 text-muted-foreground">
                  <Maximize2 className="h-4 w-4" />
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="rounded p-1.5 text-muted-foreground">
                  <Bold className="h-4 w-4" />
                </span>
                <span className="rounded p-1.5 text-muted-foreground">
                  <Italic className="h-4 w-4" />
                </span>
                <span className="rounded p-1.5 text-muted-foreground">
                  <Smile className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-shrink-0 items-center justify-between border-t border-border bg-muted/30 px-4 py-3">
          <div className="text-xs text-muted-foreground">{countLabel}</div>
          <div className="flex items-center gap-2">
            <Button variant="outline">Guardar Borrador</Button>
            <Button className="bg-primary hover:bg-primary/90">
              {publishMode === 'schedule' ? (
                <>
                  <CalendarIcon className="h-4 w-4" /> Programar
                </>
              ) : (
                'Publicar'
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* ── Preview column ───────────────────────────────────────────────── */}
      <div className="flex w-[420px] min-w-[420px] flex-col overflow-hidden bg-muted/20">
        <div className="flex flex-shrink-0 items-center justify-between border-b border-border px-4 py-3">
          <span className="text-sm font-medium text-foreground">
            Vista Previa de la Publicación
          </span>
          <div className="flex items-center overflow-hidden rounded-md border border-border text-xs">
            <span className="bg-primary px-2.5 py-1 font-medium text-primary-foreground">Post</span>
            <span className="px-2.5 py-1 text-muted-foreground">Perfil</span>
          </div>
        </div>

        <div className="flex-1 overflow-hidden p-4">
          <div className="mb-2 flex items-center gap-2 px-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PLATFORM_ICON.instagram}
              alt="Instagram"
              width={16}
              height={16}
              className="h-4 w-4"
            />
            <span className="text-xs text-muted-foreground">@{previewHandle}</span>
          </div>

          {/* Instagram post card */}
          <div className="w-full max-w-[400px] overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 p-3">
              <div className="size-8 shrink-0 rounded-full bg-gradient-to-br from-fuchsia-500 to-amber-400" />
              <span className="text-sm font-semibold">{previewHandle}</span>
            </div>

            <div className="relative aspect-square bg-muted">
              <div className="h-full w-full bg-gradient-to-br from-primary/25 to-primary/5" />
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
              </div>
              {mediaCount > 1 && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                  {Array.from({ length: mediaCount }, (_, i) => (
                    <span
                      key={i}
                      className={cn(
                        'size-1.5 rounded-full',
                        i === 0 ? 'bg-white' : 'bg-white/50',
                      )}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 px-3 pt-3">
              <Heart className="size-5" />
              <MessageCircleMore className="size-5" />
              <Send className="size-5" />
              <Bookmark className="ml-auto size-5" />
            </div>

            <div className="px-3 pb-3 pt-2">
              <p className="text-xs font-semibold">128 Me gusta</p>
              <p className="mt-1 line-clamp-3 text-xs leading-relaxed">
                <span className="font-semibold">{previewHandle}</span>{' '}
                {caption.split('\n')[0]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
