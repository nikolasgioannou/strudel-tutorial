# 06 — Audio Effects

Effects in Strudel are method calls on a pattern. Most effects accept *patterns* as their argument, so anything that can be a number can be a time-varying numeric pattern.

```
s("bd*4").gain("[1 .5]*4")           // patterned gain
note("c").lpf(sine.range(200, 2000))  // sine-modulated cutoff
```

Mental model: imagine each event going through a chain of processors. Each `.method(value)` call adds (or sets) a parameter that the audio engine reads when rendering that event.

## Signal chain (rough order)

The order matters because earlier effects feed into later ones. Roughly:

```
sample/synth source
  → speed / accelerate / chop / slice / striate (sample-rate stuff)
  → ADSR envelope
  → filter (lpf / hpf / bpf / vowel)
  → distortion (coarse, crush, shape, distort)
  → tremolo
  → compressor
  → pan
  → phaser
  → postgain
  → split into orbit:
    - dry
    - delay send
    - reverb send
    - sidechain ducking
  → output
```

You don't have to memorize this; just know that filter happens before distortion, and pan happens before reverb.

## Volume and dynamics

| Function | Range | What it does |
|---|---|---|
| `.gain(g)` | typically 0..1.5 | Volume, exponential. `.gain(.5)` is much quieter than `.gain(1)`. |
| `.velocity(v)` | 0..1 | Linear amplitude, multiplied with gain. Conceptually: how hard the note was hit. |
| `.postgain(g)` | unrestricted | Gain applied after FX (so post-distortion, post-reverb). For final taming. |
| `.compressor("thr:ratio:knee:att:rel")` | dB / ratio / dB / sec / sec | Compresses dynamics. `compressor("-20:20:10:.002:.02")` is a slamming bus comp. |

`.gain` is the workhorse. Use patterned gains like `.gain("[1 .5]*4")` to add accents — this is the single most-used technique for "making rhythm feel alive" and the workshop emphasizes it strongly.

## Filters

The most expressive effect in Strudel. Filters shape the *spectrum* of a sound.

| Function | Aliases | Range | What it does |
|---|---|---|---|
| `.lpf(hz)` | `cutoff`, `ctf`, `lp` | 0..20000 Hz | Low-pass: passes frequencies below cutoff |
| `.lpq(q)` | `resonance` | 0..50 | Low-pass resonance (peak at cutoff) |
| `.hpf(hz)` | `hp`, `hcutoff` | 0..20000 | High-pass: passes above cutoff |
| `.hpq(q)` | `hresonance` | 0..50 | High-pass resonance |
| `.bpf(hz)` | `bandf`, `bp` | 0..20000 | Band-pass: passes a window around hz |
| `.bpq(q)` | `bandq` | 0..50 | Band-pass Q (narrowness) |
| `.ftype(t)` | | `12db`/`ladder`/`24db` | Filter topology |
| `.vowel(letter)` | | `a e i o u ae aa oe ue y uh un en an on` | Formant filter (sounds like a vowel sound) |

Conceptually:

- **Low-pass** at low cutoff = muffled, dark; at high cutoff = unaffected. Sweeping it = the classic "wah" filter motion.
- **High-pass** at low cutoff = unaffected; at high cutoff = thin, hollow. Used to clean up bass from non-bass elements.
- **Band-pass** = a sliver of frequencies, the rest gone.
- **Vowel** = sounds like the human vocal tract speaking that vowel — a band-pass-like filter tuned to vowel formants.

Resonance (`q`) emphasizes the cutoff frequency. Low Q = gentle slope; high Q = a peak that can self-oscillate. Synth leads typically have Q around 5–15.

The filter cutoff can be patterned for rhythmic effect (`.lpf("400 800 400 800")`) or modulated continuously by signals (`.lpf(sine.range(200, 2000).slow(4))`).

## Filter envelopes

Each filter has its own ADSR envelope that modulates the *cutoff*:

| Function | Aliases | What it does |
|---|---|---|
| `.lpa(s)` | `lpattack` | Low-pass envelope attack time (seconds) |
| `.lpd(s)` | `lpdecay` | Low-pass envelope decay |
| `.lps(level)` | `lpsustain` | Low-pass envelope sustain (0..1) |
| `.lpr(s)` | `lprelease` | Low-pass envelope release |
| `.lpe(amount)` | `lpenv` | Modulation depth in semitones; **negative values invert** |

Conceptual usage: `note("c").lpf(400).lpa(.1).lpenv(4)` plays the note with cutoff starting at 400 Hz, sweeping up by 4 octaves over 0.1s, then settling. That's the classic "synth pluck" sound.

