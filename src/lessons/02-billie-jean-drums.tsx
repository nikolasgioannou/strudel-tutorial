import { StrudelEditor } from '../components/StrudelEditor';
import { TryThis } from '../components/TryThis';
import { SongCard } from '../components/SongCard';
import { SongJourney } from '../components/SongJourney';
import { billieJean } from '../tracks/billie-jean';
import { requireStage } from '../tracks';
import type { LessonMeta } from './index';

export const meta: LessonMeta = {
  slug: 'billie-jean-drums',
  title: 'A drum kit — Billie Jean',
  blurb: "Ndugu Chancler's iconic drum machine groove. Layering with stack().",
  order: 2,
};

const drumsStage = requireStage(billieJean, 'drums');

export function Lesson() {
  return (
    <div className="space-y-6 text-neutral-300">
      <p>
        We Will Rock You was one drum sound at a time. A real drum kit has multiple parts playing{' '}
        <em>simultaneously</em>: kick, snare, hi-hat. Michael Jackson's <em>Billie Jean</em> opens
        with one of the most famous drum patterns in pop history — kick on every quarter, snare on
        the backbeat, hi-hat counting time underneath. Let's build it.
      </p>

      <SongCard track={billieJean} />

      <SongJourney trackId="billie-jean" currentLessonSlug={meta.slug} />

      <h2 className="text-lg font-semibold text-neutral-100">One part at a time</h2>
      <p>First, just the kick. One hit per beat — that's 4 hits per bar at 117 BPM:</p>
      <StrudelEditor
        code={`setcpm(117/4)
sound("bd ~ bd ~")`}
      />
      <p>
        The <code>~</code> is a rest — silence in that slot. So <code>&quot;bd ~ bd ~&quot;</code>{' '}
        hits on beats 1 and 3 and rests on 2 and 4. Classic four-on-the-floor rock-flavored kick.
      </p>

      <p>Now just the snare, on beats 2 and 4 (the &quot;backbeat&quot;):</p>
      <StrudelEditor
        code={`setcpm(117/4)
sound("~ sd ~ sd")`}
      />
      <p>
        And the hi-hat — eight 8th notes filling the bar. <code>hh*8</code> says &quot;hi-hat
        repeated 8 times&quot;:
      </p>
      <StrudelEditor
        code={`setcpm(117/4)
sound("hh*8")`}
      />

      <h2 className="text-lg font-semibold text-neutral-100">
        <code>stack()</code> — playing things together
      </h2>
      <p>
        Three patterns, one drum kit. <code>stack()</code> takes multiple patterns and plays them
        simultaneously — each is its own layer, all locked to the same cycle:
      </p>
      <StrudelEditor code={drumsStage.code} />
      <p>
        Kick on 1 and 3, snare on 2 and 4, hi-hat under everything. That's the entire
        verse-drum-pattern of Billie Jean. The studio version was played live on a real kit by Ndugu
        Chancler — not a drum machine, despite the common assumption.
      </p>
      <p className="text-sm text-neutral-500">
        The hi-hat is the trickiest element to get right when you're building a beat. Too loud and
        it overwhelms; too quiet and the groove feels stiff. We set <code>.gain(.6)</code> on the
        hats — turn them down to 60% — so they sit <em>underneath</em> the kick and snare.{' '}
        <code>gain</code> takes a value from 0 (silent) to 1 (full).
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">
        Why <code>setcpm(117/4)</code>?
      </h2>
      <p>
        Billie Jean's tempo is 117 BPM. Our pattern has 4 beats per cycle (one bar of 4/4). So each
        cycle should last 4 beats = 4/117 of a minute. <code>setcpm(117/4)</code> tells Strudel
        exactly that: 117 divided by 4 = 29.25 cycles per minute = the right speed.
      </p>
      <p>
        General formula: <strong>setcpm(BPM / beats_per_cycle)</strong>. Memorize this — every song
        lesson uses it.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Try mixing it up</h2>
      <TryThis
        prompt='Make it your own. Try adding a clap (cp) layer, doubling the hi-hat to hh*16, or replacing the snare with a rim shot (rim). What happens if you change the kick pattern from "bd ~ bd ~" to "bd bd ~ bd"?'
        code={drumsStage.code}
      />

      <p className="text-sm text-neutral-500">
        We'll come back to Billie Jean twice more: lesson 10 adds Louis Johnson's bassline and the
        F#m / G#m7 chord pad on top, and lesson 16 humanizes the groove with probability (random
        ghost notes, occasional extra kicks).
      </p>
    </div>
  );
}
