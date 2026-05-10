# 11 — Pattern Alignment (Advanced)

This is the subtle topic that comes up with binary operators like `.add`, `.sub`, `.mul`, `.div`. When you combine two patterns with different event structures, *which side controls timing?* The answer changes what the result sounds like.

This corresponds to TidalCycles' `|+`, `+|`, `|+|` operators (and friends). Strudel uses named methods instead of symbolic operators.

## The problem

Take two patterns:

```
A: note("c e g")     // 3 events per cycle
B:        "0 7"      // 2 events per cycle
```

If I want to "add B to A," what should happen?

- 3 events per cycle? (use A's structure, sample B's value at each)
- 2 events per cycle? (use B's structure)
- 6 events per cycle? (intersect — events at every alignment of the two)
- Something else?

Strudel exposes all of these as named alignment modes.

## The four alignment modes

```
A.add.in(B)         // "in to A": use A's structure, sample B at each A event
A.add.out(B)        // "out to A, in to B": use B's structure
A.add.mix(B)        // both — events at intersections of structures
A.add.squeeze(B)    // squeeze: B's cycles are squeezed into each A event
A.add.squeezeout(B) // mirror of squeeze
A.add.reset(B)      // truncate-style alignment
A.add.restart(B)    // restart-style alignment
```

The bare `A.add(B)` defaults to `.in` — use the left pattern's structure.

### Conceptually

| Mode | What it does |
|---|---|
| `.in` | Result has *left's* event structure. At each left event, value = left + right's value at that moment. |
| `.out` | Result has *right's* event structure. At each right event, value = left's value at that moment + right. |
| `.mix` | Result has events at *every* boundary of either pattern. Two patterns' structures combine. |
| `.squeeze` | One full cycle of right is compressed to fit inside each event of left. |
| `.squeezeout` | One full cycle of left is compressed to fit inside each event of right. |
| `.reset` | Right's onsets *reset* left's pattern timer. |
| `.restart` | Right's onsets *restart* left from cycle 0. |

## Worked examples

Take `A = "0 1 2 3"` (4 evts) and `B = "10 20"` (2 evts).

### `.in` (default)

```
"0 1 2 3".add("10 20")     // ≡ .add.in
```

Result has 4 events (A's structure). Each event reads B's value at the corresponding moment:

```
event 0: value = 0  + (B at time 0)   = 0  + 10 = 10
event 1: value = 1  + (B at time .25) = 1  + 10 = 11   (B's first half is "10")
event 2: value = 2  + (B at time .5)  = 2  + 20 = 22
event 3: value = 3  + (B at time .75) = 3  + 20 = 23
```

Result: `"10 11 22 23"`.

### `.out`

```
"0 1 2 3".add.out("10 20")
```

Result has 2 events (B's structure). Each event reads A:

```
event 0: value = 10 + (A at time 0)   = 10 + 0 = 10
event 1: value = 20 + (A at time .5)  = 20 + 2 = 22
```

Result: `"10 22"`.

### `.mix`

```
"0 1 2 3".add.mix("10 20")
```

Events at every boundary of either pattern. A boundaries: 0, .25, .5, .75. B boundaries: 0, .5. Combined: 0, .25, .5, .75. So 4 events here, but they're shaped from intersections of both.

For more diverse patterns, `.mix` produces more events than either side.

### `.squeeze`

```
"0 1 2 3".add.squeeze("10 20")
```

For each A event, *one whole cycle of B* is squeezed into it. So:

```
event 0 (of A) gets B compressed → 10, 20 squeezed into 1/4 cycle
event 1 (of A) gets B again → 10, 20 squeezed into 1/4 cycle
...
```

Result: an 8-event pattern where each pair from B fits inside each A event.

Conceptually: nested cycles. Useful when A is a slow harmonic skeleton and B is a melodic motif you want to repeat inside each A note.

## Why this matters

In simple cases (matching event counts) all alignment modes agree. The differences appear when patterns have *mismatched* event counts.

The `in` default is what most music wants — "I have a melody (A); modulate something on top of it (B); keep the melody's rhythm."

`out` is when "I have a rhythm (B) and want some changing values (A) to drive it."

`squeeze` is for explicit cycle nesting.

`mix` is for intersection-style hybrids — uncommon but powerful for complex polyrhythms.

## Math operations that have alignment variants

These all support `.in`, `.out`, `.mix`, `.squeeze`, `.squeezeout`, `.reset`, `.restart`:

- `.add` / `.sub` / `.mul` / `.div` / `.mod`
- `.set` (replace value)

So `.add.out(...)` is valid. The default form (just `.add(...)`) uses `.in`.

## Mental model

Think of binary pattern operations as having two "axes":

1. **What math** — add, sub, mul, etc.
2. **Which structure wins** — left (`.in`), right (`.out`), both (`.mix`), or some nesting (`.squeeze`).

Most music uses `.in` (default) and you never need to think about it. But when you write `.add(...)` and the result has the wrong number of events per cycle, the fix is to specify alignment explicitly.

## How this relates to Tidal

Tidal has this same concept but uses symbolic operators:

| Tidal | Strudel |
|---|---|
| `\|+\|` | `.add.mix` |
| `\|+`  | `.add.in` (or just `.add`) |
| `+\|`  | `.add.out` |
| `\|*` | `.mul.in` |
| `*\|`  | `.mul.out` |
| etc. | |

The bar-side that has the bar "points at" the side providing structure. Strudel's named methods are more explicit but less concise.

## Note: signals as the "right side"

Most modulation usage doesn't care about alignment because the right side is a signal (continuous, structureless). E.g., `s("bd*4").gain(sine)` — the sine has no events, so there's nothing to align *against*. The 4 bd events sample the sine at their respective moments. Effectively `.in` semantics for free.

This is why most Strudel code never explicitly mentions alignment — the common case (continuous modulator) doesn't need it.

## A practical example from the gallery

```
"<8(3,8) <7 7*2> [4 5@3] 8>".sub(1)
.layer(
    x => x,
    x => x.add(7).off(1/8, x => x.add("2,4").off(1/8, x => x.add(5).echo(4, .125, .5))).slow(2)
)
.n().scale("A1 minor")
```

The `.add("2,4")` creates a chord (two parallel pitches). With default `.in` semantics, the chord aligns to the source pattern's structure — each source event gets two notes (the source value + 2, and source value + 4).

If this used `.add.out("2,4")`, the result would have 2 events per cycle (driven by the chord pattern), which would be wrong.

## When to learn this in detail

For early use, just know: the default `.add(B)` uses left structure. If you find yourself confused why a binary operation produced an unexpected event count, this is the page to come back to.
