# 16 — Strudel vs TidalCycles

Strudel is a JavaScript port of TidalCycles. The conceptual model is identical — `Pattern a = Arc -> [Event a]`, mini-notation grammar, cycle semantics, polyrhythm, polymeter. The differences are surface-level.

This page maps Tidal idioms to Strudel idioms so I can read either codebase.

## What's different

### Host language

- **Tidal** — Haskell. Statically typed. Compiled.
- **Strudel** — JavaScript. Dynamically typed. Browser-based.

### Audio engine

- **Tidal** — sends OSC messages to SuperCollider running SuperDirt. So Tidal is just a *pattern engine*; SuperCollider does the audio.
- **Strudel** — has its own audio engine, **SuperDough**, built on Web Audio API. Runs entirely in the browser, no external software.

Strudel can also send OSC to SuperDirt or send MIDI, so you can use Strudel as a "Tidal-style frontend" for whichever engine you want.

### Default tempo

- **Tidal** — 0.5625 cps (≈ 135 BPM at 4 beats/cycle).
- **Strudel** — 0.5 cps (1 cycle every 2 seconds), or 1 cps in newer versions. Use `setcps()` / `setcpm()` to be explicit.

### Function application

The most pervasive syntactic difference. Tidal:

```haskell
fast 2 $ rev $ s "bd sd hh cp"
```

Strudel:

```js
s("bd sd hh cp").rev().fast(2)
```

Tidal's `$` is right-associative function application; you read right-to-left ("the pattern, then reversed, then fast"). Strudel uses JavaScript method chaining; you read left-to-right.

### Symbolic operators → named methods

Tidal uses Haskell-style symbolic operators that JS can't directly express:

| Tidal | Strudel | Meaning |
|---|---|---|
| `\|+` | `.add` (default `.in`) | Add, structure from left |
| `+\|` | `.add.out` | Add, structure from right |
| `\|+\|` | `.add.mix` | Add, structure from intersection |
| `\|*` | `.mul` (default `.in`) | Multiply, structure from left |
| `*\|` | `.mul.out` | Multiply, structure from right |
| `\|-`, `-\|`, `\|-\|` | `.sub`, `.sub.out`, `.sub.mix` | Subtract |
| `\|/`, `/\|`, `\|/\|` | `.div`, `.div.out`, `.div.mix` | Divide |
| `#` | `.` (method chain) | Combine value patterns (e.g. `pat # gain 0.5`) |
| `<\|>` | `stack(...)` | Stack patterns |
| `<>` | inside mini-notation: `<a b c>` | Cycle alternation |

The `|` in Tidal "points at the structure-providing side." Strudel's named `.in` / `.out` / `.mix` says the same thing more verbosely.

### Events are called Haps

Tidal's documentation calls them "Events." Strudel had to call them something else because JavaScript has a built-in `Event` class — so they're "Haps." Same semantics: a value with a `whole` arc, `part` arc, and `value` field.

### Pattern combinator naming

Mostly identical. Some renamings:

| Tidal | Strudel |
|---|---|
| `iter` | `iter` |
| `iter'` | `iterBack` |
| `someCycles` | `someCycles` |
| `every` | `every` |
| `whenmod a b f` | `lastOf(a, when(b<a, f))` ish — somewhat different |
| `chunk` | `chunk` |
| `juxBy` | `juxBy` |

### Syntactic JS conveniences

JavaScript lets you do things Haskell doesn't:

```js
const keys = x => x.s('sawtooth').lpf(800);
note("c").apply(keys);
```

You can store an effect chain in a `const` and reuse it. Tidal would require a top-level Haskell binding (still possible but heavier).

```js
let chords = chord("<Am F C G>");
stack(
    chords.voicing().s("piano"),
    chords.rootNotes(2).note().s("sawtooth")
);
```

JS variables let you bind a chord progression once and use it across layers. This is one place Strudel feels noticeably *more* comfortable than Tidal.

### Multi-line stacks: `$:`

Strudel introduces `$:` line prefixes:

