import type { Track } from './types';

/**
 * Deep Purple — Smoke on the Water (1972). Ritchie Blackmore wrote the
 * iconic riff (the song is credited to all five band members: Blackmore,
 * Gillan, Glover, Lord, Paice). It's routinely listed among the most
 * recognizable in rock history.
 *
 * The riff is played as parallel-4th dyads — each note in the melody has
 * a perfect 4th stacked above on the next string up. The melody itself
 * lives in the G minor blues scale.
 *
 * The rhythm is straightforward — notes land ON the downbeat, with each
 * note held until the next one. Bar 1 is essentially "quarter, quarter,
 * half." That on-the-beat simplicity is part of why it's THE first riff
 * everyone learns on guitar.
 *
 * Tempo: 112 BPM (official Deep Purple sheet music marks ♩=112; some BPM
 * databases report 114). 4/4 time, key of G minor.
 */
export const smokeOnTheWater: Track = {
  id: 'smoke-on-the-water',
  title: 'Smoke on the Water',
  artist: 'Deep Purple',
  year: 1972,
  // Official animated music video released March 2024.
  youtubeId: 'Q2FzZSBD5LE',
  tempo: 112,
  // The riff is a 3-bar phrase — we loop one cycle = 3 bars (= 12 beats).
  beatsPerCycle: 12,
  key: 'G minor',
  notes:
    'Riff played as parallel-4th dyads on guitar — each melody note has a perfect 4th stacked above. Notes land on the beat; the rhythm is simple (quarter, quarter, half pattern in bar 1).',
  stages: [
    {
      id: 'riff-single-notes',
      label: 'The riff (melody only)',
      lesson: 'smoke-on-the-water',
      description: 'The melody line of the riff — single notes, three bars in G minor.',
      // 3 bars per cycle, 16 16th-note weights per bar.
      // Bar 1: G quarter (4) — Bb quarter (4) — C half (8)
      // Bar 2: G quarter (4) — Bb quarter (4) — Db 8th (2) — C dotted-quarter (6)
      // Bar 3: G quarter (4) — Bb quarter (4) — C quarter (4) — Bb 8th (2) — G 8th (2)
      code: `setcpm(112/12)
note(\`[g3@4 bb3@4 c4@8]
      [g3@4 bb3@4 db4@2 c4@6]
      [g3@4 bb3@4 c4@4 bb3@2 g3@2]\`)
  .s("sawtooth").lpf(1200).lpq(2)
  .attack(0).decay(.4).sustain(.4).release(.2)`,
    },
    {
      id: 'riff-dyads',
      label: 'The riff (parallel 4ths)',
      lesson: 'smoke-on-the-water',
      description:
        "Same riff with the perfect-4th interval stacked on top — Blackmore's actual studio tone.",
      // Each note becomes a [root, 4th-above] dyad. 4th intervals:
      //   G3 + C4    Bb3 + Eb4    C4 + F4    Db4 + Gb4
      code: `setcpm(112/12)
note(\`[[g3,c4]@4 [bb3,eb4]@4 [c4,f4]@8]
      [[g3,c4]@4 [bb3,eb4]@4 [db4,gb4]@2 [c4,f4]@6]
      [[g3,c4]@4 [bb3,eb4]@4 [c4,f4]@4 [bb3,eb4]@2 [g3,c4]@2]\`)
  .s("sawtooth").lpf(1500).lpq(2)
  .attack(0).decay(.4).sustain(.4).release(.2)`,
    },
  ],
};
