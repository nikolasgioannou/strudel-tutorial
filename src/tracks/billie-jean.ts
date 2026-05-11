import type { Track } from './types';

/**
 * Michael Jackson — Billie Jean (1982). Drums played live by Ndugu Chancler
 * (not the LinnDrum, despite what's often claimed). We'll come back to this
 * song in later lessons to layer in bass, then chords, then the lead synth.
 */
export const billieJean: Track = {
  id: 'billie-jean',
  title: 'Billie Jean',
  artist: 'Michael Jackson',
  year: 1982,
  youtubeId: 'Zi_XLOBDo_Y',
  tempo: 117,
  beatsPerCycle: 4,
  key: 'F# minor',
  notes:
    'Drums played live by Ndugu Chancler on a real kit. We will revisit this song to add bass, chords, and the synth lead as we learn each.',
  stages: [
    {
      id: 'drums',
      label: 'Drums',
      lesson: 'billie-jean',
      description: 'Kick on beats 1 and 3, snare on 2 and 4, hi-hat 8ths.',
      code: `setcpm(117/4)
sound("bd ~ bd ~, ~ sd ~ sd, hh*8")`,
    },
    // Future stages — uncomment & populate as we add lessons:
    // {
    //   id: 'with-bass',
    //   label: '+ Bass',
    //   lesson: 'first-bass',
    //   description: 'The iconic F# minor bassline.',
    //   code: '...',
    // },
  ],
};
