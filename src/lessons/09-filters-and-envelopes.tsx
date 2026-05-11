import { StrudelEditor } from '../components/StrudelEditor';
import { QuizEditor } from '../components/QuizEditor';
import type { LessonMeta } from './index';

export const meta: LessonMeta = {
  slug: 'filters-and-envelopes',
  title: 'Filters and envelopes — same notes, different soul',
  blurb: 'A synth pattern becomes a bass, a pluck, or a pad without changing a note.',
  order: 9,
};

export function Lesson() {
  return (
    <div className="space-y-6 text-neutral-300">
      <p>
        We have pitch, rhythm, and layering. What we don't yet have is <em>sound design</em> — the
        shape of each note. A sawtooth wave can be a buzzy lead, a punchy bass, or a soft pad
        depending on two tools: <strong>filters</strong> (which frequencies you keep) and{' '}
        <strong>envelopes</strong> (how loud the note is over its lifetime).
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">
        <code>.lpf()</code> — the low-pass filter
      </h2>
      <p>
        A <strong>low-pass filter</strong> lets frequencies <em>below</em> a cutoff through and
        blocks everything above. Lower the cutoff and the sound gets darker and softer; raise it and
        it gets bright and buzzy. It's the single most important sound-shaping tool in electronic
        music — every Daft Punk filter sweep, every dubstep bass wobble, every disco whoosh is
        somebody automating this one parameter.
      </p>
      <p>First, listen to a sawtooth wave with no filter at all — bright and harsh:</p>
      <StrudelEditor code={`note("c3 e3 g3 c4").s("sawtooth")`} />
      <p>
        Now add <code>.lpf(400)</code> — only frequencies under 400 Hz pass through. The hiss is
        gone; we're left with a muffled, dark version.
      </p>
      <StrudelEditor code={`note("c3 e3 g3 c4").s("sawtooth").lpf(400)`} />
      <p>
        Open the filter to <code>.lpf(2000)</code> — much brighter, but still tamed:
      </p>
      <StrudelEditor code={`note("c3 e3 g3 c4").s("sawtooth").lpf(2000)`} />
      <p>
        The cutoff can even be a <em>pattern</em>. Try <code>.lpf("200 800 200 800")</code> — the
        filter opens and closes on each note. This is how filtered house basses get that "wah-wah"
        pumping feel.
      </p>
      <StrudelEditor code={`note("c3 e3 g3 c4").s("sawtooth").lpf("200 800 200 800")`} />

      <h2 className="text-lg font-semibold text-neutral-100">
        <code>.gain()</code> — accents
      </h2>
      <p>
        Gain is volume per event. A constant <code>.gain(0.5)</code> just makes everything quieter —
        useful for mixing. The more interesting use is <em>patterning the gain</em> to create
        accents.
      </p>
      <StrudelEditor code={`sound("hh*8").gain("1 .3 .5 .3 1 .3 .5 .3")`} />
      <p className="text-sm text-neutral-500">
        That hi-hat pattern feels like a real drummer — louder on the downbeats, quieter in between.
        Without gain accents, machine-played drums sound stiff and mechanical. With them, even a
        drum machine feels alive. This is what "groove" sounds like in numbers.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">ADSR — the envelope</h2>
      <p>
        Every note has a <em>shape over time</em> — how it starts, how it ends, how loud it is in
        the middle. That shape is called an <strong>envelope</strong>, and the standard one has four
        parts: <strong>Attack, Decay, Sustain, Release</strong> (ADSR).
      </p>
      <ul className="ml-5 list-disc space-y-1 text-sm">
        <li>
          <strong>Attack</strong> (<code>.attack(s)</code>) — how long from silence to peak. Short =
          punchy and percussive. Long = smooth and pad-like.
        </li>
        <li>
          <strong>Decay</strong> (<code>.decay(s)</code>) — how long from peak down to the sustain
          level. This is what gives plucks their "ping."
        </li>
        <li>
          <strong>Sustain</strong> (<code>.sustain(level)</code>) — the volume held while the note
          is "on" (0..1). Sustain = 0 means the note dies after the decay (good for plucks). Sustain
          = 1 means it holds at full volume (good for organs and pads).
        </li>
        <li>
          <strong>Release</strong> (<code>.release(s)</code>) — how long the tail rings out after
          the note ends.
        </li>
      </ul>
      <p>Same four notes, three different envelopes — three different instruments:</p>
      <p>
        <strong>Pluck</strong> — fast attack, fast decay, no sustain, short release:
      </p>
      <StrudelEditor
        code={`note("c3 e3 g3 c4").s("sawtooth").lpf(2000)
  .attack(0).decay(.1).sustain(0).release(.1)`}
      />
      <p>
        <strong>Stab</strong> — same idea but with a longer release so the notes ring out:
      </p>
      <StrudelEditor
        code={`note("c3 e3 g3 c4").s("sawtooth").lpf(2000)
  .attack(0).decay(.05).sustain(0).release(.6)`}
      />
      <p>
        <strong>Pad</strong> — slow attack, full sustain, long release. Notes swell in and out:
      </p>
      <StrudelEditor
        code={`note("c3 e3 g3 c4").s("sawtooth").lpf(800)
  .attack(.8).decay(.2).sustain(.8).release(1.5)`}
      />
      <p className="text-sm text-neutral-500">
        There's a shorthand: <code>.adsr(".1:.1:.5:.2")</code> = attack 0.1, decay 0.1, sustain 0.5,
        release 0.2. Faster to type, same effect.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">
        Filter envelopes — the secret sauce
      </h2>
      <p>
        Real synth sounds usually have the filter envelope <em>moving</em> too — opening up at the
        start of each note, then closing back down. That's <code>.lpa()</code>, <code>.lpd()</code>,{' '}
        <code>.lps()</code>, <code>.lpr()</code> (filter attack/decay/etc.) plus{' '}
        <code>.lpenv()</code> for how much the envelope moves the cutoff.
      </p>
      <p>The classic "acid bass" sound — short, plucky, with a sharp filter sweep:</p>
      <StrudelEditor
        code={`setcpm(120/4)
note("c2 c2 eb2 c2 g2 c2 eb2 g2").s("sawtooth")
  .lpf(400).lpq(12)
  .lpa(0).lpd(.15).lpenv(4)
  .attack(0).decay(.15).sustain(0)`}
      />
      <p className="text-sm text-neutral-500">
        <code>.lpq()</code> is filter <em>resonance</em> — emphasis at the cutoff frequency. Higher
        values give that classic "wah" peak you hear in Roland TB-303 acid bass lines.
      </p>

      <section className="card space-y-3">
        <h3 className="text-sm font-medium tracking-wider text-brand-300 uppercase">Quiz</h3>
        <p className="text-sm">
          Take a plain sawtooth note pattern and turn it into a <strong>plucky synth</strong>: add a
          low-pass filter at 1500 Hz, attack 0, decay 0.1, sustain 0, release 0.1.
        </p>
        <QuizEditor
          initialCode={`note("c3 e3 g3 c4").s("sawtooth")`}
          target={`note("c3 e3 g3 c4").s("sawtooth").lpf(1500).attack(0).decay(.1).sustain(0).release(.1)`}
          hint="Chain .lpf(1500).attack(0).decay(.1).sustain(0).release(.1) onto the end."
        />
      </section>

      <p className="text-sm text-neutral-500">
        Filters and envelopes are how a synth becomes an instrument. Next lesson: instead of shaping
        the sound, we'll shape the <em>pattern</em> itself with reverse, jux, fast, and slow.
      </p>
    </div>
  );
}
