import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { PlaybackContext, type PlaybackState } from './context';

/**
 * Wraps the app so any <StrudelEditor> can coordinate via `usePlayback()`.
 * Only one editor at a time holds `activeId`; when another editor calls
 * `request`, the previous one falls out and its effect handler calls stop().
 */
export function PlaybackProvider({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const request = useCallback((id: string) => setActiveId(id), []);
  const release = useCallback(
    (id: string) => setActiveId((curr) => (curr === id ? null : curr)),
    [],
  );

  const value = useMemo<PlaybackState>(
    () => ({ activeId, request, release }),
    [activeId, request, release],
  );

  return <PlaybackContext.Provider value={value}>{children}</PlaybackContext.Provider>;
}
