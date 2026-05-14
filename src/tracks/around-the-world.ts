import type { Track } from './types';

/**
 * Daft Punk — Around the World (1997). A 4-bar bassline plays for seven
 * minutes straight; the song's signature is a slow filter sweep on it.
 *
 * The bassline (transcribed from BigBassTabs / Ableton's analysis) is an
 * "ascending stairs" pattern: A1 repeated → step up to C2, repeated →
 * step up to E2, repeated → fast descent back down. Each "stair" is
 * rest-on-beat-1 then the stair note on beats 2-3-4, with a 16th-note
 * pickup connecting up to the next stair. The final bar descends in
 * eighth notes (B2 A2 G2 F#2 E2 D2) with a low G1 octave drop near the
 * end — a classic Daft Punk move.
 *
 * Modeled as 1 cycle = 4 bars at 121 BPM via setcpm(121/16). The filter
 * sine sweeps over 2 cycles (≈16 seconds), matching the slow-evolving
 * filter automation in the original.
 */
export const aroundTheWorld: Track = {
  id: 'around-the-world',
  title: 'Around the World',
  artist: 'Daft Punk',
  year: 1997,
  youtubeId: 'K0HSD_i2DvA',
  tempo: 121,
  // 4 bars per cycle so the full bassline phrase fits in one loop.
  beatsPerCycle: 16,
  key: 'E minor',
  notes:
    'The bassline is the song. 4 bars: three "ascending stairs" of repeated notes (A1, C2, E2) with 16th-note pickups, then a descending run. Filter automation does the rest.',
  stages: [
    {
      id: 'bass-with-sweep',
      label: 'Bass + filter sweep',
      lesson: 'around-the-world',
      description:
        'The 4-bar Around the World bassline with a slow sine-wave filter sweep — the auto-wah signature.',
      code: `setcpm(121/16)
note("[~ a1 a1 [a1 ~ b1 c2]] [~ c2 c2 [c2 ~ d2 e2]] [~ e2 e2 e2] [[b2 a2] [g2 f#2] [e2 d2] [g1 ~ ~ d2]]")
  .s("sawtooth")
  .lpf(sine.range(200, 3000).slow(2))
  .lpq(8)
  .attack(0).decay(.15).sustain(0)`,
    },
  ],
};
