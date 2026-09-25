/**
 * Static copies of the spa's shadcn/ui primitives (components/ui/*), class
 * strings verbatim, with the Radix behaviour removed: these only need to look
 * right in a still frame. Used by the ported app screens in this folder.
 */
import * as React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/cn';

export { Badge } from '../ui';

// ── Button ─────────────────────────────────────────────────────────────────
const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none";
const BUTTON_VARIANT = {
  default: 'bg-primary text-primary-foreground',
  destructive: 'bg-destructive text-white dark:bg-destructive/60',
  outline: 'border bg-background shadow-xs dark:bg-input/30 dark:border-input',
  secondary: 'bg-secondary text-secondary-foreground',
  ghost: '',
  link: 'text-primary underline-offset-4',
};
const BUTTON_SIZE = {
  default: 'h-9 px-4 py-2 has-[>svg]:px-3',
  sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
  lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
  icon: 'size-9',
  'icon-sm': 'size-8',
  'icon-lg': 'size-10',
};

export function Button({
  variant = 'default',
  size = 'default',
  className,
  asChild: _asChild,
  ...props
}: React.ComponentProps<'button'> & {
  variant?: keyof typeof BUTTON_VARIANT;
  size?: keyof typeof BUTTON_SIZE;
  asChild?: boolean;
}) {
  return <button className={cn(BUTTON_BASE, BUTTON_VARIANT[variant], BUTTON_SIZE[size], className)} {...props} />;
}

// ── Card ───────────────────────────────────────────────────────────────────
export function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm', className)} {...props} />;
}
export function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className,
      )}
      {...props}
    />
  );
}
export function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('leading-none font-semibold', className)} {...props} />;
}
export function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('text-muted-foreground text-sm', className)} {...props} />;
}
export function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-action" className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)} {...props} />;
}
export function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('px-6', className)} {...props} />;
}
export function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex items-center px-6 [.border-t]:pt-6', className)} {...props} />;
}

