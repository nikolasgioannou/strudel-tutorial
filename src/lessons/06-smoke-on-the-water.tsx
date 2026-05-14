import { StrudelEditor } from '../components/StrudelEditor';
import { TryThis } from '../components/TryThis';
import { SongCard } from '../components/SongCard';
import { smokeOnTheWater } from '../tracks/smoke-on-the-water';
import { requireStage } from '../tracks';
import type { LessonMeta } from './index';

export const meta: LessonMeta = {
  slug: 'smoke-on-the-water',
  title: 'Power chords — Smoke on the Water',
  blurb: "Two notes stacked. Ritchie Blackmore's parallel-4ths riff, the rock-guitar baptism.",
  order: 6,
};

const riffSingleNotes = requireStage(smokeOnTheWater, 'riff-single-notes');
const riffDyads = requireStage(smokeOnTheWater, 'riff-dyads');

export function Lesson() {
  return (
    <div className="space-y-6 text-neutral-300">
      <p>
        If you&apos;ve ever picked up an electric guitar, this is probably the first riff someone
        showed you. Ritchie Blackmore wrote it in 1971 in Montreux after a casino burned down —
        &quot;smoke on the water&quot; was literally the air outside their hotel. Now it&apos;s the
        gateway drug to rock guitar for every kid who hears it.
      </p>
      <p>
        The riff has one twist: Blackmore plays each note as a <strong>dyad</strong> — a stack of
        two notes, the melody note plus a perfect 4th above it. That &quot;parallel 4ths&quot; sound
        is what gives the riff its weight. Today we learn how to stack notes like that.
      </p>

      <SongCard track={smokeOnTheWater} />

      <h2 className="text-lg font-semibold text-neutral-100">The melody, single notes first</h2>
      <p>
        Before we add the parallel 4ths, let&apos;s play just the melody line. The riff is a 3-bar
        phrase in G minor:
      </p>
      <ul className="ml-5 list-disc space-y-1 text-sm">
        <li>
          <strong>Bar 1:</strong> G — Bb — C
        </li>
        <li>
          <strong>Bar 2:</strong> G — Bb — Db — C
        </li>
        <li>
          <strong>Bar 3:</strong> G — Bb — C — Bb — G
        </li>
      </ul>
      <p>
        All five pitches (G, Bb, C, Db, F minus the F here) belong to the G minor blues scale — the
        scale that powers most rock and blues riffs.
      </p>
      <StrudelEditor code={riffSingleNotes.code} />
      <p className="text-sm text-neutral-500">
        We&apos;re using <code>setcpm(112/12)</code> because one full cycle of the riff is{' '}
        <strong>3 bars</strong> (= 12 beats) at 112 BPM. Each bar inside the cycle uses{' '}
        <code>[ ]</code> with <code>@N</code> weights to encode the rhythm — long held notes on beat
        1 of each bar, shorter passing notes leading to the next bar.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">
        Stacking notes with <code>[a, b, c]</code>
      </h2>
      <p>
        We&apos;ve seen square brackets used for grouping in time: <code>[a b c]</code> means
        &quot;a, b, c in one slot.&quot; Square brackets with <strong>commas</strong> mean something
        different — they stack notes to play <em>at the same time</em>:
      </p>
      <StrudelEditor code={`note("[c4, e4, g4]")`} />
      <p>
        That&apos;s a C major chord — three notes (C, E, G) played simultaneously. <code>,</code>{' '}
        means &quot;simultaneously&quot;; spaces mean &quot;in sequence&quot;.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">The riff with parallel 4ths</h2>
      <p>
        Now we replace each melody note with a 2-note stack: the melody note plus a perfect 4th
        above it. The mapping:
      </p>
      <ul className="ml-5 list-disc space-y-1 text-sm">
        <li>G → G + C (4th above G is C)</li>
        <li>Bb → Bb + Eb</li>
        <li>C → C + F</li>
        <li>Db → Db + Gb</li>
      </ul>
      <StrudelEditor code={riffDyads.code} />
      <p>
        That&apos;s the studio tone — exactly what Blackmore plays. Two notes stacked, low-pass
        filter cutting the harsh top end. Just add stadium lights.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">
        Notes simultaneously vs in sequence
      </h2>
      <p>To make the comma-vs-space distinction crystal clear:</p>
      <StrudelEditor code={`note("[c4 e4 g4]")`} />
      <p>
        That&apos;s a C-E-G <em>sequence</em> (arpeggio) — three notes in one slot, played one after
        the other in a third of the time each.
      </p>
      <StrudelEditor code={`note("[c4, e4, g4]")`} />
      <p>
        Same notes — but with commas — and they play simultaneously as a chord. Same brackets,
        opposite meaning. The comma is the chord.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Make it heavier</h2>
      <TryThis
        prompt='Drop the whole riff down an octave (replace g3 with g2, bb3 with bb2, etc.) for a sludgier, more menacing tone. Then add the drums underneath: sound("bd ~ bd ~, ~ sd ~ sd"). Now it sounds like an actual rock band.'
        code={riffDyads.code}
      />

      <p className="text-sm text-neutral-500">
        Single notes for melodies. Stacked notes for chords. Spaces for sequence, commas for
        simultaneous. From here we can build harmony — which is what the next several lessons
        explore, starting with the scales these notes come from.
      </p>
    </div>
  );
}
