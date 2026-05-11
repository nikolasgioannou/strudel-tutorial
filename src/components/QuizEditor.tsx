import { useCallback, useRef, useState } from 'react';
import { Check, Eye, Play, Square } from 'lucide-react';
import { useStrudelPlayback, readEditorCode, type StrudelEl } from './useStrudelPlayback';
import { comparePatterns } from '../quiz/evaluator';

type QuizStatus = 'idle' | 'checking' | 'correct' | 'wrong';

interface Props {
  /** What the user starts with — often empty, or a partial template. */
  initialCode: string;
  /** The reference code the user is trying to match. */
  target: string;
  /** Optional hint text shown below the editor while idle. */
  hint?: string;
}

/**
 * A code editor with an extra "Check" action. The user types, hits Check,
 * and we compare the haps their pattern produces against the target's. They
 * can also reveal the answer, which overwrites their code with the target.
 *
 * Equivalence is structural — `bd*2` and `bd bd` both pass for the same target.
 */
export function QuizEditor({ initialCode, target, hint }: Props) {
  const ref = useRef<StrudelEl | null>(null);
  // We keep `code` in React state so "Reveal answer" can re-mount the editor
  // with new content. While the user types, the underlying CodeMirror state
  // is the source of truth — we read from it on Check.
  const [code, setCode] = useState(initialCode);
  const [status, setStatus] = useState<QuizStatus>('idle');
  const [reason, setReason] = useState<string | undefined>(undefined);
  const [revealed, setRevealed] = useState(false);

  const { isPlaying, toggle } = useStrudelPlayback(ref, code);

  const handleCheck = useCallback(() => {
    const userCode = readEditorCode(ref.current) ?? code;
    setStatus('checking');
    const result = comparePatterns(userCode, target);
    if (result.match) {
      setStatus('correct');
      setReason(undefined);
    } else {
      setStatus('wrong');
      setReason(result.reason);
    }
  }, [code, target]);

  const handleReveal = useCallback(() => {
    setCode(target);
    setRevealed(true);
    setStatus('idle');
    setReason(undefined);
  }, [target]);

  // Visual treatment of the wrapper based on status.
  const wrapperBorder =
    status === 'correct'
      ? 'border-emerald-700/70'
      : status === 'wrong'
        ? 'border-rose-800/70'
        : 'border-neutral-800';

  return (
    <div className="space-y-2">
      <div className={`overflow-hidden rounded-md border bg-neutral-900 ${wrapperBorder}`}>
        <div className="flex items-center justify-between gap-2 border-b border-neutral-800 px-2 py-1.5">
          <span className="font-mono text-xs tracking-wider text-neutral-500 uppercase">Quiz</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleReveal}
              aria-label="Reveal answer"
              className="inline-flex h-6 items-center gap-1 rounded-sm px-1.5 text-xs text-neutral-500 transition hover:bg-neutral-800 hover:text-brand-300"
            >
              <Eye size={12} />
              <span>{revealed ? 'Revealed' : 'Show answer'}</span>
            </button>
            <button
              type="button"
              onClick={handleCheck}
              aria-label="Check"
              className="inline-flex h-6 items-center gap-1 rounded-sm bg-brand-700/25 px-2 text-xs text-brand-300 transition hover:bg-brand-700/40"
            >
              <Check size={12} />
              <span>Check</span>
            </button>
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
        </div>
        <strudel-editor ref={ref} code={code} />
      </div>
      <Feedback status={status} reason={reason} hint={hint} />
    </div>
  );
}

function Feedback({
  status,
  reason,
  hint,
}: {
  status: QuizStatus;
  reason: string | undefined;
  hint: string | undefined;
}) {
  if (status === 'correct') {
    return (
      <p className="text-sm text-emerald-400">
        ✓ Correct — your pattern matches the target. Press play to hear it.
      </p>
    );
  }
  if (status === 'wrong') {
    return (
      <p className="text-sm text-rose-400">
        ✗ Not yet. {reason ?? 'Your pattern produces different events.'}
      </p>
    );
  }
  if (hint) {
    return <p className="text-sm text-neutral-500">Hint: {hint}</p>;
  }
  return null;
}
