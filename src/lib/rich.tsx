import { Fragment, type ReactNode } from 'react';

/**
 * Tiny inline markup for copy strings, so emphasis lives in content JSON
 * without HTML:
 *   **text**  → strong, in the foreground colour (for muted subheads)
 *   [[text]]  → brand violet accent
 *   \n        → line break
 */
export function rich(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\[\[[^\]]+\]\]|\n)/g);
  return parts.map((p, i) => {
    if (p === '\n') return <br key={i} />;
    if (p.startsWith('**') && p.endsWith('**'))
      return (
        <strong key={i} className="font-bold text-foreground">
          {p.slice(2, -2)}
        </strong>
      );
    if (p.startsWith('[[') && p.endsWith(']]'))
      return (
        <span key={i} className="text-brand">
          {p.slice(2, -2)}
        </span>
      );
    return <Fragment key={i}>{p}</Fragment>;
  });
}
