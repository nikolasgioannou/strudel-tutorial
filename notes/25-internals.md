# 25 — Internals

How Strudel works under the hood. This is research mostly from reading the source at `codeberg.org/uzu/strudel` (the GitHub repo `tidalcycles/strudel` is now archived and points to Codeberg). I'm capturing this so when I run into puzzling behavior I have a model of the engine, not just the API.

## The packages

Strudel is a monorepo. Key packages:

- **`@strudel/core`** — the pattern engine. Pattern type, Hap, TimeSpan, Fraction, alignment operators, register system.
- **`@strudel/mini`** — the mini-notation parser. Krill PEG grammar via peggy.
- **`@strudel/transpiler`** — turns user code into pattern code (auto-wraps strings, handles `$:` labels).
- **`@strudel/superdough`** — the audio engine. WebAudio nodes, AudioWorklets, sample loading, voice management.
- **`@strudel/webaudio`** — wraps superdough as a Strudel "output."
- **`@strudel/repl`** — the in-page editor + evaluation loop.

## The scheduler

Strudel ships **two schedulers**: `Cyclist` (default, single-instance) and `NeoCyclist` (multi-instance via SharedWorker, used when multiple iframes/REPLs need to share a clock).

### How the timing loop works

The driving clock is in `zyklus.mjs`:

```js
function createClock(getTime, callback,
    duration = 0.05,    // one query window in seconds
    interval = 0.1,     // setInterval polling interval
    overlap = 0.1,      // lookahead beyond interval
    ...) {
    let phase = 0;
    let minLatency = 0.01;
    const onTick = () => {
        const t = getTime();                          // AudioContext time
        const lookahead = t + interval + overlap;
        if (phase === 0) phase = t + minLatency;
        while (phase < lookahead) {
            callback(phase, duration, tick, t);
            phase += duration;
        }
    };
    setInterval(onTick, interval * 1000);
}
```

This is the **classic Chris Wilson look-ahead scheduler pattern**:
- `setInterval` fires every 100ms.
- Inside each tick, it queries enough of the pattern to fill the next ~150-200ms (interval + overlap).
- All `phase` values are in **AudioContext seconds**, not pattern cycles.
- The actual audio scheduling happens via `o.start(targetTime)` calls — sample-accurate.

### Latency budget

From the Strudel docs:

> "In Strudel, the current query interval is 50ms with a minLatency of 100ms, meaning the latency is between 50ms and 150ms."

So the worst-case latency from "press Ctrl+Enter" to "hear new pattern" is `interval + minLatency` ≈ 150ms.

The `Cyclist.latency` parameter (default 100ms) is added to every event's `targetTime`, so events are always scheduled 100ms ahead of the AudioContext clock — gives Web Audio time to actually queue them.

### Cyclist's tick

```js
this.clock = createClock(getTime, (phase, duration, _, t) => {
    const begin = this.lastEnd;
    const end = ...;  // begin + duration in cycles
    this.lastEnd = end;
    
    const haps = this.pattern.queryArc(begin, end, { _cps: this.cps, ... });
    
    haps.forEach((hap) => {
        if (hap.hasOnset()) {
            const targetTime = (hap.whole.begin / this.cps)
                              + this.seconds_at_cps_change
                              + latency;
            const duration = hap.duration / this.cps;
            onTrigger(hap, deadline, duration, this.cps, targetTime);
        }
    });
});
```

Key insight: **`hap.whole.begin` is in cycles** (a `Fraction`), converted to AudioContext seconds via `/ cps + seconds_at_cps_change`. This piecewise conversion handles tempo changes correctly — events queued before a `setCps` still play at the old tempo.

## Hot-reload — *no cycle quantization*

Surprise: there is **no built-in cycle-boundary quantization on evaluation**. When you press Ctrl+Enter, `repl.evaluate()` does:

```js
scheduler.setPattern(pattern, autostart);
// = this.pattern = pat;
```

That's it. The next scheduler tick (within ~150ms) queries the new pattern starting at `lastEnd` (the cycle position the old pattern was queried up to). Because `queryArc` is pure and time-relative, the new pattern picks up at whatever cycle phase the clock is at.

