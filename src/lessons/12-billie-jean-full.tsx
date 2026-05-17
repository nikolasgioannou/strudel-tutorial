import { StrudelEditor } from '../components/StrudelEditor';
import { TryThis } from '../components/TryThis';
import { SongCard } from '../components/SongCard';
import { SongJourney } from '../components/SongJourney';
import { billieJean } from '../tracks/billie-jean';
import { requireStage } from '../tracks';
import type { LessonMeta } from './index';

export const meta: LessonMeta = {
  slug: 'billie-jean-full',
  title: 'Layering — Billie Jean returns',
  blurb: 'Drums + bass + chord pad. The full verse texture, three layers deep.',
  order: 12,
};

const drumsStage = requireStage(billieJean, 'drums');
const fullGroove = requireStage(billieJean, 'full-groove');

export function Lesson() {
  return (
    <div className="space-y-6 text-neutral-300">
      <p>
        Back in lesson 2 we built the drums for <em>Billie Jean</em>. We now know how to write riffs
        and chord progressions. Time to stack everything into the full verse texture — drums + bass
        + chord pad, three layers playing as one groove.
      </p>

      <SongCard track={billieJean} />

      <SongJourney trackId="billie-jean" currentLessonSlug={meta.slug} />

      <h2 className="text-lg font-semibold text-neutral-100">Where we left off</h2>
      <p>The drums alone, from lesson 2:</p>
      <StrudelEditor code={drumsStage.code} />

      <h2 className="text-lg font-semibold text-neutral-100">Louis Johnson&apos;s bassline</h2>
      <p>
        The bass on <em>Billie Jean</em> was played by Louis Johnson on a Yamaha BB1200. It&apos;s a
        busy 8th-note line — never rests for more than half a beat — that walks between two chord
        centers, F#m (the i chord) and B (the iv).
      </p>
      <p>
        The 8 notes: <strong>F# C# E F# E C# B C#</strong>. F# is the root; C# is the 5th; E is the
        b7; B is the 4th. All chord tones of F# minor and B, with B serving as a passing tone
        walking back to C#.
      </p>
      <StrudelEditor
        code={`setcpm(117/4)
note("f#2 c#2 e2 f#2 e2 c#2 b1 c#2").s("gm_acoustic_bass")`}
      />

      <h2 className="text-lg font-semibold text-neutral-100">The chord pad</h2>
      <p>
        The song&apos;s verse alternates between two chords: <strong>F#m</strong> and{' '}
        <strong>G#m7</strong>, one per bar. We&apos;ll use explicit note stacks (instead of{' '}
        <code>chord().voicing()</code>) to control the octave exactly:
      </p>
      <ul className="ml-5 list-disc space-y-1 text-sm">
        <li>
          F#m: <code>[f#3, a3, c#4]</code> — root, minor 3rd, 5th
        </li>
        <li>
          G#m7: <code>[g#3, b3, d#4, f#4]</code> — adds the b7 (F#) for the &quot;m7&quot; flavor
        </li>
      </ul>
      <StrudelEditor
        code={`setcpm(117/4)
note("<[f#3,a3,c#4] [g#3,b3,d#4,f#4]>")
  .s("sawtooth").lpf(1500)
  .attack(.05).decay(.3).sustain(.7).release(.4)
  .gain(.3).room(.4)`}
      />
      <p>
        Two chords alternating, one per cycle. With a slow attack and a touch of room, it sits
        underneath everything like a haze.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">All three together</h2>
      <p>Stack them. Drums lay the rhythm, bass walks the harmony, pad fills the space:</p>
      <StrudelEditor code={fullGroove.code} />
      <p>
        That&apos;s the verse of Billie Jean. Six lines of pattern code, three instruments, one of
        the most-recognized grooves in pop. The bass and drums lock to each other; the pad floats
        over both.
      </p>
      <p className="text-sm text-neutral-500">
        Notice how the cycle math works: drums and bass both have 4 beats per cycle (
        <code>setcpm(117/4)</code>), but the chord pad alternates with <code>{`<>`}</code> so it
        takes <em>two</em> cycles to play both chords. That means the chord changes every 2 bars —
        exactly how it works in the song.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Layer it differently</h2>
      <TryThis
        prompt='Try simplifying the bassline to just the chord roots — replace the 8-note pattern with note("<f#2 g#2>"). The song still works, but loses its slithery, walking feel. The genius of Louis Johnson is the passing notes (B1, C#2 as a walking turnaround). Then add a 4th layer: a one-finger synth lead on top of the pad. Try note("f#4 ~ ~ a4 ~ c#5 ~ ~").s("sawtooth").attack(0).decay(.1).sustain(0).gain(.4) added to the stack.'
        code={fullGroove.code}
      />

      <p className="text-sm text-neutral-500">
        Billie Jean comes back one more time in lesson 16 — same groove, but with{' '}
        <em>probability</em> mixed in to make the drums feel less robotic. Real drummers don&apos;t
        play the same pattern every bar; they throw in ghost notes and accent shifts. We&apos;ll
        teach the machine to do that.
      </p>
    </div>
  );
}
