import { StrudelEditor } from '../components/StrudelEditor';
import { TryThis } from '../components/TryThis';
import { SongCard } from '../components/SongCard';
import { SongJourney } from '../components/SongJourney';
import { weWillRockYou } from '../tracks/we-will-rock-you';
import { requireStage } from '../tracks';
import type { LessonMeta } from './index';

export const meta: LessonMeta = {
  slug: 'we-will-rock-you-solo',
  title: '"We will, we will, rock you" — WWRY returns',
  blurb: 'The chorus vocal lands on the stomp-clap. More @N elongation in a different song.',
  order: 6,
};

const chorusStage = requireStage(weWillRockYou, 'chorus-vocal');

export function Lesson() {
  return (
    <div className="space-y-6 text-neutral-300">
      <p>
        Last lesson we learned <code>@N</code> elongation by giving the Seven Nation Army riff its
        proper irregular rhythm. Now we apply the same idea to a completely different song — the
        iconic chorus vocal of <em>We Will Rock You</em>, which lands on top of the stomp-clap we
        built in lesson 1.
      </p>
      <p>
        The lyric <strong>&quot;we will, we will, rock you&quot;</strong> is six syllables of
        different lengths — two pairs of quick notes followed by two long-held notes. The same tool
        we used for SNA — weighted notes — encodes the rhythm naturally.
      </p>

      <SongCard track={weWillRockYou} />

      <SongJourney trackId="we-will-rock-you" currentLessonSlug={meta.slug} />

      <h2 className="text-lg font-semibold text-neutral-100">The chorus melody</h2>
      <p>Six notes from E minor, descending then bouncing back to land on E:</p>
      <pre className="overflow-x-auto rounded bg-neutral-950 p-3 font-mono text-sm text-neutral-300">
        We will, we will, rock you{'\n'} G F#, E D, E E
      </pre>
      <ul className="ml-5 list-disc space-y-1 text-sm">
        <li>
          <strong>&quot;We will&quot;</strong> (G F#) — two 8th notes leading to a held note
        </li>
        <li>
          <strong>&quot;rock&quot;</strong> (E) — a quarter note (the held one)
        </li>
        <li>
          <strong>&quot;We will&quot;</strong> (D E) — two 8th notes leading to the next held note
        </li>
        <li>
          <strong>&quot;you!&quot;</strong> (E) — a final held quarter
        </li>
      </ul>
      <p>
        Two iterations of &quot;two 8ths then a quarter&quot;. In 16th-note weights, 8ths get weight
        2, quarters get weight 4. Total: <code>2+2+4+2+2+4 = 16</code> — matching the 16 sixteenth
        notes in a 4-beat bar:
      </p>
      <StrudelEditor code={chorusStage.code} />
      <p className="text-sm text-neutral-500">
        The pattern <code>g4@2 f#4@2 e4@4 d4@2 e4@2 e4@4</code> encodes that rhythm. Note the drums
        also shifted from lesson 1&apos;s <code>bd*2 cp</code> (3 evenly-spaced hits) to{' '}
        <code>bd bd cp ~</code> (4 even beats) so the vocal melody lines up beat-for-beat with the
        stomp-stomp-clap-rest.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Why the rhythm matters</h2>
      <p>
        The pitches alone — G F# E D E E — would come out sounding like a scale exercise if played
        evenly. With the rhythm intact, your brain immediately fills in the lyric. That&apos;s the
        point of <code>@N</code>: the same notes mean very different things depending on how long
        each one lasts.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Try your own rhythm</h2>
      <TryThis
        prompt='Try changing the weights. Make the last "you" twice as long with e4@8 — held for half the bar. Or shorten "rock" to e4@1 so it&apos;s a fast 16th note instead of a quarter. Or try doubling all the weights (g4@4 f#4@4 ...) — that takes the whole melody twice as long. The pitches stay the same; the rhythm completely transforms.'
        code={chorusStage.code}
      />

      <p className="text-sm text-neutral-500">
        Two songs, one tool: <code>@N</code> works for any pattern of long-and-short notes, whether
        it&apos;s a bass riff or a stadium-anthem chorus. Next up: stacking notes together to make
        chords, with the most-air-guitarred riff of the 1970s.
      </p>
    </div>
  );
}
