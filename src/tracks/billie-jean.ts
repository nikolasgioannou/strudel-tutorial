import type { Track } from './types';

/**
 * Michael Jackson — Billie Jean (1982). Drums played live by Ndugu Chancler
 * (not the LinnDrum, despite what's often claimed). Bass played by Louis
 * Johnson on a Yamaha BB1200 — busy 8th notes that never rest longer than
 * one 8th and centre on F# minor with its 5th (C#).
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
    'Drums played live by Ndugu Chancler on a real kit. Bass by Louis Johnson. We will revisit this song to add chords and the synth lead as we learn them.',
  stages: [
    {
      id: 'drums',
      label: 'Drums',
      lesson: 'billie-jean',
      description: 'Kick on beats 1 and 3, snare on 2 and 4, hi-hat 8ths.',
      code: `setcpm(117/4)
sound("bd ~ bd ~, ~ sd ~ sd, hh*8")`,
    },
    {
      id: 'with-bass',
      label: '+ Bass',
      lesson: 'billie-jean-bass',
      description:
        "Louis Johnson's iconic 8-note intro/verse bassline: F# C# E F# E C# B C# in straight 8ths.",
      // Pitches decoded from the bass tab (D string frets 4-2-4-2 and A string
      // frets 4-4-2-4, interleaved). The 4th (B1) is a passing tone walking
      // back up to C#2 — the move that gives the line its slithery feel.
      code: `setcpm(117/4)
stack(
  sound("bd ~ bd ~, ~ sd ~ sd, hh*8"),
  note("f#2 c#2 e2 f#2 e2 c#2 b1 c#2").s("gm_acoustic_bass")
)`,
    },
  ],
};
