import { createContext, useContext, type ReactNode } from 'react';
import type { Locale, Theme } from './i18n';

interface PieceContext {
  theme: Theme;
  locale: Locale;
}

const Ctx = createContext<PieceContext>({ theme: 'light', locale: 'es' });

/** Set once by each template; mockups read the locale for their UI chrome. */
export function PieceProvider({ theme, locale, children }: PieceContext & { children: ReactNode }) {
  return <Ctx.Provider value={{ theme, locale }}>{children}</Ctx.Provider>;
}

export const usePiece = () => useContext(Ctx);
