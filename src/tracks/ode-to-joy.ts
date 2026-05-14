import type { Track } from './types';

/**
 * Beethoven — Symphony No. 9, 4th movement, "Ode to Joy" theme (1824).
 * The most-famous melody in classical music: 4 bars, only 5 different
 * notes (scale degrees 0-4 of D major in the original). Beethoven was
 * completely deaf by the premiere and reportedly had to be turned around
 * to see the audience applauding. Now it's the official anthem of the EU.
 *
 * The lesson presents it in C major so the degrees-to-note mapping is the
 * obvious one (C D E F G = 0 1 2 3 4). Original key was D major; the EU
 * anthem version is in F major. Beethoven's metronome marking is ♩=80;
 * most modern performances sit between 80 and 120 BPM.
 *
 * The signature rhythmic move is in bar 4: dotted-quarter / eighth / half.
 * Without it the melody is just a scale exercise — that hitch is what
 * makes it Ode to Joy.
 */
export const odeToJoy: Track = {
  id: 'ode-to-joy',
  title: 'Symphony No. 9, "Ode to Joy"',
  artist: 'Ludwig van Beethoven',
  year: 1824,
  // Karajan / Berlin Philharmonic — 4th movement, the "Ode to Joy" theme.
  youtubeId: 'XRCe86HVSJw',
  tempo: 80,
  // 4 bars per cycle (one full phrase of the theme).
  beatsPerCycle: 16,
  key: 'D major (transposed to C major for lessons)',
  notes:
    'The famous 4-bar phrase uses scale degrees 2 2 3 4 | 4 3 2 1 | 0 0 1 2 | 2 1 1. ' +
    'Bars 1-3 are straight quarter notes; bar 4 hits dotted-quarter / eighth / half — ' +
    'the rhythmic kink that makes it recognizable.',
  stages: [
    {
      id: 'melody',
      label: 'The melody (C major)',
      lesson: 'ode-to-joy',
      description: 'The opening 4-bar phrase, scale-degree pattern with correct rhythm.',
      // 4 bracketed groups = 4 bars per cycle. Inside bar 4, @N elongates
      // the note: weights 3+1+4 = 8 eighth-note units = dotted-quarter,
      // eighth, half. setcpm(80/16) makes 1 cycle = 4 bars at ♩=80.
      code: `setcpm(80/16)
n("[2 2 3 4] [4 3 2 1] [0 0 1 2] [2@3 1 1@4]")
  .scale("C:major")
  .s("piano")`,
    },
  ],
};
