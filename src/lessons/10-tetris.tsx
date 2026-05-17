import { StrudelEditor } from '../components/StrudelEditor';
import { TryThis } from '../components/TryThis';
import { SongCard } from '../components/SongCard';
import { tetris } from '../tracks/tetris';
import { requireStage } from '../tracks';
import type { LessonMeta } from './index';

export const meta: LessonMeta = {
  slug: 'tetris',
  title: 'A full melody — Tetris',
  blurb:
    'Korobeiniki, the 1861 folk tune that became video-game canon. Longer phrases, alternation.',
  order: 10,
};

const aSection = requireStage(tetris, 'a-section');

export function Lesson() {
  return (
    <div className="space-y-6 text-neutral-300">
      <p>
        Up to now our melodies have been short — 7 notes, 8 notes. Real songs have longer phrases:
        4-bar, 8-bar, sometimes 16-bar themes that develop and resolve. Time to write one. The
        melody we&apos;ll do is one you&apos;ve had stuck in your head since you were a kid, whether
        you realized it or not.
      </p>

      <SongCard track={tetris} />

      <p>
        <em>Korobeiniki</em> (&quot;Peddlers&quot;) is a Russian folk song from 1861. Outside
        Russia, nobody knew it until Hirokazu Tanaka arranged it as the &quot;Type A&quot; theme for
        Nintendo&apos;s Game Boy Tetris in 1989. Now it&apos;s legally required to ship in every
        Tetris release. Pretty good run for an 1861 peddler song.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">The A-section, all four bars</h2>
      <p>
        The recognizable opening is 4 bars in A minor, mostly walking up and down the scale.
        Here&apos;s the whole thing — note how we use <code>[ ]</code> to group bars and pile up a
        lot of notes:
      </p>
      <StrudelEditor code={aSection.code} />
      <p>
        Four top-level brackets in the cycle, each one bar of 8 8th-notes (or whatever subdivisions
        add up to 8). The pattern is almost entirely <em>stepwise</em> — adjacent notes in the A
        minor scale. That&apos;s why it&apos;s so singable.
      </p>
      <p className="text-sm text-neutral-500">
        <code>setcpm(150/16)</code> — one cycle = 4 bars at 150 BPM (the Game Boy speed; piano
        tutorials usually slow it to ~120-125 for playability). The formula{' '}
        <code>setcpm(BPM / beats_per_cycle)</code> works for any cycle length. 16 beats per cycle =
        4 bars in 4/4.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">
        Alternation with <code>{`<...>`}</code>
      </h2>
      <p>
        Real songs alternate between sections — verse, chorus, bridge. The A-section above is one
        section. To play <em>different</em> patterns each cycle, wrap them in angle brackets:
      </p>
      <StrudelEditor
        code={`setcpm(124/4)
n("<0 2 4 5>").scale("A:minor").s("piano")`}
      />
      <p>
        That plays one note per cycle, cycling through the values 0, 2, 4, 5 — root, 3rd, 5th, 6th
        of A minor. Each cycle picks the next value. Useful for slow-moving things like chord roots.
      </p>

      <p>
        Or alternate whole sub-patterns. Each thing inside <code>{`<...>`}</code> can be a full
        sub-sequence:
      </p>
      <StrudelEditor
        code={`setcpm(124/4)
n("<[0 1 2 3] [4 5 6 7]>").scale("A:minor").s("piano")`}
      />
      <p>
        First cycle plays ascending 0-3, second cycle plays 4-7, then it repeats. We&apos;ll use
        this trick a lot in upcoming lessons for arranging song sections.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Make a 2-section Tetris</h2>
      <TryThis
        prompt='Alternate the A-section with a transposed version of itself one step lower (in G minor). Try wrapping the whole pattern in <[a-section] [g-section]>, where g-section is the same notes but .scale("G:minor"). Tetris was famous for its speed-up sections — could you also try the same pattern with .fast(2) every other cycle?'
        code={aSection.code}
      />

      <p className="text-sm text-neutral-500">
        We&apos;ve gone from 4 notes to 32 notes in one expression. <code>n().scale()</code> and{' '}
        <code>{`<>`}</code> together let you write arbitrarily long melodies in surprisingly few
        characters. Next we leave melody and move to <em>harmony</em> — chord progressions.
      </p>
    </div>
  );
}
