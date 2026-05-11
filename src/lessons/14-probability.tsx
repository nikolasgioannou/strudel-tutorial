import { StrudelEditor } from '../components/StrudelEditor';
import { QuizEditor } from '../components/QuizEditor';
import type { LessonMeta } from './index';

export const meta: LessonMeta = {
  slug: 'probability',
  title: 'Probability — making patterns feel human',
  blurb: 'A machine that decides anew every event. The opposite of robotic.',
  order: 14,
};

export function Lesson() {
  return (
    <div className="space-y-6 text-neutral-300">
      <p>
        Every pattern we've written so far is <em>deterministic</em> — given the same code, it plays
        exactly the same notes in exactly the same order. That's reliable, but it can also feel
        mechanical. Real drummers don't play perfectly the same fill every time. Real improvisers
        vary their lines. Strudel gives you the same option with a family of probability functions.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">The probability ladder</h2>
      <p>
        These all take a function and apply it to a pattern <em>with some probability per event</em>
        :
      </p>
      <ul className="ml-5 list-disc space-y-1 text-sm">
        <li>
          <code>always</code> — 100% of events (i.e., just apply). Boring.
        </li>
        <li>
          <code>almostAlways</code> — 90%.
        </li>
        <li>
          <code>often</code> — 75%.
        </li>
        <li>
          <code>sometimes</code> — 50%.
        </li>
        <li>
          <code>rarely</code> — 25%.
        </li>
        <li>
          <code>almostNever</code> — 10%.
        </li>
        <li>
          <code>never</code> — 0%.
        </li>
        <li>
          <code>sometimesBy(p, fn)</code> — explicit probability between 0 and 1.
        </li>
      </ul>

      <h2 className="text-lg font-semibold text-neutral-100">Making things "ghost"</h2>
      <p>
        <code>.degradeBy(p)</code> randomly silences events with probability <em>p</em>. A hi-hat
        pattern with <code>.degradeBy(.3)</code> has roughly 30% of its hits dropping out — like a
        drummer accidentally muting hits, which is exactly what real drummers do.
      </p>
      <p>Straight 16th-note hats first — perfectly mechanical:</p>
      <StrudelEditor code={`sound("hh*16")`} />
      <p>Same pattern with 30% of the hits dropped:</p>
      <StrudelEditor code={`sound("hh*16").degradeBy(.3)`} />
      <p className="text-sm text-neutral-500">
        Listen for the difference. The straight version is a robot. The degraded version breathes.{' '}
        <code>.degradeBy(.1)</code> for subtle humanisation, <code>.degradeBy(.5)</code> for sparse
        / glitchy.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Random transformations</h2>
      <p>
        <code>.sometimes(fn)</code> applies <em>fn</em> to roughly half the events. The function can
        be any transform — reverse, speed-shift, transpose, anything from lesson 10. Here's a melody
        that sometimes plays each note twice:
      </p>
      <StrudelEditor code={`note("c3 e3 g3 c4").s("piano").sometimes(x => x.ply(2))`} />
      <p>Or a drum pattern that occasionally reverses individual events:</p>
      <StrudelEditor code={`sound("bd hh sd hh, hh*8").sometimesBy(.3, x => x.speed(-1))`} />
      <p className="text-sm text-neutral-500">
        <code>sometimesBy</code> takes a probability so you can dial in exactly how much chaos you
        want. <code>sometimesBy(.1, …)</code> = occasional surprise. <code>sometimesBy(.7, …)</code>{' '}
        = the original is the surprise.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Reviving an old pattern</h2>
      <p>Take the Billie Jean drums from lesson 4 — a perfect, eight-bar-identical loop:</p>
      <StrudelEditor
        code={`setcpm(117/4)
sound("bd ~ bd ~, ~ sd ~ sd, hh*8")`}
      />
      <p>
        Layer in probability. Drop 10% of the hats, occasionally double-hit the snare. Three small
        additions and the groove starts to feel like a person plays it:
      </p>
      <StrudelEditor
        code={`setcpm(117/4)
sound("bd ~ bd ~, ~ sd ~ sd, hh*8")
  .sometimesBy(.1, x => x.ply(2))
  .degradeBy(.1)`}
      />

      <section className="card space-y-3">
        <h3 className="text-sm font-medium tracking-wider text-brand-300 uppercase">Quiz</h3>
        <p className="text-sm">
          Take a busy 16th-note hi-hat and use <code>degradeBy</code> to drop <strong>40%</strong>{' '}
          of the hits.
        </p>
        <QuizEditor
          initialCode={`sound("hh*16")`}
          target={`sound("hh*16").degradeBy(.4)`}
          hint="Chain .degradeBy(.4) onto the end."
        />
      </section>

      <p className="text-sm text-neutral-500">
        Probability functions seed their random choices from each event's position, so the result is{' '}
        <em>different</em> on every cycle but <em>reproducible</em> — re-evaluate the same code and
        you get the same sequence of "random" choices. The chaos has a memory.
      </p>
    </div>
  );
}
