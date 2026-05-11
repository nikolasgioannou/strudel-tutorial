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
        Strudel doesn't ship the Amen break by default — we have to <em>load</em> the dirt-samples
        library, which is the standard sample pack used by Strudel and TidalCycles:
      </p>
      <StrudelEditor
        code={`samples('github:tidalcycles/dirt-samples')
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
        Strudel cycle. <code>.fit()</code> stretches (or compresses) the sample to fill exactly one
        cycle. Combined with <code>setcpm</code> matching the original tempo, you get the break
        looping clean:
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
        <code>.slice(n, indexPattern)</code> — reorder the chunks
      </h2>
      <p>
        The interesting thing about chopping isn't playing in order — it's playing in any other
        order. <code>.slice(n, pat)</code> divides the sample into <em>n</em> slices and plays them
        in whatever order <em>pat</em> specifies. Indexes are 0-based.
      </p>
      <p>
        Here we slice into 8 chunks and alternate between playing them in order one cycle and a
        scrambled order the next, sped up to jungle territory:
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
        <em>reverse</em> the sample.
      </p>
      <StrudelEditor
        code={`samples('github:tidalcycles/dirt-samples')
setcpm(130/4)
s("amen").fit().speed("<1 2 .5 -1>")`}
      />
      <p className="text-sm text-neutral-500">
        Each cycle the speed alternates: normal, double-speed, half-speed, reverse. That fourth
        cycle is a classic glitchy reverse-amen, the same trick early jungle producers used to do
        with reel-to-reel tape.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Combining the tools</h2>
      <p>Slice it, rearrange it, occasionally reverse it, add reverb — and you've got a track:</p>
      <StrudelEditor
        code={`samples('github:tidalcycles/dirt-samples')
setcpm(165/4)
s("amen")
  .fit()
  .slice(8, "<0 1 2 3 4*2 5 6 [6 7]>")
  .cut(1)
  .sometimesBy(.3, x => x.speed(-1))
  .room(.4)`}
      />

      <section className="card space-y-3">
        <h3 className="text-sm font-medium tracking-wider text-brand-300 uppercase">Quiz</h3>
        <p className="text-sm">
          Chop the Amen break into <strong>8</strong> slices played in order at the original tempo
          (130 BPM).
        </p>
        <QuizEditor
          initialCode={`samples('github:tidalcycles/dirt-samples')
setcpm(130/4)
s("amen").fit()`}
          target={`samples('github:tidalcycles/dirt-samples')
setcpm(130/4)
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
