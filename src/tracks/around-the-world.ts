import type { Track } from './types';

/**
 * Daft Punk — Around the World (1997). Built on a single repeating bassline
 * in E minor — Wikipedia/Hooktheory note an "ascending stairs" pattern that
 * climbs A1 → B1 → C2 → D2 → E2 → F#2 and walks back down. The track's
 * defining trick is a slow filter sweep applied to that bassline over many
 * bars: the same notes are constantly opening up and closing down.
 *
 * We use a simplified 8-note evocation of the bassline (not a literal
 * transcription — the real bass has uneven repetitions of each scale tone),
 * so the lesson focuses on the signal-modulated filter, which is the song's
 * real signature.
 */
export const aroundTheWorld: Track = {
  id: 'around-the-world',
  title: 'Around the World',
  artist: 'Daft Punk',
  year: 1997,
  youtubeId: 'K0HSD_i2DvA',
  tempo: 121,
  beatsPerCycle: 4,
  key: 'E minor',
  notes:
    "The bassline outlines an ascending E-minor scale and walks back down. A slow filter sweep on that bassline is the song's signature — most of the production effort goes into automating one parameter.",
  stages: [
    {
      id: 'bass-with-sweep',
      label: 'Bass + filter sweep',
      lesson: 'signals-and-modulation',
      description:
        'Simplified ascending/descending E-minor bassline with a slow sine-wave filter sweep — the Around the World "auto-wah" sound.',
      code: `setcpm(121/4)
note("a1 b1 c2 d2 e2 f#2 e2 d2").s("sawtooth")
  .lpf(sine.range(200, 3000).slow(8))
  .lpq(8)
  .attack(0).decay(.15).sustain(0)`,
    },
  ],
};
