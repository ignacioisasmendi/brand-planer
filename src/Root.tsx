import { Folder, Still } from 'remotion';
import { z } from 'zod';
import './styles/index.css';
import './lib/fonts';
import { splitContent, type ContentFile } from './lib/content';
import { THEMES } from './lib/i18n';
import { Piece } from './templates/layouts';
import { REGISTRY, type LayerName } from './templates/stage';
import { TEMPLATES } from './templates';

// Catalog demos double as each template's Studio defaults.
const demos = (require as any).context('../content/_catalog', false, /\.json$/);
/**
 * Parsed through the template schema so every `.default()` is filled in —
 * Studio's props editor walks the schema and reads `value[key]` on nested
 * objects (e.g. `copyBackground.variant`), which crashes on a missing default.
 */
function demoFor(file: string, schema: z.AnyZodObject): Record<string, unknown> {
  const key = `./${file}.json`;
  const raw = demos.keys().includes(key) ? splitContent(demos(key) as ContentFile).props : {};
  return schema.parse(raw);
}

/**
 * Renders one catalog component on a plain surface — used for CATALOG.md
 * thumbnails and for trying a component in Studio before using it in a piece.
 */
export const specimenSchema = z.object({
  use: z.enum(Object.keys(REGISTRY) as [LayerName, ...LayerName[]]),
  props: z.record(z.unknown()).default({}),
  zoom: z.number().default(1),
  theme: z.enum(THEMES).default('light'),
  surface: z.enum(['card', 'stage']).default('card'),
  width: z.number().default(800),
  height: z.number().default(500),
});

function Specimen(input: z.input<typeof specimenSchema>) {
  const p = specimenSchema.parse(input);
  const C = REGISTRY[p.use].C as React.ComponentType<Record<string, unknown>>;
  return (
    <Piece theme={p.theme} locale="es">
      <div
        className="absolute inset-0"
        style={{
          background:
            p.surface === 'stage'
              ? 'linear-gradient(160deg, var(--stage-from) 0%, var(--stage-via) 55%, var(--stage-to) 100%)'
              : 'var(--background)',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative" style={{ zoom: p.zoom }}>
          <C {...p.props} />
        </div>
      </div>
    </Piece>
  );
}

export const RemotionRoot = () => (
  <>
    <Folder name="Templates">
      {TEMPLATES.map((t) => (
        <Still
          key={t.id}
          id={t.id}
          component={t.component}
          width={t.width}
          height={t.height}
          schema={t.schema}
          defaultProps={demoFor(t.file, t.schema)}
        />
      ))}
    </Folder>
    <Folder name="Catalog">
      <Still
        id="Specimen"
        component={Specimen}
        width={800}
        height={500}
        schema={specimenSchema}
        defaultProps={specimenSchema.parse({ use: 'PostCard', props: {}, zoom: 1 })}
        calculateMetadata={({ props }) => ({ width: props.width ?? 800, height: props.height ?? 500 })}
      />
    </Folder>
  </>
);
