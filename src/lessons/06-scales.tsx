import { StrudelEditor } from '../components/StrudelEditor';
import { QuizEditor } from '../components/QuizEditor';
import type { LessonMeta } from './index';

export const meta: LessonMeta = {
  slug: 'scales',
  title: 'Scales — same notes, different feeling',
  blurb: 'Stop naming every note. Pick a scale and use degree numbers instead.',
  order: 6,
};

export function Lesson() {
  return (
    <div className="space-y-6 text-neutral-300">
      <p>
        A <strong>scale</strong> is a set of notes that "fit together". The 7 white keys on a piano
        starting from C are the C major scale. Most western music spends most of its time inside one
        scale.
      </p>

      <p>
        Strudel lets you write a melody as <em>scale degrees</em> — numbers that mean "the 1st note
        of the scale", "the 2nd", and so on. Then you pick which scale you're in, and the numbers
        turn into actual notes.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">n() and .scale()</h2>
      <p>
        The pattern of degrees uses <code>n()</code> instead of <code>note()</code>. Then{' '}
        <code>.scale("…")</code> says which scale to interpret them in.
      </p>
      <StrudelEditor code={`n("0 1 2 3 4 5 6 7").scale("C:major").s("piano")`} />

      <p>
        That played the C major scale ascending. <code>0</code> is the root (C), <code>1</code> is
        the next scale note (D), and so on. Numbers above 7 climb past the octave; negative numbers
        drop below the root.
      </p>
      <StrudelEditor code={`n("-3 -2 -1 0 1 2 3").scale("C:major").s("piano")`} />

      <h2 className="text-lg font-semibold text-neutral-100">Same pattern, different scale</h2>
      <p>
        The real magic: leave the degree numbers alone, swap the scale, and the same melody comes
        out in a different mood.
      </p>
      <p>
        Beethoven's <em>Ode to Joy</em> opens with the degrees{' '}
        <code>2 2 3 4 4 3 2 1 0 0 1 2 2 1 1</code>. In C major those notes are E E F G G F E D C C D
        E E D D — the famous melody.
      </p>
      <StrudelEditor
        code={`setcpm(60)
n("2 2 3 4 4 3 2 1 0 0 1 2 2 1 1").scale("C:major").s("piano")`}
      />

      <p>
        Now change <code>"C:major"</code> to <code>"A:minor"</code>. Exact same number pattern,
        completely different feel — wistful instead of joyful.
      </p>
      <StrudelEditor
        code={`setcpm(60)
n("2 2 3 4 4 3 2 1 0 0 1 2 2 1 1").scale("A:minor").s("piano")`}
      />

      <p>
        Try <code>"D:dorian"</code> — minor with a hopeful 6th degree. Or{' '}
        <code>"E:mixolydian"</code> for a bluesy/folk vibe.
      </p>
      <StrudelEditor
        code={`setcpm(60)
n("2 2 3 4 4 3 2 1 0 0 1 2 2 1 1").scale("D:dorian").s("piano")`}
      />

      <p className="text-sm text-neutral-500">
        The scale name format is <code>Root:Type</code> with a colon, no space. Strudel knows all
        the standard modes (major, minor, dorian, phrygian, lydian, mixolydian, locrian) plus many
        others — pentatonic, blues, harmonic minor, hirajoshi…
      </p>

      <section className="card space-y-3">
        <h3 className="text-sm font-medium tracking-wider text-brand-300 uppercase">Quiz</h3>
        <p className="text-sm">
          Take the <em>Ode to Joy</em> opening and play it in <strong>F# minor</strong>. Same degree
          pattern; just change the scale.
        </p>
        <QuizEditor
          initialCode={`setcpm(60)
n("2 2 3 4 4 3 2 1 0 0 1 2 2 1 1").scale("C:major").s("piano")`}
          target={`setcpm(60)
n("2 2 3 4 4 3 2 1 0 0 1 2 2 1 1").scale("F#:minor").s("piano")`}
          hint={`Replace "C:major" with "F#:minor".`}
        />
      </section>

      <p className="text-sm text-neutral-500">
        Next lesson: combining notes <em>and</em> drums in one pattern, using <code>stack()</code>.
      </p>
    </div>
  );
}
