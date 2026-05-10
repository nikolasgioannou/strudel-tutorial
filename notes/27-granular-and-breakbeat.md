# 27 — Granular Synthesis and Breakbeat

Strudel can shred any audio sample into grains, re-order them, time-stretch them, and reassemble them. This is granular synthesis, and it's the entire basis of breakbeat / drum-and-bass / jungle production. The seven core operators: `chop`, `striate`, `slice`, `splice`, `scrub`, `loopAt`, `fit` — plus `cut` for voice-stealing.

## 1. `chop(N)` — slice into N grains, play in order

Each event in the pattern becomes N sub-events, each playing a successive 1/N piece of the sample. The sample plays through across the duration of the original event, broken into grains. Each grain can have per-grain effects.

```js
// Chop a Rhodes loop into 4, reverse, fit to 2 cycles
samples({ rhodes: 'https://cdn.freesound.org/previews/132/132051_316502-lq.mp3' })
s("rhodes").chop(4).rev().loopAt(2)

// Extreme chop = ambient pad from any sample
s("piano:0").loopAt(8).chop(64).gain(.6).room(.8)

// Chord stab: crash chopped into 16, played fast
s("crash").chop(16).fast(4).gain(.5).cut(1)
```

**Conceptual use**: turn a long sample into a stream of granular events you can FX individually.

## 2. `striate(N)` — interleave grains across pattern events

`striate(N)` takes each pattern event and plays the *same* slice index from each — first the first 1/N of every event, then the second, etc.

```js
// Three "numbers" samples woven together rather than concatenated
s("numbers:0 numbers:1 numbers:2").striate(6).slow(3)

// Spectral smear of two breaks
s("breaks165 breaks125").striate(32).loopAt(2).slow(2)
```

Versus `chop`: chop plays one sample's grains in order, then the next sample's grains; striate interleaves slice-by-slice across samples. Striate produces a smearing, transitional sound; chop produces a stuttering, fragmented sound.

## 3. `slice(N, idxPat)` — explicit slice selection

`slice` divides into N equal pieces and lets you play them in any order via a pattern of indices. **The idiomatic Amen remix tool.**

```js
// Amen 8-slice cut-up
samples('github:yaxu/clean-breaks')
s("amen/4").fit()
  .slice(8, "<0 1 2 3 4*2 5 6 [6 7]>*2")
  .cut(1).rarely(ply("2"))

// Reverse-the-slices technique
s("breaks165")
  .slice(8, "0 1 <2 2*2> 3 [4 0] 5 6 7".every(3, rev))
  .slow(0.75)

// Custom slice points (not equal divisions)
s("breaks125").fit().slice([0, .25, .5, .75], "0 1 1 <2 3>")

// Chopped vocal phrase
s("vocal:0").slice(16, "<0 1 2 [3 4] 5 ~ 6 7 ~ 8 9 [10 11] 12 13 14>")
  .cut(1)
```

`slice` preserves slice pitch. If a slot is shorter than the slice's natural duration, only the start of the slice plays.

## 4. `splice(N, idxPat)` — slice with auto-tempo-fit

Same as `slice` but each slice's playback speed is adjusted so it exactly fills its pattern slot. No `fit()` needed.

```js
// Tempo-locked Amen splice
samples('github:yaxu/clean-breaks')
s("amen")
  .splice(8, "<0 1 2 3 4*2 5 6 [6 7]>*2")
  .cut(1).rarely(ply("2"))

// Variable-length slot arithmetic — slices auto-stretch
s("amen").splice(16, "<0 1@3 2 3 4@2 5 6@2 7 8 9>")
```

The crucial difference vs `slice`:

- **`slice`** preserves slice pitch (short slot = truncated slice).
- **`splice`** time-stretches (short slot = sped-up full slice).

For breakbeat where you want every hit to play in full regardless of slot length, use `splice`. For glitchy partial-slice playback, use `slice`.

