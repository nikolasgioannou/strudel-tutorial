import { StrudelEditor } from '../components/StrudelEditor';
import { TryThis } from '../components/TryThis';
import { SongCard } from '../components/SongCard';
import { amenBreak } from '../tracks/amen-break';
import { requireStage } from '../tracks';
import type { LessonMeta } from './index';

export const meta: LessonMeta = {
  slug: 'amen-break',
  title: 'Sample chopping — the Amen Break',
  blurb: 'The seven seconds of drums that built jungle, drum-and-bass, and half of hip-hop.',
  order: 19,
};

const straight = requireStage(amenBreak, 'straight');
const chopped = requireStage(amenBreak, 'chopped');
const remixed = requireStage(amenBreak, 'remixed');

export function Lesson() {
  return (
    <div className="space-y-6 text-neutral-300">
      <p>
        Everything we&apos;ve made so far has been built from short individual sounds — kicks,
        snares, single notes. Strudel can also work with <em>longer samples</em>: pre-recorded audio
        you slice and rearrange. The most famous example in music history is a 7-second drum solo
        from a 1969 soul B-side.
      </p>

      <SongCard track={amenBreak} />

      <p>
        Drummer Gregory Coleman played a 4-bar break in the middle of an obscure track called{' '}
        <em>Amen, Brother</em>. In the late 80s producers started sampling it. Today it&apos;s the
        foundation of jungle, drum-and-bass, hardcore, and an enormous chunk of hip-hop. Coleman
        died in poverty without ever earning a cent from it.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Loading samples</h2>
      <p>
        Strudel doesn&apos;t ship the Amen break by default — we have to <em>load</em> a sample pack
        that contains it. Alex McLean&apos;s <code>clean-breaks</code> repo packs a handful of
        classic breakbeats including the Amen:
      </p>
      <StrudelEditor
        code={`samples('github:yaxu/clean-breaks')
s("amen")`}
      />
      <p className="text-sm text-neutral-500">
        First play fetches the sample over the network. After that it&apos;s cached and instant.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">
        <code>.fit()</code> + cycle math
      </h2>
      <p>
        Played raw, the sample plays at its recorded tempo, which probably doesn&apos;t match your
        Strudel cycle. <code>.fit()</code> stretches the sample to fill <em>exactly one cycle</em>.
        The catch: the cycle has to be the right length, or you&apos;ll get a chipmunk version.
      </p>
      <p>
        The Amen break is <strong>4 bars</strong> at 130 BPM = 16 beats. To make one cycle equal
        those 16 beats, we use <code>setcpm(130/16)</code>. If we set it to <code>130/4</code> (1
        cycle = 1 bar), <code>.fit()</code> would crunch the whole 4-bar break into a single bar and
        the drums fly by 4× too fast.
      </p>
      <StrudelEditor code={straight.code} />

      <h2 className="text-lg font-semibold text-neutral-100">
        <code>.chop(n)</code> — slice into pieces
      </h2>
      <p>
        <code>.chop(n)</code> divides the sample into <em>n</em> equal slices and plays each one as
        a separate event in sequence. Sounds almost identical to <code>.fit()</code> alone — until
        you start manipulating the slices.
      </p>
      <StrudelEditor code={chopped.code} />

      <h2 className="text-lg font-semibold text-neutral-100">
        <code>.splice(n, indexPattern)</code> — reorder the chunks
      </h2>
      <p>
        The interesting thing about chopping isn&apos;t playing in order — it&apos;s playing in any
        other order. <code>.splice(n, pat)</code> divides the sample into <em>n</em> slices, plays
        them in whatever order <em>pat</em> specifies, and speed-stretches each slice to fill its
        event slot exactly.
      </p>
      <p className="text-sm text-neutral-500">
        Strudel also has <code>.slice()</code> which does the same chopping but plays each slice at{' '}
        <em>natural</em> speed — small gaps between slices if the sample length doesn&apos;t
        perfectly divide. <code>.splice()</code> is almost always what you want.
      </p>
      <p>Here&apos;s the break alternating between in-order and a scrambled remix each cycle:</p>
      <StrudelEditor code={remixed.code} />
      <p>
        <code>.cut(1)</code> assigns these slices to &quot;cut group 1&quot; — when a new slice
        starts, the previous one is killed instantly. Without it the slices overlap and you get a
        wash. With it you get the sharp, machine-gun feel that&apos;s quintessential jungle.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">
        <code>.speed()</code> — pitch and time
      </h2>
      <p>
        <code>.speed(n)</code> plays the sample at <em>n</em> times its normal rate. Higher speed =
        shorter and higher-pitched. Lower speed = longer and lower-pitched. Negative speeds{' '}
        <em>reverse</em> the sample:
      </p>
      <StrudelEditor
        code={`samples('github:yaxu/clean-breaks')
setcpm(130/16)
s("amen").speed("<1 2 .5 -1>")`}
      />
      <p className="text-sm text-neutral-500">
        That&apos;s a demo, not music — alternating four values per cycle so you can hear what each
        does. In a real track you&apos;d use <code>.speed()</code> sparingly. Here it is reversing
        every 4th cycle, which is a classic jungle transition move:
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
        Here&apos;s the break stacked with a bass progression and a swelling pad — three layers into
        something you could write a song over:
      </p>
      <StrudelEditor
        code={`samples('github:yaxu/clean-breaks')
setcpm(130/16)
stack(
  // The break — chopped clean, light reverb for glue
  s("amen").splice(8, "0 1 2 3 4 5 6 7").cut(1).gain(.85).room(.2),
  // Bass — one root note per bar walking an A-minor progression
  note("a1 a1 d2 e2")
    .s("sawtooth").lpf(500).lpq(3)
    .attack(0).decay(.8).sustain(0).gain(.7),
  // Pad — same roots two octaves up, slow attack so it swells
  note("a3 a3 d4 e4")
    .s("sawtooth").lpf(2000)
    .attack(.8).decay(.5).sustain(.6).release(1.5)
    .gain(.25).room(1)
)`}
      />
      <p className="text-sm text-neutral-500">
        That&apos;s the skeleton of countless drum-and-bass, downtempo, and lo-fi tracks: a chopped
        break, a bassline outlining a minor progression, an atmospheric pad on top.
      </p>

      <TryThis
        prompt='Try changing the splice pattern from "0 1 2 3 4 5 6 7" to "0 1 0 1 2 3 [4 5]" — repeats slice 0 and 1, then crams 4 and 5 into a single beat for a stutter. Or try .speed(.75) for half-time jungle ("liquid DnB"). Or change the bass progression — swap to note("c1 c1 g0 bb0") for a minor-key dread vibe.'
        code={remixed.code}
      />

      <p className="text-sm text-neutral-500">
        We&apos;ve got drums, melody, harmony, sound design, modulation, effects, and sample
        manipulation. The next and final lesson takes all of it and builds a complete song with
        verses, a bridge, and structural arrangement.
      </p>
    </div>
  );
}
