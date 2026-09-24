import { Check, ChevronRight, Share2 } from 'lucide-react';
import { z } from 'zod';
import { cn } from '../lib/cn';
import { usePiece } from '../lib/context';
import { localized, tr } from '../lib/i18n';
import { rich } from '../lib/rich';
import { FLOAT_CARD } from './ui';

const block = z.discriminatedUnion('type', [
  z.object({ type: z.literal('heading'), text: localized }),
  z.object({ type: z.literal('paragraph'), text: localized }),
  z.object({ type: z.literal('bullets'), items: z.array(localized) }),
  z.object({ type: z.literal('todos'), items: z.array(z.object({ text: localized, done: z.boolean().default(false) })) }),
  /** Brand palette block — swatches with hex + name (spa color-palette-block). */
  z.object({ type: z.literal('palette'), swatches: z.array(z.object({ hex: z.string(), name: z.string().optional() })) }),
]);

export const notebookPageSchema = z.object({
  /** Client the page belongs to — first breadcrumb crumb. */
  client: z.string().default('Café Origen'),
  /** Parent page crumb, optional. */
  parent: localized.optional(),
  icon: z.string().default('☕'),
  title: localized.default({ es: 'Brief de primavera', en: 'Spring brief' }),
  /** "Compartida con el cliente" switch state. */
  shared: z.boolean().default(true),
  editedBy: z.string().optional(),
  blocks: z.array(block).default([]),
  width: z.number().default(520),
});

/**
 * A Cuaderno page (spa components/notebook/notebook-page-view.tsx): breadcrumb,
 * icon + title, sync status, the share-with-client switch, then editor blocks.
 */
export function NotebookPage(input: z.input<typeof notebookPageSchema>) {
  const p = notebookPageSchema.parse(input);
  const { locale } = usePiece();
  const t =
    locale === 'en'
      ? { notebook: 'Notebook', saved: 'Synced', share: 'Share with client', edited: 'Edited by' }
      : { notebook: 'Cuaderno', saved: 'Sincronizado', share: 'Compartir con el cliente', edited: 'Editado por' };
  return (
    <article className={cn(FLOAT_CARD, 'rounded-xl px-6 py-6 shadow-2xl')} style={{ width: p.width }}>
      <div className="mb-4 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
        <span>{t.notebook}</span>
        <ChevronRight className="size-3" />
        <span>{p.client}</span>
        {p.parent && (
          <>
            <ChevronRight className="size-3" />
            <span>{tr(p.parent, locale)}</span>
          </>
        )}
      </div>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md text-2xl leading-none">{p.icon}</span>
        <h3 className="m-0 min-w-0 flex-1 text-3xl font-semibold tracking-tight">{tr(p.title, locale)}</h3>
      </div>
      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Check className="size-3 text-[color:var(--success)]" /> {t.saved}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Share2 className="size-3.5 text-muted-foreground" />
          {t.share}
          <span className={cn('flex h-[1.15rem] w-8 items-center rounded-full p-px', p.shared ? 'bg-primary' : 'bg-input')}>
            <span className={cn('size-4 rounded-full bg-background shadow-xs', p.shared && 'translate-x-[calc(100%-2px)]')} />
          </span>
        </div>
        {p.editedBy && (
          <p className="m-0 text-xs text-muted-foreground">
            {t.edited} {p.editedBy}
          </p>
        )}
      </div>
      <div className="mt-6 flex flex-col gap-3 text-[15px] leading-relaxed">
        {p.blocks.map((b, i) => {
          switch (b.type) {
            case 'heading':
              return <h4 key={i} className="m-0 mt-1 text-xl font-semibold tracking-tight">{tr(b.text, locale)}</h4>;
            case 'paragraph':
              return <p key={i} className="m-0 text-foreground/90">{rich(tr(b.text, locale))}</p>;
            case 'bullets':
              return (
                <ul key={i} className="m-0 flex list-disc flex-col gap-1 pl-5">
                  {b.items.map((x, k) => <li key={k}>{rich(tr(x, locale))}</li>)}
                </ul>
              );
            case 'todos':
              return (
                <div key={i} className="flex flex-col gap-1.5">
                  {b.items.map((x, k) => (
                    <div key={k} className="flex items-center gap-2">
                      <span className={cn('flex size-4 items-center justify-center rounded-[4px] border', x.done ? 'border-primary bg-primary text-primary-foreground' : 'border-input')}>
                        {x.done && <Check className="size-3" strokeWidth={3} />}
                      </span>
                      <span className={cn(x.done && 'text-muted-foreground line-through')}>{tr(x.text, locale)}</span>
                    </div>
                  ))}
                </div>
              );
            case 'palette':
              return (
                <div key={i} className="my-1 flex flex-wrap items-start gap-3">
                  {b.swatches.map((s, k) => (
                    <div key={k} className="w-20">
                      <div className="h-16 w-full rounded-lg border border-border" style={{ background: s.hex }} />
                      <p className="m-0 mt-1 truncate font-mono text-[11px] text-muted-foreground">{s.hex.toUpperCase()}</p>
                      {s.name && <p className="m-0 mt-0.5 truncate text-xs text-foreground">{s.name}</p>}
                    </div>
                  ))}
                </div>
              );
          }
        })}
      </div>
    </article>
  );
}
