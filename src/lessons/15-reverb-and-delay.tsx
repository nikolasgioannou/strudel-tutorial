import { StrudelEditor } from '../components/StrudelEditor';
import { QuizEditor } from '../components/QuizEditor';
import type { LessonMeta } from './index';

export const meta: LessonMeta = {
  slug: 'reverb-and-delay',
  title: 'Space — reverb and delay',
  blurb: 'No record sounds "real" without them. Two effects, infinite atmospheres.',
  order: 15,
};

export function Lesson() {
  return (
    <div className="space-y-6 text-neutral-300">
      <p>
        Two effects every recorded song uses: <strong>reverb</strong> (the sound of a space) and{' '}
        <strong>delay</strong> (discrete echoes). They're how a dry-as-bone synth becomes a
        cathedral organ, how a single guitar note becomes a dub-style echo cascade. We've sprinkled
        them into earlier lessons without explaining; this one's the proper tour.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">
        <code>.room()</code> — reverb
      </h2>
      <p>
        Reverb simulates a physical space. Sound bounces off walls, ceiling, floor, and the bouncing
        tail is what we call "the room". <code>.room(level)</code> sends the signal into a reverb at
        the given level (0–1).
      </p>
      <p>Dry — no reverb. Each note is sharp, immediate, with no tail:</p>
      <StrudelEditor code={`note("c3 e3 g3 c4").s("piano")`} />
      <p>Add a modest amount of reverb:</p>
      <StrudelEditor code={`note("c3 e3 g3 c4").s("piano").room(.5)`} />
      <p>Crank it. Now the notes hang in the air long after they're played:</p>
      <StrudelEditor code={`note("c3 e3 g3 c4").s("piano").room(2)`} />
      <p>
        For finer control you can set the size and decay of the room with{' '}
        <code>.roomsize(0–10)</code> and <code>.roomfade(seconds)</code>. Big rooms feel like
        churches; small rooms like a bathroom; tiny rooms add subtle thickness without obvious echo.
      </p>
      <StrudelEditor code={`note("c3 e3 g3 c4").s("piano").room(1).roomsize(8)`} />

      <h2 className="text-lg font-semibold text-neutral-100">
        <code>.delay()</code> — discrete echoes
      </h2>
      <p>
        Delay is different from reverb in one crucial way: reverb is a smooth, blurry tail; delay is
        a series of clear, repeating echoes. Three parameters:
      </p>
      <ul className="ml-5 list-disc space-y-1 text-sm">
        <li>
          <code>.delay(level)</code> — how much signal goes into the delay (0–1).
        </li>
        <li>
          <code>.delaytime(seconds)</code> — how long between echoes.
        </li>
        <li>
          <code>.delayfeedback(0–1)</code> — what fraction of each echo loops back in.
          <em>Approaches 1 = infinite echoes; over 1 = explodes.</em>
        </li>
      </ul>
      <p>A single audible echo, set short for a slap-back vibe:</p>
      <StrudelEditor
        code={`note("c3 e3 g3 c4").s("piano").delay(.5).delaytime(.2).delayfeedback(.2)`}
      />
      <p>Longer delay time, more feedback — turns each note into a cascade:</p>
      <StrudelEditor
        code={`note("c3 e3 g3 c4").s("piano").delay(.6).delaytime(.5).delayfeedback(.6)`}
      />
      <p>
        Set the delay time to match the song's tempo and the echoes lock to the beat. At 120 BPM, a
        16th note is 0.125s, a quarter is 0.5s. <code>.delaytime(.125)</code> gives you a 16th-note
        delay — classic dance/dub.
      </p>
      <StrudelEditor
        code={`setcpm(120/4)
sound("bd ~ sd ~").delay(.7).delaytime(.125).delayfeedback(.6)`}
      />

      <h2 className="text-lg font-semibold text-neutral-100">Reverb and delay together</h2>
      <p>
        You can stack them. Delay first puts the signal in time-space (discrete echoes), then reverb
        puts the echoes into a physical space. The combination is the entire toolkit of 80s ballads
        and dub reggae.
      </p>
      <StrudelEditor
        code={`note("c3 e3 g3 ~ a3 g3 e3 ~").s("piano")
  .delay(.5).delaytime(.375).delayfeedback(.4)
  .room(.6)`}
      />
      <p className="text-sm text-neutral-500">
        <strong>Mixing tip:</strong> a tiny bit of reverb on everything (~<code>.room(.1)</code> to{' '}
        <code>.3</code>) glues your tracks together — they sound like they're in the same space.
        Without it, individual elements feel disconnected, like they were recorded in separate
        rooms.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">A dub-style space-out</h2>
      <p>
        One way to learn an effect is to push it too far. Here's a sparse drum pattern with massive
        delay and reverb — pure space:
      </p>
      <StrudelEditor
        code={`setcpm(80/4)
stack(
  sound("bd ~ ~ ~, ~ ~ sd ~").delay(.8).delaytime(.5).delayfeedback(.7).room(1.5),
  sound("~ ~ rim ~").delay(.6).delaytime(.333).delayfeedback(.6).room(2)
)`}
      />

      <section className="card space-y-3">
        <h3 className="text-sm font-medium tracking-wider text-brand-300 uppercase">Quiz</h3>
        <p className="text-sm">
          Take a basic piano arpeggio and add a <strong>quarter-note delay at 120 BPM</strong> with
          moderate level and feedback. (Quarter-note at 120 BPM = 0.5 seconds.)
        </p>
        <QuizEditor
          initialCode={`note("c3 e3 g3 c4").s("piano")`}
          target={`note("c3 e3 g3 c4").s("piano").delay(.5).delaytime(.5).delayfeedback(.5)`}
          hint="Chain .delay(.5).delaytime(.5).delayfeedback(.5) — three methods, three parameters."
        />
      </section>

      <p className="text-sm text-neutral-500">
        Space is half of why records sound like records. Next lesson we go from <em>shaping</em>{' '}
        sound to <em>destroying</em> samples — chopping the most-sampled drum break in history.
      </p>
    </div>
  );
}
