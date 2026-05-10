# 26 — Generative Strategies

How to write patterns that *generate* music rather than just play it. Patterns that surprise me, that explore a space, that never repeat exactly.

The core insight: in Strudel, patterns are functions of cycle position. Anything that varies smoothly or randomly with the cycle index can drive musical decisions. A "generative" piece is one where every parameter is itself a pattern, a signal, or a probabilistic transform — never a fixed value.

## 1. Signal-driven melodies

Continuous signals (`sine`, `cosine`, `tri`, `square`, `saw`, `rand`, `perlin`) produce time-varying values. Map them into a note range and discretize with `.segment(N)`, then attach a scale:

```js
// Perlin random walk — smooth, no two cycles identical
n(perlin.range(0, 12).segment(16))
  .scale("C:minor").note()
  .s('triangle').room(.4)

// Sine wave shaped into a melodic contour (rises and falls)
n(sine.range(0, 7).segment(8))
  .scale("D:dorian").note()
  .s('sawtooth').lpf(1200)

// Saw ramp = monotonic ascending line per cycle
n(saw.range(0, 14).segment(8))
  .scale("E:minor").note()

// Random-integer melody (irand returns ints, no segment needed)
n(irand(8)).scale("A:lydian").note().s('piano')
```

### Combining signals

Add, multiply, or stack them to make compound contours:

```js
// Sine carrier + slow saw envelope = melody that rises across 3 cycles
// while wiggling sinusoidally inside each cycle
n(sine.add(saw.slow(3)).range(0, 12).segment(16))
  .scale("C:minor").note().s('triangle')

// Two perlin streams at different rates = two-layer wandering
n(perlin.add(perlin.slow(7)).range(0, 14).segment(8))
  .scale("F:mixolydian").note()

// Stacking signals (from the Amensister example)
sine.add(saw.slow(4)).range(0, 7).segment(8)
  .scale('G0 minor').note().s('sawtooth')
```

The pattern `sine.add(saw.slow(N))` is a workhorse: short-term oscillation around a slowly drifting centre. Acoustic improvisers behave like this — local melodic gestures inside a longer arc.

## 2. Probabilistic structure

Combine drop-out with conditional transforms. The skeleton repeats; the flesh evolves.

```js
// Living hi-hat: drop ~30%, double-time some hits, occasionally reverse
s("hh*16")
  .degradeBy(.3)
  .sometimesBy(.4, ply(2))
  .rarely(rev)

// Living melody with multi-level decisions
n("0 2 4 6 7 4 2 0").scale("C:minor").note().s('sawtooth')
  .often(x => x.off(1/8, add(7)))   // 75% of cycles get a 5th-up echo
  .sometimes(x => x.fast(2))         // 50% of cycles double-time
  .rarely(rev)                       // 25% reversed
```

The probability ladder:

| Function | Probability |
|---|---|
| `often` | 0.75 |
| `sometimes` | 0.5 |
| `rarely` | 0.25 |
| `almostAlways` | 0.9 |
| `almostNever` | 0.1 |

Stacking 2–3 of these gives the impression of a human improviser making continuous micro-decisions.

## 3. Markov-chain-like via `chooseCycles`

`chooseCycles(...args)` picks one argument per cycle. State machine on the cycle clock:

```js
// Generative jazz changes — random chord per cycle
chooseCycles("Cm7", "Fm7", "Bbm7", "Ebm7", "Abm7")
  .chord().dict('lefthand').voicing().s('gm_epiano1')

// Random key per cycle
n("0 2 4 7")
  .scale(chooseCycles("C:minor", "Eb:major", "G:dorian"))
  .note()

// Cycle-level rhythm choice
chooseCycles(
  "bd*4",
  "bd ~ bd ~",
  "bd [~ bd] bd bd",
  "bd <~ bd> bd <~ ~ bd>"
).s().bank("RolandTR909")
```

Fake a weighted Markov chain by repetition: `chooseCycles("C", "C", "G", "F")` makes C three times more likely.

## 4. Cellular-automaton-style — `binary` and `binaryN`

`binary(n)` converts an integer to a binary mini-notation pattern. `binaryN(n, bits)` pads to a fixed bit width. Use with `.struct(...)`:

```js
// 5 in binary = "1 0 1" → struct creates rests where 0
"hh".s().struct(binary(5))

// 16-bit pattern — 65,535 possible rhythms in a single number
"hh".s().struct(binaryN(55532, 16))

// Walk through neighbouring rhythms (Wolfram-1D-rule feeling)
s("bd").struct(binaryN("<43690 21845 49152 21930>", 16))

// Multiple binary patterns layered = boolean rhythm CA
stack(
  s("bd").struct(binaryN(43690, 16)),
  s("hh").struct(binaryN(21845, 16)),
  s("sd").struct(binaryN(2184, 16))
)
```

Numbers near each other in integer-space give similar rhythms. Animating `binaryN("<n n+1 n+2 n+3>", 16)` is a kind of cellular evolution.

## 5. Modulation cascades

Multiple slow signals controlling different params at different rates. Pick coprime cycle counts; the system never quite lines up.

```js
note("c2 eb2 g2 bb2".fast(2)).s('sawtooth')
  .lpf(sine.range(300, 2500).slow(8))    // filter sweep over 8 cycles
  .lpq(perlin.range(2, 18).slow(11))     // resonance breathing over 11
  .gain(tri.range(.5, .9).slow(5))       // amplitude wave over 5
  .room(perlin.range(.2, .8).slow(13))   // reverb size over 13
  .pan(sine.range(0, 1).slow(7))         // panning over 7
```