The "feel" of cycle quantization in Strudel comes from:
1. Patterns being structurally aligned to cycles (the new pattern's slot 0 begins at cycle integers).
2. `Pattern.queryArc(begin, end)` returning events for the queried window only — no doubled-up triggering.

Already-scheduled audio events keep playing. Web Audio doesn't cancel `o.start(t)` calls. So if a sample's release is in flight when you re-evaluate, you'll hear it finish — even if its source pattern is now gone.

## The transpiler

Source: `@strudel/transpiler`. Pipeline:

```
user code → acorn parse → estree-walker walk → escodegen generate → Function(body)()
```

Crucially: **no `eval` is used**. `Function(body)()` is the equivalent that doesn't expose lexical scope.

### Auto-wrapping double-quoted strings

The `doublequotes` plugin walks the AST. When it finds a string literal with double quotes (raw[0] === '"'), it replaces it with a call to `m()` (mini-notation parser):

```js
"c3 e3 g3"   // user writes
m("c3 e3 g3", 5)   // becomes (where 5 is the source byte offset)
```

The byte offset lets the editor highlight the active leaf when it triggers. There's also a backtick plugin (template literals) and a `tidal\`...\`` plugin (Haskell-style mini).

You can opt out with paired `// mini-off` / `// mini-on` comments.

### `$:` labels

`$:` is parsed as a JavaScript **labeled statement**. Strudel rewrites every labeled statement:

```js
$: s("bd sd")        // user writes
s("bd sd").p('$')    // transpiled to
```

`Pattern.prototype.p` (injected by `repl.mjs`) stores the pattern in a `pPatterns` map keyed by label. After all transformations, `applyPatternTransforms` does:

```js
pattern = stack(...Object.values(pPatterns));
```

So all `$:` lines auto-stack. Multiple `$:` get unique anonymous indices so they don't collide.

**Mute prefix `_$:`**: keys starting with `_` (or ending with `_`) cause `pPatterns[id] = silence` instead of the actual pattern. So muted lines are still transpiled and tracked, just emit silence.

**Solo prefix `S$:`**: keys starting with `S` cause all non-`S` patterns to be dropped from the stack.

### Last expression becomes return

The transpiler turns the program's last expression into a `ReturnStatement`. So you can write:

```js
$: s("bd*4")
s("hh*8")    // last expression — becomes the return value
```

…and the IIFE returns the final `s("hh*8")` pattern. (Combined with `pPatterns`, you get a stacked result.)

## The Pattern type

Source: `@strudel/core`. `Pattern` is *trivially* small:

```js
export class Pattern {
    constructor(query, steps = undefined) {
        this.query = query;        // (State) -> Hap[]
        this._Pattern = true;       // duck-type marker
        this._steps = steps;        // optional, for stepwise
    }
}
```

That's it. A Pattern is **a function `State -> Hap[]`** plus optional metadata.

### `State`

```js
export class State {
    constructor(span, controls = {}) {
        this.span = span;          // TimeSpan
        this.controls = controls;   // arbitrary key-value map
    }
}
```

`controls` is the StateMap — a dictionary that flows through every nested query. The cyclist passes `{ _cps: cps, cyclist: 'cyclist' }`. The REPL injects `id: <label>` for `$:` labels. Anything in `state.controls` is available to functions inside the query.

### `Hap` (event)

```js
export class Hap {
    constructor(whole, part, value, context = {}, stateful = false) {
        this.whole = whole;        // TimeSpan | undefined
        this.part = part;          // TimeSpan
        this.value = value;
        this.context = context;
        this.stateful = stateful;
    }
    hasOnset() {
        return this.whole != undefined && this.whole.begin.equals(this.part.begin);
    }
}
```

The whole-vs-part distinction is the heart of Tidal's algebra. A `Hap` may be a fragment of a logical event:
- `whole` = full extent of the original event (or `undefined` if continuous)
- `part` = active fragment overlapping the queried window

Only the hap that contains the onset (`whole.begin == part.begin`) actually triggers a sound. The others may still affect arc intersections in operators.

**Continuous patterns** (signals) emit haps with `whole === undefined`. They're sampled at the part midpoint.

The name "Hap" instead of "Event" is because JavaScript already has a built-in `Event` class.

### `TimeSpan` and `Fraction`

`TimeSpan` is just `{ begin: Fraction, end: Fraction }`. Strudel uses its own `Fraction` class (not floating-point) to avoid drift across cycle math — important for triplets and complex subdivisions to remain exact.

## How patterns compose

Three layers:

1. **`fmap`/`withValue`** — functor: `pat.fmap(f)` maps `f` over each hap's value.
2. **Applicatives**: `appLeft`, `appRight`, `appBoth`. Pattern of functions ⊛ pattern of values.
3. **Monadic joins**: `innerJoin`, `outerJoin`, `squeezeJoin`, `resetJoin`, `restartJoin`, `polyJoin`.

There's **no mutation**. Every operation returns a fresh Pattern whose `query` closes over the original. The official docs make this explicit:

> "Strudel and Tidal are all about transforming patterns, so how is this done? The answer is, by replacing the pattern with a new one, that calls the old one."

### Alignment operators implementation

The `_opIn` / `_opOut` / `_opMix` / `_opSqueeze` etc. low-level methods:

```js
_opIn(other, func)   { return this.fmap(func).appLeft(reify(other)); }
_opOut(other, func)  { return this.fmap(func).appRight(reify(other)); }
_opMix(other, func)  { return this.fmap(func).appBoth(reify(other)); }
_opSqueeze(other, func)    { return this.fmap(a => reify(other).fmap(b => func(a)(b))).squeezeJoin(); }
_opSqueezeOut(other, func) { return reify(other).fmap(a => this.fmap(b => func(b)(a))).squeezeJoin(); }
_opReset(other, func)      { return reify(other).fmap(b => this.fmap(a => func(a)(b))).resetJoin(); }
_opRestart(other, func)    { return reify(other).fmap(b => this.fmap(a => func(a)(b))).restartJoin(); }
```

`appLeft` (used by `_opIn`) keeps the structure (`whole`) from the left pattern; `appRight` keeps it from the right; `appBoth` uses the intersection of both.

The user-facing `add` is *not* a function on Pattern — it's a getter returning a callable wrapper:

```js
get: function () {
    const pat = this;
    const wrapper = (...other) => pat[what][DEFAULT_ALIGNMENT](...other);
    for (const how of ALIGNMENTS) {
        wrapper[how.toLowerCase()] = function (...other) {
            return pat['_op' + how](sequence(other), (a) => (b) => _composeOp(a, b, op));
        };
    }
    return wrapper;
}
```

So `pat.add(x)` calls the default alignment (`in`); `pat.add.out(x)` calls `_opOut`; etc. You can change the default with `setDefaultJoin('mix')`.

## SuperDough — the audio engine

### Voice allocation and stealing

```js
export const DEFAULT_MAX_POLYPHONY = 128;

// Inside the trigger function:
for (let i = 0; i <= activeSoundSources.size - maxPolyphony; i++) {
    const ch = activeSoundSources.entries().next();   // FIFO
    const source = ch.value[1].deref();
    source?.node?.gain?.linearRampToValueAtTime(0, t + 0.25);
    source?.stop?.(t + 0.25);
    activeSoundSources.delete(ch.value[0]);
}
```

So polyphony cap is **128 voices**, FIFO voice stealing with a 250ms gain ramp. Each voice is stored as a `WeakRef` so GC can claim it naturally.

`setMaxPolyphony(n)` is exposed to user. Increase if you want more simultaneous voices; decrease for a lo-fi "ducking" effect under load.

### Cut groups

When a sample plays with `.cut(N)`, Strudel checks for any active voice with the same cut group. If found, that voice's gain is `linearRampToValueAtTime(0, time + 0.01)` — fast 10ms fade. Then the new voice starts.

This is why `.cut(1)` on drum hits prevents tail pile-up.

### AudioWorklets

SuperDough registers ~16 AudioWorklet processors:
- `lfo-processor`
- `coarse-processor`, `crush-processor`, `shape-processor`, `distort-processor`
- `ladder-processor` (Moog-style filter), `djf-processor`
- `supersaw-oscillator`, `pulse-oscillator`, `wavetable-oscillator-processor`
- `phase-vocoder-processor` (for high-quality time/pitch)
- `byte-beat-processor`, `transient-processor`, `envelope-processor`
- `generic-processor` (Kabelsalat custom DSP)

If `disableWorklets` is set, these don't load — and the corresponding effects/synths fall back to silence or fail. There's **no ScriptProcessor fallback**.

### Sample loading

```js
const bufferCache = {};   // url -> AudioBuffer (decoded)
const loadCache = {};     // url -> Promise<AudioBuffer>

export const loadBuffer = (url, ac, s, n = 0) => {
    if (!loadCache[url]) {
        loadCache[url] = fetch(url)
            .then((res) => res.arrayBuffer())
            .then(async (res) => {
                const decoded = await ac.decodeAudioData(res);
                bufferCache[url] = decoded;
                return decoded;
            });
    }
    return loadCache[url];
};
```

Two-tier cache:
- `loadCache[url]` — Promise-coalescing. Concurrent triggers don't double-fetch.
- `bufferCache[url]` — decoded buffer in memory.

Same URL is **never fetched twice within a session**. A hard reload clears both.

### IndexedDB (user samples only)

For *user-uploaded* samples (drag-and-drop into REPL), Strudel persists Blobs to IndexedDB:

```
database = 'samples'
objectStore = 'usersamples'
fields = { id, title, blob }
```

Remote samples (`github:user/repo`) are NOT persisted in IndexedDB — they rely on:
1. Browser HTTP cache (between sessions).
2. SuperDough's in-memory `bufferCache` (within a session).

### Orbits — how FX buses work

Each orbit is an independent FX chain:

```js
export class Orbit {
    reverbNode;     // single per-orbit reverb (shared across voices)
    delayNode;      // single per-orbit feedback delay
    output;
    summingNode;
    djfNode;
    
    duck(t, ...) { ... }   // sidechain on this orbit only
}
```

So **per-orbit**: reverb, delay, DJ filter, summing/output, sidechain target.

**Global**: master output, channel merger, analysers (for visualizers), buses (for `bus` control).

When you call `.orbit(2)`, your voice routes to orbit 2's reverb and delay. Different orbits don't share FX, which is why you need `.orbit(2)` to give a layer its own delay parameters.

### Multi-channel orbit mode

If `setMultiChannelOrbits(true)`, orbit `N` routes to physical audio channels `[2N-1, 2N]`. So orbit 1 → channels 1-2, orbit 2 → 3-4, etc. Useful for surround output or per-orbit recording.

### Node pool (CPU optimization)

SuperDough recycles Web Audio nodes via WeakRef stacks:

```js
const releaseNodeToPool = (node) => {
    node.disconnect();
    if (node instanceof AudioScheduledSourceNode) return;  // not reusable
    pool.push(new WeakRef(node));
};
const getNodeFromPool = (key, factory) => {
    while (pool.length) {
        const node = pool.pop()?.deref();
        if (node && isNodeAlive(node)) return node;
    }
    return factory();
};
```

Filters and worklets get reused instead of newly allocated. AudioWorklets get a 0.5s grace window after `end` before being eligible for reuse — race-condition guard.

Separate from polyphony stealing — node pool is about avoiding GC pressure, not limiting voice count.

## Mini-notation parser

The parser is **peggy** (the maintained fork of PEG.js). Grammar lives in `@strudel/mini/krill.pegjs`, named after a predecessor "krill" project by Mdashdotdashn.

### AST node shapes

- `AtomStub` — `{ type_: 'atom', source_: 'c3', location_: {...} }`
- `ElementStub` — wraps an atom or sub-pattern with options (ops, weight, reps)
- `PatternStub` — `{ type_: 'pattern', arguments_: { alignment, _steps, seed }, source_: [...] }`
- `OperatorStub` — top-level operators (`slow $`, `fast $`, etc.)
- `CommandStub` — `setcps`, `setbpm`, `hush`

### Alignments carried in `arguments_.alignment`

- `fastcat` — default sequence (space-separated)
- `stack` — comma-separated
- `rand` — pipe-separated (random pick)
- `feet` — dot-separated (equal-foot)
- `polymeter` — curly-brace
- `polymeter_slowcat` — angle-bracket (alternation across cycles)
- `slowcat` — slow concatenation

### `patternifyAST`

Walks the AST and dispatches to Strudel functions:

```js
case 'pattern': {
    const children = ast.source_.map(enter);
    switch (ast.arguments_.alignment) {
        case 'stack':              return strudel.stack(...children);
        case 'polymeter_slowcat':  return strudel.stack(...children.map(c => c._slow(c.__weight)));
        case 'polymeter':          return strudel.stack(...aligned);
        case 'rand':               return strudel.chooseInWith(...);
        case 'feet':               return strudel.fastcat(...children);
        default:                   return strudel.sequence(...children);  // or timeCat if weighted
    }
}
case 'atom':
    if (source === '~' || source === '-') return strudel.silence;
    return strudel.pure(value).withLoc(from, to);
```

So mini-notation is just a frontend that produces calls to `stack`, `fastcat`, `sequence`, `silence`, `pure`, `chooseInWith` — the same functions you'd use directly.

`applyOptions` applies `*N`, `/N`, `!N`, `?`, `(p,s,r)`, `:N`, `..N` by calling Strudel methods like `.fast()`, `.slow()`, `._repeatCycles()`, `._degradeByWith()`, `.euclid()` / `.euclidRot()`.

## The `register()` system

User-defined chained methods get registered via `register(name, func, ...)`:

```js
export function register(name, func, patternify = true, preserveSteps = false,
                          join = (x) => x.innerJoin()) {
    if (patternify) {
        pfunc = function (...args) {
            args = args.map(reify);
            const pat = args[args.length - 1];
            const firstArgs = args.slice(0, -1);
            
            if (firstArgs.every(a => a.__pure != undefined)) {
                // scalar args — direct call
                return func(...firstArgs.map(a => a.__pure), pat);
            }
            // pattern args — applicative + join
            const [left, ...right] = firstArgs;
            let mapFn = curry((...a) => func(...a, pat), null, arity - 1);
            return join(right.reduce((acc, p) => acc.appLeft(p), left.fmap(mapFn)));
        };
    }
    Pattern.prototype[name] = function (...args) {
        return pfunc(...args.map(reify), this);
    };
    if (arity > 1) {
        Pattern.prototype['_' + name] = function (...args) {
            return func(...args, this);   // unpatternified version
        };
    }
    strudelScope[name] = curry(pfunc, null, arity);
}
```

So `register('foo', (a, b, pat) => ...)` produces:
- `Pattern.prototype.foo(a, b)` — patternifies args, applies the pattern.
- `Pattern.prototype._foo(a, b)` — raw, scalar-only version (for performance).
- `globalThis.foo` — curried, callable as `foo(a, b, pat)`.

This is how every operator in Strudel is defined uniformly.

## No memoization, no equality

Important non-feature: **no query result caching**. Each `queryArc(begin, end, controls)` re-runs the full closure chain. There's no:
- Pattern hashing.
- Equality checks (no `Pattern.equals`).
- Result memoization.

This is intentional. Caching would break random/state-dependent patterns since the `controls` map varies per query.

For typical workloads (50ms windows, <100 haps each), this is fine. Strudel deliberately leaves caching to higher layers.

## What happens on Ctrl+Enter

The full evaluation flow:

1. **Update state**: `updateState({ code, pending: true })`.
2. **Re-bind** `Pattern.prototype.p` and `d1..d9`/`p1..p9` (pPatterns getters).
3. **Hook**: `await beforeEval?.(...)`.
4. **Clear**: `allTransforms = []; codeBlocks = {}; hush();` — resets the `pPatterns` map.
5. **Transpile + evaluate** via `Function(body)()` → produces a new pattern.
6. **Apply transforms**: `applyPatternTransforms(pattern)` — re-stacks `$:` and applies `each`/`all` global transforms.
7. **Schedule**: `scheduler.setPattern(pattern, autostart)` — assigns `this.pattern = pat`.
8. **Next tick** (within ~150ms): the new pattern is queried for the next 200ms window.

In-flight WebAudio nodes keep playing. Any release tail in progress finishes naturally.

## What `hush()` does

```js
function hush() {
    pPatterns = {};
    allTransform = undefined;
    eachTransform = undefined;
    return silence;
}
```

Clears the pattern map and returns silence. Subsequent ticks query `silence`, which produces no events. **Already-scheduled audio still plays to its natural end** — `hush()` doesn't reset the audio graph.

To force-stop active voices, call `scheduler.stop()` — which sets `lastEnd = 0` so future ticks don't query — but again, in-flight WebAudio doesn't get killed except by polyphony stealing or cut-group conflicts.

## Why all this matters for use

Knowing the engine helps when:

- **Latency feels off**: it's the 50–150ms scheduler window, not your code.
- **Hot reload didn't work**: maybe you typed into a string that's now muted (`_$:`).
- **Voice stealing audible**: you exceeded 128 voices (try `setMaxPolyphony(256)` or use `cut`).
- **Sample plays delayed**: first-load fetch — pre-load samples.
- **FX bleed between layers**: same orbit. Use `.orbit(2)`, `.orbit(3)`.
- **Reverb glitches**: changing `roomsize` recalculates IR; pattern slowly.
- **Pattern math gives unexpected events**: alignment defaults to `.in` (left structure). Use `.add.out(...)` etc.

The architecture is small, principled, and inspectable. ~5000 lines of core JavaScript implement everything in this notebook.
