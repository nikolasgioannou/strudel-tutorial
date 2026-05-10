# 17 — Stepwise Patterns

This is a parallel pattern algebra alongside the normal cycle-based one. Most stepwise functions are still marked **experimental** in Strudel as of this writing — they may change. But they fill a real gap.

## Why stepwise exists

Normal Strudel operations are cycle-based. When you write `seq("bd sd", "hh hh hh")`, both patterns get squeezed into one cycle proportionally — `"bd sd"` takes half, `"hh hh hh"` takes half, even though they have different event counts.

Sometimes that's *not* what you want. Sometimes you want patterns to retain their natural step counts when concatenated, so `seq("bd sd", "hh hh hh")` becomes `"bd sd hh hh hh"` — 5 events in proportion.

That's what stepwise does: a second reference frame where the unit is "step," not "cycle."

## Step counting

A "step" = a top-level event in mini-notation. For `"a [b c] d e"`:

- `a` is 1 step
- `[b c]` is 1 step (the bracket is a sub-pattern that counts as one slot at the top level)
- `d` is 1 step
- `e` is 1 step

Total: 4 steps. Even though there are 5 events.

### The `^` marker — drop a level

Inside brackets, `^` tells the step-counter to descend:

```
"a [^b c] d e"
```

Now `[^b c]` counts internal elements: `b` and `c` are each 1 step. Total: 5 steps.

## The stepwise functions

### `pace(n)`

Forces playback to `n` steps per cycle. Without this, the step count is "structural" only — Strudel still plays everything in one cycle.

```
sound("bd sd cp").pace(4)
// Equivalent to sound("<bd sd cp>*4") or sound("{bd sd cp}%4")
```

Most stepwise operations are silent until you `pace()` them.

### `stepcat(...patterns)` (alias `timeCat` / `timecat`)

Concatenate patterns by step count, not by equal proportion:

```
stepcat([3, "e3"], [1, "g3"]).note()
// Equivalent to "e3@3 g3".note()

stepcat("bd sd cp", "hh hh").sound()
// Result: "bd sd cp hh hh" — 5 steps in order
```

Compare with regular `seq`: `seq("bd sd cp", "hh hh")` squeezes both into one cycle (half cycle each), so events have different durations. `stepcat` preserves each pattern's internal proportions.

### `stepalt(...patterns)` (experimental)

Concat patterns by alternating elements:

```
stepalt(["bd cp", "mt"], "bd").sound()
// = "bd cp bd mt bd"
```

Different from `stepcat` — interleaves rather than appending.

### `expand(factor)` — increase step duration

```
"c a f e".expand(2).note()
// Each step now takes 2 units. Pattern stays the same shape, just slower per step.
```

Patternable:

```
sound("tha dhi thom nam").bank("mridangam").expand("3 2 1 1 2 3").pace(8)
```

This makes each event have an evolving duration — `tha` is 3 units long, `dhi` is 2, `thom` is 1, etc., then repeats with `1 2 3`. With `.pace(8)`, the whole thing plays as 8 steps per cycle.

### `contract(factor)` — opposite of expand

```
sound("tha dhi thom nam").bank("mridangam").contract("3 2 1 1 2 3").pace(8)
```

Each step takes 1/factor units instead of factor units.

### `extend(n)` — density AND step count

Critical distinction:

```
stepcat("a b".extend(2), "c d")
// = "a b a b c d"  — 6 steps, source pattern doubled stepwise

stepcat("a b".fast(2),   "c d")
// = "[a b] [a b] c d"  — source pattern played twice within one slot
```

`extend` is the stepwise equivalent of `fast`. `fast(2)` doubles density within a cycle but doesn't change step count. `extend(2)` doubles density AND doubles step count.

When composing patterns with `stepcat`, you usually want `extend`, not `fast`.

### `take(n)` — keep first n steps

```
"bd cp ht mt".take("2").sound()        // "bd cp"
"bd cp ht mt".take("1 2 3").sound()    // "bd bd cp bd cp ht"
"bd cp ht mt".take("-1 -2 -3").sound() // "mt ht mt cp ht mt"
```

Positive = from start; negative = from end. Patterned values create a sliding sequence.

### `drop(n)` — opposite of take

```
"tha dhi thom nam".drop("1").sound()        // "dhi thom nam"
"tha dhi thom nam".drop("-1").sound()       // "tha dhi thom"
"tha dhi thom nam".drop("0 1 2 3").sound()  // sliding from full to empty
```

### `polymeter(...)` / `pm(...)` (experimental)

Aligns step counts via LCM:

```
polymeter("c eb g", "c2 g2").note()
// = note("{c eb g, c2 g2}%6")
// LCM of 3 and 2 is 6, so the combined pattern is 6 steps
```

The 3-step pattern repeats twice (= 6 steps), the 2-step pattern repeats three times (= 6 steps), they align cleanly.

### `shrink(n)` (experimental)

Progressively remove n steps:

```
"tha dhi thom nam".shrink("1").sound().bank("mridangam")
// cycle 0: "tha dhi thom nam"
// cycle 1: "dhi thom nam"
// cycle 2: "thom nam"
// cycle 3: "nam"
// cycle 4: empty
// then loops
```

Negative removes from end:

```
"tha dhi thom nam".shrink("-1").sound().bank("mridangam")
// removes one from the end each cycle
```

Combined:

```
"tha dhi thom nam".shrink("1 -1").sound().bank("mridangam").pace(4)
```

### `grow(n)` (experimental)

Opposite — progressively add steps until you reach the full pattern:

```
"tha dhi thom nam".grow("1").sound().bank("mridangam")
// cycle 0: empty
// cycle 1: "tha"
// cycle 2: "tha dhi"
// cycle 3: "tha dhi thom"
// cycle 4: "tha dhi thom nam"
```

This is build-up choreography in one operator.

### `tour(...patterns)` (experimental)

Inserts the source pattern into each of the listed patterns:

```
"[c g]".tour("e f", "e f g", "g f e c").note().sound("folkharp").pace(8)
```

Walks the source through each tour-stop pattern. Pair with `pace` to hear it.

### `zip(...patterns)` (experimental)

Densely interleaves steps:

```
zip("e f", "e f g", "g [f e] a f4 c").note().sound("folkharp").pace(8)
```

Like `polymeter` but compresses everything into one cycle.

## When to use stepwise

Use stepwise when:

- You're concatenating patterns that have different step counts and want them to *retain* their step counts (use `stepcat` instead of `seq`).
- You want to build up or break down a pattern across cycles (use `grow`, `shrink`).
- You want to selectively use parts of a pattern with sliding selections (`take`, `drop`).
- You're working with rhythms that have natural per-step lengths (like Indian tala or African polyrhythms) and want to compose them additively.

Use regular cycle-based ops when:

- You want everything compressed into one cycle (`seq`, `stack`, `cat`).
- You want speed/density changes (`fast`, `slow`).
- You're doing typical 4-on-the-floor or pop arrangements.

## Conceptual summary

The cycle is fixed; the step count is what stepwise plays with. Without `pace`, stepwise functions reshape the *structure* without changing the audible *rate*. With `pace(n)`, that structure becomes audible as n steps per cycle.

Most live coders don't need stepwise day-to-day. But for composers building complex polymetric pieces, it's invaluable.