LCM(5, 7, 8, 11, 13) = 40,040 cycles before the pattern repeats. At default tempo, that's hours of non-repeating texture.

## 6. Long-form arrangement — `mask` and `arrange`

```js
// Verse plays for 7 cycles, rests for 1, every 8 cycles
melody.mask("<x@7 ~>/8")

// 8-cycle structured drop-out
drums.mask("<1 1 1 1 1 1 0 1>/8")

// Two parts taking turns (verse and chorus)
$: lead.mask("<x@4 ~@4>/8")
$: pad.mask("<~@4 x@4>/8")
```

`arrange([cycles, pattern], ...)` for explicit timeline:

```js
arrange(
  [4,  s("bd*2, hh*4")],            // 4-cycle intro
  [8,  stack(drums, bass)],          // 8-cycle verse
  [8,  stack(drums, bass, chords)],  // 8-cycle chorus
  [4,  s("cp ~ cp ~")]               // 4-cycle outro
)
```

Combine: each section runs under `arrange`, with sub-element masks flickering inside.

## 7. Iter-based variation

`.iter(N)` rotates the pattern by 1/N each cycle. Over N cycles you traverse every rotation:

```js
// 8-note phrase → 8-cycle melodic perpetuum
n("0 1 2 3 4 5 6 7").iter(8).scale("C:dorian").note().s('triangle')

// iter on a chord progression — each cycle starts from a different chord
chord("<Cm7 Fm7 Bb^7 Eb^7>").iter(4).voicing()
```

Combine with offsets for extra motion: `n("0 1 2 3").iter(4).off(1/8, add(7))`.

## 8. Self-modifying patterns

`every`, `chunk`, `off` apply transforms periodically or to fragments — the base reveals new shapes over many cycles:

```js
// every: apply on the Nth cycle only
s("bd hh sd hh")
  .every(4, fast(2))           // double-speed every 4 cycles
  .every(8, rev)               // reverse every 8
  .every(16, x => x.ply(2))    // ply every 16

// chunk: divide into N parts, transform one part per cycle
"0 1 2 3".chunk(4, x => x.add(7))
  .scale("A:minor").note()
// cycle 0: first quarter shifted; cycle 1: second; etc.

// Compound: each transform at a coprime period
melody
  .every(3,  x => x.fast(2))
  .every(5,  rev)
  .every(7,  ply(2))
  .every(11, x => x.add(note("12")))
// LCM(3,5,7,11) = 1155 cycles before exact repeat
```

## 9. Additive build-up (live coding as composition)

The standard live coding rhetoric — start simple, layer up:

```js
// Step 1 — kick
$: s("bd*4")

// Step 2 — add hi-hats
$: s("bd*4")
$: s("hh*8")

// Step 3 — add bass
$: s("bd*4")
$: s("hh*8")
$: note("c2 c2 eb2 g2").s('sawtooth').lpf(600)

// Step 4 — add chords
$: chord("<Cm Fm Bb Eb>/4").voicing().s('gm_epiano1').gain(.3)

// Step 5 — add generative melody
$: n(perlin.range(0, 12).segment(16))
    .scale("C:minor").note().s('triangle').room(.4)

// Step 6 — add arrangement gates
$: s("bd*4").mask("<x@7 ~>/8")
$: s("hh*8").sometimesBy(.3, ply(2)).jux(rev)
```

The discipline: each new line should make a clearly audible difference. If it doesn't, delete it.

## 10. Where to apply chance vs determinism

Decide consciously *which parameters* are random and which are fixed:

- **Always fixed**: tempo, key, base chord progression. Listeners need a stable spine.
- **Often patterned**: melody, drums. Provide variation while staying coherent.
- **Often random**: ornaments, fill events, fx modulations. The "life" of the piece.

A track is generative when the spine is fixed and the surface is varying. If everything is random, it becomes noise. If nothing is random, it becomes loops.

## 11. Combinations that compound musically

Some combinations of operators produce more musical results than the parts alone:

| Combo | Why it works |
|---|---|
| `.iter(N).off(1/N, add(7))` | Rotating melody with parallel-fifth shadow |
| `.degrade().sometimes(ply(2))` | Sparse with bursts — natural improviser feel |
| `.scale().add("<0 [0,2,4]>")` | Sometimes single notes, sometimes triads |
| `.chunk(N, fn).every(M, rev)` | Sectional variation + reversal punctuation |
| `.lpf(sine.range(...).slow(N))` + `.lpq(perlin.range(...).slow(M))` | Filter sweep + resonance breathing — alive |
| `.jux(x => x.rev().slow(2))` | Right channel does a different thing |

Build a vocabulary of these combos through reading other people's code (notes 13 and 14).

## 12. The "infinite jukebox" idea

A truly generative track might run for hours without exact repetition. Combine:

1. Coprime modulation periods (5, 7, 11, 13 cycles).
2. `chooseCycles` for occasional chord/scale shifts.
3. `every(N, fn)` with multiple coprime N values.
4. `mask` for long-period arrangement gating.
5. Signal-driven melodies (perlin doesn't repeat).
6. `iter` for rotational variation.

The result: a piece whose surface keeps changing while its essence stays recognizable. This is the algorave aesthetic in pure form — composition by *generation* rather than *fixation*.
