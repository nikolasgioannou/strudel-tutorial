import { StrudelEditor } from '../components/StrudelEditor';
import { QuizEditor } from '../components/QuizEditor';
import { SongCard } from '../components/SongCard';
import { billieJean } from '../tracks/billie-jean';
import { requireStage } from '../tracks';
import type { LessonMeta } from './index';

export const meta: LessonMeta = {
  slug: 'billie-jean',
  title: 'Layering — Billie Jean',
  blurb: 'Stack multiple patterns to build a complete drum groove.',
  order: 4,
};

const drumsStage = requireStage(billieJean, 'drums');

export function Lesson() {
  return (
    <div className="space-y-6 text-neutral-300">
      <p>
        Every example so far has had one stream of drums at a time. Real beats stack streams — kick
        on the bottom, snare in the middle, hi-hat on top. In Strudel, you separate parallel streams
        with a comma.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">The comma</h2>
      <p>
        Inside <code>sound()</code>, a comma plays patterns simultaneously. So{' '}
        <code>"bd*4, hh*8"</code> is four kicks <em>and</em> eight hi-hats happening at the same
        time.
      </p>
      <StrudelEditor code={`sound("bd*4, hh*8")`} />

      <h2 className="text-lg font-semibold text-neutral-100">Building Billie Jean</h2>
      <p>
        Michael Jackson's <em>Billie Jean</em> has one of the most famous drum grooves of all time.
        Ndugu Chancler played it live on a real kit — three layers, each almost trivially simple on
        its own.
      </p>

      <SongCard track={billieJean} />

      <p>
        Start with the kick. It lands on beats 1 and 3 — the <strong>downbeats</strong>, the strong
        "one" and "three" you'd count out loud. With four beats per cycle that's{' '}
        <code>"bd ~ bd ~"</code>: hit, rest, hit, rest.
      </p>
      <StrudelEditor code={`sound("bd ~ bd ~")`} />

      <p>
        Add the snare on beats 2 and 4 — the <strong>backbeat</strong>. This is the most important
        rhythmic pattern in popular music: nearly every rock, pop, soul, and hip-hop song you've
        ever heard puts the snare on 2 and 4. The kick gives you "ONE-two-THREE-four" and the snare
        gives you "one-TWO-three-FOUR", and together they fill every beat. That tension between the
        down-feel and the up-feel is what makes you nod your head.
      </p>
      <StrudelEditor code={`sound("bd ~ bd ~, ~ sd ~ sd")`} />

      <p>
        Finally a hi-hat on every 8th note. <code>hh*8</code> fires eight hats across the cycle,
        which works out to two per beat. The hat doubles the pulse, halving the perceived time unit
        — it's what makes the groove feel like it's moving forward instead of plodding. 8th-note hat
        is the default in dance, pop, and most rock. 16th-note hat (<code>hh*16</code>) feels busier
        and more "trap" / "drill". Quarter-note hat (<code>hh*4</code>) feels slow and deliberate.
      </p>
      <StrudelEditor code={`sound("bd ~ bd ~, ~ sd ~ sd, hh*8")`} />

      <p>
        Last touch: the actual song runs at <strong>117 BPM</strong>. Our pattern spans one full bar
        (four beats), so we set <code>setcpm(117/4)</code>.
      </p>
      <StrudelEditor code={drumsStage.code} />

      <section className="card space-y-3">
        <h3 className="text-sm font-medium tracking-wider text-brand-300 uppercase">Quiz</h3>
        <p className="text-sm">
          Without scrolling back: recreate the Billie Jean drum groove from memory. Three layers
          separated by commas — kick on beats 1 and 3, snare on beats 2 and 4, hi-hat on every 8th.
        </p>
        <QuizEditor
          initialCode={`sound("bd")`}
          target={drumsStage.code}
          hint="Each layer covers one full cycle (4 beats). Use ~ for the silent slots in the kick and snare layers."
        />
      </section>

      <p className="text-sm text-neutral-500">
        We'll return to <em>Billie Jean</em> later — once you've learned bass and chords, we can
        layer the iconic bassline and synth pads on top of these drums.
      </p>
    </div>
  );
}
