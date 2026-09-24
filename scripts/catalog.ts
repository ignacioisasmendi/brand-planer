/**
 * npm run catalog — renders the thumbnails CATALOG.md shows:
 *   docs/catalog/template-<Name>.png   every template with its content/_catalog demo
 *   docs/catalog/<Name>.png            every primitive + mockup on its own (Specimen)
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { splitContent, type ContentFile } from '../src/lib/content';
import { TEMPLATES } from '../src/templates';
import { run, type Job } from './render';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'docs/catalog');

type Spec = { use: string; props?: Record<string, unknown>; zoom?: number; width?: number; height?: number; surface?: 'card' | 'stage' };

const SPECIMENS: Spec[] = [
  // primitives
  { use: 'Logo', props: { size: 120 }, width: 400, height: 240 },
  { use: 'Wordmark', props: { size: 72 }, width: 500, height: 240 },
  { use: 'LogoLockup', props: { size: 90, platform: 'instagram' }, width: 500, height: 240 },
  { use: 'Pill', props: { label: 'Nuevo', size: 22 }, width: 400, height: 200 },
  { use: 'Eyebrow', props: { label: 'Para agencias', size: 22 }, width: 400, height: 200 },
  { use: 'Headline', props: { text: 'Tu semana, [[programada]]', size: 64 }, width: 800, height: 240 },
  { use: 'Subhead', props: { text: 'en tus **primeros 2 meses**, en cualquier plan.', size: 30 }, width: 800, height: 200 },
  { use: 'BigStat', props: { value: '30%', suffix: 'OFF', size: 150 }, width: 600, height: 260 },
  { use: 'Cta', props: { label: 'Probalo gratis', size: 28 }, width: 500, height: 200 },
  { use: 'Sparkle', props: { size: 80, color: 'brand' }, width: 300, height: 200 },
  { use: 'HandArrow', props: { width: 120, height: 240 }, width: 300, height: 300, surface: 'stage' },
  {
    use: 'CouponTicket',
    props: { eyebrow: 'Pase reservado', title: 'Tu lugar\nen Planer', code: 'PLANER30', foot: 'Cualquier plan', stubValue: '2', stubUnit: 'Meses' },
    width: 600, height: 360, surface: 'stage',
  },
  // mockups
  { use: 'PostCard', props: { platform: 'instagram' }, zoom: 1.2, width: 520, height: 640, surface: 'stage' },
  { use: 'PostCard', props: { platform: 'facebook', width: 260 }, zoom: 1.4, width: 520, height: 640, surface: 'stage' },
  { use: 'PostCard', props: { platform: 'tiktok', width: 250, image: 'assets/photos/cafetera.jpg' }, zoom: 1.2, width: 520, height: 640, surface: 'stage' },
  { use: 'PostCard', props: { platform: 'linkedin', width: 320 }, zoom: 1.2, width: 520, height: 640, surface: 'stage' },
  { use: 'PublicationCard', props: { caption: 'Lanzamiento del blend de primavera', image: 'assets/photos/cafe-especialidad.jpg', approved: true }, zoom: 1.4, width: 500, height: 560 },
  {
    use: 'CalendarWeek',
    props: {
      days: 5,
      posts: [
        { day: 3, time: '09:30', caption: 'Colección primavera', status: 'published', image: 'assets/photos/croissant.jpg' },
        { day: 4, time: '12:00', caption: 'Nuevo blend', status: 'scheduled', image: 'assets/photos/cafe-especialidad.jpg' },
        { day: 6, time: '18:00', caption: 'Detrás de la barra', platform: 'tiktok', status: 'draft', tint: 'teal' },
      ],
    },
    width: 900, height: 560,
  },
  {
    use: 'KanbanColumn',
    props: {
      name: 'En progreso',
      tasks: [
        { title: 'Editar video de lanzamiento', labels: ['Video'], priority: 'URGENT', dueDate: '12 mar', cover: 'red' },
        { title: 'Escribir copies de la semana', labels: ['Contenido'], priority: 'HIGH', checklistDone: 3, checklistTotal: 5 },
      ],
    },
    zoom: 1.3, width: 560, height: 520,
  },
  { use: 'NotebookPage', props: { editedBy: 'Ana', blocks: [{ type: 'paragraph', text: 'Tono cálido y cercano.' }, { type: 'todos', items: [{ text: 'Fotos del latte art', done: true }, { text: 'Programar el lanzamiento' }] }] }, width: 700, height: 560 },
  { use: 'PhoneFrame', props: { width: 300, center: true }, width: 500, height: 700, surface: 'stage' },
  { use: 'BrowserFrame', props: { width: 700, height: 400 }, width: 900, height: 560, surface: 'stage' },
  { use: 'AnalyticsCard', props: { chart: 'bars', label: 'Tasa de interacción', value: '5,0%' }, zoom: 2, width: 500, height: 360 },
  { use: 'NotificationToast', props: { icon: 'Clock', title: 'Jueves 29', meta: '11:45' }, zoom: 2, width: 500, height: 200 },
  { use: 'NotificationToast', props: { variant: 'toast', platform: 'instagram', title: 'Publicado en Instagram', meta: 'Nuevo blend de temporada · hace 1 min' }, zoom: 1.6, width: 700, height: 240 },
  { use: 'AvatarStack', props: { extra: 4, size: 48, label: '7 personas' }, width: 500, height: 200 },
];

const jobs: Job[] = [];
for (const t of TEMPLATES) {
  const file = path.join(ROOT, 'content/_catalog', `${t.file}.json`);
  const { props } = splitContent(JSON.parse(readFileSync(file, 'utf8')) as ContentFile);
  jobs.push({ id: t.id, props: { ...props, locale: 'es', theme: 'light' }, scale: 0.5, out: path.join(OUT, `template-${t.id}.png`) });
}
const seen = new Map<string, number>();
for (const s of SPECIMENS) {
  const n = (seen.get(s.use) ?? 0) + 1;
  seen.set(s.use, n);
  const platform = (s.props?.platform as string | undefined) ?? '';
  const name = n === 1 && !platform ? s.use : `${s.use}-${platform || n}`;
  jobs.push({ id: 'Specimen', props: { zoom: 1, surface: 'card', ...s }, scale: 1, out: path.join(OUT, `${name}.png`) });
}
await run(jobs);
