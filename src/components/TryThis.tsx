import { useRef } from 'react';
import { Play, Sparkles, Square } from 'lucide-react';
import { useStrudelPlayback, type StrudelEl } from './useStrudelPlayback';

interface Props {
  /** Short prompt describing the experiment ("Try changing the snare to a clap"). */
  prompt: string;
  /** Starter code the user can edit. */
  code: string;
}

/**
 * Inviting an experiment, not testing for a right answer. Replaces the old
 * QuizEditor — same editable Strudel editor, no pattern-equivalence check,
 * no "reveal answer" button. The prompt sets context; the user pokes.
 *
 * Visually distinguished from a regular StrudelEditor by an accent-colored
 * border and a "Try this" header, so readers know it's their turn to play.
 */
export function TryThis({ prompt, code }: Props) {
  const ref = useRef<StrudelEl | null>(null);
  const { isPlaying, toggle } = useStrudelPlayback(ref, code);

  return (
    <section className="space-y-2 rounded-md border border-brand-700/40 bg-brand-900/10 p-3">
      <header className="flex items-center gap-2 text-brand-300">
        <Sparkles size={14} />
        <span className="text-xs font-medium tracking-wider uppercase">Try this</span>
      </header>
      <p className="text-sm text-neutral-300">{prompt}</p>
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
    </section>
  );
}
