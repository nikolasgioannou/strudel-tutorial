import { StrudelEditor } from '../components/StrudelEditor';
import { TryThis } from '../components/TryThis';
import { SongCard } from '../components/SongCard';
import { inTheAirTonight } from '../tracks/in-the-air-tonight';
import { requireStage } from '../tracks';
import type { LessonMeta } from './index';

export const meta: LessonMeta = {
  slug: 'in-the-air-tonight',
  title: 'Space — In the Air Tonight',
  blurb: "Reverb and delay. Phil Collins' atmospheric drum sound, plus THAT fill at 3:16.",
  order: 14,
};

const padStage = requireStage(inTheAirTonight, 'cr78-and-pad');
const fillStage = requireStage(inTheAirTonight, 'the-fill');

export function Lesson() {
  return (
    <div className="space-y-6 text-neutral-300">
      <p>
        Two effects every recorded song uses: <strong>reverb</strong> (the sound of a physical
        space) and <strong>delay</strong> (discrete echoes). They&apos;re what make records sound
        like records and not like demos. Sometimes they&apos;re subtle glue; sometimes they&apos;re
        the whole identity of a song. Phil Collins&apos; <em>In the Air Tonight</em> is the platonic
        example of the latter — the entire production decision was &quot;put everything in an
        enormous room.&quot;
      </p>

      <SongCard track={inTheAirTonight} />

      <p>
        And then, at exactly 3:16, the drum fill arrives. A simple tom roll, made enormous by a
        signature drum-mic trick (heavily-compressed talkback mic, often misremembered as
        &quot;gated reverb&quot;). It changed 80s drum production overnight. We&apos;ll build both —
        the atmospheric front half and the explosion.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">
        <code>.room()</code> — reverb
      </h2>
      <p>
        Reverb simulates a physical space — sound bouncing off walls, ceiling, floor. The bouncing
        tail is what makes a room feel like a room. <code>.room(level)</code> sends the signal into
        a reverb at the given level (0–1, but values up to ~2 are useful).
      </p>
      <p>Dry — no reverb. Each note is sharp, immediate, no tail:</p>
      <StrudelEditor code={`note("c3 e3 g3 c4").s("piano")`} />
      <p>A modest amount of reverb — the notes feel like they&apos;re in a room:</p>
      <StrudelEditor code={`note("c3 e3 g3 c4").s("piano").room(.5)`} />
      <p>Crank it — now the notes hang in the air long after they&apos;re played:</p>
      <StrudelEditor code={`note("c3 e3 g3 c4").s("piano").room(2)`} />
      <p className="text-sm text-neutral-500">
        For more control: <code>.roomsize(0–10)</code> changes the room dimensions,{' '}
        <code>.roomfade(seconds)</code> changes how long the tail lasts.
      </p>

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
          <code>.delayfeedback(0–1)</code> — fraction of each echo that loops back. Approaching 1 =
          infinite echoes; over 1 = explodes.
        </li>
      </ul>
      <StrudelEditor
        code={`note("c3 e3 g3 c4").s("piano").delay(.5).delaytime(.375).delayfeedback(.5)`}
      />
      <p>
        Each note now echoes 3-4 times before fading. The delay time (.375s) is roughly an 8th note
        at our default cycle — synced to the pulse without us having to think about it.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">The In the Air Tonight intro</h2>
      <p>
        The first three minutes are just a CR-78 drum machine, an atmospheric pad, and Phil&apos;s
        vocal. Sparse and ghostly. We approximate with a similar drum pattern + a slow D-minor pad
        drenched in reverb and delay:
      </p>
      <StrudelEditor code={padStage.code} />
      <p className="text-sm text-neutral-500">
        Listen for how the pad chord hangs in the air after each hit — that&apos;s{' '}
        <code>.room(1.5)</code> plus <code>.delay()</code> with a long delay time. The whole
        atmosphere of the song lives in those two effects.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">THAT drum fill</h2>
      <p>
        At 3:16, the live drums hit. Famous for the &quot;gated reverb&quot; sound — technically a
        heavily compressed mic technique rather than literal gating, but the effect is the same:
        each drum hit is enormous and then snaps off, like a flash photograph of sound.
      </p>
      <p>
        The fill itself is dead simple — a descending tom roll (high tom, mid tom, low tom). The
        magic is the production. We approximate with kick + snare + toms and a generous{' '}
        <code>.room()</code>:
      </p>
      <StrudelEditor code={fillStage.code} />
      <p className="text-sm text-neutral-500">
        Strudel doesn&apos;t have a perfect &quot;gated reverb&quot; effect built in, but combining
        tom samples with <code>.room()</code> and tight envelope control gets close. The studio
        version is unmistakable; ours is in the family.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Reverb and delay together</h2>
      <p>
        Stacking both is what makes dub reggae, ambient music, and 80s ballads feel three-
        dimensional. Delay puts the signal in time (discrete echoes); reverb puts the echoes into a
        space:
      </p>
      <StrudelEditor
        code={`note("c3 e3 g3 ~ a3 g3 e3 ~").s("piano")
  .delay(.5).delaytime(.375).delayfeedback(.4)
  .room(.6)`}
      />
      <p className="text-sm text-neutral-500">
        <strong>Mixing tip:</strong> a tiny bit of reverb on everything (~<code>.room(.1)</code> to{' '}
        <code>.3</code>) glues your tracks together — they sound like they&apos;re in the same
        space. Without it, individual elements feel disconnected.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Build your own space</h2>
      <TryThis
        prompt="Push the In the Air Tonight intro further into dub territory. Add more delay feedback (.7+) and a longer delay time (1 second instead of .5) to make the echoes cascade. Then layer the drum fill on top by stacking both stages into one big track."
        code={padStage.code}
      />

      <p className="text-sm text-neutral-500">
        Reverb and delay are how recorded music has felt &quot;real&quot; since the 1950s. With the
        right amounts of both, an empty drum machine becomes a cathedral. With the wrong amounts,
        everything turns to mush — taste matters. Next up: pattern transformations, with Mario.
      </p>
    </div>
  );
}
