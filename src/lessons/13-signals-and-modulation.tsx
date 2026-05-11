import { StrudelEditor } from '../components/StrudelEditor';
import { QuizEditor } from '../components/QuizEditor';
import { SongCard } from '../components/SongCard';
import { aroundTheWorld } from '../tracks/around-the-world';
import { requireStage } from '../tracks';
import type { LessonMeta } from './index';

export const meta: LessonMeta = {
  slug: 'signals-and-modulation',
  title: 'Signals — parameters that breathe',
  blurb: 'Every Daft Punk filter sweep, every dubstep wobble: one waveform driving one parameter.',
  order: 13,
};

const sweepStage = requireStage(aroundTheWorld, 'bass-with-sweep');

export function Lesson() {
  return (
    <div className="space-y-6 text-neutral-300">
      <p>
        Lesson 9 introduced filters with a <em>fixed</em> cutoff — <code>.lpf(800)</code> sat there
        at 800 Hz forever. Lesson 12 introduced <code>.every</code> for cycle-by-cycle change. But
        what if you want a parameter to change <em>smoothly, continuously</em>, sweeping up and
        down? That's what <strong>signals</strong> are for.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">A signal is a waveform</h2>
      <p>
        Strudel has a handful of built-in signals — values that vary over time, just like an audio
        waveform but used for control:
      </p>
      <ul className="ml-5 list-disc space-y-1 text-sm">
        <li>
          <code>sine</code> — smooth back-and-forth, 0 to 1 to 0 to 1…
        </li>
        <li>
          <code>saw</code> — linear ramp from 0 up to 1, then snaps back.
        </li>
        <li>
          <code>tri</code> — triangle, linear up and linear down.
        </li>
        <li>
          <code>square</code> — toggles abruptly between 0 and 1.
        </li>
        <li>
          <code>perlin</code> — smooth random noise (the same algorithm that's been used in
          procedural graphics since 1985). Wanders organically; never repeats.
        </li>
      </ul>
      <p>
        By default they each complete one full cycle per Strudel cycle. Their output range is always
        0 to 1. To use them, you scale that 0–1 range to whatever parameter you're controlling.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">
        <code>.range(low, high)</code> and <code>.slow(n)</code>
      </h2>
      <p>
        <code>signal.range(200, 2000)</code> remaps the signal's 0–1 output to swing between 200 and
        2000. <code>signal.slow(n)</code> stretches the signal so one full cycle of it takes{' '}
        <em>n</em> Strudel cycles instead of one — for slow, evolving sweeps.
      </p>
      <p>Here's a hi-hat with its gain modulated by a slow sine — it pulses in and out:</p>
      <StrudelEditor code={`sound("hh*16").gain(sine.range(.2, 1).slow(4))`} />
      <p>
        And here's the same trick on a filter — a sawtooth synth whose cutoff sweeps from low (dark)
        to high (bright) and back, slowly:
      </p>
      <StrudelEditor
        code={`note("c3 e3 g3 c4").s("sawtooth")
  .lpf(sine.range(200, 3000).slow(8))`}
      />
      <p className="text-sm text-neutral-500">
        That filter sweep is the most-used effect in electronic dance music. Every "build-up" you
        hear in a house or trance track is somebody automating exactly this.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">perlin for organic motion</h2>
      <p>
        <code>sine</code> is regular and predictable. <code>perlin</code> wanders. Use it when you
        want a parameter to feel alive but unpredictable — pitch jitter, slow pan drift, breath-like
        volume:
      </p>
      <StrudelEditor code={`sound("hh*16").gain(perlin.range(.3, 1))`} />

      <h2 className="text-lg font-semibold text-neutral-100">Around the World</h2>
      <p>
        Daft Punk's <em>Around the World</em> is the patron saint of filter sweeps. A simple
        bassline (an ascending E-minor pattern, climbing up and walking back down) plays for seven
        minutes straight — but the filter on it is <em>constantly</em> opening and closing. Same
        notes, but the sound is always evolving. That's the whole song.
      </p>

      <SongCard track={aroundTheWorld} />

      <p>
        Our simplified bassline first, with no filter movement — just a sawtooth synth playing an
        ascending/descending E-minor scale:
      </p>
      <StrudelEditor
        code={`setcpm(121/4)
note("a1 b1 c2 d2 e2 f#2 e2 d2").s("sawtooth")`}
      />
      <p>
        Same notes, but now wrap the cutoff in a slow sine. Watch (and listen) as the brightness
        moves up and down across 8 cycles:
      </p>
      <StrudelEditor code={sweepStage.code} />
      <p className="text-sm text-neutral-500">
        The <code>.lpq(8)</code> adds resonance — emphasis at the cutoff frequency — which is what
        makes the filter sweep audibly snake through the harmonics instead of just dulling the
        sound. Without resonance, filter sweeps feel washed out. With it, they sing.
      </p>

      <section className="card space-y-3">
        <h3 className="text-sm font-medium tracking-wider text-brand-300 uppercase">Quiz</h3>
        <p className="text-sm">
          Take the Around the World bassline and make the filter sweep{' '}
          <strong>twice as fast</strong> — sweep over 4 cycles instead of 8.
        </p>
        <QuizEditor
          initialCode={sweepStage.code}
          target={`setcpm(121/4)
note("a1 b1 c2 d2 e2 f#2 e2 d2").s("sawtooth")
  .lpf(sine.range(200, 3000).slow(4))
  .lpq(8)
  .attack(0).decay(.15).sustain(0)`}
          hint="Change slow(8) to slow(4)."
        />
      </section>

      <p className="text-sm text-neutral-500">
        Signals can drive any patternable parameter — gain, pan, speed, decay, even the rhythm
        density via <code>.fast()</code>. Anywhere you have a number, you can put a signal instead.
      </p>
    </div>
  );
}