Same pattern with `hp*` and `bp*` prefixes for high-pass and band-pass envelopes.

## Amplitude envelope (ADSR)

```
.attack(s)    // alias .att
.decay(s)     // alias .dec
.sustain(level)  // alias .sus
.release(s)   // alias .rel
.adsr("a:d:s:r")  // shorthand for all four
```

ADSR shapes the volume contour of each event:
- **Attack**: time from silence to peak
- **Decay**: time from peak to sustain level
- **Sustain**: held volume while the note is on
- **Release**: time from note-off back to silence

Conceptually:
- Quick AD, no sustain → percussive plucks.
- Long attack → strings, pads.
- Long release → ambient swells.

`adsr(".1:.1:.5:.2")` is the colon-shorthand. Each value is a pattern, so you can vary individual ADSR parameters.

## Pitch envelope

Modulates pitch over the event's life — useful for kick drums (pitch sweep down), zaps, FM-style slides:

| Function | Aliases | What it does |
|---|---|---|
| `.patt(s)` / `.pattack` | | Pitch envelope attack |
| `.pdec(s)` / `.pdecay` | | Pitch envelope decay |
| `.prel(s)` / `.prelease` | | Pitch envelope release |
| `.penv(semitones)` | | Modulation depth (positive = up, negative = down) |
| `.pcurve(0..1)` | | 0 = linear, 1 = exponential |
| `.panchor(0..1)` | | Where on the envelope the original note sits |

Conceptually `note("c").penv(-12).pdec(.5)` plays C, but the pitch starts an octave higher and sweeps down to C over 0.5 seconds.

## Delay

| Function | Aliases | What it does |
|---|---|---|
| `.delay(level)` | | Send level (0..1) — how much goes into the delay |
| `.delaytime(s)` | `delayt`, `dt` | Delay time in seconds |
| `.delayfeedback(0..1)` | `delayfb`, `dfb` | How much output feeds back in (>1 = run-away) |

Mini-notation shortcut: `.delay("0.65:0.25:0.9")` = level 0.65, time 0.25s, feedback 0.9.

Conceptually delay = "echo." Fast delay times (`.delaytime(.06)`) = flutter / metallic shimmer. Long delay times (`.delaytime(.5)`) = audible repeats. Feedback near 0 = single echo; near 1 = forever-decaying tail.

## Reverb

| Function | Aliases | What it does |
|---|---|---|
| `.room(level)` | | Send level to reverb (0..1) |
| `.roomsize(0..10)` | `rsize`, `sz`, `size` | Reverb size — bigger = longer |
| `.roomfade(s)` | `rfade` | Decay time |
| `.roomlp(hz)` | `rlp` | Low-pass on the reverb tail |
| `.roomdim(hz)` | `rdim` | Spectral darkening of tail |
| `.iresponse(sample)` | `ir` | Impulse-response convolution sample |

Conceptually: reverb = "space." Small room = subtle depth; large hall = washes everything together. Use `.roomsize(0.5)` and `.room(0.4)` as a starting point.

**Gotcha**: changing roomsize/fade/lp/dim recalculates the reverb impulse response. Don't pattern these rapidly; they're for setting a space, not modulating.

`.iresponse()` lets you convolve with a sampled impulse response (e.g., a real concert hall) for ultra-realistic reverb — uncommon in live coding but available.

## Distortion / waveshaping

| Function | Aliases | What it does |
|---|---|---|
| `.coarse(n)` | | Bit-rate reduction (1=normal, 2=half, 4=quarter). Chromium-only. |
| `.crush(depth)` | | Bit depth reduction (1=heavy, 16=light) |
| `.distort(amt)` | `.dist`, `.shape` | Wave-shape distortion |

`.distort("3:0.5")` = amount 3, postgain 0.5. `.distort("3:0.5:diode")` = explicit shape (diode-style soft clip).

Conceptually distortion adds harmonics. Light = warmth; heavy = grit; extreme = noise. `crush` is a different flavor — digital aliasing, lo-fi. `coarse` is sample-rate-reduction (8-bit Game Boy sound).

## Modulation effects

### Tremolo (amplitude modulation)

```
.tremsync(rate)         // rate in cycles
.tremdepth(0..1)
.tremshape("sine")      // sine | square | tri | saw | ramp
.tremskew(0..1)
.tremphase(0..1)
```

Conceptually: gain modulated periodically. Slow = "pulse"; fast = "tremolo guitar"; very fast = "ring mod" territory.

### Vibrato (pitch modulation)

```
.vib(rate)              // rate in Hz, alias .v
.vibmod(semitones)      // depth, alias .vmod
```

