import type { Track } from './types';

/**
 * U2 — Sunday Bloody Sunday (1983). The opening track from War. Larry
 * Mullen Jr's drum pattern is famously "military": kick on every quarter
 * (steady four-on-the-floor), snare on the backbeat (2 and 4), with
 * relentless 16th-note hi-hats riding over the top to create the
 * "machine-gun" feel. Mullen recorded the drums at the base of a
 * stairwell at Windmill Lane Studios to capture natural reverb.
 *
 * Tempo: ~100 BPM (SongBPM/Tunebat; some Wikipedia citations give 103).
 * Key: Bb minor — the band tunes their guitars down a half step so the
 * shapes they finger are B minor but the music sounds in Bb minor.
 * Published sheet music is often transposed to B minor for readability.
 */
export const sundayBloodySunday: Track = {
  id: 'sunday-bloody-sunday',
  title: 'Sunday Bloody Sunday',
  artist: 'U2',
  year: 1983,
  // Live at Red Rocks 1983, remastered 2021 — on official U2 channel.
  youtubeId: 'EM4vblG6BVQ',
  tempo: 100,
  beatsPerCycle: 4,
  key: 'Bb minor (transposed B minor in published sheet music)',
  notes:
    'The "military" feel comes from 16th-note hi-hats riding a four-on-the-floor kick. Mullen recorded the drums at the bottom of a stairwell for natural reverb.',
  stages: [
    {
      id: 'drums',
      label: 'The military drums',
      lesson: 'sunday-bloody-sunday',
      description:
        "Mullen's pattern — kick on EVERY quarter (four-on-the-floor), snare on 2 and 4, 16th-note hi-hat.",
      code: `setcpm(100/4)
stack(
  sound("bd*4"),
  sound("~ sd ~ sd"),
  sound("hh*16").gain(.5)
)`,
    },
  ],
};
