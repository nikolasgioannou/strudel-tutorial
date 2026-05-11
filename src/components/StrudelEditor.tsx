import { useRef } from 'react';
import { Play, Square } from 'lucide-react';
import { useStrudelPlayback, type StrudelEl } from './useStrudelPlayback';

/**
 * <strudel-editor> custom element. Registered by the @strudel/repl CDN script
 * in index.html. Inside `declare module 'react'`, type names resolve against
 * the react module directly — no `import type` needed.
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

interface Props {
  /** Starter code. Live edits inside the editor don't propagate back to this prop. */
  code: string;
}

export function StrudelEditor({ code }: Props) {
  const ref = useRef<StrudelEl | null>(null);
  const { isPlaying, toggle } = useStrudelPlayback(ref, code);

  return (
    <div className="overflow-hidden rounded-md border border-neutral-800 bg-neutral-900">
      <div className="flex items-center justify-end border-b border-neutral-800 px-2 py-1.5">
        <button
          type="button"
          onClick={toggle}
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
