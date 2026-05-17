import type { Track } from './types';

/**
 * Phil Collins — In the Air Tonight (1981). Famous for THE drum fill at
 * ~3:40 and for the "gated reverb" sound that defined 80s drum production.
 * The technique was a combination of an SSL reverse-talkback mic, heavy
 * compression, AND a noise gate — "gated reverb" is a slight oversimplification
 * but captures the essence.
 *
 * The intro is sparse: a Roland CR-78 drum machine running the "Disco 2"
 * preset, a Prophet-5 chord pad, and Phil's vocoded vocals. NO live snare
 * or hi-hat — that's the whole point. Live drums don't enter until the
 * famous fill at ~3:40 of the 5:35 track.
 *
 * Tempo: ~95 BPM (some sources 94-96; commonly counted as half-time of 190).
 * Key: D minor.
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
    "Built almost entirely from a Roland CR-78 drum machine (Disco 2 preset), a Prophet-5 pad, and Collins's vocoded vocal — until the live drums hit at ~3:40. The drum sound combines an SSL talkback mic, heavy compression, and a noise gate (commonly summarized as 'gated reverb').",
  stages: [
    {
      id: 'cr78-and-pad',
      label: 'CR-78 drum machine + atmospheric pad',
      lesson: 'in-the-air-tonight',
      description: 'The sparse intro — CR-78-style drum pattern + a slow-reverbed D minor pad.',
      // The CR-78 intro is famously sparse — no live snare, no live hi-hat.
      // We approximate the CR-78 "Disco 2" feel with a kick on 1 and 3,
      // a quiet rim/click on the off-beat, and the iconic Prophet-5-style
      // pad drowning everything in reverb.
      code: `setcpm(95/4)
stack(
  // CR-78-style sparse pattern: kick on 1 and 3, soft rim/click on the &
  sound("bd ~ bd ~").bank("RolandTR808"),
  sound("~ rim ~ rim").bank("RolandTR808").gain(.3),
  // The atmospheric D minor chord pad — drowning in reverb and delay
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
      description:
        'The ~3:40 moment — gated tom fill that changed 80s drum production. Descending toms with massive reverb.',
      // The actual fill: descending tom roll (high → mid → low → kick).
      // We approximate the gated-reverb signature with tom hits + big room.
      code: `setcpm(95/4)
stack(
  // Toms descending — high, mid, low — with the gated-reverb signature
  sound("[mt mt] [mt mt] [lt lt] [lt lt]").bank("RolandTR808")
    .gain(.9).room(1.2),
  // Kick punches in underneath
  sound("bd ~ bd ~").bank("RolandTR808"),
  // Snare on the backbeat — only enters with the fill, not before
  sound("~ sd ~ sd").bank("RolandTR808").room(.6)
)`,
    },
  ],
};
