# 08 — Conditional and Random Modifiers

These modifiers introduce conditional behavior — applying transforms only sometimes, only on certain cycles, or only to certain events. Together they're how a static pattern becomes a generative one.

## Periodic conditionals

These apply a transform on a regular schedule.

### `.every(n, fn)` / `.firstOf(n, fn)`

```
note("c d e g").every(4, rev)
```

Applies `fn` on cycle 0 of every n-cycle group. So with `every(4, rev)`: cycles 0, 4, 8, 12 get reversed; cycles 1-3, 5-7, etc. play normal.

Conceptually: "do this thing once every n cycles." The most common periodic transform — a baseline pattern with `every(4, fast(2))` or `every(8, rev)` becomes a varied, evolving pattern.

### `.lastOf(n, fn)`

```
note("c d e g").lastOf(4, rev)
```

Same as `every` but anchored to the *last* cycle of each n-group. Cycles 3, 7, 11 get the treatment instead of 0, 4, 8.

The difference matters in the live-coding context: `lastOf(4, fn)` feels like "ramp up to the change at the end of the bar," whereas `every(4, fn)` feels like "this is what cycle 0 does, periodically."

### `.when(condPat, fn)`

```
"c eb g".when("<0 1>/2", x => x.sub(5)).note()
```

Apply `fn` wherever the binary control pattern has a true value. More flexible than `every`/`lastOf` because the schedule is itself a pattern. Use this when you want irregular conditional schedules.

## Probabilistic conditionals

These apply a transform with some probability — every event (or every cycle) rolls dice.

### `.sometimes(fn)` / `.sometimesBy(p, fn)`

```
s("hh*8").sometimes(x => x.speed(.5))
s("hh*8").sometimesBy(0.4, x => x.speed(.5))
```

`.sometimes(fn)` = 50% chance of applying `fn` to each event. `.sometimesBy(p, fn)` lets you specify the probability `p` (0..1).

Conceptually: random per-event variation. Each `hh` is independently decided. The same code produces a different result each time (unless you use `useRNG('legacy')` for deterministic).

### Probability shortcuts

These all wrap `sometimesBy`:

| Function | Probability |
|---|---|
| `always(fn)` | 1.0 |
| `almostAlways(fn)` | 0.9 |
| `often(fn)` | 0.75 |
| `sometimes(fn)` | 0.5 |
| `rarely(fn)` | 0.25 |
| `almostNever(fn)` | 0.1 |
| `never(fn)` | 0.0 |

The named versions are more readable when you can guess the probability you want by feel.

### `.someCycles(fn)` / `.someCyclesBy(p, fn)`

```
s("hh*8").someCycles(rev)
```

Like `sometimes` but the dice roll is *per cycle*, not per event. Either the entire cycle gets the transform or none of it does.

Difference matters: with `sometimes(rev)`, individual events get reversed-or-not (which on a single-event pattern feels inconsistent). With `someCycles(rev)`, whole cycles are reversed-or-not (which feels structural).

### `.degrade()` / `.degradeBy(p)`

```
s("hh*8").degrade()         // 50% of events drop out
s("hh*8").degradeBy(.2)     // 20% drop out
```

Randomly silences events. `degradeBy(0)` = no removal; `degradeBy(1)` = total silence. The classic way to add randomness to busy patterns.

`.degrade()` is shorthand for `.degradeBy(0.5)`.

### `.undegrade()` / `.undegradeBy(p)`

```
s("hh*8").undegradeBy(.2)
```

The inverse: probability `p` here is the probability of *keeping* events. `undegradeBy(.2)` = 20% kept = 80% silenced. Mirror image semantics of `degradeBy`. Useful when you find it more natural to think "keep this rate."

## Cycle-level random selection

### `choose(...)` and `wchoose(...)`

```
s(choose("bd", "sd", "hh"))
s(wchoose(["bd", 2], ["sd", 1], ["hh", 1]))
```

`choose` picks one of the arguments at random. By default, picks can change *within* a cycle (event-by-event). `wchoose` is weighted — pass `[value, weight]` pairs.

### `chooseCycles(...)` / `randcat(...)`

```
chooseCycles("bd", "hh", "sd").s().fast(8)
```

Picks one option per cycle (rather than per event). The pattern stays consistent across the cycle.

Mini-notation form: `s("bd | hh | sd")` is roughly `chooseCycles`.

### `wchooseCycles(...)` / `wrandcat(...)`

Weighted form of `chooseCycles`.

## Selection / structure

These manipulate which events fire (vs which transform applies).

### `.struct(pat)`

```
note("c eb g").struct("x ~ x x ~ x ~ x")
```

Imposes a rhythm from a binary pattern (`x` = trigger, `~` = rest). Decouples melody from rhythm — the source provides values, the struct provides timing.

Conceptually: "play c, then eb, then g, but only at *these* moments." Subsequent values fire on subsequent `x`s, in order.

### `.mask(pat)`

```
note("c eb d eb").mask("<1 [0 1]>")
```

