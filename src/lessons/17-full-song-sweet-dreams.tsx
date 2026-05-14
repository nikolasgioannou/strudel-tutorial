import { StrudelEditor } from '../components/StrudelEditor';
import { QuizEditor } from '../components/QuizEditor';
import { SongCard } from '../components/SongCard';
import { sweetDreams } from '../tracks/sweet-dreams';
import { requireStage } from '../tracks';
import type { LessonMeta } from './index';

export const meta: LessonMeta = {
  slug: 'sweet-dreams',
  title: 'Building a full song — Sweet Dreams',
  blurb: "Every layer, every section. Eurythmics' 1983 hit, recreated end-to-end in Strudel.",
  order: 17,
};

const bassRiffStage = requireStage(sweetDreams, 'bass-riff');
const drumsStage = requireStage(sweetDreams, 'drums');
const verseStage = requireStage(sweetDreams, 'verse');
const bridgeStage = requireStage(sweetDreams, 'bridge');
const fullStage = requireStage(sweetDreams, 'full');

export function Lesson() {
  return (
    <div className="space-y-6 text-neutral-300">
      <p>
        Every lesson so far has taught one tool. This lesson uses all of them at once. We'll
        recreate Eurythmics' <em>Sweet Dreams (Are Made of This)</em> — the whole song, layer by
        layer, including <strong>arrangement</strong> (how to make a track that has different
        sections instead of just looping forever).
      </p>

      <SongCard track={sweetDreams} />

      <p>
        Annie Lennox and Dave Stewart made this in a tiny upstairs studio in 1983 with a LinnDrum
        drum machine and a pair of synths (Oberheim OB-X, or possibly a Juno-60 + SH-09 — it's been
        debated for forty years) panned hard left and right. That's the whole production. The rest
        is repetition, layering, and one section that contrasts with the rest. Strudel was
        practically designed to write music like this.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">
        The skeleton: tempo, key, structure
      </h2>
      <p>
        <strong>126 BPM</strong>, <strong>C minor</strong>, <strong>4/4</strong>. The whole song
        moves in 2-bar units, so we set <code>setcpm(126/8)</code> — one cycle covers 2 bars (8
        beats). The verse/chorus uses one 2-bar chord pattern, the bridge uses another:
      </p>
      <ul className="ml-5 list-disc space-y-1 text-sm">
        <li>
          <strong>Verse/Chorus:</strong> <code>Cm | Ab Gm</code> — one bar of Cm, then half a bar
          each of Ab and Gm.
        </li>
        <li>
          <strong>Bridge:</strong> <code>Cm | F</code> — one bar of Cm, then one bar of F. (Stewart
          said the bridge had to feel positive, "rising upwards" — F is brighter than Ab/Gm.)
        </li>
      </ul>

      <h2 className="text-lg font-semibold text-neutral-100">Layer 1: The bass riff</h2>
      <p>
        The hook everyone knows. A square-wave synth bass plays 16 eighth notes spanning the 2-bar
        loop:
      </p>
      <pre className="overflow-x-auto rounded bg-neutral-950 p-3 font-mono text-sm text-neutral-300">
        Bar 1 (Cm): C C C C Eb Eb C C{'\n'}Bar 2 (Ab→Gm): Ab Ab Ab C G G G C
      </pre>
      <p>
        The bass stays inside C minor's chord tones the whole way — that's why it sits so well under
        the chord changes. We use a <code>square</code> wave for that buzzy 80s-synth tone and a
        low-pass filter to take the harshness off:
      </p>
      <StrudelEditor code={bassRiffStage.code} />
      <p className="text-sm text-neutral-500">
        Settings worth noting: <code>.lpq(3)</code> adds a touch of resonance for the "rounded" bass
        character. <code>.sustain(0)</code> with a short <code>.decay(.2)</code> gives each note a
        percussive, plucky envelope — like a real bass synth hit, not a held organ tone.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Layer 2: The drums</h2>
      <p>
        Sweet Dreams' drum pattern is the textbook 80s 4-on-the-floor: kick on every quarter, snare
        on the backbeat (2 and 4 of each bar), hi-hats on every 8th. Over our 2-bar cycle that means
        8 kicks, 4 snares, 16 hats:
      </p>
      <StrudelEditor code={drumsStage.code} />
      <p className="text-sm text-neutral-500">
        <code>.bank("LinnDrum")</code> uses the same drum machine Eurythmics actually used — the
        LinnDrum was the prestige drum machine of the early 80s and you've heard it on probably half
        the records from that decade. Listen for the iconic snare and clap sounds.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Layer 3: Combine them</h2>
      <p>
        Stack the bass and drums in a single pattern with <code>stack()</code>. Now we have the
        groove that anchors 90% of the song. The bass riff drives the melody, the drums lock down
        the rhythm. You could honestly leave it here and have something that loops compellingly:
      </p>
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

      <h2 className="text-lg font-semibold text-neutral-100">Layer 4: The pad</h2>
      <p>
        Sweet Dreams isn't just bass + drums — there's a sustained synth playing the chords
        underneath. We could use <code>chord()</code> with <code>.voicing()</code> (lesson 11) and
        let Strudel pick the chord positions automatically. But for this song we want a specific
        sound — chords in a comfortable mid-octave range, sitting cleanly above the bass — so we'll
        write them out explicitly as note stacks instead:
      </p>
      <ul className="ml-5 list-disc space-y-1 text-sm">
        <li>
          <strong>Cm:</strong> <code>[c4, eb4, g4]</code> — root, minor 3rd, 5th
        </li>
        <li>
          <strong>Ab:</strong> <code>[ab3, c4, eb4]</code> — moves down by one note so it stays
          close to Cm (good voice leading)
        </li>
        <li>
          <strong>Gm:</strong> <code>[g3, bb3, d4]</code> — same shape one step down
        </li>
      </ul>
      <p className="text-sm">
        The <code>@2</code> on the first chord holds Cm for two weight units (= 1 bar), then Ab and
        Gm each get one unit (= half a bar each). Total weights = 4 = the 2-bar cycle.
      </p>
      <StrudelEditor code={verseStage.code} />
      <p className="text-sm text-neutral-500">
        With the pad added, the harmonic content fills out — the bass tells you the chord root, the
        pad tells you the chord quality (major vs minor), and the drums keep time. This is the full
        verse/chorus texture of the song.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">The bridge</h2>
      <p>
        Now we need contrast. The bridge keeps the same drums and tempo but changes the chord
        progression to <code>Cm | F</code> (one bar each). The bass simplifies to repeated roots — 8
        C's followed by 8 F's:
      </p>
      <StrudelEditor code={bridgeStage.code} />
      <p className="text-sm text-neutral-500">
        F major against the C-minor world feels brighter, which is Stewart's "positive section,
        rising upwards" idea in action. The harmonic relationship is <strong>iv (Fm)</strong> in the
        verse vs <strong>IV (F)</strong> in the bridge — flipping one note (Ab to A) changes the
        emotional weather.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">
        Arrangement — <code>arrange()</code>
      </h2>
      <p>
        We now have two sections that sound great in isolation. To turn them into a song, we need to{' '}
        <em>sequence</em> them. Strudel's <code>arrange()</code> function plays patterns one after
        another for a specified number of cycles each:
      </p>
      <pre className="overflow-x-auto rounded bg-neutral-950 p-3 font-mono text-sm text-neutral-300">
        arrange({'\n'} [4, sectionA], {'// play sectionA for 4 cycles'}
        {'\n'} [2, sectionB], {'// then sectionB for 2 cycles'}
        {'\n'} [4, sectionA] {'// then sectionA again for 4 cycles'}
        {'\n'})
      </pre>
      <p>
        Each cycle is 2 bars (our setting), so <code>[4, verse]</code> = 8 bars of verse,{' '}
        <code>[2, bridge]</code> = 4 bars of bridge. Here it is on just the chord pad so you can
        hear the transitions clearly:
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
        All the synth settings are chained <em>after</em> <code>arrange()</code>. The arrangement
        function returns a pattern; you can chain anything onto it the same way you'd chain onto any
        other pattern.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">The whole song</h2>
      <p>
        Put it all in one <code>stack</code>. Drums and hats hold steady throughout (no need to
        arrange them — they don't change between sections). The bass <em>and</em> the chord pad both
        use <code>arrange()</code> to switch between the verse and bridge patterns at the same
        moments. The result: a sequenced track with real arrangement, in about 25 lines of code.
      </p>
      <StrudelEditor code={fullStage.code} />
      <p className="text-sm text-neutral-500">
        That's the song. Loop it and you've got something that wouldn't sound out of place on a
        synth-pop record. Add the vocal melody on top (left as an exercise — Annie Lennox's lines
        spend most of their time on Eb and G), or sample a vocal phrase and chop it with the
        lesson-16 techniques.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Make it your own</h2>
      <p>The recipe for "song in Strudel" you just executed:</p>
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
      <p>
        Try forking the full track above. Swap <code>{`"Cm@2 Ab Gm"`}</code> for a different
        progression (try <code>{`"Am@2 F G"`}</code> for a brighter feel). Change the bass riff to
        outline different chord tones. Swap <code>"LinnDrum"</code> for <code>"RolandTR808"</code>{' '}
        for a hip-hop vibe. Lengthen the bridge to <code>[4, bridge]</code>. The whole point of
        writing it in code is that you can rewrite it instantly.
      </p>

      <section className="card space-y-3">
        <h3 className="text-sm font-medium tracking-wider text-brand-300 uppercase">Quiz</h3>
        <p className="text-sm">
          Modify the verse to use the <strong>same bass riff</strong> but transpose it{' '}
          <strong>down a 5th</strong> (an interval of 5 scale degrees, ~7 semitones) — so it plays
          in <strong>F minor</strong> instead of C minor. The new bass notes should be F1 F1 F1 F1
          Ab1 Ab1 F1 F1 | Db1 Db1 Db1 F1 C1 C1 C1 F1 and the chord pattern should be Fm@2 Db Cm.
        </p>
        <QuizEditor
          initialCode={`setcpm(126/8)
stack(
  note("c2 c2 c2 c2 eb2 eb2 c2 c2 ab1 ab1 ab1 c2 g1 g1 g1 c2")
    .s("square").lpf(900).lpq(3)
    .attack(0).decay(.2).sustain(0).gain(.7),
  sound("bd*8").bank("LinnDrum"),
  sound("[~ sd]*4").bank("LinnDrum").gain(.8),
  note("[c4,eb4,g4]@2 [ab3,c4,eb4] [g3,bb3,d4]")
    .s("sawtooth")
    .attack(.05).decay(.3).sustain(.8).release(.4)
    .lpf(1500).gain(.25).room(.4)
)`}
          target={`setcpm(126/8)
stack(
  note("f1 f1 f1 f1 ab1 ab1 f1 f1 db1 db1 db1 f1 c1 c1 c1 f1")
    .s("square").lpf(900).lpq(3)
    .attack(0).decay(.2).sustain(0).gain(.7),
  sound("bd*8").bank("LinnDrum"),
  sound("[~ sd]*4").bank("LinnDrum").gain(.8),
  note("[f3,ab3,c4]@2 [db3,f3,ab3] [c3,eb3,g3]")
    .s("sawtooth")
    .attack(.05).decay(.3).sustain(.8).release(.4)
    .lpf(1500).gain(.25).room(.4)
)`}
          hint="Bass: c→f, eb→ab, ab→db, g→c (each down a 5th). Pad: Cm→Fm (f3,ab3,c4), Ab→Db (db3,f3,ab3), Gm→Cm (c3,eb3,g3)."
        />
      </section>

      <p className="text-sm text-neutral-500">
        You just built and arranged a full song. From here you can recreate almost any 80s synth-pop
        track — they all use the same skeleton you just learned. The tools you'd add for more
        complex genres (sidechain ducking, automation curves, send effects) all exist in Strudel too
        — but the core composition flow is what you have right now.
      </p>
    </div>
  );
}
