import type { Track } from './types';

/**
 * a-ha — Take On Me (1985). The synth lead was played on a Roland Juno-60
 * (often doubled with a Yamaha DX7) over a LinnDrum programmed beat. The
 * opening 2-bar riff is the most-air-keyboarded phrase of the 80s.
 *
 * The 2-bar intro riff alternates between B minor and E major chord
 * sections, decoded from the standard tab (high E string frets 0-7 area):
 *   Bar 1 (Bm): F#4 F#4 D4 B3 B3
 *   Bar 2 (E):  E4 E4 E4 G#4 G#4 A4 B4
 *
 * Source: Ultimate Guitar / Songsterr intro tab. Tempo ~169 BPM per
 * multiple BPM databases. Key of A major overall (per Hooktheory chord
 * analysis: chorus is A - C#m7/G# - F#m - D = I - iii/3 - vi - IV in A).
 */
export const takeOnMe: Track = {
  id: 'take-on-me',
  title: 'Take On Me',
  artist: 'a-ha',
  year: 1985,
  // The famous rotoscoped 1985 video, remastered to 4K in 2019.
  youtubeId: 'djV11Xbc914',
  tempo: 169,
  // 2-bar riff per cycle = 8 beats.
  beatsPerCycle: 8,
  key: 'A major',
  notes:
    'The opening synth was a Roland Juno-60, often doubled with a DX7. LinnDrum on the beat. The intro riff arpeggiates the Bm and E chords that lead the verse.',
  stages: [
    {
      id: 'lead-riff',
      label: 'The synth lead',
      lesson: 'take-on-me',
      description: 'The 2-bar arpeggio riff that opens the song.',
      // 2 bars per cycle, 16 8th notes total. Bar 1 has 5 notes (mostly 8ths
      // + rests); bar 2 has 7 notes. The exact rhythm in the original is
      // slightly more syncopated, but a straight-8ths approximation captures
      // the famous pattern.
      code: `setcpm(169/8)
note("f#4 f#4 d4 b3 b3 ~ ~ ~ e4 e4 e4 g#4 g#4 a4 b4 ~")
  .s("sawtooth").lpf(2500).lpq(2)
  .attack(0).decay(.15).sustain(.5).release(.2)`,
    },
  ],
};
