import type { Track } from './types';

/**
 * Deep Purple — Smoke on the Water (1972). Ritchie Blackmore's riff is
 * routinely listed among the most recognizable in rock history. It's
 * played as parallel-4th dyads — each note in the melody has a perfect
 * 4th stacked above on the next string up. The melody itself lives in
 * the G minor blues scale.
 *
 * The riff is a 3-bar phrase (often described as 4 phrases of 3-5 notes
 * each):
 *   Bar 1: G — Bb — C
 *   Bar 2: G — Bb — Db — C
 *   Bar 3: G — Bb — C — Bb — G
 *
 * Tempo: 112 BPM (per multiple BPM databases). 4/4 time, key of G minor.
 */
export const smokeOnTheWater: Track = {
  id: 'smoke-on-the-water',
  title: 'Smoke on the Water',
  artist: 'Deep Purple',
  year: 1972,
  // Official animated music video released March 2024.
  youtubeId: 'Q2FzZSBD5LE',
  tempo: 112,
  // The riff is a 3-bar phrase — we'll loop one cycle = 3 bars (= 12 beats).
  beatsPerCycle: 12,
  key: 'G minor',
  notes:
    'Riff played as parallel-4th dyads on guitar — each melody note gets a perfect 4th stacked above. The melody uses the G minor blues scale (G, Bb, C, Db, D, F).',
  stages: [
    {
      id: 'riff-single-notes',
      label: 'The riff (melody only)',
      lesson: 'smoke-on-the-water',
      description: 'The riff stripped to a single melody line — easiest to see the shape.',
      // 3 bars per cycle. Bar 1: G@4 Bb@4 C@8 (3 notes, weights 4+4+8=16 16ths).
      // Bar 2: G@4 Bb@4 Db@2 C@6 (4 notes, 16 16ths).
      // Bar 3: G@4 Bb@4 C@4 Bb@2 G@2 (5 notes, 16 16ths).
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
