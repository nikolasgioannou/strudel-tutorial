import { StrudelEditor } from '../components/StrudelEditor';
import { QuizEditor } from '../components/QuizEditor';
import { SongCard } from '../components/SongCard';
import { odeToJoy } from '../tracks/ode-to-joy';
import { requireStage } from '../tracks';
import type { LessonMeta } from './index';

const odeToJoyMelody = requireStage(odeToJoy, 'melody');

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

      <SongCard track={odeToJoy} />

      <p>
        Beethoven finished his 9th Symphony in 1824, by which point he was completely deaf — he had
        to be turned around at the premiere to see the audience applauding. The 4th movement
        introduces a melody so good it later became the official anthem of the European Union. The
        whole theme uses only <strong>five different notes</strong>: scale degrees 0 through 4.
      </p>
      <p>
        The full 4-bar phrase in scale degrees is <code>2 2 3 4 | 4 3 2 1 | 0 0 1 2 | 2 1 1</code>.
        In C major: E E F G | G F E D | C C D E | E D D. Bars 1-3 are straight quarter notes, but
        bar 4 has the signature rhythmic kink: a dotted-quarter, then an eighth note, then a half
        note. That hitch is what makes the melody sound like Ode to Joy and not a scale exercise.
      </p>
      <StrudelEditor code={odeToJoyMelody.code} />
      <p className="text-sm text-neutral-500">
        We've used three Strudel tricks here. <code>[a b c d]</code> groups four notes into one
        bar's worth of time. The four bracketed groups give us 4 bars per cycle. Inside bar 4,{' '}
        <code>2@3</code> means "hold this note for 3 units" (a dotted quarter), and <code>1@4</code>{' '}
        holds for 4 units (a half note). <code>setcpm(80/16)</code> matches Beethoven's original
        metronome marking of ♩=80 with 16 beats per cycle.
      </p>

      <p>
        Now change <code>"C:major"</code> to <code>"A:minor"</code>. Exact same number pattern,
        completely different feel — wistful instead of joyful.
      </p>
      <StrudelEditor
        code={`setcpm(80/16)
n("[2 2 3 4] [4 3 2 1] [0 0 1 2] [2@3 1 1@4]")
  .scale("A:minor")
  .s("piano")`}
      />

      <p>
        Try <code>"D:dorian"</code> — minor with a hopeful 6th degree. Or{' '}
        <code>"E:mixolydian"</code> for a bluesy/folk vibe.
      </p>
      <StrudelEditor
        code={`setcpm(80/16)
n("[2 2 3 4] [4 3 2 1] [0 0 1 2] [2@3 1 1@4]")
  .scale("D:dorian")
  .s("piano")`}
      />

      <h2 className="text-lg font-semibold text-neutral-100">Why do scales sound different?</h2>
      <p>
        The 12 notes you can play on a piano (white plus black keys) are evenly spaced — each one is
        a <em>half step</em> from the next. A scale is just a particular pattern of half steps and
        whole steps (a whole step = two half steps).
      </p>
      <p>
        Major and minor are the famous pair, and they differ in <em>one critical place</em>: the gap
        between the 1st and 3rd notes.
      </p>
      <ul className="ml-5 list-disc space-y-1 text-sm">
        <li>
          <strong>Major</strong>: 1 to 3 is <em>four half steps</em> apart (a major 3rd). C → E on
          the piano. This is the "happy/bright" interval — it's the difference between a children's
          song and a funeral march.
        </li>
        <li>
          <strong>Minor</strong>: 1 to 3 is <em>three half steps</em> apart (a minor 3rd). A → C on
          the piano. Same song, one note shifted, completely different emotional weight.
        </li>
      </ul>
      <p>
        Every other "mode" is a different pattern of half- and whole-steps over the 7-note span, and
        each has a personality:
      </p>
      <ul className="ml-5 list-disc space-y-1 text-sm">
        <li>
          <strong>Lydian</strong> — major with a raised 4th. Floating, dreamy. (Think{' '}
          <em>The Simpsons</em> theme.)
        </li>
        <li>
          <strong>Mixolydian</strong> — major with a flat 7th. Bluesy, folky. (Most Beatles riffs.)
        </li>
        <li>
          <strong>Dorian</strong> — minor with a raised 6th. Funky-minor. (Miles Davis's{' '}
          <em>So What</em>.)
        </li>
        <li>
          <strong>Phrygian</strong> — minor with a flat 2nd. Spanish, metal, exotic.
        </li>
        <li>
          <strong>Locrian</strong> — almost never the home key; sounds unresolved.
        </li>
      </ul>
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
          initialCode={`setcpm(80/16)
n("[2 2 3 4] [4 3 2 1] [0 0 1 2] [2@3 1 1@4]")
  .scale("C:major")
  .s("piano")`}
          target={`setcpm(80/16)
n("[2 2 3 4] [4 3 2 1] [0 0 1 2] [2@3 1 1@4]")
  .scale("F#:minor")
  .s("piano")`}
          hint={`Replace "C:major" with "F#:minor".`}
        />
      </section>

      <p className="text-sm text-neutral-500">
        Next lesson: combining notes <em>and</em> drums in one pattern, using <code>stack()</code>.
      </p>
    </div>
  );
}
