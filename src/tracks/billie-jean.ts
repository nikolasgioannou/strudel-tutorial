import type { Track } from './types';

/**
 * Michael Jackson — Billie Jean (1982). Drums played live by Ndugu Chancler
 * on a real kit (not the LinnDrum, despite the common claim). Bass played
 * by Louis Johnson on a Yamaha BB1200 — a busy 8th-note line centred on
 * F# minor and its 5th (C#).
 *
 * Returns across three lessons:
 *   - Lesson 2: just the drums (kick/snare/hi-hat layering)
 *   - Lesson 10: drums + bass + the F#m / G#m7 / C#7 chord pad
 *   - Lesson 16: same groove with probability-based variations
 *     (sometimes/often) to humanize it
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
    'Drums by Ndugu Chancler. Bass by Louis Johnson. Two-chord progression (F#m and G#m7) drives the verse, with a synth pad floating on top. We come back to this song multiple times.',
  stages: [
    {
      id: 'drums',
      label: 'Drums',
      lesson: 'billie-jean-drums',
      description: 'Kick on beats 1 and 3, snare on 2 and 4, hi-hat 8ths.',
      code: `setcpm(117/4)
stack(
  sound("bd ~ bd ~"),
  sound("~ sd ~ sd"),
  sound("hh*8").gain(.6)
)`,
    },
    {
      id: 'full-groove',
      label: '+ Bass + chord pad',
      lesson: 'billie-jean-full',
      description: "Layer Louis Johnson's bassline and a F#m / G#m7 chord pad on top.",
      // The classic verse alternates between F#m and G#m7 chords. Each chord
      // lasts one bar (here, half the 2-bar cycle since we set up the bass
      // to span 2 bars). Bass = Louis Johnson's intro pattern. Pad uses
      // explicit note-stacks for predictable voicing.
      code: `setcpm(117/4)
stack(
  // Drums
  sound("bd ~ bd ~"),
  sound("~ sd ~ sd"),
  sound("hh*8").gain(.6),
  // Bass — F# C# E F# E C# B C# (Louis Johnson, straight 8ths)
  note("f#2 c#2 e2 f#2 e2 c#2 b1 c#2")
    .s("gm_acoustic_bass").gain(.8),
  // Chord pad — F#m and G#m7 alternating per bar
  note("<[f#3,a3,c#4] [g#3,b3,d#4,f#4]>")
    .s("sawtooth").lpf(1500)
    .attack(.05).decay(.3).sustain(.7).release(.4)
    .gain(.25).room(.4)
)`,
    },
    {
      id: 'humanized',
      label: 'Humanized variations',
      lesson: 'billie-jean-humanized',
      description:
        'Same groove with probability-based variations — ghost snare hits, occasional kick doubles, accent flips.',
      // Real drummers don't play exactly the same pattern every bar. They
      // throw in ghost notes, occasional extra kicks, dynamic shifts.
      // sometimes() and often() inject these decorations randomly.
      code: `setcpm(117/4)
stack(
  sound("bd ~ bd ~").sometimes(x => x.fast(2)),
  sound("~ sd ~ sd").often(x => x.gain("1 .5")),
  sound("hh*8").gain(.6).sometimes(x => x.fast(2)),
  note("f#2 c#2 e2 f#2 e2 c#2 b1 c#2")
    .s("gm_acoustic_bass").gain(.8),
  note("<[f#3,a3,c#4] [g#3,b3,d#4,f#4]>")
    .s("sawtooth").lpf(1500)
    .attack(.05).decay(.3).sustain(.7).release(.4)
    .gain(.25).room(.4)
)`,
    },
  ],
};
