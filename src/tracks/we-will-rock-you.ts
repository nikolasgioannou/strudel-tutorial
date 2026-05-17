import type { Track } from './types';

/**
 * Queen — We Will Rock You (1977). The simplest possible song to recreate:
 * two stomps and a clap, looped, with the iconic "We will, we will rock you"
 * chorus vocal on top. The studio drums are actually the band stomping on
 * wooden boards and clapping — a Roland TR-707 gets close in Strudel.
 *
 * The song appears in two lessons:
 *   - Lesson 1: just the stomp-clap (drums alone)
 *   - Lesson 5: the chorus vocal melody joins the stomp-clap (note durations)
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
    'Stomps and claps recorded by the band on wooden boards. The chorus vocal "we will, we will rock you" descends through E minor: G F# E D E E.',
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
      id: 'chorus-vocal',
      label: '+ "We will rock you" vocal',
      lesson: 'we-will-rock-you-solo',
      description:
        'The chorus vocal melody — G F# E D E E in E minor, descending then bouncing back.',
      // The famous chorus hook "we will, we will, rock you" lands on 6 notes:
      // G4 F#4 E4 D4 E4 E4. Rhythm: "we-will-ROCK" twice — each phrase is
      // 8th-8th-quarter (the long note on "ROCK"/"YOU"). 16 16ths per bar =
      // weights 2+2+4+2+2+4 = 16. setcpm(81/4) makes 1 cycle = 1 bar = 4 beats.
      // Source: noobnotes letter notation + standard chorus rhythm transcription.
      code: `setcpm(81/4)
stack(
  sound("bd bd cp ~").bank("RolandTR707"),
  note("g4@2 f#4@2 e4@4 d4@2 e4@2 e4@4")
    .s("sawtooth").lpf(2000).lpq(1)
    .attack(.02).decay(.3).sustain(.5).release(.2)
    .gain(.7)
)`,
    },
  ],
};
