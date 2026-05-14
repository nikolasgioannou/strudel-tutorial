import type { Track } from './types';

/**
 * Phil Collins — In the Air Tonight (1981). Famous for THE drum fill at
 * 3:16 and for the "gated reverb" sound that defined 80s drum production
 * (later debated — Collins and Padgham say it was a heavily compressed
 * talkback mic, not literal gating).
 *
 * The first 3+ minutes are just a Roland CR-78 drum machine, an
 * atmospheric pad, and Phil's vocal. Then the live drums explode in. We
 * focus on the atmospheric front half — sparse drum machine + huge
 * reverb space — because that's where the song lives most of the time.
 *
 * Tempo commonly stated as 95 BPM (half-time feel) or 190 BPM (full-time).
 * We'll use the half-time 95 BPM count since that matches how the song
 * actually grooves.
 */
export const inTheAirTonight: Track = {
  id: 'in-the-air-tonight',
  title: 'In the Air Tonight',
  artist: 'Phil Collins',
  year: 1981,
  youtubeId: 'YkADj0TPrJA',
  tempo: 95,
  beatsPerCycle: 4,
  key: 'D minor',
  notes:
    "Built almost entirely from Roland CR-78 drum machine, an atmospheric pad, and Collins's vocal — until the live drums hit at 3:16. The mix is huge: lots of reverb and delay on everything.",
  stages: [
    {
      id: 'cr78-and-pad',
      label: 'Drum machine + atmospheric pad',
      lesson: 'in-the-air-tonight',
      description: 'Sparse CR-78-style drum machine pattern with a long-reverbed pad.',
      // The CR-78 intro has a relentless hi-hat and very sparse kick/snare.
      // We approximate with Strudel's defaults and a big room/delay.
      code: `setcpm(95/4)
stack(
  // Sparse drum machine — kick on 1, snare on 3, hat throughout
  sound("bd ~ ~ ~").bank("RolandTR808"),
  sound("~ ~ sd ~").bank("RolandTR808").room(.8),
  sound("hh*8").bank("RolandTR808").gain(.4),
  // The atmospheric chord pad — D minor, in shadow
  note("[d3,f3,a3]")
    .s("sawtooth").lpf(800)
    .attack(.5).decay(.5).sustain(.7).release(2)
    .gain(.3).room(1.5).delay(.5).delaytime(.5).delayfeedback(.4)
)`,
    },
    {
      id: 'the-fill',
      label: 'THAT drum fill',
      lesson: 'in-the-air-tonight',
      description: 'The 3:16 moment — gated-reverb tom fill that changed 80s drum production.',
      // Phil's fill is a famously simple tom roll, made enormous by the
      // gated/compressed mic technique. We approximate with the gated reverb
      // sound by stacking tom hits with massive reverb that "snaps off" via
      // short release.
      code: `setcpm(95/4)
stack(
  // Toms descending — high, mid, low — with the gated-reverb signature
  sound("[mt mt] [mt mt] [lt lt] [lt lt]").bank("RolandTR808")
    .gain(.9).room(1.2),
  // Kick punches in underneath
  sound("bd ~ bd ~").bank("RolandTR808"),
  // Snare on the backbeat
  sound("~ sd ~ sd").bank("RolandTR808").room(.6)
)`,
    },
  ],
};
