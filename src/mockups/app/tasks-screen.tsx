import * as React from 'react'
import {
  Calendar,
  CheckSquare,
  ChevronLeft,
  GripVertical,
  LayoutGrid,
  Link2,
  List,
  MoreHorizontal,
  Plus,
} from 'lucide-react'

import { Badge } from './ui'
import { Button } from './ui'
import { cn } from '../../lib/cn'

import { AppFrame, type AppFrameProps } from './app-frame'

/**
 * The task board screen, as a static screen.
 *
 * Mirrors `components/tasks/task-board-view.tsx` (toolbar + view toggle),
 * `task-board-dnd.tsx` (the column row), `task-list-column.tsx` (column chrome)
 * and `task-card.tsx` (the card itself, including its label-colour hash,
 * priority styles and checklist meter).
 *
 * Drag affordances render in their resting state — the grips and hover-only
 * menus are drawn but inert, since nothing here is interactive.
 */

export type TaskPriorityKey = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
export type TaskCoverColor = 'gray' | 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple'

/** Copied verbatim from task-card.tsx so covers match the app exactly. */
const COVER_COLOR: Record<TaskCoverColor, string> = {
  gray: 'bg-muted',
  red: 'bg-red-500',
  orange: 'bg-orange-400',
  yellow: 'bg-yellow-400',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
}

const PRIORITY_STYLES: Record<
  TaskPriorityKey,
  { variant: 'secondary' | 'destructive'; className: string; label: string }
> = {
  LOW: { variant: 'secondary', className: 'text-muted-foreground', label: 'Baja' },
  MEDIUM: { variant: 'secondary', className: 'text-blue-600 dark:text-blue-400', label: 'Media' },
  HIGH: { variant: 'secondary', className: 'text-orange-600 dark:text-orange-400', label: 'Alta' },
  URGENT: { variant: 'destructive', className: '', label: 'Urgente' },
}

/**
 * Deterministic label colour — the same hash the app uses, so a label string
 * lands on the same colour here as it does in production.
 */
