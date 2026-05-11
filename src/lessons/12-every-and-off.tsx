import { StrudelEditor } from '../components/StrudelEditor';
import { QuizEditor } from '../components/QuizEditor';
import type { LessonMeta } from './index';

export const meta: LessonMeta = {
  slug: 'every-and-off',
  title: 'Variation — every and off',
  blurb: 'Turn a 4-bar loop into something that evolves for minutes.',
  order: 12,
};

export function Lesson() {
  return (
    <div className="space-y-6 text-neutral-300">
      <p>
        A loop that never changes gets tedious in about 30 seconds. Two tools — and two ideas — will
        fix that for free, without writing a single new note.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">
        <code>.every(n, fn)</code> — "do this every N cycles"
      </h2>
      <p>
        <code>.every(n, fn)</code> takes a function that transforms a pattern and applies it only on
        every <em>n</em>-th cycle. The rest of the time the pattern plays normally — so you get long
        stretches of the familiar loop, punctuated by a moment of surprise.
      </p>
      <p>A drum loop with no variation:</p>
      <StrudelEditor code={`sound("bd hh sd hh, ~ ~ ~ cp")`} />
      <p>
        Now reverse every 4th cycle. Three normal bars, one reversed bar, repeat. The brain starts
        to predict the loop, and then it's broken — exactly when an arrangement would normally call
        for a fill.
      </p>
      <StrudelEditor code={`sound("bd hh sd hh, ~ ~ ~ cp").every(4, rev)`} />
      <p>
        The function is just a name — anything you'd write inline can go there. Try{' '}
        <code>.every(4, x =&gt; x.fast(2))</code> — every 4th cycle plays twice as fast:
      </p>
      <StrudelEditor code={`sound("bd hh sd hh, ~ ~ ~ cp").every(4, x => x.fast(2))`} />
      <p>
        Or stack two: every 4 bars reverse, every 8 bars also slow down. Each transform fires
        independently:
      </p>
      <StrudelEditor
        code={`sound("bd hh sd hh, ~ ~ ~ cp")
  .every(4, rev)
  .every(8, x => x.fast(2))`}
      />

      <h2 className="text-lg font-semibold text-neutral-100">
        <code>.off(t, fn)</code> — harmonised echoes
      </h2>
      <p>
        <code>.off(t, fn)</code> plays the pattern as normal, <em>and at the same time</em> plays a
        delayed-and-transformed copy of itself, starting <em>t</em> cycles later. It's like a ghost
        following the melody.
      </p>
      <p>A melody on its own:</p>
      <StrudelEditor
        code={`setcpm(60)
n("0 2 4 6 4 2 0 -2").scale("C:minor").s("piano")`}
      />
      <p>
        Now add a copy offset by an 8th note (<code>1/8</code> of a cycle), shifted up 7 scale
        degrees — exactly an octave in our 7-note scale. It sounds like two pianists in
        conversation.
      </p>
      <StrudelEditor
        code={`setcpm(60)
n("0 2 4 6 4 2 0 -2").scale("C:minor")
  .off(1/8, x => x.add(7))
  .s("piano")`}
      />
      <p>
        Stack multiple <code>.off</code> calls and the texture gets thicker. Each <code>.off</code>{' '}
        adds another delayed voice; here's three voices at different intervals — the original, plus
        a 5th above one 8th later, plus an octave above 1/4 later:
      </p>
      <StrudelEditor
        code={`setcpm(60)
n("0 2 4 6 4 2 0 -2").scale("C:minor")
  .off(1/8, x => x.add(4))
  .off(1/4, x => x.add(7))
  .s("piano")`}
      />
      <p className="text-sm text-neutral-500">
        This is how live coders make sparse code sound dense. One melody plus two <code>.off</code>{' '}
        calls and you've got three-voice counterpoint. The same trick fills cathedrals when an
        organist holds the pedal note and plays a melody on top — the held note is the "delayed
        harmonised echo" of itself, kind of.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Combining the two ideas</h2>
      <p>
        <code>.every</code> handles long-form variation; <code>.off</code> handles harmonic
        thickening. Together they turn a 1-bar pattern into something that evolves for as long as
        you leave it running.
      </p>
      <StrudelEditor
        code={`setcpm(60)
stack(
  sound("bd ~ bd ~, ~ sd ~ sd, hh*8").every(4, rev),
  n("0 2 4 6 4 2 0 -2").scale("C:minor")
    .off(1/8, x => x.add(7))
    .s("piano")
    .every(8, x => x.fast(2))
)`}
      />

      <section className="card space-y-3">
        <h3 className="text-sm font-medium tracking-wider text-brand-300 uppercase">Quiz</h3>
        <p className="text-sm">
          Take a hi-hat pattern and make it <strong>reverse every 4 cycles</strong>. (Reversing a
          hi-hat sounds the same, but doing the same on a more complex pattern is how you'd actually
          use this — practising the syntax.)
        </p>
        <QuizEditor
          initialCode={`sound("hh*8")`}
          target={`sound("hh*8").every(4, rev)`}
          hint="Chain .every(4, rev) onto the end."
        />
      </section>

      <p className="text-sm text-neutral-500">
        You now know enough to build a full track. Drums, bass, chords, melody, sound design,
        variation — every primitive from here on layers onto these foundations.
      </p>
    </div>
  );
}
