import { createContext, useContext } from 'react';

/** Globally coordinates which Strudel editor currently holds the playing slot. */
export interface PlaybackState {
  activeId: string | null;
  /** Become the active editor; whichever id was active will fall out. */
  request: (id: string) => void;
  /** Release the active slot if this editor currently owns it. */
  release: (id: string) => void;
}

export const PlaybackContext = createContext<PlaybackState | null>(null);

export function usePlayback(): PlaybackState {
  const ctx = useContext(PlaybackContext);
  if (!ctx) throw new Error('usePlayback must be used inside <PlaybackProvider>');
  return ctx;
}
