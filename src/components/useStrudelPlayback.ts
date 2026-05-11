import { useCallback, useEffect, useId } from 'react';
import { usePlayback } from '../playback/context';

/** Shape of the imperative editor attached to <strudel-editor> after upgrade. */
export interface StrudelMirror {
  evaluate?: () => void;
  stop?: () => void;
  setCode?: (s: string) => void;
  /** CodeMirror EditorView, present once the element has fully upgraded. */
  view?: { state: { doc: { toString(): string } } };
  /** Some older builds expose code as a property. */
  code?: string;
}

export type StrudelEl = HTMLElement & { code?: string; editor?: StrudelMirror };

/**
 * Wires a <strudel-editor> ref into the shared playback context. Components
 * that render a strudel-editor element call this and get back the imperative
 * play/stop/toggle helpers plus the current play state.
 *
 * Responsibilities:
 *   - Push the `code` prop into the editor when it changes (no-op for the
 *     initial mount; useful when a parent updates the code, e.g. "reveal
 *     answer" on a quiz).
 *   - Listen for activeId in the playback context — when another editor
 *     becomes active, stop our audio so only one editor plays at a time.
 *   - On unmount, stop audio and release the active slot.
 */
export function useStrudelPlayback(
  ref: React.RefObject<StrudelEl | null>,
  code: string,
): {
  id: string;
  isPlaying: boolean;
  play: () => void;
  stop: () => void;
  toggle: () => void;
} {
  const id = useId();
  const { activeId, request, release } = usePlayback();
  const isPlaying = activeId === id;

  // Push code in whenever the prop changes.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.editor?.setCode) el.editor.setCode(code);
    else el.code = code;
  }, [code, ref]);

  // Another editor became active — silence ourselves.
  useEffect(() => {
    if (isPlaying) return;
    ref.current?.editor?.stop?.();
  }, [isPlaying, ref]);

  // Unmount cleanup: capture ref.current at mount-time so cleanup uses a
  // stable handle (avoids the "ref may have changed by cleanup" warning).
  useEffect(() => {
    const el = ref.current;
    return () => {
      el?.editor?.stop?.();
      release(id);
    };
  }, [id, ref, release]);

  const play = useCallback(() => {
    request(id);
    ref.current?.editor?.evaluate?.();
  }, [id, ref, request]);

  const stop = useCallback(() => {
    ref.current?.editor?.stop?.();
    release(id);
  }, [id, ref, release]);

  const toggle = useCallback(() => {
    if (isPlaying) stop();
    else play();
  }, [isPlaying, play, stop]);

  return { id, isPlaying, play, stop, toggle };
}

/**
 * Read the editor's current text. The <strudel-editor> attribute does NOT
 * auto-update when the user types — we have to dig into CodeMirror's state.
 * Falls back through several shapes for resilience to future strudel-repl
 * versions.
 */
export function readEditorCode(el: StrudelEl | null): string | null {
  if (!el) return null;
  const editor = el.editor;
  if (!editor) return null;

  if (editor.view?.state?.doc?.toString) return editor.view.state.doc.toString();
  if (typeof editor.code === 'string') return editor.code;

  return null;
}
