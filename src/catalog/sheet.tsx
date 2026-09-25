/**
 * ComponentSheet — every primitive, mockup and template on one page, each under
 * its exact catalog name. `npm run sheet` renders it to docs/catalog/sheet-<theme>.png;
 * in Studio it is Catalog → ComponentSheet.
 */
import type { ComponentType, ReactElement } from 'react';
import { z } from 'zod';
import { THEMES } from '../lib/i18n';
import { Background } from '../primitives';
import { Piece } from '../templates/layouts';
import { REGISTRY, type LayerName } from '../templates/stage';
import { TEMPLATES } from '../templates';
import { demoFor } from './demos';
import { SPECIMENS } from './specimens';

export const sheetSchema = z.object({ theme: z.enum(THEMES).default('light') });

const COLS = 4;
const CELL = 520;
const GAP = 40;
const PAD = 72;
const LABEL = 64;
const SECTION = 96;
export const SHEET_WIDTH = PAD * 2 + COLS * CELL + (COLS - 1) * GAP;

type Cell = {
  name: string;
  note?: string;
  /** Design box the item is drawn in, scaled to CELL wide. */
  width: number;
  height: number;
  render: () => ReactElement;
};

const STAGE_BG = 'linear-gradient(160deg, var(--stage-from) 0%, var(--stage-via) 55%, var(--stage-to) 100%)';

function sections(): Array<{ title: string; cells: Cell[] }> {
  const spec = (group: 'Primitives' | 'Mockups'): Cell[] =>
    SPECIMENS.filter((s) => s.group === group).map((s) => {
      const C = REGISTRY[s.use as LayerName].C as ComponentType<Record<string, unknown>>;
      return {
        name: s.use,
        note: s.note,
        width: s.width,
        height: s.height,
        render: () => (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: s.surface === 'stage' ? STAGE_BG : 'var(--background)' }}>
            <div className="relative" style={{ zoom: s.zoom ?? 1 }}>
              <C {...(s.props ?? {})} />
            </div>
          </div>
        ),
      };
    });

  const backgrounds: Cell[] = (['flat', 'gradient', 'grid', 'glow'] as const).map((variant) => ({
    name: 'Background',
    note: `variant: ${variant}`,
    width: 600,
    height: 340,
    render: () => <Background variant={variant} />,
  }));

  const templates: Cell[] = TEMPLATES.map((t) => ({
    name: t.id,
    note: `${t.width}×${t.height}`,
    width: t.width,
    height: t.height,
    render: () => <t.component {...demoFor(t.file, t.schema)} />,
  }));

  return [
    { title: 'Primitives', cells: [...spec('Primitives'), ...backgrounds] },
    { title: 'Mockups', cells: spec('Mockups') },
    { title: 'Templates', cells: templates },
  ];
}

/** Wide landscape items (≥700px, wider than tall) span two columns so they stay legible. */
const spanOf = (cell: Cell) => (cell.width >= 700 && cell.width / cell.height >= 1.2 ? 2 : 1);

/** Absolute layout: rows packed left to right, each row as tall as its tallest cell. */
function layout() {
  let y = PAD;
  const placed: Array<
    | { kind: 'title'; title: string; y: number }
    | { kind: 'cell'; cell: Cell; x: number; y: number; w: number; k: number }
  > = [];
  for (const section of sections()) {
    placed.push({ kind: 'title', title: section.title, y });
    y += SECTION;
    let col = 0;
    let rowH = 0;
    for (const cell of section.cells) {
      const span = spanOf(cell);
      if (col + span > COLS) {
        y += rowH + GAP;
        col = 0;
        rowH = 0;
      }
      const w = span * CELL + (span - 1) * GAP;
      const k = w / cell.width;
      placed.push({ kind: 'cell', cell, x: PAD + col * (CELL + GAP), y, w, k });
      rowH = Math.max(rowH, LABEL + cell.height * k);
      col += span;
    }
    y += rowH + GAP * 2;
  }
  return { placed, height: y + PAD - GAP * 2 };
}

export const sheetHeight = () => Math.ceil(layout().height);

export function ComponentSheet(input: z.input<typeof sheetSchema>) {
  const { theme } = sheetSchema.parse(input);
  const { placed } = layout();
  return (
    <Piece theme={theme} locale="es">
      <div className="absolute inset-0 bg-background" />
      {placed.map((p, i) =>
        p.kind === 'title' ? (
          <h2
            key={i}
            className="absolute m-0 font-bold text-foreground"
            style={{ left: PAD, top: p.y, fontSize: 44, letterSpacing: '-0.02em' }}
          >
            {p.title}
          </h2>
        ) : (
          <div key={i} className="absolute" style={{ left: p.x, top: p.y, width: p.w }}>
            <div className="flex items-baseline gap-3" style={{ height: LABEL }}>
              <span className="font-mono font-semibold text-foreground" style={{ fontSize: 24 }}>
                {p.cell.name}
              </span>
              {p.cell.note && (
                <span className="font-mono text-muted-foreground" style={{ fontSize: 16 }}>
                  {p.cell.note}
                </span>
              )}
            </div>
            <div
              className="relative overflow-hidden rounded-xl border"
              style={{ width: p.w, height: p.cell.height * p.k }}
            >
              <div className="absolute top-0 left-0" style={{ width: p.cell.width, height: p.cell.height, zoom: p.k }}>
                {p.cell.render()}
              </div>
            </div>
          </div>
        ),
      )}
    </Piece>
  );
}
