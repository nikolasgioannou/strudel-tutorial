# 03 — Mini-Notation

Strings inside `s("…")`, `note("…")`, `n("…")`, etc. are **not** plain strings. They get parsed as mini-notation: a tiny domain-specific language for expressing rhythmic patterns. Mini-notation is the most concentrated way to write a pattern, and most Strudel code uses it heavily.

The language was originally invented for TidalCycles. It descends from a long line of pattern-string notations going back to at least the 1980s.

> **Conceptual rule of thumb:** every mini-notation feature has a JS-function equivalent. The string is just denser. `"bd*4"` ≡ `s("bd").fast(4)`. `"a b c"` ≡ `seq("a", "b", "c")`. `"<a b c>"` ≡ `cat("a", "b", "c")`. The parser unfolds the string into the same pattern objects the JS API would build directly.

## When mini-notation is parsed

A string inside double quotes `"…"` (or backticks `` `…` `` for multi-line) is parsed if the function expects a pattern. Inside JS code, single-quoted strings `'…'` are just regular strings — so `'C minor'` passed to `.scale()` is a literal string lookup, not a parsed pattern. **This single-vs-double-quote distinction matters and bites people.**

Comments inside mini-notation: none — it's a flat grammar, no `//` inside the string.

## The symbols, conceptually

I'll group these by what they *do to pattern structure*.

### Sequencing (control timing within one cycle)

#### Space — "next event"

```
"bd hh sd hh"
```

The space is the most basic separator. It says "and then." A sequence `"a b c d"` divides one cycle into 4 equal slots and emits one event per slot. The number of top-level elements determines the subdivision.

**Implication**: `"a b c"` is 3 events per cycle, each lasting 1/3 cycle. `"a b c d"` is 4 events per cycle, each 1/4 cycle. The cycle duration doesn't change; the event count does.

#### `[]` — "subdivide this slot"

```
"bd [hh hh] sd"        // subgroup
"bd [hh [sd cp]] cp"   // nested
```

Brackets group events into a sub-pattern. The bracket as a whole occupies *one slot of its parent*; events inside divide that slot equally. This is recursive — you can nest `[ [ [...] ] ]` to any depth.

**Conceptually**: brackets create a *new local cycle* whose duration equals one slot of the outer cycle. Inside that local cycle, the same rules apply: spaces divide, brackets nest, etc.

This is why mini-notation is so dense — instead of writing out timing math, you write nested brackets and the parser does the math.

#### `,` — "play these in parallel"

Two meanings depending on context:

```
"bd, hh*8, ~ cp"          // top-level comma → stack
"[c3, e3, g3]"            // inside brackets → polyphonic chord
```

The comma layers patterns vertically. At top level, `"bd*4, hh*8"` produces two parallel patterns: a 4-on-the-floor kick and 8 hi-hats. Inside brackets, `[c3, e3, g3]` is a chord (three notes simultaneously).

When patterns stacked with `,` have *different event counts per cycle*, you get **polyrhythm**. `"bd*3, hh*4"` plays 3 kicks against 4 hats in the same cycle — they share a cycle but have different rates.

#### `~` and `-` — rest / silence

```
"bd ~ sd ~"
"bd - sd -"        // same thing
```

A literal silence. The slot still exists (it takes up its share of the cycle); nothing plays in it. Use `~` or `-`; they're equivalent. (`-` is sometimes nicer for grid-style notation.)

### Repetition (multiply event count)

#### `*n` — "repeat n times in this slot"

```
"bd*4"             // four bds in one cycle
"bd [hh*3] sd"     // hh plays 3 times in its 1/3 slot
"bd*0.5"           // bd lasts 2 cycles? no — see slow
"bd*2.75"          // fractional reps allowed
```

`*n` says "make this slot contain n copies of this thing." Structurally equivalent to wrapping in brackets and listing it n times. Fractional values are allowed and produce non-integer subdivisions (creates polymeter-ish feel).

#### `/n` — "stretch this over n cycles"

```
"[c d e f]/2"      // takes 2 cycles to play through
"<a b c>/4"        // same as <a b c> stretched over 4
```

`/n` is the inverse: instead of cramming more events per cycle, it spreads the pattern over multiple cycles. `[a b c d]/4` plays one event per cycle for 4 cycles.

#### `!n` — "replicate without speeding up"

```
"c!3 e"            // c, c, c, e — four total slots
"c [eb,<g a bb>!2]"
```

This is the trickiest of the repeaters. `!n` makes `n` *adjacent slots* of the same value. Compare:

- `"c*3"` → three c's crammed into ONE slot (so the whole `c*3` lasts 1/2 cycle in `"c*3 e"`).
- `"c!3"` → three c's each in their OWN slot (so `"c!3 e"` has 4 slots: c, c, c, e).

The difference is whether the repetition happens *inside* one slot (`*`) or *across* multiple slots (`!`). For consistent grooves you almost always want `!`; for fast rolls you want `*`.

#### `@n` and `_` — "elongate this event"

```
"c@3 eb"           // c lasts 3 units, eb lasts 1 — total 4 units
"c _ _ eb"         // same thing — _ extends the previous
```

