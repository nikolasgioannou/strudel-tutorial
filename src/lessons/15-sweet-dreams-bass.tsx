import { StrudelEditor } from '../components/StrudelEditor';
import { TryThis } from '../components/TryThis';
import { SongCard } from '../components/SongCard';
import { SongJourney } from '../components/SongJourney';
import { sweetDreams } from '../tracks/sweet-dreams';
import { requireStage } from '../tracks';
import type { LessonMeta } from './index';

export const meta: LessonMeta = {
  slug: 'sweet-dreams-bass',
  title: 'A signature bass tone — Sweet Dreams',
  blurb: "Eurythmics' iconic synth bass. Square waves, lpq resonance, LinnDrum drums.",
  order: 15,
};

const bassRiff = requireStage(sweetDreams, 'bass-riff');
const drumsStage = requireStage(sweetDreams, 'drums');

export function Lesson() {
  return (
    <div className="space-y-6 text-neutral-300">
      <p>
        Annie Lennox and Dave Stewart wrote Sweet Dreams in 1983 in a tiny upstairs studio. The
        sequencing was done on a <strong>Movement Systems MCS Drum Computer</strong> — a rare
        British prototype, only about 30 units ever built — which drove a Roland SH-101 for the
        bass. An Oberheim OB-X provided the sustained string pad. The bass riff is what you remember
        most. We&apos;ll build the tone now.
      </p>
      <p className="text-sm text-neutral-500">
        Strudel doesn&apos;t ship Movement MCS samples — almost no software does. We&apos;ll use the
        LinnDrum bank as the closest available approximation. Historically inaccurate, sonically in
        the family.
      </p>

      <SongCard track={sweetDreams} />

      <SongJourney trackId="sweet-dreams" currentLessonSlug={meta.slug} />

      <h2 className="text-lg font-semibold text-neutral-100">The riff</h2>
      <p>
        Sweet Dreams moves in 2-bar units. The bass riff is 16 eighth notes across those 2 bars,
        outlining a Cm chord in bar 1 and an Ab/Gm split in bar 2:
      </p>
      <pre className="overflow-x-auto rounded bg-neutral-950 p-3 font-mono text-sm text-neutral-300">
        Bar 1 (Cm): C C C C Eb Eb C C{'\n'}Bar 2 (Ab→Gm): Ab Ab Ab C G G G C
      </pre>
      <p>
        That&apos;s 16 notes — pure repetition with two ascending steps (Eb, Ab) that make the ear
        lean forward. Strudel-wise it&apos;s straightforward:
      </p>
      <StrudelEditor code={bassRiff.code} />

      <h2 className="text-lg font-semibold text-neutral-100">
        Why <code>square</code>, not <code>sawtooth</code>?
      </h2>
      <p>
        We&apos;ve been defaulting to <code>sawtooth</code> for most synth work. Sweet Dreams&apos;
        bass uses a <strong>square wave</strong> instead — and it matters.
      </p>
      <ul className="ml-5 list-disc space-y-1 text-sm">
        <li>
          <strong>Sawtooth</strong> contains every harmonic — brightest, buzziest. Good for leads,
          brass.
        </li>
        <li>
          <strong>Square</strong> contains only <em>odd</em> harmonics — hollow, woodwind-like
          character. Good for bass, sub-bass, and that 80s synth-pop tone.
        </li>
      </ul>
      <p>Hear them side-by-side. First sawtooth on the riff:</p>
      <StrudelEditor
        code={`setcpm(126/8)
note("c2 c2 c2 c2 eb2 eb2 c2 c2 ab1 ab1 ab1 c2 g1 g1 g1 c2")
  .s("sawtooth").lpf(900)
  .attack(0).decay(.2).sustain(0)`}
      />
      <p>Now square — same notes, same filter, only the waveform changes:</p>
      <StrudelEditor
        code={`setcpm(126/8)
note("c2 c2 c2 c2 eb2 eb2 c2 c2 ab1 ab1 ab1 c2 g1 g1 g1 c2")
  .s("square").lpf(900)
  .attack(0).decay(.2).sustain(0)`}
      />
      <p className="text-sm text-neutral-500">
        That hollow, slightly nasal quality is the square wave&apos;s personality. Listen for it in
        80s synth-pop bass, in Game Boy chiptune, in old-school techno — anywhere you hear that
        &quot;bubble&quot; bass tone, it&apos;s probably a square.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">
        <code>.lpq()</code> — resonance for character
      </h2>
      <p>
        Filter resonance (Q) emphasizes frequencies right at the cutoff. A little Q gives the filter
        character; too much makes it howl. For a bass synth tone, you want some Q to give the cutoff
        &quot;edge&quot;:
      </p>
      <StrudelEditor code={bassRiff.code} />
      <p>
        <code>.lpq(3)</code> on the riff — moderate Q. Compare with no Q:
      </p>
      <StrudelEditor
        code={`setcpm(126/8)
note("c2 c2 c2 c2 eb2 eb2 c2 c2 ab1 ab1 ab1 c2 g1 g1 g1 c2")
  .s("square").lpf(900)
  .attack(0).decay(.2).sustain(0)`}
      />
      <p className="text-sm text-neutral-500">
        Higher Q makes the filter cutoff audibly resonate — sharper transients on each note, more
        &quot;synth-pop pluck.&quot; Crank it to <code>.lpq(10)</code> and you&apos;ll hear it howl.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Add the LinnDrum</h2>
      <p>
        Sweet Dreams&apos; drum pattern is a textbook 80s 4-on-the-floor — kick on every quarter,
        snare on the backbeat, hats on every 8th — played with the LinnDrum samples. Strudel ships
        those:
      </p>
      <StrudelEditor code={drumsStage.code} />
      <p>Now combine bass + drums:</p>
      <StrudelEditor
        code={`setcpm(126/8)
stack(
  note("c2 c2 c2 c2 eb2 eb2 c2 c2 ab1 ab1 ab1 c2 g1 g1 g1 c2")
    .s("square").lpf(900).lpq(3)
    .attack(0).decay(.2).sustain(0).gain(.7),
  sound("bd*8").bank("LinnDrum"),
  sound("[~ sd]*4").bank("LinnDrum").gain(.8),
  sound("hh*16").bank("LinnDrum").gain(.5)
)`}
      />
      <p>
        You can hear the song forming. That&apos;s 95% of Sweet Dreams in eight lines of code. The
        chord pad and vocal arrangement are still to come — we&apos;ll get there in lesson 18.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Make it your own</h2>
      <TryThis
        prompt='Swap the LinnDrum bank for "RolandTR808" to make it more hip-hop. Or push the filter cutoff higher (lpf 1500 instead of 900) for a more aggressive, brighter bass. Or transpose to a different key — replace c2 with f2, eb2 with ab2, ab1 with db2, g1 with c2 to play it in F minor.'
        code={bassRiff.code}
      />

      <p className="text-sm text-neutral-500">
        Sweet Dreams comes back in lesson 18 — full song with the chord pad, the bridge, and the{' '}
        <code>arrange()</code> function that sequences the verses and bridge into a complete track.
        Next lesson we add atmosphere — reverb and delay — using Phil Collins&apos; most famous
        moment.
      </p>
    </div>
  );
}
