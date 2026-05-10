# 31 — Pattern Algebra (Formal Reference)

A rigorous reference for what every operator *actually* does to the query function. Useful when I'm trying to reason about pattern composition rather than guess from name analogy.

I'll use Haskell-ish type signatures because they're more compact than JavaScript types. Translation: `Pattern a` is a Strudel pattern producing values of type `a`. `Time` is `Fraction`. `Arc = TimeSpan`.

## Foundations

### Types

```haskell
type Time     = Fraction              -- exact rational
data Arc      = Arc { begin :: Time, end :: Time }
data Hap a    = Hap { whole :: Maybe Arc, part :: Arc, value :: a }
data State    = State { span :: Arc, controls :: Map String Any }
type Pattern a = State -> [Hap a]
```

A `Pattern a` is *just* a function `State → [Hap a]`. Every operator manipulates that function.

### Hap onset

A hap *triggers* a sound only if `whole.begin == part.begin`. This is the "onset" condition. Fragments (haps where the part starts after the whole's begin) don't re-trigger.

### Continuous patterns

If `whole == Nothing`, the pattern is continuous (a signal). Each hap is sampled at the part's midpoint and produces a value, but never triggers a discrete sound.

## Primitive constructors

### `pure :: a -> Pattern a`

```js
pure(v).query(state) =
    state.span.spanCycles.map(subspan =>
        Hap(wholeCycle(subspan.begin), subspan, v))
```

One whole-cycle event per cycle in the queried span.

### `silence :: Pattern a`

```js
silence.query(state) = []
```

Always empty.

### Constant lift (`reify`)

Any non-pattern value `v` is automatically `pure(v)` when passed where a pattern is expected. So `add(0.5)` is `add(pure(0.5))`.

## Functor

### `fmap :: (a -> b) -> Pattern a -> Pattern b`

```js
fmap(f, pat).query(state) = pat.query(state).map(hap =>
    Hap(hap.whole, hap.part, f(hap.value)))
```

Apply `f` to every hap's value, preserving timing structure.

In Strudel: `pat.fmap(f)` or `pat.withValue(f)`.

## Applicative

### `appLeft :: Pattern (a -> b) -> Pattern a -> Pattern b`

```js
appLeft(funcPat, valPat).query(state) =
    funcPat.query(state).flatMap(hapF =>
        valPat.query(state.setSpan(hapF.wholeOrPart)).flatMap(hapV =>
            let newWhole = hapF.whole;          // ← from LEFT
                newPart  = hapF.part.intersection(hapV.part)
            in if newPart != null
               then [Hap(newWhole, newPart, hapF.value(hapV.value))]
               else []))
```

The `whole` (timing structure) comes from the **left** pattern. The value pattern is queried only within the left's hap span.

### `appRight :: Pattern (a -> b) -> Pattern a -> Pattern b`

Mirror: `whole` comes from the **right** (value) pattern.

### `appBoth :: Pattern (a -> b) -> Pattern a -> Pattern b`

`whole` is the **intersection** of both. So if a function-hap's whole is `[0, 1)` and a value-hap's whole is `[0.5, 1.5)`, the resulting whole is `[0.5, 1)`.

## Monadic joins

A `Pattern (Pattern a)` is a "pattern of patterns" — at each event, the value is itself a pattern. Joining flattens.

### `innerJoin :: Pattern (Pattern a) -> Pattern a`

```js
innerJoin(pp).query(state) = pp.query(state).flatMap(outerHap =>
    outerHap.value.query(state).filter(innerHap =>
        ... within outerHap span ...))
```

Each inner pattern is queried with the original state. The outer structure dictates *when* to query.

### `outerJoin :: Pattern (Pattern a) -> Pattern a`

The inner patterns determine timing; outer is just selection.

### `squeezeJoin :: Pattern (Pattern a) -> Pattern a`

Each outer hap's slot is *one full cycle* of the inner pattern. Cycles get squeezed into events.

```js
"a b".squeezeJoin("0 1")     ≈    "[0 1] [0 1]"
```

### `resetJoin`, `restartJoin`, `polyJoin`

Variants that reset/restart the inner pattern's clock at outer onsets.

## Time transforms

### `fast :: Pattern Number -> Pattern a -> Pattern a`

```js
fast(n, pat).query(state) =
    pat.query(state.withSpan(span => span.scale(n))).map(hap =>
        hap.withSpan(s => s.scale(1/n)))
```

Stretches the queried span by `n`, then squeezes the resulting events back. So 2× more events per cycle.

`slow(n) = fast(1/n)`.

### `early :: Time -> Pattern a -> Pattern a`

```js
early(t, pat).query(state) =
    pat.query(state.withSpan(span => span.shift(t))).map(hap =>
        hap.withSpan(s => s.shift(-t)))
```

Shift query later by `t`, shift events back earlier.

`late(t) = early(-t)`.

### `rev :: Pattern a -> Pattern a`

```js
rev(pat).query(state) =
    pat.query(state.withSpan(span => span.flipInCycle())).map(hap =>
        hap.withSpan(s => s.flipInCycle()))
```

Reverse arcs within their cycle, query, flip events back.

### `compress :: Arc -> Pattern a -> Pattern a`

```js
compress(arc, pat).query(state) =
    pat.query(state.withSpan(span => span.fitInto(arc)))
```

Fit pattern into a sub-arc of each cycle, leaving silence outside.

### `zoom :: Arc -> Pattern a -> Pattern a`

```js
zoom(arc, pat).query(state) =
    pat.query(state.withSpan(span => span.scaleIntoArc(arc)))
```

Play a subspan of pattern stretched to fill cycle.

## Structural / event-shaping

### `seq :: [Pattern a] -> Pattern a`

```js
seq(ps).query(state) =
    let n = length(ps)
    in concat(ps.mapWithIndex((p, i) =>
        compress(Arc(i/n, (i+1)/n), p).query(state)))
```

Each pattern occupies 1/n of the cycle.

### `cat :: [Pattern a] -> Pattern a`

```js
cat(ps).query(state) =
    let n = length(ps)
    in if floor(span.start) % n == k
       then ps[k].query(state.withSpan(... shifted ...))
       else []
```

One whole cycle per pattern, cycling through.

### `stack :: [Pattern a] -> Pattern a`

```js
stack(ps).query(state) = concat(ps.map(p => p.query(state)))
```

Run all queries, concatenate results. Polyphonic.

### `silence :: Pattern a`

```js
silence.query(state) = []
```

## Pattern alignment (the key insight)

The seven low-level operator-builders, all defined in terms of fmap + applicative + join:

```js
opIn(other, func)        = (this.fmap(func)).appLeft(reify(other))
opOut(other, func)       = (this.fmap(func)).appRight(reify(other))
opMix(other, func)       = (this.fmap(func)).appBoth(reify(other))
opSqueeze(other, func)    = (this.fmap(a => other.fmap(b => func(a)(b)))).squeezeJoin()
opSqueezeOut(other, func) = (other.fmap(a => this.fmap(b => func(b)(a)))).squeezeJoin()
opReset(other, func)      = (other.fmap(b => this.fmap(a => func(a)(b)))).resetJoin()
opRestart(other, func)    = (other.fmap(b => this.fmap(a => func(a)(b)))).restartJoin()
```

User-facing `add`, `sub`, `mul`, `div`, `mod`, `set`, `keep`, `keepif` are getters returning a callable wrapper:

```js
pat.add               // a getter
pat.add(other)        // calls opIn(other, +)        — DEFAULT
pat.add.in(other)     // also calls opIn(other, +)
pat.add.out(other)    // calls opOut(other, +)
pat.add.mix(other)    // calls opMix(other, +)
pat.add.squeeze(...)  // calls opSqueeze(other, +)
```

## Conditional combinators

### `every :: Int -> (Pattern a -> Pattern a) -> Pattern a -> Pattern a`

```js
every(n, fn, pat).query(state) =
    let cycleNum = floor(state.span.start)
    in if cycleNum % n == 0
       then fn(pat).query(state)
       else pat.query(state)
```

Apply `fn` on cycle 0, n, 2n, …; otherwise pass through.

### `lastOf(n, fn, pat)`

Same but `cycleNum % n == n-1`.

### `when :: Pattern Bool -> (Pattern a -> Pattern a) -> Pattern a -> Pattern a`

```js
when(cond, fn, pat).query(state) =
    let condHaps = cond.query(state)
    in pat.query(state).filterMap(hap =>
        let active = condHaps.find(c => c.contains(hap))?.value
        in if active then fn(pure(hap.value)).query(state) else hap)
```

Apply `fn` per-hap based on a binary control pattern.

## Probabilistic

### `degradeBy :: Number -> Pattern a -> Pattern a`

```js
degradeBy(p, pat).query(state) =
    pat.query(state).filter(hap =>
        seededRandom(hap.context, hap.part.start) >= p)
```

Drop each hap with probability `p`. Random seed derived from event context, so same code → same drops within a cycle.

### `sometimesBy :: Number -> (Pattern a -> Pattern a) -> Pattern a -> Pattern a`

```js
sometimesBy(p, fn, pat).query(state) =
    pat.query(state).map(hap =>
        if seededRandom(hap) < p then fn(pure(hap.value)).query(state)
        else hap)
```

Apply `fn` to each hap with probability `p`.

`sometimes(fn)` = `sometimesBy(0.5, fn)`.

### `someCycles :: (Pattern a -> Pattern a) -> Pattern a -> Pattern a`

```js
someCyclesBy(p, fn, pat).query(state) =
    let cycleNum = floor(state.span.start)
    in if seededRandom(cycleNum) < p
       then fn(pat).query(state)
       else pat.query(state)
```

Per-cycle probabilistic application.

## Accumulation / layering

### `superimpose :: (Pattern a -> Pattern a) -> Pattern a -> Pattern a`

```js
superimpose(fn, pat) = stack(pat, fn(pat))
```

### `layer :: [(Pattern a -> Pattern a)] -> Pattern a -> Pattern a`

```js
layer(fns, pat) = stack(...fns.map(fn => fn(pat)))
```

Note: `superimpose` keeps original; `layer` does not (unless `x => x` is in the list).

### `off :: Time -> (Pattern a -> Pattern a) -> Pattern a -> Pattern a`

```js
off(t, fn, pat) = stack(pat, late(t, fn(pat)))
```

Original plus delayed-and-transformed copy.

### `echo :: Int -> Time -> Number -> Pattern a -> Pattern a`

```js
echo(n, t, decay, pat) =
    stack(...[0..n-1].map(i =>
        late(i*t, pat.gain(decay^i))))
```

n stacked time-shifted copies, each with `decay^i` gain.

### `jux :: (Pattern a -> Pattern a) -> Pattern a -> Pattern a`

```js
jux(fn, pat) = stack(pat.pan(0), fn(pat).pan(1))
```

## Continuous signals

### `sine :: Pattern Number`

A pattern such that for any query span:

```js
sine.query(state) = state.span.subdivide(N).map(span =>
    Hap(undefined, span, (sin(2π·span.midpoint) + 1) / 2))
```

Where `N` is some sampling resolution. The `whole = undefined` is what makes it continuous.

### `range :: Number -> Number -> Pattern Number -> Pattern Number`

```js
range(lo, hi, sig) = sig.fmap(v => lo + v*(hi-lo))
```

### `segment :: Int -> Pattern a -> Pattern a`

```js
segment(n, pat).query(state) =
    state.span.subdivide(n).flatMap(subspan =>
        pat.query(State(subspan, ...)).take(1).map(h =>
            Hap(subspan, subspan, h.value)))
```

Sample n discrete events per cycle, giving each one a concrete `whole`.

## A worked composition

`note("c").add("0 7").every(4, rev).fast(2)` desugars to:

```js
fast(2,
    every(4, rev,
        opIn(reify("0 7"),
             v => other_v => v + other_v)
        (fmap(value => Number(value), reify("c")))))
```

Reading inside-out:
1. `reify("c")` produces a constant pattern of "c" (one event per cycle).
2. `note("c")` parses "c" as MIDI 60 = the note C4.
3. `add("0 7")` queries the value pattern (left) for haps; queries "0 7" (right) within each hap's span; left's structure dominates; values are summed.
4. `every(4, rev)` returns a new pattern: query original except cycle-0-of-4 use `rev(pat).query(state)`.
5. `fast(2)` stretches the query span by 2 before delegating, squashes events back.

The final query returns events at cycle granularity 8 events per cycle (because `add("0 7")` has 2 events per cycle, then `fast(2)`), with values `60+0=60` and `60+7=67`, except every 4th cycle they're reversed.

## Why this matters

Every Strudel operator is a function-on-functions. Once I see the pattern algebra at this level, I can:
- Predict any operator's behavior from its definition.
- Compose new operators by combining primitives (and that's exactly what `register()` does).
- Debug unexpected output by tracing back through `whole`/`part` semantics.
- Read source code of the engine without surprise.

The whole language is built from `fmap + appLeft/Right/Both + the joins + Pattern as State→[Hap]`. Everything else is derived.
