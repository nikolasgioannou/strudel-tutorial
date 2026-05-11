import { StrudelEditor } from '../components/StrudelEditor';
import { QuizEditor } from '../components/QuizEditor';
import { SongCard } from '../components/SongCard';
import { sevenNationArmy } from '../tracks/seven-nation-army';
import { requireStage } from '../tracks';
import type { LessonMeta } from './index';

export const meta: LessonMeta = {
  slug: 'seven-nation-army',
  title: 'First notes — Seven Nation Army',
  blurb: 'From drum hits to actual melodies. Welcome to pitch.',
  order: 5,
};

const riffStage = requireStage(sevenNationArmy, 'riff');

export function Lesson() {
  return (
    <div className="space-y-6 text-neutral-300">
      <p>
        Drums get you a groove. To make a <em>song</em>, you also need pitch — notes that go up and
        down. Strudel has a <code>note()</code> function for that.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Letter notation</h2>
      <p>
        The simplest way to write notes is with their letter names. <code>"c e g"</code> plays C,
        then E, then G — a major arpeggio.
      </p>
      <StrudelEditor code={`note("c e g").s("piano")`} />

      <p>
        Sharps and flats use <code>#</code> and <code>b</code>: <code>"c# eb gb"</code>. Sequencing
        works exactly like it did for drums — spaces between events split the cycle evenly.
      </p>
      <StrudelEditor code={`note("c eb g bb").s("piano")`} />

      <h2 className="text-lg font-semibold text-neutral-100">Octaves</h2>
      <p>
        Add a number to a note name to choose its octave. <code>c4</code> is middle C; lower numbers
        go down, higher numbers go up. <code>"c2 c3 c4 c5"</code> plays the same note in four
        different octaves.
      </p>
      <StrudelEditor code={`note("c2 c3 c4 c5").s("piano")`} />

      <h2 className="text-lg font-semibold text-neutral-100">Picking an instrument</h2>
      <p>
        We've been using <code>.s("piano")</code> all along — that selects the piano sound. Strudel
        has hundreds of built-in instruments. For the song below we want a bass tone:{' '}
        <code>gm_acoustic_bass</code>.
      </p>
      <StrudelEditor code={`note("e2 g2 a2").s("gm_acoustic_bass")`} />

      <h2 className="text-lg font-semibold text-neutral-100">Building the riff</h2>
      <p>
        The White Stripes' <em>Seven Nation Army</em> riff is seven notes in the bass register —
        E&nbsp;E&nbsp;G&nbsp;E&nbsp;D&nbsp;C&nbsp;B. That's the whole thing.
      </p>

      <SongCard track={sevenNationArmy} />

      <p>
        Start with just the first three: <code>e2 e2 g2</code>.
      </p>
      <StrudelEditor code={`note("e2 e2 g2").s("gm_acoustic_bass")`} />

      <p>Now add the rest — back to E, then walk down D, C, B:</p>
      <StrudelEditor code={`note("e2 e2 g2 e2 d2 c2 b1").s("gm_acoustic_bass")`} />

      <p>
        Almost there. Set the tempo to match the record — 124 BPM — and pad an 8th-note rest at the
        end so the loop has room to breathe.
      </p>
      <StrudelEditor code={riffStage.code} />

      <p className="text-sm text-neutral-500">
        <strong>One honest caveat about the rhythm.</strong> The pitches above are exactly right — E
        E G E D C B — but the record's rhythm isn't all eighth notes. The first E hangs for almost a
        full beat before the riff takes off, and the final B rings out twice as long. We've
        simplified to straight 8ths because we haven't covered <em>note durations</em> yet. Once we
        do (a few lessons from now), you'll be able to come back to this riff and fix the timing
        yourself with one extra symbol.
      </p>

      <section className="card space-y-3">
        <h3 className="text-sm font-medium tracking-wider text-brand-300 uppercase">Quiz</h3>
        <p className="text-sm">
          Take the riff and play it <strong>one octave higher</strong>. Same notes (E E G E D C B),
          but each one is now in the octave above.
        </p>
        <QuizEditor
          initialCode={riffStage.code}
          target={`setcpm(124/4)
note("e3 e3 g3 e3 d3 c3 b2 ~").s("gm_acoustic_bass")`}
          hint="Add 1 to every octave number — e2 becomes e3, b1 becomes b2."
        />
      </section>

      <p className="text-sm text-neutral-500">
        You now have melody and rhythm. Next we'll learn scales — a way to think about which notes
        "fit together" without spelling out each one.
      </p>
    </div>
  );
}
