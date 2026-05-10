# 09 — Signals and Modulation

## What's a signal?

A **signal** is a *continuous* pattern — one that has a value at every point in time, not just at discrete events. Where a normal pattern emits events at specific moments, a signal can be sampled at any moment.

In type terms (from `01-core-mental-model.md`): a signal is a `Pattern a` whose events all have `whole = Nothing`. It doesn't have onsets; it has a *value-at-time* function.

Signals are the bridge between the event-based world (notes, drum hits) and the continuous-modulation world (LFOs, slow-evolving cutoffs). They're how patterns express smooth change.

## The built-in signals

### Unipolar (range [0, 1])

| Signal | Shape |
|---|---|
| `sine` | Smooth oscillation, low to high |
| `cosine` | Same shape as sine, phase-shifted |
| `saw` | Linear ramp 0 → 1, jump back to 0 |
| `isaw` | Inverted saw: 1 → 0, jump back |
| `tri` | Triangle: 0 → 1 → 0 |
| `square` | Step: 0 for half cycle, 1 for half |
| `rand` | Continuous random noise (each query gets fresh random) |
| `perlin` | Smooth random noise (correlated neighbors — "pretty noise") |

All of these complete one full period per cycle. They can be slowed/sped: `sine.slow(4)` does a single sine wave over 4 cycles.

### Bipolar (range [-1, 1])

Same names with `2` suffix:

| Signal |
|---|
| `sine2`, `cosine2`, `saw2`, `tri2`, `square2`, `rand2` |

Conceptually: same shapes, just centered on 0 instead of 0.5. Useful when you want symmetric modulation around a center point.

### Discrete random helpers

| Signal | Output |
|---|---|
| `irand(n)` | Continuous random integers in [0, n-1] |
| `brand` | Random binary 0/1 |
| `brandBy(p)` | Random binary, p probability of 1 |

### Mouse signals (for live performance)

| Signal | What it returns |
|---|---|
| `mouseX` (alias `mousex`) | Mouse X position 0..1 |
| `mouseY` (alias `mousey`) | Mouse Y position 0..1 |

Live use: `note(rand).range(36, 72).segment(8)` plus the mouse on filter cutoff lets you "play" the synth interactively.

## Mapping with `.range()`

Raw signals output 0..1 (unipolar) or -1..1 (bipolar). Most parameters need different ranges. So you map:

```
sine.range(200, 2000)         // [0,1] → [200, 2000]
saw.range(-12, 12)            // [0,1] → [-12, 12]
```

`.range(min, max)` does linear mapping. There's also:

- `.rangex(min, max)` — exponential mapping. Useful for frequency parameters because human hearing is logarithmic. `sine.rangex(200, 2000)` gives perceptually-even motion.
- `.range2(min, max)` — for bipolar signals, maps -1..1 to min..max.

## Using signals as parameters

This is the big move:

```
s("hh*16").lpf(sine.range(200, 2000).slow(4))
```

The cutoff is now a sine wave that takes 4 cycles to complete one period, mapped to 200..2000 Hz. The hi-hats progressively get brighter and darker. This is auto-modulation — the parameter is alive.

Almost every parameter in Strudel can take a signal:

```
.gain(sine.range(.3, .8).slow(8))           // slow volume swell
.pan(sine.range(.2, .8))                    // auto-pan
.speed(perlin.range(.9, 1.1))               // slight speed jitter
.cutoff(saw.range(500, 4000).slow(2))       // sweeping cutoff (descending stops, ramps up)
.delay(perlin.range(0, .5).slow(32))        // very slow delay-amount drift
```

## `.segment(n)` — discretize a signal

Signals don't trigger discrete events on their own. To make a signal *generate notes*, use `.segment(n)`:

```
n(saw.range(0, 8).segment(8))
```

`.segment(8)` samples the signal 8 times per cycle and turns those samples into 8 discrete events. So this gives 8 notes per cycle, each with `n` value taken from the saw wave at that moment.

