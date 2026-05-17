import type { Track } from './types';

/**
 * Koji Kondo — Super Mario Bros. Overworld Theme (1985). Kondo himself said
 * this was the hardest of the six themes to compose. Written for the NES's
 * two pulse-wave channels + triangle + noise; the melody lives on one of
 * the pulse channels.
 *
 * The opening 4 bars are what everyone air-NES's. We focus on those.
 *
 * Key: C major. Tempo: 100 BPM (with swing).
 *
 * The opening phrase (simplified to straight 16ths for teaching):
 *   Bar 1: E5 E5 ~ E5 ~ C5 E5 ~
 *   Bar 2: G5 ~ ~ ~ G4 ~ ~ ~   (the famous octave drop)
 *
 * Public domain status: copyrighted, but our re-creation is a transcription.
 */
export const marioTheme: Track = {
  id: 'mario-theme',
  title: 'Super Mario Bros. Theme (Overworld)',
  artist: 'Koji Kondo',
  year: 1985,
  // Clean NES soundtrack rip.
  youtubeId: 'iy3qq7zc4EY',
  tempo: 100,
  // 2-bar opening phrase per cycle — the iconic part with the octave drop.
  beatsPerCycle: 8,
  key: 'C major',
  notes:
    'NES pulse-wave melody on top of triangle bass. The percussion channel has swing, but the melody pulses are straight 8ths/16ths. We capture the famous 2-bar opening with the high-G/low-G octave drop.',
  stages: [
    {
      id: 'opening',
      label: 'The opening phrase',
      lesson: 'mario-theme',
      description:
        'The iconic 2-bar opening — the "duh-duh duh duh-duh" then the G5/G4 octave drop that everyone recognizes.',
      // 2 bars per cycle, 8 positions per bar (each position = 8th note).
      // Bar 1: E5 E5 ~ E5 ~ C5 E5 ~  (the famous "duh-duh duh duh-duh" opening)
      // Bar 2: G5 ~ ~ ~ G4 ~ ~ ~     (high G, then a beat later low G — THE octave drop)
      code: `setcpm(100/8)
note("e5 e5 ~ e5 ~ c5 e5 ~ g5 ~ ~ ~ g4 ~ ~ ~")
  .s("square").lpf(2500)
  .attack(0).decay(.15).sustain(.3).release(.15)`,
    },
  ],
};