## 5. `scrub(pos)` — tape-style position scrubbing

Pass a pattern of fractional sample positions. Optional `pos:speed` syntax for speed too.

```js
// Random-access scrubbing of a swelling pad
s("swpad:0").scrub("{0.1!2 .25@3 0.7!2 <0.8:1.5>}%8")

// Scrub through Amen via a slow ramp
s("amen/4").fit().scrub("{0@3 0@2 4@3}%8".div(16))

// Perlin-driven scrub head — never repeats
s("vocal:0").scrub(perlin.segment(8))

// Mouse-position scrubbing for live performance
s("pad:0").scrub(mouseX)
```

## 6. `loopAt(N)` — stretch sample to N cycles

`loopAt` time-stretches (by changing playback speed) so the whole sample fits N cycles. The standard way to align a long loop or texture to the cycle clock.

```js
// 8-second pad fitted to 4 cycles
s("pad:0").loopAt(4)

// Combined with chop for granular ambient
s("rhodes").chop(4).rev().loopAt(2)

// 32-cycle drone from a short sample
s("metal:0").loopAt(32).gain(.4)
```

## 7. `fit()` — stretch sample to event duration

Each occurrence of the sample fills its slot exactly. Essential for breakbeat.

```js
// One whole Amen per half-cycle
s("amen/2").fit()

// Mixed breaks all aligned to slot length
s("breaks125 breaks165 amen breaks157").fit()
```

## 8. `cut(group)` — voice stealing

Drum sample tails can pile up and mud the mix. `.cut(group)` puts samples into a "cut group" — new samples in the group kill earlier samples in the same group.

```js
// Without cut: previous open hat keeps ringing into closed hats
s("oh hh oh hh")

// With cut: each new hat cancels the previous
s("oh hh oh hh").cut(1)

// Different groups for different drums
s("bd").cut(1)        // kick group
s("sd").cut(2)        // snare group
s("hh oh").cut(3)     // hat group
```

For chopped breaks, `cut(1)` on the whole stream prevents grains from overlapping into a muddy wash.

## 9. `chop` + `jux(rev)` — stereo granular spread

The classic Strudel one-liner. Left plays grains forward; right plays them reversed → wide phase-y stereo bloom.

```js
// Pad-from-anything formula
s(SAMPLE).loopAt(8).chop(64).jux(rev).room(.6).gain(.5)

// From the official "Chop" example
s("p").loopAt(32).chop(128).jux(rev).shape(.4).decay(.1).sustain(.6)

// Aggressive variant: stack reverses and speed-changes
s("amen/2").fit().chop(32).jux(rev).jux(x => x.speed(.5))
```

This is the granular workhorse. Almost any sustained sample becomes an interesting ambient texture with this treatment.

## The Amen break tradition

The "Amen break" is the 4-bar drum solo from "Amen, Brother" by The Winstons (1969). After being sampled onto drum-sample collections in the late 1980s, it became the rhythmic substrate of jungle, drum-and-bass, breakcore, and (eventually) live-coded algorave.

In the TidalCycles community, randomly cut-up Amens have become near-canonical — a lingua franca demonstrating the language's strengths in a few lines. Strudel inherits this directly.

### Loading samples

```js
samples('github:tidalcycles/dirt-samples')
// makes amen, amencutup, breaks125, breaks152, breaks157, breaks165, etc.

// Or cleaner stems:
samples('github:yaxu/clean-breaks')
```

### Classic 16-grain cutup

```js
samples('github:tidalcycles/dirt-samples')
s("amen/4").fit().chop(16)
```

`amen/4` plays one Amen per 4 cycles; `.fit()` tempo-locks; `.chop(16)` shatters into 16 grains. The minimum-effort, maximum-genre-signal "live-coded Amen."

### Production-ready Amen template

