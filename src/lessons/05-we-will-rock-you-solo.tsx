import { StrudelEditor } from '../components/StrudelEditor';
import { TryThis } from '../components/TryThis';
import { SongCard } from '../components/SongCard';
import { SongJourney } from '../components/SongJourney';
import { weWillRockYou } from '../tracks/we-will-rock-you';
import { sevenNationArmy } from '../tracks/seven-nation-army';
import { requireStage } from '../tracks';
import type { LessonMeta } from './index';

export const meta: LessonMeta = {
  slug: 'we-will-rock-you-solo',
  title: 'Note durations — back to We Will Rock You',
  blurb: "@N elongation. Hold notes longer. Brian May's solo lands on Queen's stomp-clap.",
  order: 5,
};

const soloStage = requireStage(weWillRockYou, 'solo');
const snaRealRhythm = requireStage(sevenNationArmy, 'riff-with-rhythm');

export function Lesson() {
  return (
    <div className="space-y-6 text-neutral-300">
      <p>
        So far, every note we&apos;ve written takes the same amount of time. Four notes in a cycle?
        Each gets a quarter. Sixteen hi-hats? Each gets a sixteenth. But real music has notes of
        different <em>durations</em> — held notes, quick passing notes, dotted rhythms.
      </p>
      <p>
        We&apos;re going back to <em>We Will Rock You</em>. Two minutes of stomp-clap then,
        suddenly, Brian May&apos;s guitar solo arrives over the chant. It opens with a sustained
        high note that just sits there for ages, then fires off a quick descending phrase. We
        can&apos;t express that with even-spaced notes. We need a way to say &quot;hold this one
        longer.&quot;
      </p>

      <SongCard track={weWillRockYou} />

      <SongJourney trackId="we-will-rock-you" currentLessonSlug={meta.slug} />

      <h2 className="text-lg font-semibold text-neutral-100">
        <code>@N</code> — elongation
      </h2>
      <p>
        In Strudel&apos;s mini-notation, putting <code>@N</code> after a note tells it to take{' '}
        <em>N times</em> as much time as the unmarked notes. The cycle is divided proportionally
        based on the weights:
      </p>
      <StrudelEditor code={`note("c4 c4 c4 c4")`} />
      <p>Four equal notes, each takes a quarter of the cycle. Now compare:</p>
      <StrudelEditor code={`note("c4@4 c4")`} />
      <p>
        Two notes, weights 4 and 1, total = 5. The first C takes 4/5 of the cycle (long), the second
        takes 1/5 (short). The same five slots&apos; worth of time, but distributed unevenly.
      </p>
      <p>
        That&apos;s how we encode rhythm: long held notes get a big <code>@N</code>, short notes get
        small or no annotation.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">A phrase from the WWRY solo</h2>
      <p>
        Brian May&apos;s actual solo is a complex blend of bends, pinch harmonics, and stacked
        harmonies — way more than we can capture in one lesson. What we <em>can</em> capture is the
        shape of the opening phrase: a sustained high note (the F#5 he hammers on), with excursions
        up to A and back, finishing on a held low E:
      </p>
      <StrudelEditor code={soloStage.code} />
      <p className="text-sm text-neutral-500">
        That&apos;s the stomp-clap rhythm from lesson 1 (still{' '}
        <code>sound(&quot;bd*2 cp&quot;).bank(&quot;RolandTR707&quot;)</code>) stacked with the
        solo. Listen for the sustained <code>f#5@2</code> opening — that&apos;s the note held twice
        as long as the others. The full pattern is <code>f#5@2 a5 f#5 e4 g5 f#5 e5 e4</code>;
        weights add up to 9 so each unweighted note gets 1/9 of the cycle and the held F# gets 2/9.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Back to Seven Nation Army</h2>
      <p>
        Last lesson we played the SNA riff with even 8th notes. The real recording has it more like
        &quot;quarter, rest, eighth, dotted-eighth, dotted-eighth, eighth, half, half&quot; — the
        first E is held for a full beat, the C and B in bar 2 are each held for two:
      </p>
      <StrudelEditor code={snaRealRhythm.code} />
      <p className="text-sm text-neutral-500">
        The pattern <code>e2@4 ~@2 e2@2 g2@3 e2@3 d2@2 c2@8 b1@8</code> uses 32 weight units to
        represent the 32 16th notes across 2 bars. Quarter notes get weight 4, dotted 8ths get
        weight 3, half notes get weight 8. <em>That</em> rhythm is what makes the SNA riff sound
        like a riff and not a scale exercise.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Try your own rhythm</h2>
      <TryThis
        prompt="Try changing the weight on the held f#5 in the WWRY solo. Make it f#5@4 to hold it twice as long, or f#5@1 to make it just like the other notes. Listen to how the held opening note changes the whole feeling of the phrase."
        code={soloStage.code}
      />

      <p className="text-sm text-neutral-500">
        <code>@N</code> is the workhorse of rhythmic precision in Strudel. Anywhere a riff has a
        sustained note vs short notes, <code>@N</code> is how you write it. Next up: power chords —
        playing more than one note at the same time.
      </p>
    </div>
  );
}
