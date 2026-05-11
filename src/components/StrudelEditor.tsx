import { useCallback, useEffect, useId, useRef } from 'react';
import { Play, Square } from 'lucide-react';
import { usePlayback } from '../playback/context';

/**
 * <strudel-editor> custom element. Registered by the @strudel/repl CDN script
 * in index.html. The element's internal `editor` property exposes a
 * StrudelMirror instance with imperative methods (.evaluate(), .stop()).
 *
 * Inside `declare module 'react'`, type names resolve against the react module
 * directly — so DetailedHTMLProps / HTMLAttributes don't need to be imported
 * here; we just reference them with the `React.` prefix.
 */
declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'strudel-editor': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          code?: string;
          sync?: boolean;
          solo?: boolean;
        },
        HTMLElement
      >;
    }
  }
}

/** Shape of the imperative editor attached to the custom element after upgrade. */
interface StrudelMirror {
  evaluate?: () => void;
  stop?: () => void;
  setCode?: (s: string) => void;
}
type StrudelEl = HTMLElement & { code?: string; editor?: StrudelMirror };

interface Props {
  /** Starter code. Live edits inside the editor don't propagate back to this prop. */
  code: string;
}

export function StrudelEditor({ code }: Props) {
  // Stable per-instance id used as the playback coordinator key.
  const id = useId();
  const { activeId, request, release } = usePlayback();
  const isPlaying = activeId === id;

  const ref = useRef<StrudelEl | null>(null);

  // Push code into the editor whenever the prop changes (rare for static lessons,
  // but keeps the API honest if a parent ever updates it).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.editor?.setCode) el.editor.setCode(code);
    else el.code = code;
  }, [code]);

  // React to becoming inactive: if another editor took the slot, stop our audio.
  useEffect(() => {
    if (isPlaying) return;
    ref.current?.editor?.stop?.();
  }, [isPlaying]);

  // Best-effort stop on unmount so navigating between lessons silences audio.
  // Capture ref.current inside the effect — by the time cleanup runs, the ref
  // is still pointing at the same custom element (its lifetime matches ours).
  useEffect(() => {
    const el = ref.current;
    return () => {
      el?.editor?.stop?.();
      release(id);
    };
  }, [id, release]);

  const handleToggle = useCallback(() => {
    if (isPlaying) {
      ref.current?.editor?.stop?.();
      release(id);
    } else {
      // Claim the active slot first; that triggers other editors to stop.
      request(id);
      ref.current?.editor?.evaluate?.();
    }
  }, [id, isPlaying, request, release]);

  return (
    // Card-shaped container. The toolbar lives in its own row, then a 1px
    // divider, then the actual editor body (the foreign <div> that strudel
    // inserts after <strudel-editor>).
    <div className="overflow-hidden rounded-md border border-neutral-800 bg-neutral-900">
      <div className="flex items-center justify-end border-b border-neutral-800 px-2 py-1.5">
        <button
          type="button"
          onClick={handleToggle}
          aria-label={isPlaying ? 'Stop' : 'Play'}
          aria-pressed={isPlaying}
          className={
            'inline-flex h-6 w-6 items-center justify-center rounded-sm text-neutral-400 transition ' +
            (isPlaying
              ? 'bg-brand-700/25 text-brand-300 hover:bg-brand-700/40'
              : 'hover:bg-neutral-800 hover:text-brand-300')
          }
        >
          {isPlaying ? (
            <Square size={12} fill="currentColor" />
          ) : (
            <Play size={12} fill="currentColor" />
          )}
        </button>
      </div>
      <strudel-editor ref={ref} code={code} />
    </div>
  );
}
