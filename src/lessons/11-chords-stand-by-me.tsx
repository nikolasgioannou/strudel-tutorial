import { StrudelEditor } from '../components/StrudelEditor';
import { QuizEditor } from '../components/QuizEditor';
import { SongCard } from '../components/SongCard';
import { standByMe } from '../tracks/stand-by-me';
import { requireStage } from '../tracks';
import type { LessonMeta } from './index';

export const meta: LessonMeta = {
  slug: 'chords-stand-by-me',
  title: 'Chords — the engine of every pop song',
  blurb: 'Stand By Me, Earth Angel, half the doo-wop catalogue: all the same four chords.',
  order: 11,
};

const chordsStage = requireStage(standByMe, 'chords');
const withBassStage = requireStage(standByMe, 'with-bass');

export function Lesson() {
  return (
    <div className="space-y-6 text-neutral-300">
      <p>
        Single notes give you melody. Three or more notes played at the same time give you a{' '}
        <strong>chord</strong>. Chains of chords moving in a sequence give you a{' '}
        <strong>chord progression</strong> — and chord progressions are the engine of almost every
        song you've ever loved.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">What's a chord?</h2>
      <p>
        Stack three notes from a scale, skipping every other one, and you get a{' '}
        <strong>triad</strong>. In C major, the triad on C is C-E-G; on F it's F-A-C; on G it's
        G-B-D. The stack's character depends on the intervals inside:
      </p>
      <ul className="ml-5 list-disc space-y-1 text-sm">
        <li>
          <strong>Major</strong> triad — root + major 3rd + perfect 5th. Sounds bright (C-E-G).
        </li>
        <li>
          <strong>Minor</strong> triad — root + minor 3rd + perfect 5th. Sounds sad (A-C-E).
        </li>
        <li>
          <strong>Diminished</strong> — minor 3rd + flat 5th. Sounds unstable (B-D-F).
        </li>
      </ul>
      <p>
        We could write a chord by hand using a comma stack: <code>{`note("[c3,e3,g3]")`}</code>.
        That's a C major triad as three simultaneous notes.
      </p>
      <StrudelEditor code={`note("[c3,e3,g3]").s("piano")`} />

      <h2 className="text-lg font-semibold text-neutral-100">
        <code>chord()</code> and <code>.voicing()</code>
      </h2>
      <p>
        Spelling every chord by note is tedious. Strudel has a shortcut: <code>chord("…")</code>{' '}
        takes chord <em>symbols</em> (the kind you'd see on a lead sheet) and{' '}
        <code>.voicing()</code> turns each symbol into a well-arranged set of notes.
      </p>
      <StrudelEditor code={`chord("<C F G C>").voicing().s("piano")`} />
      <p>
        The <code>{`<>`}</code> brackets alternate one chord per cycle. Each chord lasts the full
        cycle. The voicer picks reasonable note positions — it'll usually keep adjacent chords close
        to each other so the inner voices move smoothly. That smooth motion has a name —{' '}
        <strong>voice leading</strong> — and it's a huge part of why some chord progressions feel
        "right".
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Roman numerals</h2>
      <p>
        Music theorists describe chord progressions in <strong>Roman numerals</strong> rather than
        chord names, because the same progression sounds the same in any key. The numerals refer to{' '}
        <em>scale degrees</em>:
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
        <li>
          <strong>vii°</strong> — the 7th degree. <em>Diminished</em> (rarely used as a home chord).
        </li>
      </ul>
      <p>
        So in C major, <strong>I-V-vi-IV</strong> means C-G-Am-F. In A major, the same Roman
        numerals are A-E-F#m-D. <em>The same progression</em>, different starting note.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">The "50s progression": I-vi-IV-V</h2>
      <p>
        One progression sits behind an absurd number of songs: <strong>I-vi-IV-V</strong>. Ben E.
        King's <em>Stand By Me</em>, "Earth Angel", "Heart and Soul", "Blue Moon", "Every Breath You
        Take" — they all walk these four chords in some order.
      </p>
      <p>
        In A major (Stand By Me's key) the chords are <code>A</code> → <code>F#m</code> →{' '}
        <code>D</code> → <code>E</code>. Major, minor, major, major. It works because:
      </p>
      <ul className="ml-5 list-disc space-y-1 text-sm">
        <li>The I (A) is home — stable, the place you start and want to return to.</li>
        <li>
          The vi (F#m) shares two notes with the I (A and C# / E and C# in F#m), so it feels like a
          soft pivot — not really moving away, just dimming the lights.
        </li>
        <li>
          The IV (D) is a fresh major chord — it lifts the mood. Most "uplift" moments in pop songs
          land on a IV chord.
        </li>
        <li>
          The V (E) is the most unstable chord. It contains the leading tone (G# in this key) which
          pulls strongly back to the root A. Every V chord wants to resolve to a I — and that's what
          triggers the loop.
        </li>
      </ul>

      <SongCard track={standByMe} />

      <h2 className="text-lg font-semibold text-neutral-100">Building Stand By Me</h2>
      <p>The progression on its own — one chord per bar at 120 BPM:</p>
      <StrudelEditor code={chordsStage.code} />

      <p>
        Add a bass note for each chord — <code>.rootNotes(2)</code> extracts the root of each chord
        symbol at octave 2:
      </p>
      <StrudelEditor code={withBassStage.code} />

      <p className="text-sm text-neutral-500">
        The original has a more elaborate walking bassline that moves between the chord roots with
        passing tones — exactly like Billie Jean did. The structure of "play chord tones, connect
        them with stepwise motion" repeats across nearly every bass instrument in pop music.
      </p>

      <section className="card space-y-3">
        <h3 className="text-sm font-medium tracking-wider text-brand-300 uppercase">Quiz</h3>
        <p className="text-sm">
          Transpose the Stand By Me progression into <strong>C major</strong>. In C, I-vi-IV-V
          spells out C, Am, F, G.
        </p>
        <QuizEditor
          initialCode={chordsStage.code}
          target={`setcpm(120/4)
chord("<C Am F G>").voicing().s("piano")`}
          hint={`Replace <A F#m D E> with <C Am F G>.`}
        />
      </section>

      <p className="text-sm text-neutral-500">
        Next lesson: making a static loop feel alive with periodic transformations —{' '}
        <code>.every(n, fn)</code> and <code>.off(t, fn)</code>.
      </p>
    </div>
  );
}