function getLabelColor(label: string): string {
  const colors = [
    'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  ]
  let hash = 0
  for (let i = 0; i < label.length; i++) {
    hash = (hash << 5) - hash + label.charCodeAt(i)
    hash |= 0
  }
  return colors[Math.abs(hash) % colors.length]
}

export interface TaskEntry {
  title: string
  done?: boolean
  labels?: string[]
  priority?: TaskPriorityKey
  /** Pre-formatted, e.g. `12 mar` — kept as a string so renders stay deterministic. */
  dueDate?: string
  overdue?: boolean
  checklistDone?: number
  checklistTotal?: number
  blocked?: boolean
  coverColor?: TaskCoverColor
}

export interface TaskListEntry {
  name: string
  tasks: TaskEntry[]
}

export interface TasksScreenProps extends Omit<AppFrameProps, 'active' | 'topbar'> {
  boardName?: string
  /** Which toggle segment reads as selected. Only the board layout is drawn. */
  view?: 'board' | 'list'
  lists?: TaskListEntry[]
}

const DEFAULT_LISTS: TaskListEntry[] = [
  {
    name: 'Ideas',
    tasks: [
      {
        title: 'Serie de reels "detrás de escena"',
        labels: ['Contenido', 'Reels'],
        priority: 'MEDIUM',
        coverColor: 'purple',
      },
      {
        title: 'Encuesta de stories para elegir packaging',
        labels: ['Community'],
        checklistDone: 1,
        checklistTotal: 4,
      },
      { title: 'Colaboración con @estudio.norte', priority: 'LOW' },
    ],
  },
  {
    name: 'En progreso',
    tasks: [
      {
        title: 'Editar video de lanzamiento primavera',
        labels: ['Video'],
        priority: 'URGENT',
        dueDate: '12 mar',
        overdue: true,
        checklistDone: 3,
        checklistTotal: 5,
        coverColor: 'red',
      },
      {
        title: 'Escribir copies de la semana',
        labels: ['Contenido'],
        priority: 'HIGH',
        dueDate: '14 mar',
        blocked: true,
      },
    ],
  },
  {
    name: 'Revisión',
    tasks: [
      {
        title: 'Aprobar grilla de feed de abril',
        labels: ['Cliente'],
        priority: 'HIGH',
        dueDate: '16 mar',
        checklistDone: 2,
        checklistTotal: 2,
      },
    ],
  },
  {
    name: 'Listo',
    tasks: [
      {
        title: 'Publicar carrusel de testimonios',
        done: true,
        labels: ['Contenido'],
        dueDate: '8 mar',
        coverColor: 'green',
      },
      { title: 'Responder comentarios pendientes', done: true },
    ],
  },
]

function TaskBoardCard({ task }: { task: TaskEntry }) {
  const checklistTotal = task.checklistTotal ?? 0
  const checklistDone = task.checklistDone ?? 0
  const hasFooter =
    !!task.priority || !!task.dueDate || checklistTotal > 0 || !!task.blocked

  return (
    <div
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm',
        task.done && 'opacity-60',
      )}
    >
      {/* Cover colour strip */}
      {task.coverColor && (
        <div className={cn('h-2 w-full', COVER_COLOR[task.coverColor])} />
      )}

      <div className="flex flex-col gap-1.5 p-3">
        {/* Done toggle + grip + title + actions */}
        <div className="flex items-start gap-1.5">
          <span
            className={cn(
              'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border-2',
              task.done
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-muted-foreground/40',
            )}
          >
            {task.done && (
              <svg viewBox="0 0 10 8" fill="none" className="size-2.5">
                <path
                  d="M1 4l3 3 5-6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
          <GripVertical className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/40" />
          <span
            className={cn(
              'flex-1 text-sm font-medium leading-snug',
              task.done && 'text-muted-foreground line-through',
            )}
          >
            {task.title}
          </span>
          <MoreHorizontal className="size-3.5 shrink-0 text-muted-foreground opacity-0" />
        </div>

        {/* Labels */}
        {!!task.labels?.length && (
          <div className="ml-8 flex flex-wrap gap-1">
            {task.labels.map((label) => (
              <span
                key={label}
                className={cn(
                  'inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium',
                  getLabelColor(label),
                )}
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Priority · due date · checklist · blocked */}
        {hasFooter && (
          <div className="ml-8 mt-0.5 flex flex-wrap items-center gap-2">
            {task.priority && (
              <Badge
                variant={PRIORITY_STYLES[task.priority].variant}
                className={cn('h-4 px-1.5 py-0 text-xs', PRIORITY_STYLES[task.priority].className)}
              >
                {PRIORITY_STYLES[task.priority].label}
              </Badge>
            )}
            {task.dueDate && (
              <span
                className={cn(
                  'flex items-center gap-1 text-xs',
                  task.overdue && !task.done
                    ? 'font-medium text-red-500 dark:text-red-400'
                    : 'text-muted-foreground',
                )}
              >
                <Calendar className="size-3" />
                {task.dueDate}
                {task.overdue && !task.done && <span className="text-[10px]">(Vencida)</span>}
              </span>
            )}
            {checklistTotal > 0 && (
              <span
                className={cn(
                  'flex items-center gap-1 text-xs tabular-nums',
                  checklistDone === checklistTotal
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-muted-foreground',
                )}
              >
                <CheckSquare className="size-3" />
                {checklistDone}/{checklistTotal}
              </span>
            )}
            {task.blocked && (
              <span className="flex items-center gap-1 text-xs text-orange-500 dark:text-orange-400">
                <Link2 className="size-3" />
                Bloqueada
              </span>
            )}
          </div>
        )}

        {/* Checklist meter */}
        {checklistTotal > 0 && (
          <div className="ml-8 mt-0.5 h-1 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                'h-full rounded-full',
                checklistDone === checklistTotal ? 'bg-green-500' : 'bg-primary',
              )}
              style={{ width: `${(checklistDone / checklistTotal) * 100}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export function TasksScreen({
  boardName = 'Contenido — Marzo',
  view = 'board',
  lists = DEFAULT_LISTS,
  ...frame
}: TasksScreenProps) {
  return (
    <AppFrame active="tasks" {...frame}>
      <div className="flex h-full flex-col overflow-hidden">
        {/* ── Board toolbar ────────────────────────────────────── */}
        <div className="flex shrink-0 items-center gap-3 border-b px-4 py-3">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <ChevronLeft className="size-4" />
            Tableros de tareas
          </Button>
          <div className="h-4 w-px bg-border" />
          <h1 className="text-base font-semibold">{boardName}</h1>
          <div className="flex-1" />

          {/* View toggle */}
          <div className="flex items-center overflow-hidden rounded-md border">
            <Button
              variant={view === 'board' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 gap-1.5 rounded-none px-2.5"
            >
              <LayoutGrid className="size-3.5" />
              Tablero
            </Button>
            <Button
              variant={view === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 gap-1.5 rounded-none px-2.5"
            >
              <List className="size-3.5" />
              Lista
            </Button>
          </div>

          {/* Faithful to the app: the `addList` string is itself "+ Agregar lista"
              and sits next to a Plus icon, so production really does render two
              plus signs here. Mirrored deliberately — see NOTES.md. */}
          <Button variant="outline" size="sm" className="gap-1.5">
            <Plus className="size-4" />
            + Agregar lista
          </Button>
        </div>

        {/* ── Column row ───────────────────────────────────────── */}
        <div className="flex-1 overflow-hidden">
          <div className="flex min-h-full gap-4 p-4 pb-6">
            {lists.map((list) => (
              <div
                key={list.name}
                className="flex w-72 shrink-0 flex-col rounded-xl border bg-muted/40"
              >
                {/* Column header */}
                <div className="flex items-center gap-1.5 px-3 py-2.5">
                  <GripVertical className="size-4 shrink-0 text-muted-foreground/40" />
                  <span className="flex-1 truncate text-sm font-semibold">{list.name}</span>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {list.tasks.length}
                  </span>
                  <MoreHorizontal className="size-3.5 shrink-0 text-muted-foreground" />
                </div>

                {/* Cards */}
                <div className="flex min-h-[4rem] flex-col gap-2 px-2 pb-2">
                  {list.tasks.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <p className="text-xs text-muted-foreground/60">Sin tareas</p>
                    </div>
                  )}
                  {list.tasks.map((task) => (
                    <TaskBoardCard key={task.title} task={task} />
                  ))}

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-full justify-start gap-1.5 text-xs text-muted-foreground"
                  >
                    <Plus className="size-3.5" />
                    Agregar una tarea
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppFrame>
  )
}
