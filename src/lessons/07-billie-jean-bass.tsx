import { StrudelEditor } from '../components/StrudelEditor';
import { QuizEditor } from '../components/QuizEditor';
import { SongCard } from '../components/SongCard';
import { billieJean } from '../tracks/billie-jean';
import { requireStage } from '../tracks';
import type { LessonMeta } from './index';

export const meta: LessonMeta = {
  slug: 'billie-jean-bass',
  title: 'Combining layers — Billie Jean returns',
  blurb: 'Drums + bass at the same time. The song starts feeling real.',
  order: 7,
};

const drumsStage = requireStage(billieJean, 'drums');
const withBassStage = requireStage(billieJean, 'with-bass');

export function Lesson() {
  return (
    <div className="space-y-6 text-neutral-300">
      <p>
        Lesson 4 covered comma-stacking <em>inside</em> a single <code>sound()</code> call. That
        works for drums layered together, but it doesn't help when you want to play{' '}
        <code>note(...)</code> and <code>sound(...)</code> at the same time — they're two different
        function calls.
      </p>

      <p>
        For that we use <code>stack()</code> — a function that takes any number of patterns and
        plays them simultaneously.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">stack()</h2>
      <p>
        Each argument to <code>stack()</code> is its own pattern. They all play in parallel, at the
        same tempo.
      </p>
      <StrudelEditor
        code={`stack(
  sound("bd*4"),
  note("c3 e3 g3 c4").s("piano")
)`}
      />

      <h2 className="text-lg font-semibold text-neutral-100">Billie Jean revisited</h2>
      <p>
        We built the <em>Billie Jean</em> drums in lesson 4. Time to add the bass. Louis Johnson
        played a busy 8th-note line on a Yamaha BB1200, and the intro pattern repeats throughout the
        verse:{' '}
        <strong>
          <code>F# C# E F# E C# B C#</code>
        </strong>
        .
      </p>

      <SongCard track={billieJean} />

      <p>Here are the drums on their own — same code as before:</p>
      <StrudelEditor code={drumsStage.code} />

      <p>
        Now the bass. Every note in the line is doing a specific harmonic job — none of them are
        random.
      </p>
      <ul className="ml-5 list-disc space-y-1 text-sm">
        <li>
          <code>F#2</code> — the <strong>root</strong> of F# minor. Every chord has a "home" note;
          this is it.
        </li>
        <li>
          <code>C#2</code> — the <strong>perfect 5th</strong>. The root and the 5th together form
          the most stable interval in music; rock "power chords" are nothing but a root and a 5th.
        </li>
        <li>
          <code>E2</code> — the <strong>minor 7th</strong>. Going from F# to E adds tension; it
          turns F#m into F#m7 and makes the line feel like it wants to keep moving.
        </li>
        <li>
          <code>B1</code> — the <strong>4th</strong>. It's a <em>passing tone</em>: a note that
          doesn't belong to the chord, but bridges between two chord tones (here it walks from C#
          back down and then back up to C#). Passing tones are how bass lines become melodies
          instead of just chord arpeggios.
        </li>
      </ul>
      <p>
        Together those four pitches outline F#m7 with one decorative passing tone. That's the recipe
        for a huge proportion of funk and pop basslines:{' '}
        <em>play the chord tones, walk between them with passing tones, stay in time.</em>
      </p>
      <StrudelEditor
        code={`setcpm(117/4)
note("f#2 c#2 e2 f#2 e2 c#2 b1 c#2").s("gm_acoustic_bass")`}
      />

      <p>
        Combine them with <code>stack()</code> and the song's bones snap together:
      </p>
      <StrudelEditor code={withBassStage.code} />

      <p className="text-sm text-neutral-500">
        On the recording, the bassline also walks through the chord changes (F#m to G#m to C#7).
        We're keeping it on the intro pattern, which is the most iconic and instantly recognisable
        part of the song.
      </p>

      <section className="card space-y-3">
        <h3 className="text-sm font-medium tracking-wider text-brand-300 uppercase">Quiz</h3>
        <p className="text-sm">
          Swap the bass instrument from <code>gm_acoustic_bass</code> to{' '}
          <code>gm_synth_bass_1</code> — a synthesised bass that sits closer to the original
          record's tone.
        </p>
        <QuizEditor
          initialCode={withBassStage.code}
          target={`setcpm(117/4)
stack(
  sound("bd ~ bd ~, ~ sd ~ sd, hh*8"),
  note("f#2 c#2 e2 f#2 e2 c#2 b1 c#2").s("gm_synth_bass_1")
)`}
          hint='Change "gm_acoustic_bass" to "gm_synth_bass_1" inside the bass pattern.'
        />
      </section>

      <p className="text-sm text-neutral-500">
        Drums, bass, and a <code>stack()</code> to glue them. We'll come back to{' '}
        <em>Billie Jean</em> again when we have chords and synth leads — the song will keep getting
        closer to the record.
      </p>
    </div>
  );
}
