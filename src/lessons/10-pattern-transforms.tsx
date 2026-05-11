import { StrudelEditor } from '../components/StrudelEditor';
import { QuizEditor } from '../components/QuizEditor';
import type { LessonMeta } from './index';

export const meta: LessonMeta = {
  slug: 'pattern-transforms',
  title: 'Transforming patterns — rev, jux, fast, ply',
  blurb: 'Take any pattern and warp it: reverse, stereo-mirror, speed-shift, repeat.',
  order: 10,
};

export function Lesson() {
  return (
    <div className="space-y-6 text-neutral-300">
      <p>
        So far we've <em>built</em> patterns: stack drums, write notes, set tempos. Strudel's next
        superpower is <em>transforming</em> existing patterns — taking what you've already got and
        warping it. A single transform can turn a flat loop into something that feels alive.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">
        <code>.rev()</code> — reverse the cycle
      </h2>
      <p>
        Plays the same events, but backwards in time. Last note first, first note last. It's
        instantly disorienting — your brain knows the melody but in the wrong order.
      </p>
      <StrudelEditor code={`note("c3 e3 g3 c4").s("piano")`} />
      <p>
        Add <code>.rev()</code>:
      </p>
      <StrudelEditor code={`note("c3 e3 g3 c4").s("piano").rev()`} />

      <h2 className="text-lg font-semibold text-neutral-100">
        <code>.jux(rev)</code> — the magic spice
      </h2>
      <p>
        Possibly the most-used trick in all of live coding. <code>.jux(fn)</code> stands for
        "juxtapose" — it plays the original on the left channel and <code>fn(original)</code> on the
        right channel at the same time. The most common version is <code>.jux(rev)</code> — original
        on the left, reversed on the right, simultaneously. Wide stereo image, instant Aphex Twin
        vibes.
      </p>
      <StrudelEditor code={`note("c3 e3 g3 c4 e4 g3 c4 e4").s("sawtooth").lpf(2000).jux(rev)`} />
      <p className="text-sm text-neutral-500">
        Put on headphones. The two ears hear different patterns moving in opposite directions — but
        it still sounds harmonically coherent because both versions use the same notes.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">
        <code>.fast(n)</code> and <code>.slow(n)</code>
      </h2>
      <p>
        We've seen <code>*N</code> and <code>/N</code> <em>inside</em> mini-notation. The
        method-style versions <code>.fast()</code> and <code>.slow()</code> apply to the whole
        pattern from outside. Useful when you're chaining lots of methods.
      </p>
      <StrudelEditor code={`sound("bd hh sd hh").fast(2)`} />
      <p>The fast factor can itself be a pattern — speed-up that changes:</p>
      <StrudelEditor code={`sound("bd hh sd hh").fast("<1 2 4 1>")`} />
      <p className="text-sm text-neutral-500">
        First cycle plays at normal speed, second twice as fast, third four times, fourth back to
        normal. Four-bar build-up with two characters.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">
        <code>.ply(n)</code> — repeat each event in place
      </h2>
      <p>
        <code>.ply(n)</code> repeats each event <em>n</em> times in its own slot. So a four-event
        pattern with <code>.ply(2)</code> becomes an eight-event pattern where every event is
        doubled.
      </p>
      <StrudelEditor code={`sound("bd hh sd cp").ply(2)`} />
      <p>
        Compare to <code>.fast(2)</code>: fast doubles the whole pattern, ply doubles each event.
        Different feels.
      </p>
      <StrudelEditor code={`sound("bd hh sd cp").fast(2)`} />

      <h2 className="text-lg font-semibold text-neutral-100">Combining transforms</h2>
      <p>
        These all stack. Take a simple melody, reverse it, jux it, and slow it down — four
        decisions, totally different result:
      </p>
      <StrudelEditor
        code={`note("c3 d3 e3 g3 a3 g3 e3 d3").s("sawtooth").lpf(1500)
  .rev()
  .jux(rev)
  .slow(2)`}
      />
      <p className="text-sm text-neutral-500">
        The trick to interesting Strudel code isn't writing more notes; it's writing a small pattern
        and finding the right transforms. A single line plus three method calls is usually enough to
        fill a minute of music.
      </p>

      <section className="card space-y-3">
        <h3 className="text-sm font-medium tracking-wider text-brand-300 uppercase">Quiz</h3>
        <p className="text-sm">
          Take the drum pattern below and apply <strong>jux(rev)</strong> so the original plays on
          the left and the reversed version plays on the right.
        </p>
        <QuizEditor
          initialCode={`sound("bd hh sd hh oh cp")`}
          target={`sound("bd hh sd hh oh cp").jux(rev)`}
          hint="Chain .jux(rev) onto the end."
        />
      </section>

      <p className="text-sm text-neutral-500">
        Next lesson we move from individual sounds to <em>harmony</em>: building chord progressions,
        the engine behind almost every pop song.
      </p>
    </div>
  );
}
