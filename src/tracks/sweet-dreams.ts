import type { Track } from './types';

/**
 * Eurythmics — Sweet Dreams (Are Made of This) (1983). Annie Lennox + Dave
 * Stewart, recorded in an 8-track upstairs studio after Stewart's previous
 * band fell apart. The drum machine is the rare Movement Systems MCS Drum
 * Computer (a ~30-unit British prototype), NOT a LinnDrum. The bass is
 * sequenced from a Roland SH-101 via the Movement; an Oberheim OB-X
 * provides the sustained string pad. Lennox's vocal carries the melody.
 *
 * Stewart paraphrased the writing process in interviews — he wanted a
 * contrasting middle section that felt positive ("hold your head up,
 * moving on") to lift the song's predominantly minor mood.
 *
 * The track is one of the cleanest examples in pop of repetition +
 * layering doing all the work. Two bars of chord changes, looped for
 * almost the entire song, with a contrasting 2-bar bridge.
 *
 * Note: Strudel doesn't ship the Movement MCS samples, so we use LinnDrum
 * in the code below — close in vibe but historically wrong. Treat
 * LinnDrum here as a "best available approximation," not historical
 * accuracy.
 */
export const sweetDreams: Track = {
  id: 'sweet-dreams',
  title: 'Sweet Dreams (Are Made of This)',
  artist: 'Eurythmics',
  year: 1983,
  youtubeId: 'qeMFqkcPYcg',
  tempo: 126,
  // The whole song moves in 2-bar units. 1 cycle = 2 bars = 8 beats.
  beatsPerCycle: 8,
  key: 'C minor',
  notes:
    'Iconic 2-bar pattern: Cm | Ab Gm. Bridge: Cm | F. A Roland SH-101 sequenced by ' +
    'the rare Movement MCS Drum Computer plays the 16-eighth-note bass riff (C-Eb-C / ' +
    'Ab-C-G-C) that anchors the song. The MCS also handles drums — a 4-on-the-floor ' +
    'kick with backbeat snare and 8th-note hats. We approximate the MCS with LinnDrum.',
  stages: [
    {
      id: 'bass-riff',
      label: 'The bass riff',
      lesson: 'sweet-dreams-bass',
      description: 'The 16-eighth-note synth bass riff that drives the song.',
      // 16 eighth notes over 2 bars at 126 BPM, in C minor.
      // Bar 1 (Cm): C C C C Eb Eb C C
      // Bar 2 (Ab→Gm): Ab Ab Ab C G G G C
      // Source: MusicRadar tutorial transcription, confirmed by Music Dept
      // Rockschool sheet music.
      code: `setcpm(126/8)
note("c2 c2 c2 c2 eb2 eb2 c2 c2 ab1 ab1 ab1 c2 g1 g1 g1 c2")
  .s("square").lpf(900).lpq(3)
  .attack(0).decay(.2).sustain(0)`,
    },
    {
      id: 'drums',
      label: 'Drums alone',
      lesson: 'sweet-dreams-bass',
      description: 'LinnDrum-style 4-on-floor with backbeat and 8th-note hats.',
      code: `setcpm(126/8)
stack(
  sound("bd*8").bank("LinnDrum"),
  sound("[~ sd]*4").bank("LinnDrum").gain(.8),
  sound("hh*16").bank("LinnDrum").gain(.5)
)`,
    },
    {
      id: 'verse',
      label: 'Verse (bass + drums + pad)',
      lesson: 'sweet-dreams-full',
      description: 'Full verse texture — bass riff, drums, sustained chord pad.',
      // Chord weights: chord 1 = 1 bar (half the 2-bar cycle), chords 2+3
      // each get half a bar. Explicit [note,note,note] stacks instead of
      // chord().voicing() so we control the octave exactly — voicing()'s
      // default anchor was picking the chord too high and floating it
      // off the bass.
      code: `setcpm(126/8)
stack(
  note("c2 c2 c2 c2 eb2 eb2 c2 c2 ab1 ab1 ab1 c2 g1 g1 g1 c2")
    .s("square").lpf(900).lpq(3)
    .attack(0).decay(.2).sustain(0).gain(.7),
  sound("bd*8").bank("LinnDrum"),
  sound("[~ sd]*4").bank("LinnDrum").gain(.8),
  sound("hh*16").bank("LinnDrum").gain(.5),
  note("[c4,eb4,g4]@2 [ab3,c4,eb4] [g3,bb3,d4]")
    .s("sawtooth")
    .attack(.05).decay(.3).sustain(.8).release(.4)
    .lpf(1500).gain(.25).room(.4)
)`,
    },
    {
      id: 'bridge',
      label: 'Bridge variation',
      lesson: 'sweet-dreams-full',
      description: 'The contrasting 2-bar bridge — Cm | F instead of Cm | Ab Gm.',
      code: `setcpm(126/8)
stack(
  note("c2*8 f2*8")
    .s("square").lpf(900).lpq(3)
    .attack(0).decay(.2).sustain(0).gain(.7),
  sound("bd*8").bank("LinnDrum"),
  sound("[~ sd]*4").bank("LinnDrum").gain(.8),
  sound("hh*16").bank("LinnDrum").gain(.5),
  note("[c4,eb4,g4] [f3,a3,c4]")
    .s("sawtooth")
    .attack(.05).decay(.3).sustain(.8).release(.4)
    .lpf(1500).gain(.25).room(.4)
)`,
    },
    {
      id: 'full',
      label: 'Full arrangement',
      lesson: 'sweet-dreams-full',
      description: 'Verse → bridge → verse using arrange() to sequence sections.',
      // arrange() takes [cycles, pattern] pairs and plays them sequentially.
      // Drums and hats run throughout; the bass and chords change per section.
      code: `setcpm(126/8)
stack(
  // Drums hold steady through the whole arrangement
  sound("bd*8").bank("LinnDrum"),
  sound("[~ sd]*4").bank("LinnDrum").gain(.8),
  sound("hh*16").bank("LinnDrum").gain(.5),
  // Bass switches between verse riff and bridge pattern
  arrange(
    [4, note("c2 c2 c2 c2 eb2 eb2 c2 c2 ab1 ab1 ab1 c2 g1 g1 g1 c2")],
    [2, note("c2*8 f2*8")],
    [4, note("c2 c2 c2 c2 eb2 eb2 c2 c2 ab1 ab1 ab1 c2 g1 g1 g1 c2")]
  ).s("square").lpf(900).lpq(3)
    .attack(0).decay(.2).sustain(0).gain(.7),
  // Chord pad — explicit voicings, switches with the bass
  arrange(
    [4, note("[c4,eb4,g4]@2 [ab3,c4,eb4] [g3,bb3,d4]")],
    [2, note("[c4,eb4,g4] [f3,a3,c4]")],
    [4, note("[c4,eb4,g4]@2 [ab3,c4,eb4] [g3,bb3,d4]")]
  ).s("sawtooth")
    .attack(.05).decay(.3).sustain(.8).release(.4)
    .lpf(1500).gain(.25).room(.4)
)`,
    },
  ],
};
