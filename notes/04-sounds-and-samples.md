# 04 — Sounds and Samples

## The two functions

```
s("bd hh")        // sound by name
sound("bd hh")    // alias of s
```

`s` and `sound` are the same function. Both take a pattern of strings and produce events whose value is "play this sound." Use `s` for brevity, `sound` for clarity.

A "sound" can be:

1. A **sample name** like `bd`, `hh`, `sd` (drum samples loaded by default).
2. A **drum-machine-prefixed sample** like `RolandTR909_bd` (or just `bd` after `.bank("RolandTR909")`).
3. A **GM soundfont preset** like `gm_epiano1`, `gm_acoustic_bass`, `piano`.
4. A **synth waveform** like `sawtooth`, `square`, `triangle`, `sine`, `pulse`.
5. A **noise type** like `white`, `pink`, `brown`, `crackle`.
6. A **wavetable** like `wt_flute` (after loading the bubo waveforms pack).
7. A **ZZFX preset** like `z_sawtooth`, `z_tan`.
8. A **custom-loaded sample** registered via `samples({…})`.

The same function plays all of these. The dispatch is by name — Strudel looks up the name in its registries and decides whether to play a sample, run a synth, or generate noise.

## Default drum sample names

Strudel auto-loads the **dirt-samples** library on first play. These abbreviations come from TidalCycles tradition:

| Name | Sound |
|------|-------|
| `bd` | bass drum / kick |
| `sd` | snare drum |
| `hh` | closed hi-hat |
| `oh` | open hi-hat |
| `cp` | clap |
| `rim` | rimshot |
| `cb` | cowbell |
| `cr` | crash cymbal |
| `rd` | ride cymbal |
| `lt`, `mt`, `ht` | low / mid / high tom |
| `sh` | shaker |
| `tb` | tambourine |
| `perc` | percussion (generic) |
| `misc` | miscellaneous |
| `fx` | sound effects |

There are *many* more in the dirt-samples library — `casio`, `jazz`, `metal`, `east`, `crow`, `wind`, `space`, `numbers`, `insect`, `breath`, `gong`, `woodblock`, `psaltery_pluck`, etc. The workshop intentionally exposes the weird ones to show off Strudel's range.

## `bank(name)` — switch drum machines

```
sound("bd hh sd hh").bank("RolandTR909")
```

`.bank()` *prefixes* the bank name onto every sound name. So `"bd"` becomes `"RolandTR909_bd"`. This lets you write a generic drum pattern and switch between physical drum-machine sounds:

- `RolandTR808` — classic 808 boom
- `RolandTR909` — house/techno workhorse
- `RolandTR707` — punchy, snappy
- `RolandTR606` — small drum kit
- `RolandTR505`, `RolandTR727`
- `AkaiLinn`, `AkaiMPC60`
- `RhythmAce`, `KorgMinipops`
- `LinnDrum`, `OberheimDX`, `EmuDrumulator`, `EmuSP12`, `MFB512`
- `RolandCR78`, `RolandCR8000`
- `RolandCompurhythm1000`
- `ViscoSpaceDrum`, `CasioRZ1`
- `Yamaha`, `Casio`

Bank names can themselves be patterns: `.bank("<RolandTR808 RolandTR909>/4")` switches every 4 cycles.

**Subtlety**: not every bank has every drum name. `RolandTR909` has `bd`, `sd`, `hh`, `oh`, `cp`, `rim`, `rd`, `cr`. Some banks lack toms or claps. You'll discover this by trial and error (or peeking at the sounds tab in the REPL).

## `n(pat)` — sample variant index

Most drum samples have multiple variants. `bd:0` is the first kick, `bd:1` is a different kick, etc. Two ways to choose:

```
"bd:0 bd:1 bd:2"           // inline mini-notation
n("0 1 2").s("bd")         // separate variant pattern
```

Both produce the same events. The separate `n()` form is more flexible — you can apply transforms to just the variant pattern (like `n("0 1 2").every(2, rev)`).

If you ask for a variant that doesn't exist (`bd:7` when there are only 4 variants), Strudel wraps with modulo. So `bd:7` with 4 variants becomes `bd:3`.

**The double role of `n`:** when there's no `.scale()` in scope, `n()` is a sample variant selector. With `.scale()` in scope, `n()` becomes a scale-degree selector. This is intentional — the same numeric pattern means "pick from a list" in both cases, just the list changes.

## GM soundfonts — `gm_*` and `piano`

Strudel ships with GeneralMIDI soundfont synths. They're synthesized (not sampled), so they don't need to download — they're available immediately:

```
note("c e g").s("piano")
note("c2").s("gm_acoustic_bass")
```

Names you'll see in examples:

- `piano` — straight piano (most common)
- `gm_epiano1`, `gm_epiano2` — electric piano (Rhodes-ish)
- `gm_acoustic_bass`, `gm_synth_bass_1`, `gm_synth_bass_2`, `gm_electric_bass_finger`
- `gm_electric_guitar_clean`, `gm_electric_guitar_muted`, `gm_acoustic_guitar_steel`
- `gm_synth_strings_1`, `gm_tremolo_strings`, `gm_violin`
- `gm_xylophone`, `gm_marimba`, `gm_vibraphone`
- `gm_accordion`, `gm_harmonica`, `gm_ocarina`, `gm_blown_bottle`
- `gm_voice_oohs`
- (Most of the GM soundfont catalog with `gm_` prefix)