Like a gate: where mask = 0, no events; where mask = 1, original events. Unlike `struct`, mask doesn't reshape the rhythm — it just removes events from the existing structure.

Common idiom: `.mask("<x@7 ~>/8")` plays for 7 cycles, silent for 1. Lets you arrange long-form structure inside the same code.

### `.invert()` / `.inv()`

```
s("bd").struct("1 0 0 1 0 0 1 0".lastOf(4, invert))
```

Swaps `x` ↔ `~`, `1` ↔ `0`. Useful for binary masks/structs to flip between "on" and "off" cells.

### `.reset(pat)` and `.restart(pat)`

```
s("bd*4, hh*8").reset("<x@3 x(5,8)>")
```

These restart the pattern's internal time when the control pattern fires:

- `.reset(pat)` — reset to start of *current cycle* on each onset.
- `.restart(pat)` — reset to cycle 0 (i.e., truly back to the beginning of the pattern's history).

`reset` is gentler — it makes the pattern feel fresh each cycle. `restart` is more disruptive — it can rewind, breaking continuity.

## Pick / inhabit family — choose from lists

### `.pick(idxPat, listOrMap)`

```
note("c").pick("0 1 2", [
    s("bd"),
    s("hh"),
    s("sd")
])
```

`pick(idxPat, list)` picks the idx-th pattern from `list` for each event. The chosen pattern's *structure* is preserved — it plays as it would normally.

If `listOrMap` is a JS object (key-value), `idxPat` is a pattern of keys.

### `.pickF(idxPat, fnList)`

```
note("c d e").pickF("<0 1 2>", [
    x => x,
    x => x.add(7),
    x => x.add(12)
])
```

Like `pick` but the list contains functions. The selected function is applied to the source pattern. Effectively: "pick a transformation."

### `.pickmod` / `.pickmodF`

Wrapping versions: out-of-range indices wrap with modulo instead of being undefined. Use these when the index pattern can exceed the list length.

### `.inhabit(idxPat, list)` / `.squeeze(idxPat, list)`

These are like `pick` but they *compress* the chosen pattern to fit inside the source event's duration. So if event A spans 1/4 cycle, and you `inhabit` it with a 1-cycle pattern, that whole pattern is squeezed into 1/4 cycle.

The difference between `pick` and `inhabit`:
- `pick` lets the chosen pattern play at its natural cycle rate; only the *which* changes.
- `inhabit`/`squeeze` forces the chosen pattern to fit the source event's duration.

Use `inhabit` when you have a sequence of long events and you want each event to *contain* a sub-pattern.

### `.arp(pat)` and `.arpWith(fn)`

```
note("[c, eb, g]").arp("0 1 2 1")
```

Arpeggiator: takes a chord pattern (containing simultaneous notes) and outputs them serially according to an index pattern. `arp("0 2 1")` plays the first, third, second chord tone in sequence.

Conceptually: chord → arp pattern. Decouples chord composition from arpeggio shape.

## Difference between `every`-family and `sometimes`-family

This trips people up:

- **every/lastOf** are *deterministic* — you know which cycles get the transform.
- **sometimes/often/rarely** are *probabilistic* — each event/cycle independently decides.

Practical difference: `every(4, rev)` has a steady period — predictable phrasing. `sometimes(rev)` is unpredictable — chaotic, generative. Both have their place.

Combining them:

```
s("hh*8").every(4, x => x.sometimes(rev))
```

= "every 4 cycles, randomly reverse some events." That's deterministic at the macro level, random at the micro level.

## RNG determinism

Strudel patterns that use randomness can be made deterministic by setting an RNG seed:

```
useRNG('legacy')
```

This makes random patterns reproducible — the same code produces the same "random" sequence. Useful for sharing reproducible compositions.

## A worked example

Take the classic "amen break" cutup pattern from the examples gallery:

```
n("0 1 2 3 4 5 6 7")
.sometimes(x => x.ply(2))            // ~50% of events repeat twice in place
.rarely(x => x.speed("2 | -2"))      // ~25% of events double-speed (forward or reverse)
.sometimesBy(.4, x => x.delay(.5))   // ~40% of events have delay added
.s("amencutup")
.slow(2)
```

Reading this conceptually:
- Source: 8 events per cycle, indexing into amen break slices.
- Mutations applied:
  - About half get `ply(2)` (each event becomes two rapid events).
  - About a quarter get speed-modulated (forward or reverse).
  - About 40% get delay added.
- The whole thing is slowed to take 2 cycles.

Each play-through sounds different because of the probabilistic transforms, but the *shape* is consistent — slow amen with random embellishments.

## Mental model: probability as an axis

When designing patterns, I find it useful to think of *probability* as a parameter just like volume or pitch. A drum pattern with no probabilistic modifiers is rigid. Add `degradeBy(.1)` and it gets a hint of human looseness. Crank to `degradeBy(.5)` and it becomes sparse. `sometimes(fast(2))` adds glitch energy. The probability dial is the difference between "machine" and "alive."