```js
samples('github:tidalcycles/dirt-samples')
s("amen/4").fit().chop(16).cut(1)
  .sometimesBy(.5, ply("2"))           // double-hits 50% of the time
  .sometimesBy(.25, mul(speed("-1")))  // reverse 25% of the time
```

- `.cut(1)` prevents grain overlap.
- `.ply(2)` doubles a hit — classic break-beat stutter.
- Reversing some hits → trademark breakcore "swallow."

### Slice-based remix (Amensister-style)

```js
samples('github:tidalcycles/dirt-samples')
n("0 1 2 3 4 5 6 7")
  .sometimes(x => x.ply(2))
  .rarely(x => x.speed("2 | -2"))
  .sometimesBy(.4, x => x.delay(".5"))
  .s("amencutup")
  .slow(2).room(.5)
```

`amencutup` is a pre-sliced Amen. Treating `:n` as `n(...)` selects hits in order; probabilistic transforms mutate them.

### Splice for tempo-perfect remix

```js
samples('github:yaxu/clean-breaks')
s("amen")
  .splice(16, "<0 1 2 3 4*2 5 6 [6 7] 8 9 10*2 11 12 13 14 15>*2")
  .cut(1)
  .sometimesBy(.5, ply(2))
  .rarely(rev)
```

### Layered break + bass + FX

```js
samples('github:tidalcycles/dirt-samples')
stack(
  // The break
  s("amen/4").fit().chop(16).cut(1)
    .sometimesBy(.5, ply(2))
    .sometimesBy(.25, mul(speed(-1)))
    .lpf(perlin.range(800, 5000).slow(11)),

  // Sub bass
  note("<c1 c1 eb1 g1>/2").s('sine').gain(.7),

  // Atmospheric scrub
  s("breath").chop(16).rev().mask("<x ~@7>").room(1).shape(.6),

  // Stereo break ghost
  s("amen/4").fit().chop(32).jux(rev).gain(.3).delay(.4)
).reset("<x@7 x(5,8,-1)>")
```

`reset("<x@7 x(5,8,-1)>")` retriggers the pattern on a 5-against-8 Euclidean — long-form variation that makes a 30-second loop feel like a piece of music.

### Scrub-style break manipulation

```js
// Skipping playhead — random sample positions
s("amen/4").fit().scrub("{0 .25 .5 .125 .75 .375 .875}%8".div(16)).cut(1)

// DJ-style "back-spin" gesture
s("amen").fit().every(4, x => x.scrub("0:-2"))   // pos 0, speed -2
```

## Decision matrix — which operator when

| Goal | Use |
|---|---|
| Stretch a long sample to fit cycles | `loopAt(N)` |
| Make a sample fit each event duration | `fit()` |
| Granular ambient pad from a sample | `chop(N).jux(rev)` |
| Remix a break by reordering hits, tempo-locked | `splice(N, idxPat)` |
| Remix a break with raw slice playback | `slice(N, idxPat)` |
| Spectral smear / texture blending | `striate(N)` |
| DJ-style scratch / scrubbing | `scrub(posPat)` |
| Prevent grain pile-up | `cut(group)` |

## Aesthetic notes

- **Less is more** for jungle/dnb. The classic Amen treatment is just `chop(16).cut(1)`, plus light probabilistic ply / rev. Over-treatment destroys the groove.
- **For ambient/IDM**, the opposite — chop into 64-128 grains, layer with `jux(rev)`, modulate with perlin signals. The sample loses its identity and becomes texture.
- **Pair `chop` with FX**: `.shape()`, `.lpf()`, `.crush()`, `.delay()`. The grain stream is a perfect input for distortion and filtering.
- **Combine with melody**: chopped breaks under a `note().scale()` melody is the bread-and-butter dnb/jungle template.

The big insight: granular operators are **structural transformations** of samples, not just FX. They redefine how the sample's content is exposed to the pattern. A `chop(16)` turns one event into 16 events, each subject to your pattern's transforms.
