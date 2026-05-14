import { StrudelEditor } from '../components/StrudelEditor';
import { TryThis } from '../components/TryThis';
import { SongCard } from '../components/SongCard';
import { SongJourney } from '../components/SongJourney';
import { odeToJoy } from '../tracks/ode-to-joy';
import { sevenNationArmy } from '../tracks/seven-nation-army';
import { requireStage } from '../tracks';
import type { LessonMeta } from './index';

export const meta: LessonMeta = {
  slug: 'ode-to-joy',
  title: 'Scales — Ode to Joy',
  blurb: 'Stop naming every note. Pick a scale and use degree numbers instead.',
  order: 7,
};

const melodyStage = requireStage(odeToJoy, 'melody');
const snaAsDegrees = requireStage(sevenNationArmy, 'riff-as-scale-degrees');

export function Lesson() {
  return (
    <div className="space-y-6 text-neutral-300">
      <p>
        Up to now, every melody we&apos;ve written has spelled out each note —{' '}
        <code>note(&quot;e2 g2 d2 c2&quot;)</code>. That&apos;s fine for short riffs, but
        transposing to a different key means renaming every single note. There&apos;s a better way:
        write the melody as <em>scale degrees</em> and tell Strudel which key you&apos;re in. Then
        the same number sequence can be played in any key.
      </p>
      <p>
        This is the most-recognizable melody in classical music — Beethoven&apos;s{' '}
        <em>Ode to Joy</em>, written in 1824 while he was completely deaf. Five notes. Four bars.
        Two centuries of life. Let&apos;s see how few characters it takes to play.
      </p>

      <SongCard track={odeToJoy} />

      <h2 className="text-lg font-semibold text-neutral-100">A scale</h2>
      <p>
        A <strong>scale</strong> is a set of notes that &quot;fit together.&quot; The 7 white keys
        on a piano starting from C are the C major scale: C, D, E, F, G, A, B. Most western music
        spends most of its time inside one scale. Numbering them 0 through 6 gives us &quot;scale
        degrees&quot;:
      </p>
      <ul className="ml-5 list-disc space-y-1 text-sm">
        <li>0 = C (the root)</li>
        <li>1 = D</li>
        <li>2 = E</li>
        <li>3 = F</li>
        <li>4 = G</li>
        <li>5 = A</li>
        <li>6 = B</li>
        <li>7 = C (octave up)</li>
        <li>-1 = B (octave down), -2 = A, etc.</li>
      </ul>

      <h2 className="text-lg font-semibold text-neutral-100">
        <code>n()</code> and <code>.scale()</code>
      </h2>
      <p>
        Instead of <code>note(&quot;c4 d4 e4 f4&quot;)</code>, we write{' '}
        <code>n(&quot;0 1 2 3&quot;).scale(&quot;C:major&quot;)</code>. <code>n()</code> takes scale
        degrees; <code>.scale()</code> picks the key:
      </p>
      <StrudelEditor code={`n("0 1 2 3 4 5 6 7").scale("C:major").s("piano")`} />
      <p>
        That&apos;s the C major scale ascending. Now the magic — change{' '}
        <code>&quot;C:major&quot;</code> to <code>&quot;A:minor&quot;</code> without touching the
        numbers:
      </p>
      <StrudelEditor code={`n("0 1 2 3 4 5 6 7").scale("A:minor").s("piano")`} />
      <p>
        Same shape, completely different feel. The numbers stay the same; the scale changes the
        mood.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Ode to Joy in scale degrees</h2>
      <p>
        Beethoven&apos;s melody uses only degrees 0 through 4 (the first 5 notes of the scale). The
        full 4-bar phrase is <code>2 2 3 4 | 4 3 2 1 | 0 0 1 2 | 2 1 1</code>. In C major those
        degrees map to E, F, G, D, C. The rhythmic kink in bar 4 (dotted-quarter / eighth / half) is
        what makes it unmistakable — that&apos;s our friend <code>@N</code> from lesson 5:
      </p>
      <StrudelEditor code={melodyStage.code} />
      <p className="text-sm text-neutral-500">
        Now try changing <code>&quot;C:major&quot;</code> to <code>&quot;A:minor&quot;</code>. Same
        numbers, completely different emotional weight — joyful becomes wistful.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Back to Seven Nation Army</h2>
      <p>
        Lesson 4 wrote the SNA riff as <code>note(&quot;e2 e2 g2 e2 d2 c2 b1 ~&quot;)</code>. In E
        minor scale degrees, those notes become <code>0 0 2 0 -1 -2 -3</code> — the negative numbers
        go below the root:
      </p>
      <StrudelEditor code={snaAsDegrees.code} />

      <SongJourney trackId="seven-nation-army" currentLessonSlug={meta.slug} />

      <p>
        Same audio output, completely different writing. Why bother?{' '}
        <strong>Because now you can transpose by changing one string.</strong> Change{' '}
        <code>&quot;E:minor&quot;</code> to <code>&quot;F#:minor&quot;</code> and the entire riff
        jumps up a half step. Try it.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Other scales worth knowing</h2>
      <ul className="ml-5 list-disc space-y-1 text-sm">
        <li>
          <strong>major</strong> — bright, happy. The default.
        </li>
        <li>
          <strong>minor</strong> (or <strong>aeolian</strong>) — sad, melancholy.
        </li>
        <li>
          <strong>dorian</strong> — minor with a raised 6th. Folky, funky-minor.
        </li>
        <li>
          <strong>mixolydian</strong> — major with a flat 7th. Bluesy, rock.
        </li>
        <li>
          <strong>pentatonic</strong> — 5 notes, no sour intervals. Used in tons of folk and pop.
        </li>
        <li>
          <strong>minorBlues</strong> — minor pentatonic + blue note. Most rock solos live here.
        </li>
      </ul>

      <TryThis
        prompt='Play Ode to Joy in three different scales and listen to how the mood shifts. Change "C:major" to "D:dorian" — minor with a hopeful 6th. Or "E:mixolydian" for a bluesy/folk feel.'
        code={melodyStage.code}
      />

      <p className="text-sm text-neutral-500">
        Scale degrees are the bridge from melody-writing to chord-writing. The next lesson stays in
        scale-degree land but starts playing <em>longer</em> melodies — full song themes instead of
        short riffs.
      </p>
    </div>
  );
}
