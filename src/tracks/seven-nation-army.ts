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
      // the final B held for two. The next stage ("riff-with-rhythm") uses @N
      // elongation to encode the real durations once that's been introduced.
      code: `setcpm(124/4)
note("e2 e2 g2 e2 d2 c2 b1 ~").s("gm_acoustic_bass")`,
    },
    {
      id: 'riff-with-rhythm',
      label: 'The riff (real rhythm)',
      lesson: 'note-durations',
      description:
        'Quarter E, 8th rest, 8th E, dotted-8th G, dotted-8th E, 8th D, then a full bar of half-note C followed by half-note B. 2 bars in 4/4.',
      // 32 16th-note units per cycle (1 cycle = 2 bars at 124 BPM, setcpm(124/8)).
      // Bar 1 (16 units): e2@4 ~@2 e2@2 g2@3 e2@3 d2@2  →  4+2+2+3+3+2 = 16  ✓
      //   beat 1:    e2 quarter (4 units)
      //   beat 2:    8th rest (2 units) then e2 8th (2 units)
      //   beat 3:    g2 dotted-8th (3 units) then e2 dotted-8th (3 units)
      //   beat 4.5:  d2 8th (2 units, lands on the "and" of 4)
      // Bar 2 (16 units): c2@8 b1@8  →  8+8 = 16  ✓
      //   beat 1:    c2 half (8 units)
      //   beat 3:    b1 half (8 units)
      code: `setcpm(124/8)
note("e2@4 ~@2 e2@2 g2@3 e2@3 d2@2 c2@8 b1@8").s("gm_acoustic_bass")`,
    },
  ],
};
