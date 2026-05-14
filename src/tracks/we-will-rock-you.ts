import type { Track } from './types';

/**
 * Queen — We Will Rock You (1977). The simplest possible song to recreate:
 * two stomps and a clap, looped, with Brian May's guitar solo arriving only
 * at the very end. The studio drums are actually the band stomping on
 * wooden boards and clapping — a Roland TR-707 gets close in Strudel.
 *
 * The song appears in two lessons:
 *   - Lesson 1: just the stomp-clap (drums alone)
 *   - Lesson 5: the guitar solo joins the stomp-clap (note durations)
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
    'Stomps and claps recorded by the band on wooden boards. Brian May plays the solo on his Red Special at the very end of the track — May himself plays at ♩=80 in the solo section.',
  stages: [
    {
      id: 'drums',
      label: 'Drums',
      lesson: 'we-will-rock-you-drums',
      description: 'The stomp-stomp-clap groove.',
      code: `setcpm(81/2)
sound("bd*2 cp").bank("RolandTR707")`,
    },
    {
      id: 'solo',
      label: '+ Brian May solo',
      lesson: 'we-will-rock-you-solo',
      description: 'A simplified phrase from the guitar solo — held high notes returning to E.',
      // Brian May's actual solo is a complex blend of bends, harmonies, and
      // pinch harmonics that needs many more tools than we have at this point.
      // The shape captured here is the recognizable opening of the solo:
      // sustained F# (the fret-14 note he hammers), returning to open E,
      // with brief excursions up to A and G. Tempo confirmed by the official
      // tab (♩=80) — slightly slower than the rest of the song (♩=81).
      code: `setcpm(80/4)
stack(
  sound("bd*2 cp").bank("RolandTR707"),
  note("f#5@2 a5 f#5 e4 g5 f#5 e5 e4")
    .s("sawtooth").lpf(2200).lpq(2)
    .attack(.01).decay(.4).sustain(.4).release(.3)
    .gain(.7)
)`,
    },
  ],
};
