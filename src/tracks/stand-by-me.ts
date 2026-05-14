import type { Track } from './types';

/**
 * Ben E. King — Stand By Me (1961). The textbook example of the
 * I-vi-IV-V "50s progression": A → F#m → D → E in A major. The same four
 * chords power thousands of pop songs ("Heart and Soul", "Earth Angel",
 * countless doo-wop, plus modern songs built on the same bones).
 */
export const standByMe: Track = {
  id: 'stand-by-me',
  title: 'Stand By Me',
  artist: 'Ben E. King',
  year: 1961,
  youtubeId: 'z5i9vT8wGY8',
  tempo: 120,
  beatsPerCycle: 4,
  key: 'A major',
  notes:
    'The original "50s progression": I-vi-IV-V. Each chord lasts a full bar. The bassline walks between the chord roots; the piano carries the harmony.',
  stages: [
    {
      id: 'chords',
      label: 'Chords',
      lesson: 'stand-by-me',
      description: 'The four-chord progression on piano — A, F#m, D, E.',
      code: `setcpm(120/4)
chord("<A F#m D E>").voicing().s("piano")`,
    },
    {
      id: 'with-bass',
      label: '+ Bass',
      lesson: 'stand-by-me',
      description: 'Add the root note of each chord on bass.',
      // rootNotes(2) extracts the root pitch from each chord symbol in octave 2.
      code: `setcpm(120/4)
stack(
  chord("<A F#m D E>").voicing().s("piano"),
  chord("<A F#m D E>").rootNotes(2).s("gm_acoustic_bass")
)`,
    },
  ],
};
