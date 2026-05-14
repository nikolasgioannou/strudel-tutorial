import type { Track } from './types';

/**
 * The Winstons — Amen, Brother (1969). The 7-second drum solo at 1:26 of this
 * obscure soul B-side became the most-sampled drum break in history: the
 * foundation of jungle, drum and bass, hardcore, and a huge swath of hip-hop.
 * Drummer Gregory Coleman never made a penny from it.
 *
 * Strudel ships the break as the `amen` sample (loaded from
 * `github:tidalcycles/dirt-samples`). We don't recreate it note-by-note —
 * the original is the original — but we use it as raw material for chopping
 * and slicing exercises.
 */
export const amenBreak: Track = {
  id: 'amen-break',
  title: 'Amen, Brother (the break)',
  artist: 'The Winstons',
  year: 1969,
  youtubeId: 'GxZuq57_bYM', // The Winstons - Amen, Brother
  tempo: 130,
  beatsPerCycle: 4,
  key: 'Db major',
  notes:
    'Played by Gregory Coleman as a four-bar drum solo on the B-side "Amen, Brother". Original recording is 130 BPM in Db major; jungle and drum-and-bass producers commonly pitch it up to 165–175 BPM.',
  stages: [
    {
      id: 'straight',
      label: 'The break (looped)',
      lesson: 'sample-chopping',
      // The break is 4 bars long, so 1 cycle = 4 bars (130/16, not 130/4)
      // — otherwise .fit() compresses the whole break into a single bar.
      description: 'The Amen break sample, looped at its original tempo via .fit().',
      code: `samples('github:yaxu/clean-breaks')
setcpm(130/16)
s("amen").fit()`,
    },
    {
      id: 'chopped',
      label: 'Chopped (16 slices)',
      lesson: 'sample-chopping',
      description: 'The same break chopped into 16 even slices played in order.',
      code: `samples('github:yaxu/clean-breaks')
setcpm(130/16)
s("amen").fit().chop(16)`,
    },
    {
      id: 'remixed',
      label: 'Reordered slices',
      lesson: 'sample-chopping',
      description: 'Splice into 8 chunks (speed-matched), alternate in-order and remixed.',
      // .splice() (not .slice()) — same chopping idea, but each slice is
      // speed-stretched to fill its event slot. Without this you get
      // tiny gaps between slices whenever the sample's exact duration
      // doesn't perfectly equal cycle/N. Single outer <> picks one of
      // two 8-event sub-patterns each cycle.
      code: `samples('github:yaxu/clean-breaks')
setcpm(130/16)
s("amen")
  .splice(8, "<[0 1 2 3 4 5 6 7] [0 1 2 3 4*2 5 [6 7]]>")
  .cut(1)`,
    },
  ],
};
