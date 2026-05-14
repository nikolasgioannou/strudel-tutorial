import type { Track } from './types';

/**
 * U2 — Sunday Bloody Sunday (1983). The opening track from War. Larry
 * Mullen Jr's drum pattern is famously "military" — kick on 1 and 3,
 * snare on 2 and 4, but driven by relentless 16th-note hi-hats that give
 * it the "machine-gun" feel. Mullen recorded the drums at the base of a
 * stairwell to capture natural reverb.
 *
 * Tempo confirmed by The Drum Ninja transcription at ♩=98.
 */
export const sundayBloodySunday: Track = {
  id: 'sunday-bloody-sunday',
  title: 'Sunday Bloody Sunday',
  artist: 'U2',
  year: 1983,
  // Promotional video used the Red Rocks 1983 live performance.
  youtubeId: 'EM4vblG6BVQ',
  tempo: 98,
  beatsPerCycle: 4,
  key: 'A minor',
  notes:
    'The "military" feel comes from 16th-note hi-hats riding over a standard backbeat. Mullen recorded the drums at the bottom of a stairwell for natural reverb.',
  stages: [
    {
      id: 'drums',
      label: 'The military drums',
      lesson: 'sunday-bloody-sunday',
      description:
        "Mullen's opening pattern — kick on 1 and 3, snare on 2 and 4, 16th-note hi-hat.",
      code: `setcpm(98/4)
stack(
  sound("bd ~ bd ~"),
  sound("~ sd ~ sd"),
  sound("hh*16").gain(.5)
)`,
    },
  ],
};
