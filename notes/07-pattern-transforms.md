# 07 — Pattern Transforms

Pattern transforms take a pattern and return a new pattern. They are the core of Strudel's expressive power — they're what makes a few lines of code produce hours of musical material.

Conceptually each transform manipulates the *query function*. Read `01-core-mental-model.md` first if any of this feels mysterious.

## Time transforms

These shift, stretch, or compress the time axis.

### `.fast(n)` and `.slow(n)`

```
s("bd hh sd hh").fast(2)    // twice as many events per cycle
s("bd hh sd hh").slow(2)    // pattern stretches over 2 cycles
```

`.fast(n)` plays the pattern n times faster (more events per cycle). `.slow(n)` plays n times slower (events spread across n cycles).

Equivalent to mini-notation `*n` and `/n` *applied to the entire pattern*. (See `03-mini-notation.md` for why local `*n` and outer `.fast(n)` differ.)

Patternable: `.fast("<1 2 4>")` cycles through speeds.

### `.hurry(n)`

```
s("amen").hurry(2)
```

Like `.fast(n)` but **also** speeds up the playback rate of samples. So a sample plays back faster (and pitched up). For a synth pattern, `hurry` and `fast` are the same; for samples, `hurry` adds an audible pitch shift.

### `.early(t)` and `.late(t)`

```
"bd ~ sd ~".early(.1)       // shift everything 1/10 cycle earlier
"bd ~ sd ~".late(.05)        // shift 5/100 cycle later
```

`.early(t)` moves events earlier in time by `t` (fraction of a cycle). `.late(t)` moves them later.

Tiny values (`.late(.005)`) create flam-like timing nudges. Larger values shift entire patterns out of phase.

### `.compress(a, b)` and `.zoom(a, b)`

```
s("bd sd").compress(.25, .75)   // pattern fits in [0.25, 0.75], silence elsewhere
s("bd hh sd cp").zoom(.25, .75)  // play only the slice from 0.25 to 0.75 of the pattern
```

`.compress(a, b)` keeps the pattern's content but squeezes it into the time-window `[a, b]` of each cycle, leaving silence before and after. Conceptually: "play this pattern only in the middle of each cycle."

`.zoom(a, b)` plays only the *internal slice* `[a, b]` of the pattern, stretched to fill the cycle. Conceptually: "give me a close-up of the middle half of the pattern."

### `.linger(f)`

```
s("a b c d").linger(.25)
```

Takes a fraction `f` of the pattern and repeats it to fill the cycle. `.linger(.25)` plays the first quarter four times. Stutter / glitch effect.

### `.fastGap(n)`

```
s("bd sd").fastGap(2)        // pattern occupies first half, silence in second half
```

Like `.fast(n)` but instead of filling the cycle with repeated copies, it leaves the rest as silence. A condensed pattern with breathing room.

### `.iter(n)` and `.iterBack(n)`

```
n("0 1 2 3").iter(4)         // each cycle starts one step later: 0123, 1230, 2301, 3012
```

`.iter(n)` divides the pattern into n equal parts and on each cycle, rotates so it starts at a different part. Cycle through n cycles to get back to the original. `.iterBack(n)` rotates the other direction.

This is great for endlessly-evolving variations — phase-shift the pattern across cycles.

### `.ply(n)`

```
s("bd ~ sd cp").ply(2)
// equivalent to: s("bd*2 ~*2 sd*2 cp*2") = "bd bd ~ ~ sd sd cp cp"
```

`.ply(n)` repeats *each event* n times in place. Adds rapid-fire repeats inside each existing event slot. Combine with patterned `n`: `.ply("<1 2 3>")` for evolving repeat counts.

### `.palindrome()`

```
note("c d e g").palindrome()
// cycle 0: c d e g
// cycle 1: g e d c
// cycle 2: c d e g
// ...
```

Alternates forward and backward each cycle. Pendulum motion.

### `.rev()`

```
note("c d e g").rev()
// every cycle: g e d c
```

Reverses the pattern within each cycle. (As opposed to `palindrome` which alternates.)

### `.segment(n)`

```
note(saw.range(40, 52).segment(8))
```

Discretizes a continuous signal: takes n equally-spaced samples per cycle and turns them into n discrete events. For continuous signals like `sine`, `saw`, `perlin`, this is how you turn them into pitched note patterns. Without `.segment`, signals don't trigger discrete events.

Conceptually `.segment(n)` is "sample-and-hold n times per cycle."

### `.swing(n)` and `.swingBy(amount, n)`

```
s("hh*8").swing(4)           // shorthand for swingBy(1/3, 4)
s("hh*8").swingBy(1/2, 4)
```

`.swing(n)` divides the cycle into n parts and delays the second half of each part — creating a shuffle/swing feel. `.swingBy(x, n)` lets you control the amount.

`.swing(4)` on `hh*8` turns straight-eight hi-hats into a triplet-feel shuffle.

### `.clip(n)` and `.legato(n)`

