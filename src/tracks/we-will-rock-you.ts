import type { Track } from './types';

/**
 * Queen — We Will Rock You (1977). The simplest possible song to recreate:
 * two stomps and a clap, looped. The recording uses body percussion, but a
 * vintage Roland TR-707 sample bank gets close.
 */
export const weWillRockYou: Track = {
  id: 'we-will-rock-you',
  title: 'We Will Rock You',
  artist: 'Queen',
  year: 1977,
  youtubeId: '-tJYN-eG1zk',
  tempo: 81,
  beatsPerCycle: 2,
  key: 'C major',
  notes:
    'The studio recording uses stomps and claps recorded by the band rather than drums. We approximate it with a Roland TR-707.',
  stages: [
    {
      id: 'drums',
      label: 'Drums',
      lesson: 'we-will-rock-you',
      description: 'The stomp-stomp-clap groove.',
      code: `setcpm(81/2)
sound("bd*2 cp").bank("RolandTR707")`,
    },
  ],
};