// ── Tabs (static: the trigger matching defaultValue/value is active) ────────
const TabsCtx = React.createContext<string | undefined>(undefined);
export function Tabs({
  defaultValue,
  value,
  className,
  children,
  onValueChange: _onValueChange,
  ...props
}: React.ComponentProps<'div'> & { defaultValue?: string; value?: string; onValueChange?: (v: string) => void }) {
  return (
    <TabsCtx.Provider value={value ?? defaultValue}>
      <div className={cn('flex flex-col gap-2', className)} {...props}>
        {children}
      </div>
    </TabsCtx.Provider>
  );
}
export function TabsList({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]', className)} {...props} />;
}
export function TabsTrigger({ value, className, ...props }: React.ComponentProps<'button'> & { value: string }) {
  const active = React.useContext(TabsCtx) === value;
  return (
    <button
      data-state={active ? 'active' : 'inactive'}
      className={cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

// ── Form controls ──────────────────────────────────────────────────────────
export function Input({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      readOnly
      className={cn(
        'placeholder:text-muted-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none md:text-sm',
        className,
      )}
      {...props}
    />
  );
}
export function Checkbox({ checked, className, onCheckedChange: _o, ...props }: React.ComponentProps<'span'> & { checked?: boolean; onCheckedChange?: unknown }) {
  return (
    <span
      data-state={checked ? 'checked' : 'unchecked'}
      className={cn(
        'peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary flex size-4 shrink-0 items-center justify-center rounded-[4px] border shadow-xs',
        className,
      )}
      {...props}
    >
      {checked && <Check className="size-3.5" />}
    </span>
  );
}
export function Separator({ className, orientation = 'horizontal', decorative: _d, ...props }: React.ComponentProps<'div'> & { orientation?: 'horizontal' | 'vertical'; decorative?: boolean }) {
  return <div className={cn('bg-border shrink-0', orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px', className)} {...props} />;
}

// ── Avatar ─────────────────────────────────────────────────────────────────
export function Avatar({ className, ...props }: React.ComponentProps<'span'>) {
  return <span className={cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', className)} {...props} />;
}
export function AvatarImage({ className, ...props }: React.ComponentProps<'img'>) {
  return <img className={cn('aspect-square size-full', className)} alt="" {...props} />;
}
export function AvatarFallback({ className, ...props }: React.ComponentProps<'span'>) {
  return <span className={cn('bg-muted flex size-full items-center justify-center rounded-full', className)} {...props} />;
}

// ── Breadcrumb ─────────────────────────────────────────────────────────────
export function Breadcrumb(props: React.ComponentProps<'nav'>) {
  return <nav aria-label="breadcrumb" {...props} />;
}
export function BreadcrumbList({ className, ...props }: React.ComponentProps<'ol'>) {
  return <ol className={cn('text-muted-foreground m-0 flex list-none flex-wrap items-center gap-1.5 p-0 text-sm break-words sm:gap-2.5', className)} {...props} />;
}
export function BreadcrumbItem({ className, ...props }: React.ComponentProps<'li'>) {
  return <li className={cn('inline-flex items-center gap-1.5', className)} {...props} />;
}
export function BreadcrumbPage({ className, ...props }: React.ComponentProps<'span'>) {
  return <span className={cn('text-foreground font-normal', className)} {...props} />;
}

// ── Select (static: shows the item whose value is the defaultValue) ─────────
const SelectCtx = React.createContext<React.ReactNode>(null);

function findItemLabel(children: React.ReactNode, value: string | undefined): React.ReactNode {
  let label: React.ReactNode = null;
  React.Children.forEach(children, (child) => {
    if (label || !React.isValidElement(child)) return;
    const props = child.props as { value?: string; children?: React.ReactNode };
    if (child.type === SelectItem && props.value === value) label = props.children;
    else if (props.children) label = findItemLabel(props.children, value);
  });
  return label;
}

export function Select({ defaultValue, value, children }: { defaultValue?: string; value?: string; children: React.ReactNode; onValueChange?: unknown }) {
  return <SelectCtx.Provider value={findItemLabel(children, value ?? defaultValue)}>{children}</SelectCtx.Provider>;
}
export function SelectTrigger({ className, size = 'default', children, ...props }: React.ComponentProps<'button'> & { size?: 'sm' | 'default' }) {
  return (
    <button
      data-size={size}
      className={cn(
        "border-input [&_svg:not([class*='text-'])]:text-muted-foreground dark:bg-input/30 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs outline-none data-[size=default]:h-9 data-[size=sm]:h-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <span className="line-clamp-1 flex items-center gap-2">{children}</span>
      <ChevronDown className="size-4 opacity-50" />
    </button>
  );
}
export function SelectValue(_: { placeholder?: string }) {
  return <>{React.useContext(SelectCtx)}</>;
}
/** Dropdown contents never show in a still. */
export function SelectContent(_: { children?: React.ReactNode; className?: string }) {
  return null;
}
export function SelectItem(_: { value: string; children?: React.ReactNode; className?: string }) {
  return null;
}

// ── Chart ──────────────────────────────────────────────────────────────────
export type ChartConfig = Record<string, { label?: React.ReactNode; color?: string; theme?: Record<'light' | 'dark', string> }>;

/**
 * The spa's ChartContainer minus ResponsiveContainer (it measures via
 * ResizeObserver after the frame is captured). Pass `width`/`height` to size
 * the chart; the child recharts element receives them.
 */
export function ChartContainer({
  config,
  className,
  children,
  width = 600,
  height = 170,
}: {
  config: ChartConfig;
  className?: string;
  children: React.ReactElement<{ width?: number; height?: number }>;
  width?: number;
  height?: number;
}) {
  const vars = Object.fromEntries(
    Object.entries(config).map(([k, v]) => [`--color-${k}`, v.color ?? v.theme?.light ?? '']),
  ) as React.CSSProperties;
  return (
    <div
      className={cn(
        "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 flex justify-center text-xs [&_.recharts-surface]:outline-hidden",
        className,
      )}
      style={vars}
    >
      {React.cloneElement(children, { width, height })}
    </div>
  );
}