Without `.segment`, signals are continuous modulation — they don't trigger anything by themselves. With `.segment`, they become note generators.

This is a powerful melody-generation technique: pick a signal, scale it to a note range, segment it, attach a scale.

```
n(perlin.range(0, 7).segment(16))
    .scale("C:minor")
    .note()
    .s("piano")
```

= 16 notes per cycle, smoothly drifting through C minor according to perlin noise. Always sounds musical; never repeats exactly.

## Why perlin is special

`rand` produces independent random values each query — uncorrelated, jittery. `perlin` produces *smoothly varying* random values — adjacent samples are close to each other. This means:

- `lpf(rand.range(200, 2000))` = noisy, jittery cutoff — sounds glitchy.
- `lpf(perlin.range(200, 2000))` = smooth wandering cutoff — sounds organic.

For modulation, perlin almost always sounds better than rand.

## LFO — `.lfo()`

A signal sampled at audio rate (rather than per-event) gives you true continuous modulation:

```
s("saw").lfo({ c: 'gain', rate: 4, depth: 0.5, shape: 'sine' })
```

Parameters:

- `c` / `control` — which parameter to modulate (string name)
- `r` / `rate` — modulation frequency (Hz)
- `s` / `sync` — sync to cycles (true/false)
- `dr` / `dep` / `depth` — relative depth (multiplier)
- `da` / `depthabs` — absolute depth
- `dc` / `dcoffset` — DC offset (center value)
- `sh` / `shape` — `0`=triangle, `1`=sine, `2`=ramp, `3`=saw, `4`=square
- `sk` / `skew` — waveform asymmetry
- `curve` — curvature of the shape
- `fxi` — FX index (which insert in the chain)

Conceptual difference from signals:

- **Signal as parameter** (`.lpf(sine.range(200, 2000))`) samples the signal *once per event*. Between events, the parameter is held constant. This is sample-and-hold.
- **LFO** (`.lfo({c:'lpf', ...})`) modulates the parameter *continuously during the event*. So a single 1-second note can have its filter sweeping smoothly throughout, which a signal-as-parameter can't do.

For per-event control, use signals. For within-event modulation, use LFO.

## Combining signals

Signals are patterns, so all pattern operations apply:

```
sine.add(saw.slow(4)).range(0, 7).segment(8)
```

This adds two signals (sine + slow saw), then maps the result. You can stack, transform, and compose signals just like notes.

```
stack(sine, cosine).segment(16).range(0, 15)
```

Stacks two signals — at any moment both are active, producing two parallel modulators.

## ADSR envelopes vs signals

Conceptually similar but:

- **ADSR** is *triggered by events*. Each event gets its own envelope from start to finish.
- **Signals** are *free-running*. The cycle drives them; events sample whatever value they have at their onset.

ADSR is best when you want the parameter to behave the same way at every event. Signals are best when you want the parameter to evolve over time *across* events.

You combine them: a slow signal sets a center value, and per-event ADSR moves around that center. E.g., `lpf(perlin.range(500, 1500).slow(8)).lpa(.1).lpenv(2)` = perlin slowly sets a base cutoff, ADSR sweeps from there each event.

## Three layers of randomness

Worth distinguishing:

1. **Pattern-level randomness** — `?` mini-notation, `degrade*`, `sometimes*`, `choose*`. Affects which events fire and which transforms apply.
2. **Continuous random signals** — `rand`, `perlin`, `irand`. Modulate parameters over time.
3. **Per-event random** — `velocity(rand.range(.5, 1))` puts a random value at every event onset.

These compose. A pattern can have probabilistic events (#1), modulating filter cutoff with perlin (#2), and randomized velocity per event (#3). All independently controllable.

## Mental model

A signal is a function `time → value`. Strudel just lets you use it anywhere a value is expected. The conversion `discrete pattern ↔ continuous signal` happens via:

- `.segment(n)` (continuous → discrete)
- Constant lift (discrete `0.5` → constant signal)

Once you're fluent with signals, the difference between "automated parameter" and "melody generator" is just "which side of segment am I on."
