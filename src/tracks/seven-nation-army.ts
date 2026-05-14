import type { Track } from './types';

/**
 * The White Stripes — Seven Nation Army (2003). Jack White played the riff
 * on guitar through an octave pedal so it sounds like a bass. The note
 * sequence — E2 E2 G2 E2 D2 C2 B1 — is decoded from the A-string bass tab
 * (frets 7-7-10-7-5-3-2 → MIDI 40 40 43 40 38 36 35).
 *
 * Returns across three lessons:
 *   - Lesson 4: the riff with straight 8ths (introduces note())
 *   - Lesson 5: the riff with real rhythm (introduces @N elongation)
 *   - Lesson 7: the same riff in E-minor scale degrees (n().scale())
 */
export const sevenNationArmy: Track = {
  id: 'seven-nation-army',
  title: 'Seven Nation Army',
  artist: 'The White Stripes',
  year: 2003,
  youtubeId: '0J2QdDbelmY',
  tempo: 124,
  beatsPerCycle: 8, // riff spans 2 bars
  key: 'E minor',
  notes:
    'Riff played on guitar through an octave pedal to mimic a bass. The 7 notes outline an E minor sound. We meet it three times: simple, with real rhythm, then in scale-degree form.',
  stages: [
    {
      id: 'riff',
      label: 'The riff (straight 8ths)',
      lesson: 'seven-nation-army',
      description:
        'The seven iconic notes — E E G E D C B — at the song tempo, simplified to straight 8ths.',
      code: `setcpm(124/4)
note("e2 e2 g2 e2 d2 c2 b1 ~").s("gm_acoustic_bass")`,
    },
    {
      id: 'riff-with-rhythm',
      label: 'The riff (real rhythm)',
      lesson: 'we-will-rock-you-solo',
      description:
        'Quarter E, 8th rest, 8th E, dotted-8th G, dotted-8th E, 8th D, then a full bar each of held C and held B.',
      // 32 16th-note units per cycle (1 cycle = 2 bars at 124 BPM, setcpm(124/8)).
      // Bar 1: e2@4 ~@2 e2@2 g2@3 e2@3 d2@2  →  4+2+2+3+3+2 = 16  ✓
      // Bar 2: c2@8 b1@8  →  8+8 = 16  ✓
      code: `setcpm(124/8)
note("e2@4 ~@2 e2@2 g2@3 e2@3 d2@2 c2@8 b1@8").s("gm_acoustic_bass")`,
    },
    {
      id: 'riff-as-scale-degrees',
      label: 'The riff in scale degrees',
      lesson: 'ode-to-joy',
      description: 'Same riff written in E minor scale degrees — n().scale() instead of note().',
      // E minor scale: E F# G A B C D (degrees 0-6). E=0, G=2, D=-1 (below octave),
      // C=-2, B=-3. Matches the original note sequence.
      code: `setcpm(124/4)
n("0 0 2 0 -1 -2 -3 ~").scale("E:minor").s("gm_acoustic_bass")`,
    },
  ],
};
