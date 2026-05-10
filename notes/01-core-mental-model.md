# 01 — Core Mental Model

This is the most important page in this notebook. Every other operator is a consequence of this one idea.

## The keystone

> **A pattern is a pure function from a time-arc to a list of events.**

In Haskell types:

```haskell
type Time   = Rational           -- exact fractions, not floats
data Arc    = Arc { start :: Time, stop :: Time }
data Event a = Event {
    whole :: Maybe Arc,         -- where the event "wants to be"
    part  :: Arc,               -- the slice that overlaps the query
    value :: a                  -- what plays
}
type Pattern a = Arc -> [Event a]
```

So `Pattern Number`, `Pattern Note`, `Pattern SampleName` — they all share the same shape. They are *functions*, not data.

## What this implies

### 1. Patterns don't store events; they compute them on demand.

When the audio scheduler asks "what events happen between t=4.0 and t=4.5?", it calls `pattern.queryArc(4.0, 4.5)` and gets back a list. The pattern itself is just code. Nothing is "happening" in memory until somebody asks.

This is why patterns can be infinite without exploding: an infinitely long pattern is just a function; it only materializes the slice you ask for.

### 2. Every operator is a function-transformation.

`rev(pat)` doesn't reverse a list — it returns a *new pattern* whose query reverses the arc, calls the inner pattern with the reversed arc, then reverses the resulting events back. Pseudocode:

```js
const rev = pat => makePattern(arc =>
    pat.query(flipArc(arc)).map(flipEvent)
);
```

`fast(2, pat)` returns a pattern whose query stretches the arc by 2× before delegating:

```js
const fast = (n, pat) => makePattern(arc =>
    pat.query(scaleArc(arc, n)).map(squashEvent)
);
```

`stack(p1, p2)` returns a pattern whose query calls *both* and concatenates results:

```js
const stack = (p1, p2) => makePattern(arc =>
    [...p1.query(arc), ...p2.query(arc)]
);
```

This is why every combinator in Strudel is so cheap: it's just function composition. You can stack a hundred transformations and the runtime cost is "do all those transformations on each query," not "build a giant data structure."

### 3. Events have *two* arcs: `whole` and `part`.

`whole` is where the event wants to be — its "natural" position. `part` is the slice that overlaps the current query window.

If an event spans `[0.5, 1.5)` and I query `[0, 1)`, I get back an event with `whole = [0.5, 1.5)` and `part = [0.5, 1)`. The fragment "remembers" where it came from. This is why events can straddle cycle boundaries and still play correctly.

### 4. Discrete vs continuous = whether `whole` exists.

- **Discrete pattern** (`note("c3 e3")`): every event has a `whole`. Concrete onsets and durations.
- **Continuous pattern / signal** (`sine`, `saw`, `rand`): events have `whole = Nothing`. The pattern can be sampled at any moment but has no inherent onsets.

`segment(8)` discretizes a continuous signal: it takes 8 samples per cycle and turns them into 8 discrete events with concrete `whole` arcs.

This is why the same operators work on signals and discrete patterns — they're the same type, just with `whole = Nothing` for signals.

### 5. "Everything is a pattern."

Every parameter to every function is itself a `Pattern`. A bare number `0.5` lifts to a constant pattern (a function that always returns one event with value `0.5`). So `gain(0.5)` and `gain("0.5 1 0.5 1")` are the same type — the second just has more events per cycle.

This is why effect parameters can be patterns: they're patterns by default. The "constant" case is the degenerate one.

### 6. Live coding works because patterns are values, not state.

When I edit the code and re-evaluate, the pattern engine doesn't have to "stop, flush, restart." It just swaps a pointer: "from now on, query *this* function instead of that one." Because patterns are pure, the new function computes events for the next time-window starting wherever the scheduler currently is. No glitch. No state to migrate.

The change is typically *snapped to the next cycle boundary* so phrasing stays musical.

## Why this view "clicks" everything else

Once I see patterns as `Arc -> [Event]`, every operator's behavior is deducible:

| Operator | What it does to the query function |
|---|---|
| `rev` | Flip the arc before delegating; flip events back |
| `fast(n)` | Stretch the arc by n; squeeze events back |
| `slow(n)` | Compress the arc by n; expand events back |
| `early(t)` | Shift arc later by t; shift events earlier |
| `late(t)` | Shift arc earlier by t; shift events later |
| `every(n, fn)` | Use original query most cycles; use fn(pat).query on every nth cycle |
| `stack(a, b)` | Run both queries, concatenate |
| `cat(a, b, c)` | Cycle 0 → a, cycle 1 → b, cycle 2 → c, repeat |
| `seq(a, b, c)` | Run all three within one cycle |
| `add.in(other)` | Use this pattern's structure; add other's value at each event |
| `add.out(other)` | Use other pattern's structure; add this pattern's value |
| `mask(other)` | Drop events where other says 0/`~` |
| `struct(other)` | Use other's rhythmic structure with this pattern's values |
| `jux(fn)` | `stack(this.pan(0), fn(this).pan(1))` |

I can keep going forever — it's all "transform the function."

## A worked example: why `"bd*4"` and `bd.fast(4)` produce the same thing

`"bd*4"` is mini-notation. The parser produces the AST `Repeat(bd, 4)`, which compiles to a pattern whose query divides the cycle into 4 slots and emits a `bd` event in each.

`s("bd").fast(4)` is JavaScript. `s("bd")` produces a pattern with one event per cycle at value `"bd"`. `.fast(4)` wraps it so the query stretches the arc by 4× before delegating, then squeezes the events.

Both compute the same events when queried. They reach the same destination by different routes — the first goes through the parser, the second through the runtime function. This is why the language feels "uniform": the parser and the runtime are different syntaxes for the same semantic model.

## The single sentence to remember

> **Patterns are functions; operators are function-transformers; nothing is computed until the scheduler asks "what plays between t₁ and t₂?"**

If something I read later confuses me, I come back here.
