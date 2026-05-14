import { StrudelEditor } from '../components/StrudelEditor';
import { TryThis } from '../components/TryThis';
import { SongCard } from '../components/SongCard';
import { SongJourney } from '../components/SongJourney';
import { sweetDreams } from '../tracks/sweet-dreams';
import { requireStage } from '../tracks';
import type { LessonMeta } from './index';

export const meta: LessonMeta = {
  slug: 'sweet-dreams-full',
  title: 'A full song — Sweet Dreams returns',
  blurb: 'Verses, bridge, arrange(). Build a complete track with multiple sections.',
  order: 18,
};

const verseStage = requireStage(sweetDreams, 'verse');
const bridgeStage = requireStage(sweetDreams, 'bridge');
const fullStage = requireStage(sweetDreams, 'full');

export function Lesson() {
  return (
    <div className="space-y-6 text-neutral-300">
      <p>
        Lesson 13 built the Sweet Dreams bass tone. Now we finish the song. Every tool from every
        previous lesson is going to land in one expression: drums, square-wave bass, chord pads,
        sectional arrangement. The last new concept is <code>arrange()</code> — how you sequence
        multiple sections so a song has structure instead of just looping forever.
      </p>

      <SongCard track={sweetDreams} />

      <SongJourney trackId="sweet-dreams" currentLessonSlug={meta.slug} />

      <h2 className="text-lg font-semibold text-neutral-100">Build it up: the verse</h2>
      <p>
        The verse stacks the bass riff (from lesson 13), the LinnDrum pattern, and a chord pad
        playing <code>Cm | Ab Gm</code> over each 2-bar cycle. The chord notes are written as
        explicit stacks — we&apos;ve been using this approach since lesson 6:
      </p>
      <ul className="ml-5 list-disc space-y-1 text-sm">
        <li>
          <strong>Cm:</strong> <code>[c4, eb4, g4]</code>
        </li>
        <li>
          <strong>Ab:</strong> <code>[ab3, c4, eb4]</code>
        </li>
        <li>
          <strong>Gm:</strong> <code>[g3, bb3, d4]</code>
        </li>
      </ul>
      <StrudelEditor code={verseStage.code} />
      <p className="text-sm text-neutral-500">
        That&apos;s the verse texture. Looped endlessly, it&apos;d eventually become boring — which
        is why songs have <em>bridges</em>.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">The bridge</h2>
      <p>
        Sweet Dreams has a contrasting middle section. Dave Stewart said it had to feel
        &quot;positive, rising upwards&quot; — and the chord progression flips: instead of{' '}
        <code>Cm | Ab Gm</code>, the bridge is <code>Cm | F</code>. F major against the C-minor
        world feels brighter; the harmonic relationship is iv-vs-IV (one note flipped, Ab to A,
        changes the whole emotional weather).
      </p>
      <StrudelEditor code={bridgeStage.code} />

      <h2 className="text-lg font-semibold text-neutral-100">
        <code>arrange()</code> — sequencing sections
      </h2>
      <p>
        Now we need to chain verse and bridge into a song. <code>arrange()</code> takes
        <code>[cycles, pattern]</code> pairs and plays them sequentially:
      </p>
      <pre className="overflow-x-auto rounded bg-neutral-950 p-3 font-mono text-sm text-neutral-300">
        arrange({'\n'} [4, sectionA], {'// play sectionA for 4 cycles'}
        {'\n'} [2, sectionB], {'// then sectionB for 2 cycles'}
        {'\n'} [4, sectionA] {'// then sectionA again'}
        {'\n'})
      </pre>
      <p>
        Each cycle is 2 bars (our setting), so <code>[4, verse]</code> = 8 bars of verse,{' '}
        <code>[2, bridge]</code> = 4 bars of bridge. Here&apos;s arrangement applied to the chord
        pad alone, so you can hear the section switches clearly:
      </p>
      <StrudelEditor
        code={`setcpm(126/8)
arrange(
  [4, note("[c4,eb4,g4]@2 [ab3,c4,eb4] [g3,bb3,d4]")],
  [2, note("[c4,eb4,g4] [f3,a3,c4]")],
  [4, note("[c4,eb4,g4]@2 [ab3,c4,eb4] [g3,bb3,d4]")]
).s("sawtooth")
  .attack(.05).decay(.3).sustain(.8).release(.4)
  .lpf(1500).gain(.5).room(.4)`}
      />
      <p className="text-sm text-neutral-500">
        All the synth settings are chained <em>after</em> <code>arrange()</code> — the arrangement
        function returns a pattern, and you can chain anything onto it just like any other pattern.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">The complete track</h2>
      <p>
        Put everything in one <code>stack</code>. Drums and hats hold steady throughout (no need to
        arrange them — they don&apos;t change between sections). The bass <em>and</em> the chord pad
        both use <code>arrange()</code> to switch between the verse and bridge patterns at the same
        moments. The result: a sequenced track with real arrangement, in about 25 lines of code.
      </p>
      <StrudelEditor code={fullStage.code} />
      <p className="text-sm text-neutral-500">
        Loop it. You&apos;ve made a track. Add the vocal melody on top (Annie Lennox spends most of
        her lines on Eb and G), or sample a vocal phrase and chop it with the lesson-17 techniques.
        The skeleton is here — everything else is decoration.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">
        The recipe for &quot;a song in Strudel&quot;
      </h2>
      <p>You just executed the same loop you can apply to any song:</p>
      <ol className="ml-5 list-decimal space-y-1 text-sm">
        <li>
          Pick a tempo and set <code>setcpm</code> to your cycle length in bars.
        </li>
        <li>Write a hook (bass riff, melodic phrase) and get it sounding right alone.</li>
        <li>Add a drum pattern that locks with it.</li>
        <li>Add a chord pad for harmonic context.</li>
        <li>Write a contrasting section (different chord progression, different bass).</li>
        <li>
          Sequence the sections with <code>arrange()</code>.
        </li>
      </ol>

      <TryThis
        prompt='Try forking the full track. Swap "Cm@2 Ab Gm" for a different progression like Am-F-G-Em (a common pop turnaround). Change the bass riff to outline different chord tones. Swap "LinnDrum" for "RolandTR808" for a hip-hop vibe. Lengthen the bridge to [4, bridge]. The whole point of writing music in code is that you can rewrite it instantly.'
        code={fullStage.code}
      />

      <h2 className="text-lg font-semibold text-neutral-100">Where to go from here</h2>
      <p>Congratulations — you can write songs in Strudel now. From here:</p>
      <ul className="ml-5 list-disc space-y-1 text-sm">
        <li>
          Pick a song you love and try to recreate it. The recipe above scales to almost any
          electronic, rock, or pop track.
        </li>
        <li>
          Read the{' '}
          <a href="https://strudel.cc/learn/" className="text-brand-300 underline">
            official Strudel docs
          </a>{' '}
          — every function we&apos;ve used has more options than we covered.
        </li>
        <li>
          Make a song that&apos;s entirely yours. The tools you have right now are everything you
          need to make a full track.
        </li>
      </ul>
      <p className="text-sm text-neutral-500">
        Two months ago, &quot;how would I program music?&quot; sounded like an impossibly broad
        question. Now you have an answer: <code>sound</code>, <code>note</code>, <code>stack</code>,{' '}
        <code>setcpm</code>, and patterns that compose. Strudel was designed for this. Go make
        something.
      </p>
    </div>
  );
}