## Synth waveforms

Pass a waveform name to `s()`/`.sound()` and Strudel synthesizes:

- `sine` — pure tone
- `sawtooth` (alias `saw`) — rich harmonic content
- `square` — odd-harmonic-only
- `triangle` — softer than square
- `pulse` — variable-width square (use `pw()` to vary)
- `white`, `pink`, `brown` — noise types (decreasingly bright)
- `crackle` — percussive crackle (use `density()` to control)

Default: when you call `note()` without `s()`, the synth defaults to `triangle`.

## `samples()` — loading custom samples

```
samples({
    bassdrum: 'bd/BT0AADA.wav',
    snaredrum: ['sd/01.wav', 'sd/02.wav'],     // array → :index access
    moog: { g3: 'moog/g3.wav', g4: 'moog/g4.wav' },  // pitched map
}, 'https://example.com/samples/');
```

`samples(map, baseUrl?)` registers a sample dictionary. Keys are sound names; values can be:

- A **single URL** (relative to `baseUrl`) — one variant.
- An **array of URLs** — multiple variants accessible via `:0`, `:1`, etc.
- An **object mapping note names to URLs** — pitched samples; Strudel auto-pitch-shifts to the requested note.

### GitHub shortcut

```
samples('github:tidalcycles/dirt-samples')
samples('github:eddyflux/crate')
samples('github:tidalcycles/dirt-samples/master')   // explicit branch
```

Loads a sample pack from a GitHub repo (the repo needs a `strudel.json` index file at the root, which most published packs have). Defaults to `main` branch.

### strudel.json shortcut

```
samples('https://raw.githubusercontent.com/.../strudel.json')
```

Direct URL to a `strudel.json` describing the pack.

### Shabda integration

```
samples('shabda:bass:4,hihat:4')                 // freesound search
samples('shabda/speech:hello,world')             // text-to-speech
```

Queries freesound.org or generates speech samples on the fly. Useful for prototyping.

### Local sampler

```
samples('http://localhost:5432/')
```

Run `npx @strudel/sampler` in a folder full of `.wav` files; it serves them with auto-generated `strudel.json`.

## Pitched samples

This deserves a separate note because it's powerful:

```
samples({
    moog: {
        g2: 'moog/g2.wav',
        g3: 'moog/g3.wav',
        g4: 'moog/g4.wav',
    }
}, 'github:tidalcycles/dirt-samples')

note("c2 c3 c4").s("moog")
```

When the pattern asks for `c3`, Strudel finds the nearest mapped sample (`g3`), then pitch-shifts it (by 5 semitones) to play the requested note. With samples at every octave, you get reasonable cross-range fidelity. With samples every few semitones, you get studio-quality sampler behavior.

## Sample-manipulation effects

These are technically audio effects but they're sample-specific so I list them here:

| Function | What it does |
|----------|--------------|
| `.begin(0.2)` | Start playback 20% into the sample |
| `.end(0.5)` | Stop at 50% (combined with `.begin`, this trims the sample) |
| `.loop(1)` | Loop the sample (default off) |
| `.loopBegin(.2)` / `.loopEnd(.8)` | Loop region (only meaningful with `.loop(1)`) |
| `.cut(1)` | Cut group: any new sample in group 1 mutes earlier samples in group 1. Tape-deck choke effect. |
| `.clip(.5)` | Multiply event duration (0..1+ scales clip length) |
| `.legato(.5)` | Same as `clip` essentially — note duration scaler |
| `.loopAt(2)` | Play sample over exactly 2 cycles regardless of native length |
| `.fit()` | Resample so the sample fits the event's duration |
| `.chop(8)` | Chop sample into 8 grains, play sequentially |
| `.striate(8)` | Like chop but interleaves grains across all events |
| `.slice(8, "0 1 2 3")` | Slice into 8 named slices, play indexed sequence |
| `.splice(8, "0 1 2 3")` | Like slice but auto-adjusts speed to fit duration |
| `.scrub("0 .5")` | Scrub through sample by position pattern |
| `.speed(2)` | Playback speed (and pitch). Negative = reverse. |
| `.accelerate(.5)` | Speed change over the duration (vinyl-stop effect) |

### Conceptually: chop vs striate vs slice vs splice

These all do "granular sample mangling" but differ in *how* the sample is segmented and reassembled:

- **chop(N)**: cuts into N equal slices, plays them in original order back to back. Adds N events per original event.
- **striate(N)**: cuts into N slices, but for an N-event pattern, each event plays a *different* slice. Spreads slices across pattern events.
- **slice(N, idx)**: splits into N slices, then `idx` is a separate pattern that picks which slice each event plays. Most flexible.
- **splice(N, idx)**: like slice but speeds the playback so each slice fits inside the event duration — keeps tempo lock.

Use `chop` for "stretch a sample across more events" (good for chord stabs). Use `slice` or `splice` for "remix a break beat by reordering its drum hits."

## Ordering — what happens first

Sound rendering pipeline (simplified):
1. Pattern produces an event with `s = "bd:0"`.
2. `bd:0` is resolved to a sample buffer (or synth).
3. Sample-position params apply: `begin`, `end`, `loop*`, `speed`, `chop`/`slice`/...
4. ADSR envelope applies.
5. Audio FX chain applies (filter → distortion → delay → reverb → pan...). See `06-effects.md`.

`.cut()` happens at step 2-3 (kills earlier voices in same cut group).
