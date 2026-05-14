import { StrudelEditor } from '../components/StrudelEditor';
import { TryThis } from '../components/TryThis';
import { SongCard } from '../components/SongCard';
import { standByMe } from '../tracks/stand-by-me';
import { requireStage } from '../tracks';
import type { LessonMeta } from './index';

export const meta: LessonMeta = {
  slug: 'stand-by-me',
  title: 'Chord progressions — Stand By Me',
  blurb: 'The four chords that built half of pop music. I-vi-IV-V, the 50s progression.',
  order: 9,
};

const chordsStage = requireStage(standByMe, 'chords');
const withBassStage = requireStage(standByMe, 'with-bass');

export function Lesson() {
  return (
    <div className="space-y-6 text-neutral-300">
      <p>
        Single notes give you melody. Three or more notes played at the <em>same time</em> give you
        a <strong>chord</strong>. A series of chords moving in a sequence gives you a{' '}
        <strong>chord progression</strong> — and chord progressions are the engine of almost every
        song you&apos;ve loved.
      </p>
      <p>
        One progression in particular sits behind an absurd number of songs:{' '}
        <strong>I-vi-IV-V</strong>. Ben E. King&apos;s <em>Stand By Me</em>, &quot;Earth
        Angel&quot;, &quot;Heart and Soul&quot;, &quot;Every Breath You Take&quot; — they all walk
        these four chords.
      </p>

      <SongCard track={standByMe} />

      <h2 className="text-lg font-semibold text-neutral-100">Stacking notes manually</h2>
      <p>
        We saw in lesson 6 (Smoke on the Water) that <code>[a, b, c]</code> plays three notes
        simultaneously. A chord is the same idea with three or more notes. In A major, the I chord
        (A major triad) is A + C# + E:
      </p>
      <StrudelEditor code={`note("[a3, c#4, e4]").s("piano")`} />
      <p>
        That works, but spelling out every chord by note gets tedious fast. Strudel has a shorthand.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">
        <code>chord()</code> and <code>.voicing()</code>
      </h2>
      <p>
        <code>chord(&quot;...&quot;)</code> takes <em>chord symbols</em> — the kind you&apos;d see
        on a lead sheet — and <code>.voicing()</code> turns each symbol into a stack of notes:
      </p>
      <StrudelEditor code={`chord("<C F G C>").voicing().s("piano")`} />
      <p>
        The <code>{`<>`}</code> brackets alternate one chord per cycle. So that pattern plays C
        major, F major, G major, C major — four cycles, one chord per cycle.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Roman numerals</h2>
      <p>
        Music theorists describe chord progressions in <strong>Roman numerals</strong> rather than
        chord names, because the same progression sounds the same in any key. The numerals refer to
        scale degrees:
      </p>
      <ul className="ml-5 list-disc space-y-1 text-sm">
        <li>
          <strong>I</strong> (uppercase) — the chord on the 1st scale degree. <em>Major.</em>
        </li>
        <li>
          <strong>ii</strong>, <strong>iii</strong>, <strong>vi</strong> (lowercase) — the chords on
          the 2nd, 3rd, 6th degrees. <em>Minor.</em>
        </li>
        <li>
          <strong>IV</strong>, <strong>V</strong> (uppercase) — the 4th and 5th degrees.{' '}
          <em>Major.</em>
        </li>
      </ul>
      <p>
        So in C major, <strong>I-V-vi-IV</strong> means C-G-Am-F. In A major, the same Roman
        numerals are A-E-F#m-D. <em>The same progression</em>, different starting note.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Stand By Me: I-vi-IV-V</h2>
      <p>
        In A major (Stand By Me&apos;s key) the chords are <code>A</code> → <code>F#m</code> →{' '}
        <code>D</code> → <code>E</code>. Major, minor, major, major. It works because:
      </p>
      <ul className="ml-5 list-disc space-y-1 text-sm">
        <li>The I (A) is home — stable, the place you start and want to return to.</li>
        <li>
          The vi (F#m) shares two notes with the I, so it feels like a soft pivot — dimming the
          lights, not moving away.
        </li>
        <li>
          The IV (D) is a fresh major chord — it lifts the mood. Most &quot;uplift&quot; moments in
          pop songs land on a IV.
        </li>
        <li>
          The V (E) is the most unstable chord. It pulls strongly back to the I, and that pull is
          what triggers the loop.
        </li>
      </ul>
      <StrudelEditor code={chordsStage.code} />
      <p>
        Four cycles, four chords — A, F#m, D, E. One chord per bar. That&apos;s the whole verse.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Add the bass</h2>
      <p>
        Most chord progressions in pop are anchored by a bass line that plays the <em>root note</em>{' '}
        of each chord. <code>.rootNotes(2)</code> extracts the root from each chord symbol and plays
        it in octave 2:
      </p>
      <StrudelEditor code={withBassStage.code} />
      <p className="text-sm text-neutral-500">
        Now the bass walks A → F# → D → E underneath the chords. That&apos;s the texture of Stand By
        Me — bass walking the chord roots, piano playing the harmony, snap-and-finger rhythm on top.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Try it in another key</h2>
      <TryThis
        prompt={`Transpose to C major. I-vi-IV-V in C is C, Am, F, G. Replace "<A F#m D E>" with "<C Am F G>". The progression sounds identical in shape, just transposed to a new home.`}
        code={chordsStage.code}
      />

      <p className="text-sm text-neutral-500">
        I-vi-IV-V and its rotations (I-V-vi-IV, vi-IV-I-V) power thousands of pop songs. Once you
        can hear it, you&apos;ll hear it everywhere. Next lesson we apply chords to a song we
        already started — adding the bass and chord pad to Billie Jean.
      </p>
    </div>
  );
}