```js
$: s("bd*4")
$: s("hh*8")
$: note("c e g").s("sawtooth")
```

This auto-stacks the prefixed lines. Tidal has nothing exactly like this — Tidalists use `do` blocks with `<|>`. The Strudel `$:` is more concise for the live-coding case.

To mute a layer, change `$:` to `_$:` — Strudel-specific.

### Block evaluation

Tidal supports block-level evaluation in Atom/Vim plugins (you select a block, evaluate it). Strudel's REPL evaluates the entire buffer on Ctrl+Enter — there's no "evaluate just this block." Workaround: use multiple browser tabs or comment out the parts you don't want playing.

### Sampling

Tidal expects samples on local disk (loaded from SuperDirt's directories). Strudel loads samples from URLs (browser-constraint) — typically GitHub, freesound, or self-hosted.

```js
samples('github:tidalcycles/dirt-samples')
samples('shabda:bass:4')
```

### Type system

- **Tidal** — Haskell catches pattern-type mismatches at compile time. `s(noteValue)` would not type-check because sounds and notes are different types.
- **Strudel** — runtime-typed. You can write nonsense and discover the error at evaluation time. More forgiving for live coding (no compile step) but easier to make mistakes.

In practice: Strudel patterns are uniformly `Pattern` objects, so most operations work on anything. Errors usually manifest as silence or weird outputs rather than type errors.

## Things that exist in both

- **Mini-notation grammar** — identical. `"bd [hh hh] sd"` parses the same way.
- **Cycle as fundamental unit** — identical.
- **Polyrhythm `,`, polymeter `{}`, alternation `<>`** — identical.
- **Euclidean rhythms `(p, s, r)`** — identical.
- **Pattern combinators** — `every`, `sometimes`, `often`, `rarely`, `chunk`, `iter`, `swing`, `palindrome`, `jux`, `off`, `superimpose`, `layer` — all identical semantics.
- **Filter, delay, reverb names** — `lpf`, `hpf`, `delay`, `room` — same.
- **Arrangement via masks** — works the same.

## Things only in Strudel

- Browser audio engine (no SuperCollider needed).
- Built-in soundfonts (`gm_*`, `piano`).
- ZZFX synth (`z_*`).
- Wavetable synth (`wt_*`).
- Hydra integration for visuals.
- Mouse signals (`mouseX`, `mouseY`).
- Pianoroll and other visualizers in-browser.
- `samples('github:user/repo')` shortcut.
- `samples('shabda:...')` freesound integration.
- LFO at audio rate (Strudel's `.lfo()` is more capable than Tidal's `cont` patterns for fast modulation).

## Things only in Tidal

- SuperCollider integration for "real" synthesis (more capable synths, more efficient for big sessions).
- Pure-function ergonomics from Haskell.
- More mature ecosystem (Tidal has been around since 2009).
- Native MIDI clock with sample-accurate timing (Strudel's MIDI is OK but the browser adds latency).

## Coming from Tidal? Here's the cheat sheet

1. Replace `$` with method chains. `f $ g $ pat` → `pat.g().f()`.
2. Replace `|+` with `.add`. Replace `|+|` with `.add.mix`. Etc.
3. Replace `#` with `.`. `pat # gain 0.5` → `pat.gain(0.5)`.
4. Wrap mini-notation in `s("…")`, `note("…")`, `n("…")`.
5. Stack with `stack(a, b, c)` or with `$:` prefixes.
6. Use `setcps` / `setcpm` (Strudel doesn't have Tidal's d1, d2, ... pattern slots — everything is one big `evaluate()`).

## Coming from JavaScript? Here's the orientation

1. The string inside `"…"` is mini-notation, not a regular string.
2. Single quotes `'…'` are NOT parsed — use them for things like scale names that shouldn't be parsed.
3. Method chaining looks JS-y but each call returns a new pure pattern, not a mutated object.
4. `s("foo bar")` is a pattern of two events, not a pattern of one string.
5. The `Pattern` type is opaque — you don't usually see it. Operations build new patterns from old ones.
