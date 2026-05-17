import { StrudelEditor } from '../components/StrudelEditor';
import { TryThis } from '../components/TryThis';
import { SongCard } from '../components/SongCard';
import { marioTheme } from '../tracks/mario-theme';
import { requireStage } from '../tracks';
import type { LessonMeta } from './index';

export const meta: LessonMeta = {
  slug: 'mario-theme',
  title: 'Pattern transforms — Mario',
  blurb: 'rev, jux, every, fast, slow. Take a melody and warp it without rewriting the notes.',
  order: 17,
};

const opening = requireStage(marioTheme, 'opening');

export function Lesson() {
  return (
    <div className="space-y-6 text-neutral-300">
      <p>
        So far we&apos;ve treated patterns as fixed strings of notes. But Strudel patterns are{' '}
        <em>objects</em> — you can transform them after you&apos;ve written them, by reversing,
        speeding up, stereo-splitting, or applying any of a long list of operations. This is one of
        the things that makes live-coding music actually fun.
      </p>
      <p>
        We&apos;re going to demonstrate with Koji Kondo&apos;s overworld theme from{' '}
        <em>Super Mario Bros.</em> — 1985, NES, the most-loved video game music in history. The
        opening 2-bar phrase is the perfect transformation target: short, recognizable, in a clean
        major key.
      </p>

      <SongCard track={marioTheme} />

      <h2 className="text-lg font-semibold text-neutral-100">The melody</h2>
      <p>
        Mario lives in C major at 100 BPM. The famous 2-bar opening: a quick triple-E figure with a
        C in the middle, then a high G5 that waits a beat before dropping an octave to G4. That
        octave drop is the song&apos;s signature.
      </p>
      <StrudelEditor code={opening.code} />
      <p className="text-sm text-neutral-500">
        The actual NES recording uses two pulse-wave channels for melody/harmony, a triangle channel
        for bass, and a noise channel for percussion. The percussion has swing but the melodic
        pulses are straight. We&apos;re simplifying to one square wave for clarity.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">
        <code>.rev()</code> — reverse
      </h2>
      <p>
        <code>.rev()</code> plays the pattern backwards. Same notes, reverse order:
      </p>
      <StrudelEditor
        code={`setcpm(100/8)
note("e5 e5 ~ e5 ~ c5 e5 ~ g5 ~ ~ ~ g4 ~ ~ ~")
  .s("square").lpf(2500)
  .attack(0).decay(.15).sustain(.3).release(.15)
  .rev()`}
      />
      <p>
        Recognizably Mario, but the phrase resolves backwards now — starts on the low G, climbs up
        to the iconic Es. Useful for transitions or to make a B-section that&apos;s clearly related
        to the A-section.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">
        <code>.fast()</code> and <code>.slow()</code>
      </h2>
      <p>
        These do exactly what they sound like. <code>.fast(2)</code> plays the pattern at double
        speed (= takes half a cycle); <code>.slow(2)</code> at half speed.
      </p>
      <StrudelEditor
        code={`setcpm(100/8)
note("e5 e5 ~ e5 ~ c5 e5 ~ g5 ~ ~ ~ g4 ~ ~ ~")
  .s("square").lpf(2500)
  .attack(0).decay(.15).sustain(.3).release(.15)
  .fast(2)`}
      />
      <p>
        Double-time. Notice that the rests get crunched too — the entire pattern compresses
        proportionally.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">
        <code>.jux(f)</code> — split-stereo transform
      </h2>
      <p>
        <code>.jux(f)</code> is one of the cleverest functions in Strudel. It splits your pattern
        into stereo channels: left gets the original, right gets the function applied. The classic
        use is <code>.jux(rev)</code> — left ear hears Mario forward, right ear hears it reversed,
        at the same time. (Headphones recommended.)
      </p>
      <StrudelEditor
        code={`setcpm(100/8)
note("e5 e5 ~ e5 ~ c5 e5 ~ g5 ~ ~ ~ g4 ~ ~ ~")
  .s("square").lpf(2500)
  .attack(0).decay(.15).sustain(.3).release(.15)
  .jux(rev)`}
      />
      <p className="text-sm text-neutral-500">
        Your brain works hard to make sense of this. It usually decides the song is happening twice
        in different timelines — which, technically, it is. Other things to <code>jux</code> with:{' '}
        <code>.jux(x =&gt; x.fast(2))</code>, <code>.jux(x =&gt; x.add(7))</code> (transposes the
        right side by 7 semitones).
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">
        <code>.every(N, f)</code> — periodic transformation
      </h2>
      <p>
        <code>.every(N, fn)</code> applies <em>fn</em> to the pattern every Nth cycle. The other N-1
        cycles play normally. So <code>.every(4, rev)</code> means &quot;play normally for 3 cycles,
        then reverse on cycle 4, repeat.&quot;
      </p>
      <StrudelEditor
        code={`setcpm(100/8)
note("e5 e5 ~ e5 ~ c5 e5 ~ g5 ~ ~ ~ g4 ~ ~ ~")
  .s("square").lpf(2500)
  .attack(0).decay(.15).sustain(.3).release(.15)
  .every(4, rev)`}
      />
      <p>
        This is the workhorse of &quot;living&quot; patterns — keep something familiar for a while,
        then surprise the listener. Variations come for free without writing more patterns by hand.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Stack them</h2>
      <TryThis
        prompt='Try stacking the regular melody with a slowed-down version an octave lower (the "underworld" Mario vibe). Add a second note line to the stack: the same pattern but transposed down 12 semitones using .add(-12) and slowed with .slow(2). Listen for how the slow low version becomes a bass under the fast melody.'
        code={opening.code}
      />

      <p className="text-sm text-neutral-500">
        Transforms turn a 16-note pattern into endless variation. Combined with <code>every</code>{' '}
        and <code>jux</code>, the same source pattern can sound like a dozen different arrangements.
        Next we add another tool for variation: <em>probability</em> — letting some events happen{' '}
        <em>sometimes</em> instead of always.
      </p>
    </div>
  );
}
