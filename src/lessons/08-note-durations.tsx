import { StrudelEditor } from '../components/StrudelEditor';
import { QuizEditor } from '../components/QuizEditor';
import { SongCard } from '../components/SongCard';
import { sevenNationArmy } from '../tracks/seven-nation-army';
import { requireStage } from '../tracks';
import type { LessonMeta } from './index';

export const meta: LessonMeta = {
  slug: 'note-durations',
  title: 'Note durations — Seven Nation Army, for real this time',
  blurb: 'Some notes are short. Some are held. The @ symbol controls how long.',
  order: 8,
};

const riffSimpleStage = requireStage(sevenNationArmy, 'riff');
const riffRealRhythmStage = requireStage(sevenNationArmy, 'riff-with-rhythm');

export function Lesson() {
  return (
    <div className="space-y-6 text-neutral-300">
      <p>
        Every pattern we've written so far has been built from equal-sized slots — spaces split time
        evenly, brackets subdivide, <code>*N</code> packs in. But real music isn't equal: a held
        first note, three quick notes, a long closing chord. To do that in mini-notation we need one
        more symbol.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">
        <code>@N</code> — make this note last N times longer
      </h2>
      <p>
        Inside a sequence, <code>"c@3 e"</code> gives the C three units of time and the E one unit.
        The total "weight" (3 + 1 = 4) divides the cycle. So the C lasts 3/4 of the cycle and the E
        lasts 1/4 — three times longer for the C.
      </p>
      <StrudelEditor code={`note("c@3 e").s("piano")`} />
      <p>
        Compare to plain <code>"c e"</code> — that's equal halves. The <code>@3</code> just
        stretched the first slot to be three times bigger.
      </p>
      <StrudelEditor code={`note("c e").s("piano")`} />

      <p>
        Notes without a <code>@</code> default to weight 1. So in <code>"c@4 d e f g@4"</code>, the
        two end notes are each held 4 units while the middle three are 1 unit each. Total weight
        4+1+1+1+4 = 11 — those numbers don't need to be round, the cycle just divides into 11
        pieces.
      </p>
      <StrudelEditor code={`note("c@4 d e f g@4").s("piano")`} />

      <p className="text-sm text-neutral-500">
        Pro tip: musically, the weight numbers usually represent <em>16th notes</em> or{' '}
        <em>8th notes</em>. If your cycle is 1 bar (16 sixteenths), then{' '}
        <code>note("c@4 d@4 e@4 f@4")</code> is four equal quarter notes;{' '}
        <code>note("c@8 d@8")</code> is two half notes. You're just expressing duration in a common
        unit.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Fixing the Seven Nation Army riff</h2>
      <p>
        Back in lesson 5 we played Jack White's riff but flattened the rhythm to straight 8ths. The
        real shape is: a quarter-note opener, a short rest, then a tumble of 8ths and dotted-8ths,
        closing on two half notes in bar 2.
      </p>

      <SongCard track={sevenNationArmy} />

      <p>Here's the straight-8th version we did before:</p>
      <StrudelEditor code={riffSimpleStage.code} />

      <p>
        Now with the real durations. We need finer-grained timing than 8ths (because of the dotted
        8ths), so let's set <strong>one weight unit = one 16th note</strong> and span 2 bars per
        cycle — that's <code>setcpm(124/8)</code>, giving 32 units total.
      </p>
      <p>Bar 1 (16 units of bar 1):</p>
      <ul className="ml-5 list-disc space-y-1 text-sm">
        <li>
          <code>e2@4</code> — quarter on beat 1 (4 × 16th = 1 beat).
        </li>
        <li>
          <code>~@2</code> — 8th rest on beat 2.{' '}
          <em>
            This is the pause that gives the riff its characteristic delay before the descent.
          </em>
        </li>
        <li>
          <code>e2@2</code> — 8th on the "and" of 2.
        </li>
        <li>
          <code>g2@3</code> — dotted 8th on beat 3 (3 × 16th = 0.75 beat).
        </li>
        <li>
          <code>e2@3</code> — dotted 8th right after.
        </li>
        <li>
          <code>d2@2</code> — 8th on the "and" of 4, closing out bar 1.
        </li>
      </ul>
      <p>Bar 2 (16 units) — the lament close:</p>
      <ul className="ml-5 list-disc space-y-1 text-sm">
        <li>
          <code>c2@8</code> — half note on beat 1 (8 × 16th = 2 beats).
        </li>
        <li>
          <code>b1@8</code> — half note on beat 3. No rest after — the two halves fill bar 2
          exactly, and then the loop comes back around to that opening E.
        </li>
      </ul>
      <p>
        Total weight: 4 + 2 + 2 + 3 + 3 + 2 + 8 + 8 = 32 units = 32 × 16ths = 2 bars at 124 BPM.
      </p>
      <StrudelEditor code={riffRealRhythmStage.code} />

      <p>
        That feels right. Same notes as before, but the rhythm is the heartbeat — it's why this riff
        has been chanted in stadiums for over twenty years.
      </p>

      <section className="card space-y-3">
        <h3 className="text-sm font-medium tracking-wider text-brand-300 uppercase">Quiz</h3>
        <p className="text-sm">
          Make a simple "long-short" alternating pattern: a kick that lasts <strong>3 units</strong>
          , followed by a snare that lasts <strong>1 unit</strong>, repeated. The kick should be
          three times longer than the snare.
        </p>
        <QuizEditor
          initialCode={`sound("bd sd")`}
          target={`sound("bd@3 sd")`}
          hint="Put @3 right after the bd."
        />
      </section>

      <p className="text-sm text-neutral-500">
        With <code>@N</code> in your toolkit you can write any rhythm — no more equal-slot
        compromise. Next up: making the same notes sound completely different by shaping them with
        filters and envelopes.
      </p>
    </div>
  );
}
