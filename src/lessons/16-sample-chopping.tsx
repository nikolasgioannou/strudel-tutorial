import { StrudelEditor } from '../components/StrudelEditor';
import { QuizEditor } from '../components/QuizEditor';
import { SongCard } from '../components/SongCard';
import { amenBreak } from '../tracks/amen-break';
import { requireStage } from '../tracks';
import type { LessonMeta } from './index';

export const meta: LessonMeta = {
  slug: 'sample-chopping',
  title: 'Sample chopping — the Amen Break',
  blurb: 'The seven seconds of drums that built jungle, drum-and-bass, and a lot of hip-hop.',
  order: 16,
};

const straightStage = requireStage(amenBreak, 'straight');
const choppedStage = requireStage(amenBreak, 'chopped');
const remixedStage = requireStage(amenBreak, 'remixed');

export function Lesson() {
  return (
    <div className="space-y-6 text-neutral-300">
      <p>
        Everything we've made so far has been built from short individual sounds — kicks, snares,
        single notes. Strudel can also work with <em>longer samples</em>: pre-recorded audio you
        slice and rearrange. The most famous example in history is a seven-second drum solo from
        1969.
      </p>

      <SongCard track={amenBreak} />

      <p>
        In 1969, drummer Gregory Coleman played a four-bar break in the middle of an obscure soul
        B-side called <em>Amen, Brother</em>. In the late 80s producers started sampling it. Today
        it's the foundation of jungle, drum-and-bass, hardcore, and an enormous chunk of hip-hop.
        Coleman died in poverty without ever making a cent from it.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Loading samples</h2>
      <p>
        Strudel doesn't ship the Amen break by default — we have to <em>load</em> a sample pack that
        contains it. The cleanest single-file version lives in Alex McLean's{' '}
        <code>clean-breaks</code> repo, which packs a handful of classic breakbeats including the
        Amen:
      </p>
      <StrudelEditor
        code={`samples('github:yaxu/clean-breaks')
s("amen")`}
      />
      <p className="text-sm text-neutral-500">
        The first time you play this, samples take a moment to fetch over the network. After that
        they're cached and instant.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">
        <code>.fit()</code> — lock the sample to the cycle
      </h2>
      <p>
        Played raw, the sample plays at its recorded tempo, which probably doesn't match your
        Strudel cycle. <code>.fit()</code> stretches (or compresses) the sample so it fills{' '}
        <em>exactly one cycle</em>. The catch: the cycle has to be the right length, or you'll get a
        chipmunk version.
      </p>
      <p>
        The Amen break is a <strong>4-bar</strong> drum phrase at 130 BPM, so 16 beats. To make one
        cycle equal those 16 beats, we use <code>setcpm(130/16)</code>. If we set it to{' '}
        <code>130/4</code> (1 cycle = 1 bar), <code>.fit()</code> would crunch the whole 4-bar break
        into a single bar — and the drums fly by 4× too fast.
      </p>
      <StrudelEditor code={straightStage.code} />

      <h2 className="text-lg font-semibold text-neutral-100">
        <code>.chop(n)</code> — slice into pieces
      </h2>
      <p>
        <code>.chop(n)</code> divides the sample into <em>n</em> equal slices and plays each one as
        a separate event in sequence. So <code>.chop(16)</code> turns a one-cycle sample into 16
        small events — each playing one 16th of the original audio.
      </p>
      <StrudelEditor code={choppedStage.code} />
      <p>
        Sounds almost identical to <code>.fit()</code> alone — until you start manipulating the
        slices. Now they're events you can apply Strudel transforms to.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">
        <code>.splice(n, indexPattern)</code> — reorder the chunks
      </h2>
      <p>
        The interesting thing about chopping isn't playing in order — it's playing in any other
        order. <code>.splice(n, pat)</code> divides the sample into <em>n</em> slices, plays them in
        whatever order <em>pat</em> specifies, and — crucially — speed-stretches each slice to fill
        its event slot exactly. Indexes are 0-based.
      </p>
      <p className="text-sm text-neutral-500">
        Strudel also has a function called <code>.slice()</code> that does the same chopping but
        plays each slice at its <em>natural</em> speed. If the audio of a slice is slightly shorter
        than its event slot, you get tiny silent gaps between slices. <code>.splice()</code> is
        almost always what you want.
      </p>
      <p>First, slices 0-7 in order — should sound the same as the chopped version:</p>
      <StrudelEditor
        code={`samples('github:yaxu/clean-breaks')
setcpm(130/16)
s("amen").splice(8, "0 1 2 3 4 5 6 7").cut(1)`}
      />
      <p>
        Now alternate between in-order and a remixed pattern each cycle. The outer{' '}
        <code>{'<…>'}</code> alternates between the two sub-patterns — one cycle in order, the next
        scrambled with subdivisions:
      </p>
      <StrudelEditor code={remixedStage.code} />
      <p className="text-sm text-neutral-500">
        <code>.cut(1)</code> assigns these slices to "cut group 1" — meaning when a new slice
        starts, the previous one is killed instantly. Without it the slices overlap and you get a
        wash. With it you get the sharp, machine-gun feel that's quintessential jungle.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">
        <code>.speed()</code> — pitch and time
      </h2>
      <p>
        <code>.speed(n)</code> plays the sample at <em>n</em> times its normal rate. Higher speed =
        shorter and higher-pitched; lower speed = longer and lower-pitched. Negative speeds{' '}
        <em>reverse</em> the sample. Again — no <code>.fit()</code>: with the cycle already matched
        to the sample, <code>.speed(1)</code> is natural rate.
      </p>
      <StrudelEditor
        code={`samples('github:yaxu/clean-breaks')
setcpm(130/16)
s("amen").speed("<1 2 .5 -1>")`}
      />
      <p className="text-sm text-neutral-500">
        That's a demo, not music — it cycles through all four values so you can hear what each one
        does. Slammed back-to-back it sounds jarring; that's the point. In a real track you'd use{' '}
        <code>.speed()</code> like a spice. Here it is reversing the whole break only every 4th
        cycle, with a touch of room — recognizable jungle move:
      </p>
      <StrudelEditor
        code={`samples('github:yaxu/clean-breaks')
setcpm(130/16)
s("amen")
  .every(4, x => x.speed(-1))
  .room(.3)`}
      />

      <h2 className="text-lg font-semibold text-neutral-100">Putting it all together</h2>
      <p>
        Sample chopping alone is a technique. Sample chopping <em>inside a track</em> is music.
        Here's the break, a bassline, and a swelling pad — three layers stacked into something you
        could actually loop and write over. Every tool from this lesson plus the synth tools from
        lessons 9, 11, and 7 are in this one block:
      </p>
      <StrudelEditor
        code={`samples('github:yaxu/clean-breaks')
setcpm(130/16)
stack(
  // The break — chopped clean, light reverb for glue
  s("amen").splice(8, "0 1 2 3 4 5 6 7").cut(1).gain(.85).room(.2),
  // Bassline — one root note per bar of an A-minor i-i-iv-V walk
  note("a1 a1 d2 e2")
    .s("sawtooth").lpf(500).lpq(3)
    .attack(0).decay(.8).sustain(0).gain(.7),
  // Pad — same chord roots two octaves up, slow attack so it swells
  note("a3 a3 d4 e4")
    .s("sawtooth").lpf(2000)
    .attack(.8).decay(.5).sustain(.6).release(1.5)
    .gain(.25).room(1)
)`}
      />
      <p className="text-sm text-neutral-500">
        That's the same skeleton used by countless drum-and-bass, downtempo, and lo-fi tracks: a
        chopped break, a simple bassline outlining a minor progression, an atmospheric pad on top.
        Swap the chord notes, change the splice pattern, run it through a filter sweep from lesson
        13 — and you've got your own song.
      </p>

      <section className="card space-y-3">
        <h3 className="text-sm font-medium tracking-wider text-brand-300 uppercase">Quiz</h3>
        <p className="text-sm">
          Chop the Amen break into <strong>8</strong> slices played in order at the original tempo
          (130 BPM).
        </p>
        <QuizEditor
          initialCode={`samples('github:yaxu/clean-breaks')
setcpm(130/16)
s("amen").fit()`}
          target={`samples('github:yaxu/clean-breaks')
setcpm(130/16)
s("amen").fit().chop(8)`}
          hint="Add .chop(8) to the end of the chain."
        />
      </section>

      <p className="text-sm text-neutral-500">
        Sampling and chopping are how producers built entire genres out of seven seconds of recorded
        audio. With the tools in this lesson you can take any sample — a vocal phrase, a piano
        chord, your own field recording — and turn it into rhythm.
      </p>
    </div>
  );
}
