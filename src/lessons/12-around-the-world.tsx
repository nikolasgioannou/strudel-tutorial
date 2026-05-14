import { StrudelEditor } from '../components/StrudelEditor';
import { TryThis } from '../components/TryThis';
import { SongCard } from '../components/SongCard';
import { aroundTheWorld } from '../tracks/around-the-world';
import { requireStage } from '../tracks';
import type { LessonMeta } from './index';

export const meta: LessonMeta = {
  slug: 'around-the-world',
  title: 'Signals — Around the World',
  blurb: "Daft Punk's filter sweep. Parameters that move on their own.",
  order: 12,
};

const sweepStage = requireStage(aroundTheWorld, 'bass-with-sweep');

export function Lesson() {
  return (
    <div className="space-y-6 text-neutral-300">
      <p>
        Last lesson the filter cutoff was fixed — <code>.lpf(2500)</code> sat at 2500 Hz the whole
        time. What if you wanted the filter to <em>move</em> — slowly opening up, then closing back
        down, breathing? That&apos;s what <strong>signals</strong> are for, and Daft Punk&apos;s{' '}
        <em>Around the World</em> is the patron saint of the technique. The bassline plays for seven
        minutes straight, but the filter on it is constantly evolving — every loop sounds the same
        and different at once.
      </p>

      <SongCard track={aroundTheWorld} />

      <h2 className="text-lg font-semibold text-neutral-100">A signal is a moving value</h2>
      <p>
        Strudel has built-in signals that vary continuously over time, just like audio waveforms but
        used for <em>control</em>:
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
          <code>square</code> — abrupt toggle between 0 and 1.
        </li>
        <li>
          <code>perlin</code> — smooth random noise. Wanders organically; never repeats.
        </li>
      </ul>
      <p>
        By default each signal completes one full cycle per Strudel cycle, with output range 0 to 1.
        You scale that 0-to-1 range to whatever parameter you&apos;re modulating.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">
        <code>.range()</code> and <code>.slow()</code>
      </h2>
      <p>
        <code>sine.range(200, 2000)</code> remaps the sine&apos;s 0-1 output to swing between 200
        and 2000. <code>sine.slow(8)</code> stretches the wave so one full cycle takes 8 Strudel
        cycles instead of 1 — slow, evolving motion.
      </p>
      <p>
        Here&apos;s a hi-hat with its <em>gain</em> modulated by a slow sine — it pulses in and out:
      </p>
      <StrudelEditor code={`sound("hh*16").gain(sine.range(.2, 1).slow(4))`} />
      <p>
        And here&apos;s the same idea on a filter — the cutoff sweeps from dark to bright over 8
        cycles:
      </p>
      <StrudelEditor
        code={`note("c3 e3 g3 c4").s("sawtooth")
  .lpf(sine.range(200, 3000).slow(8))`}
      />
      <p className="text-sm text-neutral-500">
        That filter sweep is the most-used effect in electronic dance music. Every build-up you hear
        in house, trance, techno, drum-and-bass is somebody automating exactly this.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">The Around the World bassline</h2>
      <p>
        The actual bassline is a 4-bar &quot;ascending stairs&quot; pattern: three runs of repeated
        notes (A1, then C2, then E2), then a quick descent. Daft Punk plays it for seven minutes;
        we&apos;ll loop it indefinitely. Without the filter sweep, it&apos;s just a bassline:
      </p>
      <StrudelEditor
        code={`setcpm(121/16)
note("[~ a1 a1 [a1 ~ b1 c2]] [~ c2 c2 [c2 ~ d2 e2]] [~ e2 e2 e2] [[b2 a2] [g2 f#2] [e2 d2] [g1 ~ ~ d2]]")
  .s("sawtooth")`}
      />

      <h2 className="text-lg font-semibold text-neutral-100">Add the sweep</h2>
      <p>
        Now wrap the filter cutoff in a slow sine. We use <code>.slow(2)</code> so the sweep takes 2
        cycles (= 8 bars ≈ 16 seconds) to swing from dark to bright and back. That slow timing is
        what makes the song feel like it&apos;s breathing:
      </p>
      <StrudelEditor code={sweepStage.code} />
      <p className="text-sm text-neutral-500">
        <code>.lpq(8)</code> adds heavy resonance — emphasis at the cutoff. That&apos;s what makes
        the filter sweep audibly snake through the harmonics instead of just dulling the sound.
        Without resonance, filter sweeps feel washed out. With it, they sing.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Modulate anything</h2>
      <p>
        Signals can drive any patternable parameter — gain, pan, speed, decay, even the rhythm
        density via <code>.fast()</code>. Anywhere you have a number, you can put a signal instead.
        Try modulating the <em>pan</em>:
      </p>
      <StrudelEditor
        code={`note("c3 e3 g3 c4").s("sawtooth").lpf(1200)
  .pan(sine.range(0, 1).slow(4))`}
      />
      <p className="text-sm text-neutral-500">
        Headphones recommended. The synth pans left and right over 4 cycles. <code>perlin</code>{' '}
        instead of <code>sine</code> would make it wander unpredictably rather than swing regularly.
      </p>

      <h2 className="text-lg font-semibold text-neutral-100">Make your own sweep</h2>
      <TryThis
        prompt='Speed up the filter sweep so it cycles twice as fast — change .slow(2) to .slow(1). Or replace sine with perlin to get an organic, unpredictable filter motion. Try also adding sound("bd*4") to the stack for the iconic Around the World four-on-the-floor underneath.'
        code={sweepStage.code}
      />

      <p className="text-sm text-neutral-500">
        Signals turn static patterns into living ones. Combined with filters and envelopes from the
        last lesson, you can build sounds that evolve over the course of a song. Next we use these
        same tools to build Eurythmics&apos; <em>Sweet Dreams</em> bass tone.
      </p>
    </div>
  );
}
