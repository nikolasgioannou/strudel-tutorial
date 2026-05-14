import { StrudelEditor } from '../components/StrudelEditor';
import { TryThis } from '../components/TryThis';
import { SongCard } from '../components/SongCard';
import { takeOnMe } from '../tracks/take-on-me';
import { requireStage } from '../tracks';
import type { LessonMeta } from './index';

export const meta: LessonMeta = {
  slug: 'take-on-me',
  title: 'Synth design — Take On Me',
  blurb: "Filters and envelopes. Shape a raw waveform into a-ha's iconic Juno-60 lead.",
  order: 11,
};

const leadStage = requireStage(takeOnMe, 'lead-riff');

export function Lesson() {
  return (
    <div className="space-y-6 text-neutral-300">
      <p>
        Every lesson so far has used synth defaults — <code>sawtooth</code>, <code>square</code>,{' '}
        <code>piano</code>. We&apos;ve barely shaped the <em>sound</em>. Time to fix that. The 2-bar
        opening riff of a-ha&apos;s <em>Take On Me</em> isn&apos;t complex melodically (12 notes,
        all from A major), but the <em>sound</em> is what makes it unmistakable: a Roland Juno-60
        with a bright, clean, glassy tone that cuts through the LinnDrum behind it.
      </p>
      <p>
        We&apos;ll build that sound by shaping a raw sawtooth wave with a <em>filter</em> and an{' '}
        <em>envelope</em>. These are the two most-important sound-design tools in electronic music.
        Once you know how to use them, you can turn one waveform into a hundred instruments.
      </p>

      <SongCard track={takeOnMe} />

      <h2 className="text-lg font-semibold text-neutral-100">The riff, raw</h2>
      <p>
        First, the notes alone — a bare sawtooth wave with no shaping. The pitches are right but the
        sound is harsh and flat:
      </p>
      <StrudelEditor
        code={`setcpm(169/8)
note("f#4 f#4 d4 b3 b3 ~ ~ ~ e4 e4 e4 g#4 g#4 a4 b4 ~").s("sawtooth")`}
      />
      <p className="text-sm text-neutral-500">
        Sawtooth waves are bright and harmonically rich — they contain every harmonic of the
        fundamental, which is why they sound buzzy. Great raw material for synth bass and lead;
        unpleasant on its own.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">
        <code>.lpf()</code> — the low-pass filter
      </h2>
      <p>
        A <strong>low-pass filter</strong> keeps frequencies below a cutoff and blocks everything
        above. Lower cutoff = darker, softer. Higher cutoff = brighter, more open.
        <code>.lpf(N)</code> sets the cutoff in Hz:
      </p>
      <StrudelEditor
        code={`setcpm(169/8)
note("f#4 f#4 d4 b3 b3 ~ ~ ~ e4 e4 e4 g#4 g#4 a4 b4 ~").s("sawtooth").lpf(800)`}
      />
      <p>
        Now the harsh top end is gone. <code>lpf(800)</code> says &quot;everything above 800Hz,
        cut.&quot; The buzz settles into a rounded, dark tone.
      </p>

      <p>
        Try opening the filter wider — <code>.lpf(2500)</code> — for a brighter sound that still has
        its edges rounded:
      </p>
      <StrudelEditor
        code={`setcpm(169/8)
note("f#4 f#4 d4 b3 b3 ~ ~ ~ e4 e4 e4 g#4 g#4 a4 b4 ~").s("sawtooth").lpf(2500)`}
      />
      <p className="text-sm text-neutral-500">
        <code>.lpq(N)</code> is filter <em>resonance</em> — emphasis at the cutoff. Higher Q = more
        &quot;wah&quot; right at the cutoff frequency. Strudel&apos;s default Q is low; for
        synth-pop tones you want a little Q to give the filter character.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">ADSR — the volume envelope</h2>
      <p>
        Every note has a <em>shape over time</em> — how it starts, how it fades. That shape is
        called an <strong>envelope</strong>, and the standard model has four parts:{' '}
        <strong>Attack, Decay, Sustain, Release</strong> (ADSR).
      </p>
      <ul className="ml-5 list-disc space-y-1 text-sm">
        <li>
          <code>.attack(s)</code> — seconds from silence to full volume. Short = punchy. Long =
          pad-like swell.
        </li>
        <li>
          <code>.decay(s)</code> — seconds from peak down to the sustain level.
        </li>
        <li>
          <code>.sustain(level)</code> — held level while the note is &quot;on&quot; (0..1).
        </li>
        <li>
          <code>.release(s)</code> — seconds for the tail to fade once the note ends.
        </li>
      </ul>
      <p>
        For a punchy synth lead, you want short attack (instant), short decay, mid-high sustain,
        short release. That gives every note a clean, defined hit:
      </p>
      <StrudelEditor code={leadStage.code} />
      <p>
        That&apos;s the Take On Me riff with the full sound-design treatment: sawtooth waveform,
        low-pass filter at 2500Hz, slight resonance, punchy envelope. The actual recording uses a
        Roland Juno-60, but the technique is the same: take a raw wave, filter it, shape it with an
        envelope, and you have an instrument.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Three sounds, same notes</h2>
      <p>
        Watch the same melody become three different instruments by just changing the envelope. A
        pluck — fast attack, fast decay, no sustain:
      </p>
      <StrudelEditor
        code={`setcpm(169/8)
note("f#4 f#4 d4 b3 b3 ~ ~ ~ e4 e4 e4 g#4 g#4 a4 b4 ~")
  .s("sawtooth").lpf(2500)
  .attack(0).decay(.1).sustain(0)`}
      />
      <p>A pad — slow attack, full sustain, long release. Notes swell in:</p>
      <StrudelEditor
        code={`setcpm(169/8)
note("f#4 f#4 d4 b3 b3 ~ ~ ~ e4 e4 e4 g#4 g#4 a4 b4 ~")
  .s("sawtooth").lpf(2500)
  .attack(.4).decay(.3).sustain(.7).release(.8)`}
      />
      <p>Same notes, completely different feel. That&apos;s the power of envelope shaping.</p>

      <h2 className="text-lg font-semibold text-neutral-100">Stack with drums</h2>
      <TryThis
        prompt='Add a LinnDrum-style beat under the riff to make it feel like the actual song. The original has a 4-on-the-floor kick with claps on 2 and 4. Try adding sound("bd*4").bank("LinnDrum") and sound("~ cp ~ cp").bank("LinnDrum") to the stack(). Then play with the .lpf cutoff value — drop it to 800 for a dark, brooding version.'
        code={leadStage.code}
      />

      <p className="text-sm text-neutral-500">
        Filters and envelopes are the entire toolkit of subtractive synthesis — which is what every
        analog synth (Moog, Juno, Prophet, OB-X) is doing. Next lesson we let the filter{' '}
        <em>move</em> over time, with another iconic 80s riff.
      </p>
    </div>
  );
}
