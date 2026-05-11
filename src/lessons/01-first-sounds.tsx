import { StrudelEditor } from '../components/StrudelEditor';
import type { LessonMeta } from './index';

export const meta: LessonMeta = {
  slug: 'first-sounds',
  title: 'Your first sound',
  blurb: 'Press play. Edit the code. Hear what changes.',
  order: 1,
};

export function Lesson() {
  return (
    <div className="space-y-6 text-neutral-300">
      <p>
        Below is a box of code. Click into it, then press the <strong>play</strong> button (or hit{' '}
        <kbd className="rounded bg-neutral-800 px-1.5 py-0.5 font-mono text-xs">Ctrl + Enter</kbd>)
        and you should hear a drum beat. Press <strong>stop</strong> (or{' '}
        <kbd className="rounded bg-neutral-800 px-1.5 py-0.5 font-mono text-xs">Ctrl + .</kbd>) to
        silence it.
      </p>

      <StrudelEditor code={`sound("bd hh sd hh")`} />

      <p>
        That's it — you just made music with code. The string <code>"bd hh sd hh"</code> is a
        sequence of <em>drum names</em>: <code>bd</code> is a bass drum, <code>hh</code> is a
        hi-hat, <code>sd</code> is a snare. Strudel splits the cycle (about two seconds) into four
        equal slots and plays one drum per slot.
      </p>

      <section className="card space-y-3">
        <h3 className="text-sm font-medium tracking-wider text-brand-300 uppercase">Try this</h3>
        <p>Edit the code below and press play again. A few things to try one at a time:</p>
        <ul className="ml-5 list-disc space-y-1 text-sm">
          <li>
            Add more events: <code>"bd hh sd hh cp"</code>
          </li>
          <li>
            Speed up the hi-hats: <code>"bd hh*4 sd hh*4"</code>
          </li>
          <li>
            Use a different drum machine: <code>{`sound("bd hh sd hh").bank("RolandTR909")`}</code>
          </li>
          <li>
            Add a rest: <code>"bd ~ sd ~"</code> (the tilde means silence)
          </li>
        </ul>
        <StrudelEditor code={`sound("bd hh sd hh")`} />
      </section>

      <p className="text-sm text-neutral-500">
        Every cycle, the new code takes over at the next bar — so you can edit while it plays.
        That's the live-coding loop in one sentence.
      </p>
    </div>
  );
}