`@n` says "this event is worth n units of time" (default `@1`). The cycle is divided proportionally by total weight. So `"c@3 eb"` has weights [3,1], total 4, so c gets 3/4 of the cycle and eb gets 1/4.

`_` is the same as `@1` but applied to "extend the previous event by one more unit": `"c _ _"` ≡ `"c@3"`.

This is how you write swing-like grooves: `"c@2 c"` produces a long-short pulse where c1 is twice as long as c2.

### Cross-cycle structure

#### `<>` — "one element per cycle"

```
"<a b c d>"        // cycle 0: a, cycle 1: b, cycle 2: c, cycle 3: d, then loop
"<bd sd>*8"        // 8 events per cycle, ALTERNATING bd and sd ACROSS cycles
```

Angle brackets are the macro-form structure tool. Each element occupies an entire cycle, and the bracket cycles through them across iterations. Equivalent to `cat(a, b, c, d)`.

`<a b c>` ≡ `[a b c]/3` — one event per cycle for 3 cycles.

This is how you write progressions: `"<C^7 Am7 Dm7 G7>"` plays each chord for one cycle.

#### `{}` — "polymeter"

```
"{bd sd hh, cp}"   // one polymeter (bd-sd-hh) against another (cp)
"{a b c d, e f}%4"  // % sets the step length to 4 steps per cycle
```

Curly braces encode **polymeter**: patterns that share a *step rate* but have *different lengths*. Each element gets one "step" of the cycle. Patterns with different step counts will rotate against each other across cycles.

The distinction polyrhythm vs polymeter:

- **Polyrhythm** (`,` inside `[]`): same cycle period, different event rates. `[bd*3, hh*4]` plays 3 against 4 in one cycle.
- **Polymeter** (`{}`): same event rate, different bar lengths. `{a b c, d e}` has both patterns playing at the same step speed; the 3-step pattern wraps every 3 steps, the 2-step every 2 — they line up every 6.

In Strudel docs they put it as: square brackets divide *time* into parallel streams; curly braces let *independent cycles* coexist; angle brackets *rotate selections temporally across cycles*.

### Random / probabilistic

#### `?` — "this event might be silenced"

```
"hh hh? hh? hh"        // 50% chance the marked hh's drop
"hh hh?0.2 hh?0.8"     // custom probability per event
```

A `?` after an event gives it a 50% chance of being silenced (replaced with a rest) on each cycle. `?0.x` lets you specify the probability of *removal* (so `?0.1` = 10% chance gone, `?0.9` = almost always gone).

Per-cycle: each cycle, the dice roll fresh. So the same `?` will sometimes produce the event, sometimes drop it.

#### `|` — "random pick"

```
"a | b | c"            // each cycle, pick one of these
"hh:0 | hh:1 | hh:2"   // pick a sample variant
```

The pipe is "random select between alternatives." On each query, one of the options is picked. Per-cycle by default.

### Sample / variant selectors

#### `:n` — "select sample n"

```
"hh:0 hh:1 hh:2"           // explicit sample variants
"casio:1"                  // second variant (0-indexed)
```

After a sample name, `:n` picks the n-th variant (0-indexed). If the sample has 5 variants and you ask for `:7`, it wraps (Strudel uses modulo).

This is *not* the same as `n("0 1 2").s("hh")`, though it produces the same events. The `:` form is parsed inline; `n()` takes a separate pattern. They compose differently with effects — the separate `n()` form is more flexible because the variant selection is a separable pattern.

### Euclidean rhythms

#### `(p, s)` and `(p, s, r)` — "Euclidean distribution"

```
"bd(3, 8)"             // 3 pulses spread evenly across 8 steps
"bd(3, 8, 2)"          // rotated by 2 steps
"bd(5, 8, -1)"         // rotated backwards by 1 step
```

A Euclidean rhythm distributes `p` pulses across `s` steps as evenly as possible. The result is a rhythm pattern with characteristic "bouncy" timings used in many world music traditions (and electronic music).

Examples:
- `(3, 8)` → `x . . x . . x .` — the famous "tresillo"
- `(5, 8)` → `x . x x . x x .` — "cinquillo"
- `(3, 4)` → `x . x x` — three-against-four
- `(7, 8)` → `x x x x x x x .` — almost-on-every-step

The optional third argument `r` rotates the result by r steps. Negative values rotate the other way.

### Other symbols

#### `.` — "foot divider"

```
"1 2 3 4 . 5 6 . 7 . 8"
```

The dot is an alternative way to group: it divides the pattern into equal-weighted "feet" (sections). Useful when you want unequal-event groups but with equal *durations*. The example above has 4 feet: `[1 2 3 4]`, `[5 6]`, `[7]`, `[8]` — each foot lasts 1/4 cycle, regardless of how many events it has inside.

Less commonly used than brackets but it's there.

#### `b` and `#` — "flat" and "sharp"

```
"c eb gb"          // c, e-flat, g-flat
"c d# f#"          // c, d-sharp, f-sharp
"cb"               // c-flat — but careful: looks like the cowbell sample
```