```
note("c a f e").clip(.5)      // each note lasts half its slot
```

Multiplies the duration of each event by `n`. `.clip(.5)` = staccato (short notes); `.clip(1)` = legato (notes butt up against each other); `.clip(2)` = overlapping notes.

`legato` is an alias.

### `.inside(n, fn)` and `.outside(n, fn)`

```
"0 1 2 3".inside(4, rev).note()    // applies rev as if pattern were 4 cycles long
```

These let you apply a function as if the pattern were running at a different time scale.

- `.inside(n, fn)` — apply `fn` *inside* an n-cycles-long version. Same as `.slow(n).fn().fast(n)`.
- `.outside(n, fn)` — opposite: apply `fn` as if zoomed out by n cycles.

These compose with operations like `rev` to create cycle-wide reversals from element-wide reversals.

### `.ribbon(offset, cycles)`

```
note("<c d e f>").ribbon(1, 2)     // play cycles 1-2 of the source, looped
```

Cuts a `cycles`-long window out of the pattern's timeline starting at `offset` and loops just that. Useful for grabbing a specific phrase.

## Layering / accumulation

These overlay patterns on top of themselves.

### `.superimpose(fn)`

```
note("c e g").superimpose(x => x.add(7))
// Now plays both the original and a +7 transposed copy
```

Stacks `fn(this)` *on top of* `this`. Both play simultaneously. Result: the original plus the transformed version.

### `.layer(fn1, fn2, ...)`

```
note("c e g").layer(
    x => x,
    x => x.add(7),
    x => x.sub(12)
)
```

Like `superimpose` for many transforms, BUT it *drops the original*. Whatever the functions return is what plays. To include the original, use `x => x` as one of the layers.

So:
- `superimpose(f)` = original ∪ f(original)
- `layer(f, g)` = f(original) ∪ g(original)

### `.off(time, fn)`

```
note("c eb g").off(1/8, x => x.add(7))
```

`.off(t, fn)` overlays the pattern with a copy that's been *time-shifted by t cycles* and transformed by `fn`. Result: the original at time 0, plus a delayed-and-transformed echo at time `t`.

Conceptually: a harmonized echo. The classic `.off(1/8, x => x.add(7))` plays each note, then 1/8 cycle later plays it transposed up a fifth.

You can chain multiple `off`s:

```
"0 1 2 3".off(1/4, add(2)).off(1/2, add(6))
```

This stacks three voices: original, +2 at 1/4 offset, +6 at 1/2 offset.

### `.echo(times, time, feedback)`

```
s("bd").echo(4, 1/8, .5)
```

Adds `times` echoes spaced by `time` cycles, each at `feedback` fraction of the previous gain. So `echo(4, 1/8, .5)` gives 4 echoes at 1/8 spacing, decaying by 50% each.

Note: this is a *pattern-level* echo (creates more events). It's different from `.delay()` (which is an audio FX delay).

### `.echoWith(times, time, fn)`

```
n("0").echoWith(4, 1/8, (x, i) => x.add(i * 7))
```

Like `echo` but you supply a function `(pattern, index) => transformedPattern` that gets called for each echo, with `i` = which iteration. Lets you transform each echo cumulatively (e.g., transpose up by octaves, or apply different effects to each repeat).

### `.jux(fn)` and `.juxBy(width, fn)`

```
s("bd lt cp ht").jux(rev)
```

`.jux(fn)` splits stereo: original goes to left channel, `fn(original)` goes to right channel. Single-step way to make any pattern wider and weirder. `jux(rev)` (reverse on right) is THE most-quoted Strudel/Tidal trick — it instantly gives a pattern that "Aphex Twin" feeling.

`.juxBy(width, fn)` controls how spread the channels are: `juxBy(0)` = mono (no jux), `juxBy(1)` = full stereo split. Patternable, so you can swell jux in and out.

## Conditional and chunked transforms

(See also `08-conditional-and-random.md` for the random-conditional family.)

### `.chunk(n, fn)`

```
n("0 1 2 3").chunk(4, x => x.add(7)).scale("A:minor").note()
```

Divides the pattern into `n` chunks (in cycle-time). Each cycle, `fn` is applied to *one* of those chunks. Across `n` cycles you cycle through which chunk gets the treatment.

So `chunk(4, fast(2))` makes 1/4 of the pattern double-time, but a different 1/4 each cycle.

`.chunkBack(n, fn)` cycles backwards. `.fastChunk(n, fn)` is similar but doesn't loop the source for each chunk.

### `.lastOf(n, fn)` and `.firstOf(n, fn)` / `.every(n, fn)`

```
note("c d e g").every(4, rev)   // on every 4th cycle, reverse
```

- `.every(n, fn)` / `.firstOf(n, fn)` apply `fn` on cycle 0, n, 2n, ... (the *first* of each n-cycle group).
- `.lastOf(n, fn)` apply on cycle n-1, 2n-1, 3n-1, ... (the *last* of each n-cycle group).

