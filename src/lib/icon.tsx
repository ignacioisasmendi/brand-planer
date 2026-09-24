import { icons, type LucideProps } from 'lucide-react';

export type IconName = keyof typeof icons;

/** Lucide icon by PascalCase name (`Clock`, `CalendarDays`) — the spa's icon set. */
export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const C = icons[name as IconName];
  if (!C) throw new Error(`Unknown lucide icon "${name}"`);
  return <C {...props} />;
}