Inside `note()`, these modify pitch. They also work as accidentals on scale degrees: `"5b"` in a scale context means "the 5th degree, flatted."

(Be careful: `cb` could be interpreted as the cowbell sample inside `s()`, or as "c-flat" inside `note()`. Context decides.)

#### `x` — "not silence" (for `struct`)

```
"x ~ x x ~ x ~ x"      // a struct mask
```

Inside a `struct(…)` argument, `x` means "trigger" and `~` means "rest." This is the rhythm-only language used to impose timing structure on a separate pitch pattern.

#### Backticks — multi-line mini-notation

```js
sound(`
    bd*2, - cp,
    - - - oh, hh*4,
    [- casio]*2
`)
```

Backticks let mini-notation span multiple lines. Useful for big drum-grid patterns. Each line is just continued; whitespace (including newlines) functions like a space.

## The full table

| Symbol  | Name              | What it does to pattern structure |
|---------|-------------------|------------------------------------|
| ` `     | space             | Separates events; divides cycle into N equal slots |
| `[ ]`   | subgroup          | Subdivides one slot recursively |
| `{ }`   | polymeter         | Multiple patterns at same step rate, different lengths |
| `< >`   | alternate         | One element per cycle, cycles across iterations |
| `,`     | parallel/chord    | Layer simultaneously (top-level: stack; in `[]`: polyphony) |
| `*n`    | repeat in-slot    | n copies of value crammed into one slot |
| `/n`    | slow              | Stretch over n cycles |
| `!n`    | replicate         | n copies, each in its OWN slot |
| `@n`    | elongate          | This event has weight n |
| `_`     | extend previous   | Same as `@(prev+1)`; just lengthens the prior event |
| `~`,`-` | rest              | Silence (slot still exists) |
| `?`     | probabilistic drop| 50% chance silenced; `?0.x` for custom probability |
| `\|`    | random pick       | Pick one of the options per cycle |
| `:n`    | sample variant    | Choose n-th sample (0-indexed) |
| `( , )` | euclid            | (pulses, steps) or (pulses, steps, rotation) |
| `.`     | foot              | Equal-duration grouping (alt to brackets) |
| `b`,`#` | accidentals       | Flat/sharp in note context |
| `x`     | trigger           | "Active" beat in `struct` masks |

## Worked examples — translating mini-notation to events

### `"bd hh sd hh"`

```
4 events, each 1/4 cycle:
bd @ [0, 1/4)
hh @ [1/4, 2/4)
sd @ [2/4, 3/4)
hh @ [3/4, 1)
```

### `"bd [hh hh] sd"`

```
3 outer slots. middle slot is subdivided:
bd @ [0, 1/3)
hh @ [1/3, 1/3 + 1/6) = [1/3, 1/2)
hh @ [1/2, 2/3)
sd @ [2/3, 1)
```

### `"<a b c>"` (3 cycles in)

```
cycle 0: a @ [0, 1)
cycle 1: b @ [0, 1)
cycle 2: c @ [0, 1)
cycle 3: a @ [0, 1)   // cycles
```

### `"bd*4, hh*3"` (polyrhythm)

```
Two parallel streams in one cycle:
Stream 1: bd @ [0, 1/4), bd @ [1/4, 2/4), bd @ [2/4, 3/4), bd @ [3/4, 1)
Stream 2: hh @ [0, 1/3), hh @ [1/3, 2/3), hh @ [2/3, 1)
```

### `"c@3 eb"` (elongation)

```
Total weight 4. c claims 3/4, eb claims 1/4:
c  @ [0, 3/4)
eb @ [3/4, 1)
```

### `"bd(3, 8)"` (euclidean)

```
8 steps = 1/8 each. 3 pulses distributed evenly:
bd @ [0,   1/8)
.  @ [1/8, 2/8)
.  @ [2/8, 3/8)
bd @ [3/8, 4/8)
.  @ [4/8, 5/8)
.  @ [5/8, 6/8)
bd @ [6/8, 7/8)
.  @ [7/8, 1)
```

## The two ways to make things faster (and why both exist)

`*n` inside mini-notation is the parser's repetition. `.fast(n)` is a runtime function. They produce the same events when applied to a single thing:

- `"bd*4"` and `s("bd").fast(4)` are equivalent.

But they compose differently with surrounding context:

- `"bd*4 sd"` repeats *just the bd* 4 times in its slot, then plays sd once — total 5 events, unequal subdivision.
- `s("bd sd").fast(4)` repeats *the entire pattern* 4 times — total 8 events, equal subdivision.

So the `*` is *local* to one element of the parser's tree; `.fast()` applies to the whole pattern. Same applies to `/n` vs `.slow()`.

## Inside vs outside mini-notation, conceptually

A small but important point: many operators have both a mini-notation form and a JS form, but they're not always identical. The mini-notation lives at parse time; the JS form lives at runtime. The runtime form is more flexible (you can compute things), the parse-time form is more concise.

Rule of thumb: write rhythm in mini-notation, write transformations in JS. Mini-notation is great for "play these events in this rhythm." JS is great for "now reverse it, layer it, modulate the cutoff with a sine wave."
