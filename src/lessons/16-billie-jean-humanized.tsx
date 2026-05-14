import { StrudelEditor } from '../components/StrudelEditor';
import { TryThis } from '../components/TryThis';
import { SongCard } from '../components/SongCard';
import { SongJourney } from '../components/SongJourney';
import { billieJean } from '../tracks/billie-jean';
import { requireStage } from '../tracks';
import type { LessonMeta } from './index';

export const meta: LessonMeta = {
  slug: 'billie-jean-humanized',
  title: 'Probability — Billie Jean returns again',
  blurb: 'sometimes, often, rarely. Make a static groove feel like a human is playing it.',
  order: 16,
};

const humanized = requireStage(billieJean, 'humanized');

export function Lesson() {
  return (
    <div className="space-y-6 text-neutral-300">
      <p>
        Lesson 10 built the full Billie Jean groove. Press play on it for 30 seconds and you&apos;ll
        notice something: it feels robotic. The drums are <em>exactly</em> the same every bar. Real
        drummers don&apos;t play that way. They throw in ghost notes, occasional extra kicks, accent
        shifts. The groove evolves over the course of a song.
      </p>
      <p>
        We can teach Strudel to do that. The trick is <strong>probability</strong> — letting certain
        transformations fire <em>sometimes</em> instead of always. Same notes, but the pattern stops
        being predictable.
      </p>

      <SongCard track={billieJean} />

      <SongJourney trackId="billie-jean" currentLessonSlug={meta.slug} />

      <h2 className="text-lg font-semibold text-neutral-100">
        <code>sometimes()</code>, <code>often()</code>, <code>rarely()</code>
      </h2>
      <p>Strudel has a family of functions that apply a transformation with a probability:</p>
      <ul className="ml-5 list-disc space-y-1 text-sm">
        <li>
          <code>sometimes(fn)</code> — 50% chance per cycle
        </li>
        <li>
          <code>often(fn)</code> — 75% chance per cycle
        </li>
        <li>
          <code>rarely(fn)</code> — 25% chance per cycle
        </li>
        <li>
          <code>sometimesBy(p, fn)</code> — custom probability p (0 to 1)
        </li>
      </ul>
      <p>
        On any cycle the function might or might not fire. The pattern still loops; it just
        doesn&apos;t play the same way every time.
      </p>

      <p>
        Try a kick that <em>sometimes</em> doubles up:
      </p>
      <StrudelEditor
        code={`setcpm(117/4)
sound("bd ~ bd ~").sometimes(x => x.fast(2))`}
      />
      <p>
        Half the cycles you hear the normal kick on 1 and 3. Half the cycles the pattern runs at
        double speed (kicks on every 8th). Real drummers do this in fills — drop a double-time
        section into an otherwise steady bar.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Humanizing Billie Jean</h2>
      <p>Take our lesson-10 groove and sprinkle in three pieces of human variation:</p>
      <ul className="ml-5 list-disc space-y-1 text-sm">
        <li>
          The kick <em>sometimes</em> plays a double-time fill (every other cycle on average)
        </li>
        <li>
          The snare <em>often</em> has accent shifts on the gain pattern
        </li>
        <li>
          The hats <em>sometimes</em> double up to 16th notes
        </li>
      </ul>
      <StrudelEditor code={humanized.code} />
      <p className="text-sm text-neutral-500">
        Press play and listen for 30+ seconds. You&apos;ll hear the same groove, but no two cycles
        are quite the same. Some bars stay simple; some bars have an extra kick or louder snare.
        That&apos;s the variation that makes recorded drums feel alive.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">A simpler probability example</h2>
      <p>
        Ghost notes are a drum-kit trick: extra, quiet snare hits between the loud backbeat hits.
        They give the groove forward momentum without disrupting the structure. We can add ghost
        notes randomly:
      </p>
      <StrudelEditor
        code={`setcpm(117/4)
stack(
  sound("bd ~ bd ~"),
  sound("~ sd ~ sd"),
  sound("hh*8").gain(.5),
  // Quiet snare on every 8th, but only when probability fires
  sound("~ sd ~ sd ~ sd ~ sd").gain(.2).rarely(x => x)
)`}
      />
      <p>
        The last layer is barely-audible ghost snares on every 8th note. <code>rarely</code> means
        they only fire on ~25% of cycles. So you hear them occasionally but never consistently —
        exactly what a drummer adds for groove.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Why this works musically</h2>
      <p>
        Music humans like has both <strong>pattern</strong> (predictable structure your brain can
        anchor to) and <strong>surprise</strong> (variations that keep attention). A perfectly
        repetitive loop trains your brain to ignore it after a few bars. A perfectly random sequence
        has no structure to follow. The sweet spot is <em>pattern with occasional surprises</em> —
        which is what <code>sometimes</code> produces almost mechanically.
      </p>

      <TryThis
        prompt='Take the humanized Billie Jean groove and add a "fill" layer that triggers rarely — sound("~ ~ ~ [cp cp cp]").rarely(x => x). That gives you triple-clap fills at random moments. Or try .sometimesBy(.1, x => x.fast(4)) on the snare for very occasional snare rolls.'
        code={humanized.code}
      />

      <p className="text-sm text-neutral-500">
        Probability turns a pattern into a generator. The same code outputs a different recording
        every time you play it. You write a structure and a probability; the machine plays you a
        song. Next lesson: we apply this kind of generative chop-and-replay thinking to{' '}
        <em>sample manipulation</em> — the most-sampled drum break in history.
      </p>
    </div>
  );
}
