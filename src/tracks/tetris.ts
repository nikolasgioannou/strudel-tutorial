import type { Track } from './types';

/**
 * Korobeiniki ("Peddlers") — Russian folk song from 1861, based on a poem
 * by Nikolay Nekrasov. Outside Russia it's known almost exclusively as the
 * Tetris theme: Hirokazu Tanaka arranged it for Nintendo's Game Boy in
 * 1989, and it's been the canonical Tetris music ever since. The Tetris
 * Company requires its inclusion in every release of the game.
 *
 * The melody is in A minor and has the perfect "scale + alternation"
 * shape for teaching melodies in Strudel — it's almost entirely a
 * stepwise walk through the A minor scale.
 *
 * Public domain (1861 folk song).
 */
export const tetris: Track = {
  id: 'tetris',
  title: 'Korobeiniki (Tetris Theme)',
  artist: 'Traditional Russian / arr. Hirokazu Tanaka',
  year: 1989,
  // Original Game Boy 8-bit recording — fan extension.
  youtubeId: 'NmCCQxVBfyM',
  // Game Boy original runs at ~150 BPM (speeds up to ~225 BPM as the stack
  // gets tall). Piano tutorials often slow it to ~120-125 for playability;
  // we use 150 to match the actual Game Boy speed.
  tempo: 150,
  // The famous A-section is 4 bars; we'll fit it in one cycle.
  beatsPerCycle: 16,
  // The Game Boy chiptune actually sounds in E minor; piano transcriptions
  // are conventionally written in A minor for readability — we use A minor
  // here for the same reason.
  key: 'A minor (Game Boy chiptune is E minor; A minor is the conventional piano key)',
  notes:
    'The Game Boy "Type A" theme. Almost entirely stepwise motion through the A minor scale (A B C D E F G). Mostly 8th notes; bar 3 hits held A notes.',
  stages: [
    {
      id: 'a-section',
      label: 'The A-section melody',
      lesson: 'tetris',
      description: 'The famous 4-bar opening — the part you immediately recognize.',
      // 4 bars per cycle at 124 BPM via setcpm(124/16). Each top-level []
      // is 1 bar of 8 8th notes (or whatever subdivision adds up to 8).
      // Bars 1-3 are 8 8th notes; bar 4 has a held A with a pickup.
      // Melody source: standard Game Boy transcription (Hirokazu Tanaka).
      code: `setcpm(124/16)
note(\`[e5 b4 c5 d5 c5 b4 a4 a4]
      [c5 e5 d5 c5 b4 b4 c5 d5]
      [e5 e5 c5 c5 a4 a4 a4 ~]
      [d5 d5 f5 a5 g5 f5 e5 e5]\`)
  .s("piano")`,
    },
  ],
};
