import { StrudelEditor } from '../components/StrudelEditor';
import { TryThis } from '../components/TryThis';
import { SongCard } from '../components/SongCard';
import { SongJourney } from '../components/SongJourney';
import { weWillRockYou } from '../tracks/we-will-rock-you';
import { requireStage } from '../tracks';
import type { LessonMeta } from './index';

export const meta: LessonMeta = {
  slug: 'we-will-rock-you-drums',
  title: 'Your first beat — We Will Rock You',
  blurb: 'Two stomps, one clap. The simplest song ever, and your first line of Strudel code.',
  order: 1,
};

const drumsStage = requireStage(weWillRockYou, 'drums');

export function Lesson() {
  return (
    <div className="space-y-6 text-neutral-300">
      <p>
        Welcome to Strudel. We're going to learn music by building songs you already know. Every
        lesson centers on a real track, and the whole curriculum is one long spiral — songs come
        back as we learn more, each time with new layers.
      </p>

      <p>
        First song: Queen's <em>We Will Rock You</em>. It's barely a song — two stomps and a clap,
        looped for two minutes, with vocals on top. That makes it perfect for the first 10 lines of
        Strudel you'll ever write.
      </p>

      <SongCard track={weWillRockYou} />

      <SongJourney trackId="we-will-rock-you" currentLessonSlug={meta.slug} />

      <h2 className="text-lg font-semibold text-neutral-100">
        <code>sound()</code> — your first command
      </h2>
      <p>
        Strudel programs are mostly one-liners. <code>sound("bd")</code> plays a kick drum
        (&quot;bd&quot; = bass drum). Hit the play button below — make sure your volume is up:
      </p>
      <StrudelEditor code={`sound("bd")`} />
      <p>
        Each cycle, the string inside <code>sound()</code> is interpreted as a pattern. A single
        word like <code>"bd"</code> is one event per cycle — one kick per ~2 seconds at Strudel's
        default tempo.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">A sequence of sounds</h2>
      <p>
        Put multiple sounds in the string, separated by spaces. They share the cycle equally — two
        sounds means each gets half a cycle, three means each gets a third, and so on:
      </p>
      <StrudelEditor code={`sound("bd cp")`} />
      <p>That's a kick followed by a clap. Two events per cycle, evenly spaced.</p>

      <h2 className="text-lg font-semibold text-neutral-100">
        Repetition with <code>*N</code>
      </h2>
      <p>
        We Will Rock You is <strong>stomp, stomp, clap</strong>. Two kicks and a clap. We could
        write <code>"bd bd cp"</code> — three even events — or we can use <code>*N</code> to repeat
        the previous element. <code>bd*2</code> means &quot;bd, twice&quot;:
      </p>
      <StrudelEditor code={`sound("bd*2 cp")`} />
      <p>
        That's the song. Two stomps and a clap, sharing the cycle. But it's at Strudel's default
        tempo, which is faster than Queen recorded it.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">
        <code>setcpm</code> — setting tempo
      </h2>
      <p>
        Queen recorded We Will Rock You at <strong>81 BPM</strong>. <code>setcpm</code> sets the
        cycles-per-minute. Our pattern has 2 beats per cycle (one stomp-stomp and one clap), so we
        want <code>setcpm(81/2)</code> — 81 beats per minute divided by 2 beats per cycle:
      </p>
      <StrudelEditor code={drumsStage.code} />
      <p>
        Now it sounds right. Imagine 70,000 people at a Queen concert stamping along — that's the
        tempo.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">
        Drum banks with <code>.bank()</code>
      </h2>
      <p>
        Strudel ships with multiple drum machine sample packs. The original song uses body
        percussion — stomps on wooden boards, hands clapping — but a vintage Roland TR-707 gets
        close to that punchy thump. <code>.bank("RolandTR707")</code> tells Strudel which sample
        pack to pull from. Try swapping it for <code>RolandTR808</code> (more hip-hop),{' '}
        <code>RolandTR909</code> (more techno), or leaving it off (Strudel's default samples):
      </p>

      <TryThis
        prompt='Try changing "RolandTR707" to "RolandTR808" or "RolandTR909" to hear how different drum machines change the song&apos;s feel. Then try changing "cp" to "sd" (snare drum) or "hh" (hi-hat).'
        code={drumsStage.code}
      />

      <p className="text-sm text-neutral-500">
        Three tools in one lesson: <code>sound()</code> to trigger samples, <code>*N</code> to
        repeat, <code>setcpm</code> to set tempo, and <code>.bank()</code> to pick a drum machine.
        We'll come back to <em>We Will Rock You</em> in lesson 5 to add Brian May's guitar solo on
        top.
      </p>
    </div>
  );
}
