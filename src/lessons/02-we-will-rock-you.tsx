import { StrudelEditor } from '../components/StrudelEditor';
import { QuizEditor } from '../components/QuizEditor';
import { SongCard } from '../components/SongCard';
import { weWillRockYou } from '../tracks/we-will-rock-you';
import { requireStage } from '../tracks';
import type { LessonMeta } from './index';

export const meta: LessonMeta = {
  slug: 'we-will-rock-you',
  title: 'Your first song — We Will Rock You',
  blurb: 'Famous songs are simpler than you think.',
  order: 2,
};

// The "drums" stage of this track is the single source of truth for the
// finished code. The quiz reuses it as starter material, and any future
// lesson that revisits this song will refer back to the same stage.
const drumsStage = requireStage(weWillRockYou, 'drums');

export function Lesson() {
  return (
    <div className="space-y-6 text-neutral-300">
      <p>
        Queen's <em>We Will Rock You</em> is a drum pattern you already know: two stomps and a clap,
        looped forever. Two lines of Strudel and we have it.
      </p>

      <SongCard track={weWillRockYou} />

      <h2 className="text-lg font-semibold text-neutral-100">The pattern</h2>
      <p>
        Two kicks and a clap. We could write <code>"bd bd cp"</code>, but the same idea fits in{' '}
        <code>"bd*2 cp"</code> — <code>*2</code> means "do this twice in one slot".
      </p>
      <StrudelEditor code={`sound("bd*2 cp")`} />

      <p>
        Close, but the song has a specific tempo: <strong>81 beats per minute</strong>. Strudel
        thinks in cycles, not beats. The function <code>setcpm()</code> sets cycles per minute. Our
        pattern spans two beats (stomp-stomp-clap = two beats), so a cycle covers half a bar —
        that's <code>81 / 2</code> cycles per minute.
      </p>
      <StrudelEditor
        code={`setcpm(81/2)
sound("bd*2 cp")`}
      />

      <p>
        The studio recording uses body percussion — feet on bleachers, hands clapping. We can get a
        vintage drum-machine version with <code>.bank("RolandTR707")</code>. The pattern stays the
        same; only the sample source changes.
      </p>
      <StrudelEditor code={drumsStage.code} />

      <section className="card space-y-3">
        <h3 className="text-sm font-medium tracking-wider text-brand-300 uppercase">Quiz</h3>
        <p className="text-sm">
          The TR-707 is iconic but a bit thin. Swap to the punchier <strong>Roland TR-909</strong>.
          Keep the pattern and tempo the same.
        </p>
        <QuizEditor
          initialCode={drumsStage.code}
          target={`setcpm(81/2)
sound("bd*2 cp").bank("RolandTR909")`}
          hint='Change "RolandTR707" to "RolandTR909".'
        />
      </section>

      <p className="text-sm text-neutral-500">
        Two new functions: <code>setcpm()</code> for tempo and <code>.bank()</code> for picking a
        drum machine. Together with the rhythm vocabulary in the next lesson, you can rebuild most
        pop drum beats.
      </p>
    </div>
  );
}
