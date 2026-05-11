import type { Track } from './types';

/**
 * The White Stripes — Seven Nation Army (2003). Jack White played the riff
 * on guitar through an octave pedal so it sounds like a bass. The note
 * sequence — E2 E2 G2 E2 D2 C2 B1 — is decoded from the A-string bass tab
 * (frets 7-7-10-7-5-3-2 → MIDI 40 40 43 40 38 36 35).
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
    'Riff played on guitar through an octave pedal to mimic a bass. The 7 notes outline an E minor sound.',
  stages: [
    {
      id: 'riff',
      label: 'The riff (straight-8ths)',
      lesson: 'seven-nation-army',
      description:
        'The seven iconic notes — E E G E D C B — at the song tempo. Rhythm simplified to straight 8ths; the held first E and held final B come back when we teach note duration.',
      // 8 slots (last is silence) gives the riff a straight-8ths feel — pitches
      // are correct, but the studio rhythm has the first E held for a beat and
      // the final B held for two. A future "riff-with-rhythm" stage will use
      // @N elongation once that's introduced (likely in the durations lesson).
      code: `setcpm(124/4)
note("e2 e2 g2 e2 d2 c2 b1 ~").s("gm_acoustic_bass")`,
    },
  ],
};
