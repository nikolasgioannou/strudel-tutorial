import { StrudelEditor } from '../components/StrudelEditor';
import { TryThis } from '../components/TryThis';
import { SongCard } from '../components/SongCard';
import { SongJourney } from '../components/SongJourney';
import { sevenNationArmy } from '../tracks/seven-nation-army';
import { requireStage } from '../tracks';
import type { LessonMeta } from './index';

export const meta: LessonMeta = {
  slug: 'seven-nation-army',
  title: 'Your first riff — Seven Nation Army',
  blurb: 'Pitches. note(). The 7-note bass figure heard in every stadium since 2003.',
  order: 4,
};

const riffStage = requireStage(sevenNationArmy, 'riff');

export function Lesson() {
  return (
    <div className="space-y-6 text-neutral-300">
      <p>
        We've made drum patterns. Now we make notes. The White Stripes' <em>Seven Nation Army</em>{' '}
        opens with one of the most-played riffs of the 21st century — Jack White stomping a Whammy
        pedal to drop his guitar an octave so it sounds like a bass. Seven notes. You can hear it
        from any stadium crowd, any football match, any election rally. Time to play it yourself.
      </p>

      <SongCard track={sevenNationArmy} />

      <SongJourney trackId="seven-nation-army" currentLessonSlug={meta.slug} />

      <h2 className="text-lg font-semibold text-neutral-100">
        <code>note()</code> — pitched notes
      </h2>
      <p>
        <code>sound()</code> triggered drum samples. <code>note()</code> triggers musical pitches.
        It takes a string of note names — letters from <code>a</code> to <code>g</code>, with
        optional <code>#</code> (sharp) or <code>b</code> (flat), and a number for which octave (3,
        4, 5 — 4 is middle):
      </p>
      <StrudelEditor code={`note("c4 d4 e4 f4")`} />
      <p>That's four ascending notes — C, D, E, F in the 4th octave (middle of the piano).</p>

      <h2 className="text-lg font-semibold text-neutral-100">The Seven Nation Army riff</h2>
      <p>
        The riff is seven notes: <strong>E E G E D C B</strong>. Jack White plays it on the guitar's
        low strings, in E minor, so the pitches sit down in bass territory. Octave 2 is the right
        register:
      </p>
      <StrudelEditor code={riffStage.code} />
      <p>
        That's the famous riff. The <code>~</code> at the end is a rest — the original holds the
        final B for two beats; we'll come back to that real rhythm in the next lesson.
      </p>
      <p className="text-sm text-neutral-500">
        <code>.s(&quot;gm_acoustic_bass&quot;)</code> picks the sampled instrument — Strudel has a
        whole General MIDI library. <code>gm_acoustic_bass</code> gives us a credible upright/bass
        sound. Without <code>.s()</code>, you'd hear a plain synth tone.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">
        Why <code>setcpm(124/4)</code>?
      </h2>
      <p>
        Same formula as before. The song is at 124 BPM. The riff fills 1 bar of 4/4 (4 beats), so 1
        cycle = 4 beats and <code>setcpm = 124 / 4 = 31</code> cycles per minute.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Layering with the drums</h2>
      <p>
        Now stack the riff with a simple drum pattern — kick on every beat, snare on 2 and 4. The
        riff becomes a song:
      </p>
      <StrudelEditor
        code={`setcpm(124/4)
stack(
  note("e2 e2 g2 e2 d2 c2 b1 ~").s("gm_acoustic_bass"),
  sound("bd*4"),
  sound("~ sd ~ sd")
)`}
      />
      <p>
        You just made the verse of Seven Nation Army with five lines of code. The kicks pound, the
        snare backbeats, the riff snakes underneath.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Notes in different octaves</h2>
      <TryThis
        prompt='Try changing octaves. Play the riff one octave higher — replace "e2" with "e3", "b1" with "b2", and so on. Or transpose the whole riff up a half-step into F minor: f2 f2 ab2 f2 eb2 db2 c2 ~.'
        code={riffStage.code}
      />

      <p className="text-sm text-neutral-500">
        We&apos;ll come back to this riff in lesson 5 to give it the studio-correct rhythm (the
        first E is held for a full beat, the final B for two), and again in lesson 7 to rewrite it
        as scale degrees instead of pitch names.
      </p>
    </div>
  );
}
