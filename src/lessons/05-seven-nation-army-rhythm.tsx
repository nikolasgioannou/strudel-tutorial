import { StrudelEditor } from '../components/StrudelEditor';
import { TryThis } from '../components/TryThis';
import { SongCard } from '../components/SongCard';
import { SongJourney } from '../components/SongJourney';
import { sevenNationArmy } from '../tracks/seven-nation-army';
import { requireStage } from '../tracks';
import type { LessonMeta } from './index';

export const meta: LessonMeta = {
  slug: 'seven-nation-army-rhythm',
  title: 'Note durations — Seven Nation Army returns',
  blurb: '@N elongation. The famous riff with its real, irregular rhythm.',
  order: 5,
};

const riff = requireStage(sevenNationArmy, 'riff');
const riffWithRhythm = requireStage(sevenNationArmy, 'riff-with-rhythm');

export function Lesson() {
  return (
    <div className="space-y-6 text-neutral-300">
      <p>
        Last lesson we played the Seven Nation Army riff with even 8th notes. It had the right
        pitches — but it didn&apos;t quite feel like the song. That&apos;s because the actual riff
        has <em>uneven</em> note durations: held notes, short passing notes, long sustained notes.
        Real music has notes of different lengths.
      </p>
      <p>
        Today we go back to the same 7-note riff and fix the rhythm. The trick is one tiny piece of
        mini-notation: <code>@N</code>.
      </p>

      <SongCard track={sevenNationArmy} />

      <SongJourney trackId="seven-nation-army" currentLessonSlug={meta.slug} />

      <h2 className="text-lg font-semibold text-neutral-100">
        <code>@N</code> — elongation
      </h2>
      <p>
        In Strudel&apos;s mini-notation, putting <code>@N</code> after a note tells it to take{' '}
        <em>N times</em> as much time as the unmarked notes. The cycle gets divided proportionally
        based on the weights:
      </p>
      <StrudelEditor code={`note("c4 c4 c4 c4")`} />
      <p>Four equal notes, each takes a quarter of the cycle. Now compare:</p>
      <StrudelEditor code={`note("c4@4 c4")`} />
      <p>
        Two notes, weights 4 and 1, total = 5. The first C takes 4/5 of the cycle (long), the second
        takes 1/5 (short). Same total time, distributed unevenly. That&apos;s the building block:
        long held notes get a big <code>@N</code>, short notes get small or no annotation.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Where we left off</h2>
      <p>The straight-8ths version from last lesson — pitches right, rhythm wrong:</p>
      <StrudelEditor code={riff.code} />

      <h2 className="text-lg font-semibold text-neutral-100">The real SNA rhythm</h2>
      <p>
        Listen carefully to the actual recording. The first E is <em>held</em> for a beat and a half
        (dotted-quarter). Then a quick 16th-note E. Then a dotted-8th G. Then a dotted-8th E. Then a
        dotted-8th D leading into bar 2. Bar 2 is two long held notes: half-note C, half-note B.
      </p>
      <ul className="ml-5 list-disc space-y-1 text-sm">
        <li>
          <strong>Bar 1</strong> (in 16ths): E(6) E(1) G(3) E(3) D(3) → 16 total
        </li>
        <li>
          <strong>Bar 2</strong> (in 16ths): C(8) B(8) → 16 total
        </li>
      </ul>
      <p>
        Two bars, 32 sixteenth-note weights total. We use <code>setcpm(124/8)</code> so 1 cycle = 2
        bars (= 8 beats at 124 BPM):
      </p>
      <StrudelEditor code={riffWithRhythm.code} />
      <p className="text-sm text-neutral-500">
        Now it sounds like the riff. The held first E gives it weight. The half-note C and B at the
        end give it gravity. <em>That</em> rhythm is what makes the SNA riff sound like a riff and
        not a scale exercise.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Layer with drums</h2>
      <p>
        Add a simple drum pattern under the real-rhythm riff. With <code>setcpm(124/8)</code>, each
        cycle is 2 bars, so the drum patterns need to span 2 bars too:
      </p>
      <StrudelEditor
        code={`setcpm(124/8)
stack(
  note("e2@4 ~@2 e2@2 g2@3 e2@3 d2@2 c2@8 b1@8").s("gm_acoustic_bass"),
  sound("bd*8"),
  sound("~ sd ~ sd ~ sd ~ sd")
)`}
      />
      <p>
        Eight kicks across 2 bars (= 4 per bar = on every beat). Snare on every backbeat. Riff with
        its real rhythm. That&apos;s the verse of Seven Nation Army.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Try your own rhythm</h2>
      <TryThis
        prompt='Change the rhythm of the riff without changing the pitches. Try making EVERY note a quarter (give them all @4): note("e2@4 e2@4 g2@4 e2@4 d2@4 c2@4 b1@4 ~@4"). Or compress the first bar into half a bar by halving all weights. Listen to how the same pitches feel completely different with different durations.'
        code={riffWithRhythm.code}
      />

      <p className="text-sm text-neutral-500">
        <code>@N</code> is the workhorse of rhythmic precision in Strudel. Anywhere a riff has a
        sustained note vs short notes, <code>@N</code> is how you write it. Next up: we apply the
        same idea to a vocal line — the &quot;we will, we will, rock you&quot; chorus that joins the
        stomp-clap from lesson 1.
      </p>
    </div>
  );
}