Shorthand: `.vib("4:.5")` = 4 Hz rate, 0.5 semitone depth. Conceptually: pitch wobbling around the center note.

### Phaser

```
.phaser(rate)           // alias .ph
.phaserdepth(0..1)      // alias .phd
.phasercenter(hz)       // alias .phc, default 1000
.phasersweep(hz)        // alias .phs, default 2000
```

A phaser is a series of all-pass filters with sweeping cutoffs. Conceptually: a swirling, watery sound.

## Panning

| Function | What it does |
|---|---|
| `.pan(0..1)` | 0 = full left, 0.5 = center, 1 = full right |

Patternable: `.pan("0 1")` alternates left/right. `.pan(sine.range(.3, .7))` slowly auto-pans.

For stereo *content* manipulation see `jux` in `07-pattern-transforms.md`.

## Sidechain ducking

```
.duckorbit(2)           // duck against orbit 2's volume
.duckattack(s)          // alias .duck.att
.duckdepth(0..1)
```

When the targeted orbit plays loud, this signal gets quieter. Classic house "pumping" technique driven by the kick drum.

## Orbits

```
.orbit(2)               // alias .o(2)
```

An "orbit" is an FX-bus group. By default everything's on orbit 1, sharing one delay and one reverb. Putting different patterns on different orbits gives them independent FX.

```
$: s("bd sd").delay(.4).delaytime(.5)         // orbit 1 delay
$: s("hh*8").delay(.6).delaytime(.06).orbit(2) // orbit 2 has a different delay setting
```

Without orbits, the second pattern's delay settings would just override the first.

## LFO (audio-rate modulation)

`.lfo({...})` lets you attach a low-frequency oscillator to any parameter:

```
s("saw").lfo({c: 'gain', rate: "<2 4>", depth: 0.5, shape: 'sine'})
```

Parameters:
- `c` / `control` — which parameter to modulate (`gain`, `lpf`, etc.)
- `r` / `rate` — modulation rate
- `s` / `sync` — sync to cycles vs free-running
- `dep` / `dr` / `depth` — modulation depth (relative)
- `da` / `depthabs` — absolute depth
- `dc` / `dcoffset` — DC offset
- `sh` / `shape` — `0`=triangle, `1`=sine, `2`=ramp, `3`=saw, `4`=square
- `sk` / `skew` — waveform skew
- `curve` — curvature

This is more capable than just multiplying a parameter by `sine`, because LFO operates at audio rate (faster than per-event sampling) — it can do *true* continuous modulation.

## Visualization "effects" (don't make sound)

These are pattern decorators that affect the visualizer, not the audio. They're prefixed with `_` for in-line versions:

| Function | What it does |
|---|---|
| `.color("cyan")` | Highlight color in the editor |
| `.markcss('text-decoration:underline')` | CSS override |
| `._scope()` | Time-domain oscilloscope |
| `._spectrum()` | Frequency-domain spectrum |
| `._pianoroll(opts)` | Pianoroll view |
| `._punchcard(opts)` | Pattern-as-punchcard view |
| `._spiral(opts)` | Spiral cycle view |
| `._pitchwheel(opts)` | Pitch-circle view |

Useful for live performance when you want a visual.

## Patternability quick reference

Most parameters can be patterned. Notable exceptions are reverb's `roomsize`/`roomfade`/`roomlp`/`roomdim` (which recalculate state and shouldn't change rapidly) and CSound parameters (limited to a few values).

Continuous-modulation-friendly (sample between events): ADSR envelopes, filter envelopes, pitch envelope, tremolo, phaser, vibrato, LFO, ducking. Everything else samples at event onset.

## A typical "pluck synth" recipe (just to anchor everything)

```
note("c3 eb3 g3 bb3")
  .s("sawtooth")        // synth source
  .lpf(800)             // tame the high end
  .lpq(8)               // some resonance
  .lpa(.05)             // fast attack on filter
  .lpenv(4)             // filter sweeps up by 4 semitones-equivalent
  .attack(.001)         // very fast amp attack
  .decay(.15)           // amp drops to sustain in 150ms
  .sustain(0)           // no sustain — full pluck
  .release(.05)         // quick release
  .gain(.5)             // moderate volume
  .room(.3)             // a bit of reverb
```

Once I see this I should be able to read it as: "play these notes on a sawtooth, with a snappy filter envelope, no sustain, in a small reverb space." The conceptual pieces are filter shape (`lpf`, `lpq`), filter envelope (`lpa`, `lpenv`), amp envelope (ADSR), and reverb send.
