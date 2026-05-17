import { StrudelEditor } from '../components/StrudelEditor';
import { TryThis } from '../components/TryThis';
import { SongCard } from '../components/SongCard';
import { SongJourney } from '../components/SongJourney';
import { sevenNationArmy } from '../tracks/seven-nation-army';
import { requireStage } from '../tracks';
import type { LessonMeta } from './index';

export const meta: LessonMeta = {
  slug: 'seven-nation-army-scales',
  title: 'Scale degrees — Seven Nation Army returns',
  blurb:
    'Rewrite the famous riff with scale degrees instead of note names. Same riff, transposable in one keystroke.',
  order: 9,
};

const riff = requireStage(sevenNationArmy, 'riff');
const riffAsDegrees = requireStage(sevenNationArmy, 'riff-as-scale-degrees');

export function Lesson() {
  return (
    <div className="space-y-6 text-neutral-300">
      <p>
        Last lesson we learned how scale degrees let us write melodies as numbers — the same pattern
        can sound joyful in major or wistful in minor, just by swapping the scale. Time to apply
        that to a song we already know: the Seven Nation Army riff.
      </p>

      <SongCard track={sevenNationArmy} />

      <SongJourney trackId="seven-nation-army" currentLessonSlug={meta.slug} />

      <h2 className="text-lg font-semibold text-neutral-100">The riff in note names</h2>
      <p>
        From lesson 4, we wrote the riff as explicit pitch names — E, G, D, C, B all in octave 2:
      </p>
      <StrudelEditor code={riff.code} />
      <p>
        The trouble with this: if Jack White had played it a half-step higher (F minor instead of E
        minor), we&apos;d have to rewrite every single note name. <code>note()</code> doesn&apos;t
        know it&apos;s in E minor — it just plays pitches.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Translating to scale degrees</h2>
      <p>
        The E minor scale is: <code>E F# G A B C D</code> — degrees 0-6. Below the root E2 we keep
        counting backwards: <code>D2 = -1</code>, <code>C2 = -2</code>, <code>B1 = -3</code>.
      </p>
      <p>So the riff pitches map to scale degrees like this:</p>
      <ul className="ml-5 list-disc space-y-1 text-sm">
        <li>
          E2 → degree <code>0</code>
        </li>
        <li>
          G2 → degree <code>2</code> (two scale steps above E: F#, G)
        </li>
        <li>
          D2 → degree <code>-1</code> (one step below E: D)
        </li>
        <li>
          C2 → degree <code>-2</code>
        </li>
        <li>
          B1 → degree <code>-3</code>
        </li>
      </ul>
      <p>The 7-note riff E E G E D C B becomes:</p>
      <StrudelEditor code={riffAsDegrees.code} />
      <p className="text-sm text-neutral-500">
        Identical-sounding output to the <code>note()</code> version. The difference is in the
        source: we no longer have specific pitch names, just &quot;positions in the scale.&quot;
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Why bother?</h2>
      <p>
        <strong>One-character transposition.</strong> Change <code>&quot;E:minor&quot;</code> to{' '}
        <code>&quot;F#:minor&quot;</code> and the entire riff jumps up a half step. Change it to{' '}
        <code>&quot;G:minor&quot;</code> and it&apos;s up a minor third. Change it to{' '}
        <code>&quot;E:major&quot;</code> and the same shape becomes major instead of minor — which
        is a completely different mood, but the riff outline is still recognizable.
      </p>
      <p>
        With explicit note names, every transposition is a full rewrite. With scale degrees,
        it&apos;s a single string change.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Try the transpositions</h2>
      <TryThis
        prompt='Transpose the SNA riff into 3 different keys without touching the numbers. Try "G:minor" (a minor 3rd higher), "A:minor" (a 4th higher), and "E:major" (same root, but major instead of minor). Each one keeps the same melodic shape but feels completely different.'
        code={riffAsDegrees.code}
      />

      <p className="text-sm text-neutral-500">
        Scale degrees give us a way to think in shapes rather than specific pitches. That same idea
        — &quot;positions in a scale&quot; — is the foundation of chord progressions, which is the
        next lesson&apos;s topic. We&apos;re moving from single-note melodies to playing multiple
        notes at once, with one of the most-used progressions in pop music.
      </p>
    </div>
  );
}