These give you a pattern that "comes alive" periodically — one bar in every four does something different.

### `.when(condPat, fn)`

```
"c eb g".when("<0 1>/2", x => x.sub(5)).note()
```

Apply `fn` only when the binary control pattern has a 1. Lets you express more complex conditional schedules than `every`.

### `.struct(pat)`

```
note("c eb g").struct("x ~ x x ~ x ~ x")
```

Imposes a rhythmic structure from another pattern. Where the struct has `x`, an event fires (with the next value from the source). Where it has `~`, silence. Decouples rhythm from melody completely.

### `.mask(pat)`

```
note("c eb d eb").mask("<1 [0 1]>")
```

Like a gate: silences events where mask is 0/`~`, lets them through where mask is 1/`x`. Useful for arrangement-level "only play this section in cycles 4-7":

```
.mask("<x@7 ~>/8")    // play for 7 cycles, silent for 1, repeating every 8
```

## Composition combinators

These build patterns out of other patterns. They're "factories," but they also act as transforms when chained.

### `cat(...)` / `slowcat(...)`

```
cat("c", "e", "g")      // cycle 0: c, cycle 1: e, cycle 2: g
```

Each pattern takes one whole cycle. Equivalent to `<a b c>` mini-notation.

### `seq(...)` / `fastcat(...)`

```
seq("c", "e", "g")      // all three in one cycle
```

Cram all into one cycle. Equivalent to `[a b c]` (or just `"a b c"`) mini-notation.

### `stack(...)` / `polyrhythm(...)` / `pr(...)`

```
stack("c", "e", "g")     // play all three simultaneously
```

Layer in parallel. Same as the comma operator at top-level mini-notation. The aliases `polyrhythm` / `pr` emphasize the rhythm-stacking aspect.

### `polymeter(...)` / `pm(...)`

```
polymeter("c eb g", "c2 g2")
```

Like stack, but aligns *step rate* not *cycle period*. Patterns repeat at different cycle lengths but share a common pulse. Same as `{}` mini-notation.

### `stepcat([n, pat], ...)` / `timeCat`

```
stepcat([3, "c"], [1, "e"])
```

Concatenates patterns with weighted lengths. Like `seq` but each pattern has a relative size — first plays for 3/4 of the cycle, second for 1/4. Same as `c@3 e` mini-notation but for pattern composition.

### `arrange([cycles, pat], ...)`

```
arrange([4, "<c a f e>"], [2, "<g a>"])
```

Plays each pattern for the specified number of cycles, then moves to the next. Top-level macro arrangement: 4 cycles of one section, 2 cycles of another, repeat. Lets you build A-A-B-A song structures from inside Strudel.

### `pure(x)` and `silence`

`pure(x)` lifts a single value to a constant pattern. `silence` is a pattern that produces no events. Useful as identity elements when building patterns programmatically.

### `run(n)`

```
n(run(8)).scale("C:major")
```

Generates the integer pattern `0, 1, 2, ..., n-1`. Equivalent to `"0 1 2 3 4 5 6 7"`.

### `binary(n)` / `binaryN(n, bits)`

```
s("hh").struct(binary(5))     // binary of 5 = 101 → "x ~ x"
s("hh").struct(binaryN(55532, 16))   // padded to 16 bits
```

Generates a rhythmic struct from a number's binary representation. Compact way to specify rhythms numerically.

## Higher-order utility: `.apply(fn)`

```
const myShape = x => x.s("sawtooth").lpf(800).delay(.3);

note("c e g").apply(myShape)
```

`.apply(fn)` calls `fn(this)` and returns the result. Lets you reuse a chain of effects as a function. Conceptually: a shorthand for "apply this transformation pipeline."

Used extensively in the examples to share effect chains across multiple layers.

## When to use what — pattern transform decision tree

- "Make it faster" → `.fast(2)` (or `*2` in mini-notation)
- "Make it slower" → `.slow(2)` (or `/2`)
- "Reverse it" → `.rev()`
- "Make it twice as funky on the off-beats" → `.swing(4)`
- "Add a delayed harmonized copy" → `.off(1/8, x => x.add(7))`
- "Add an echo" → `.echo(4, 1/8, .5)`
- "Stereoize it" → `.jux(rev)`
- "Make every 4th bar special" → `.every(4, fn)`
- "Add a counter-melody on top" → `.superimpose(x => x.transform())`
- "Replace it with a transformed version" → `.layer(x => x.transform())`
- "Re-section it rhythmically" → `.struct("x ~ x x")`
- "Gate it for arrangement" → `.mask("<x@7 ~>/8")`
- "Apply transform to one chunk per cycle" → `.chunk(4, fn)`
- "Stretch a continuous signal into discrete notes" → `.segment(8)`
- "Give it a triplet feel" → `.swing(8)` or `swingBy(1/3, 8)`

The vocabulary is small but the combinations are unbounded.
