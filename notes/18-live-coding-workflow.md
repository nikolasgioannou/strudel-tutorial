# 18 — Live Coding Workflow

How to actually *perform* with Strudel. The mechanics of editing-while-playing, building up a track from scratch, muting layers, switching sections.

## The REPL loop

When you press `Ctrl+Enter`, three things happen:

1. **Transpilation** — the editor contents are parsed (via acorn) and rewritten. Mini-notation strings get auto-wrapped: `note("c3 [e3 g3]*2")` becomes something like `note(m('c3 [e3 g3]*2', 5))` where `m()` is the mini-notation parser and `5` tracks source location for highlighting.

2. **Pattern construction** — the rewritten code is evaluated as JavaScript, producing a single root pattern (typically a `stack(...)` of all your layers).

3. **Scheduler update** — the new pattern becomes the active query target. The scheduler keeps querying for events 50-150 ms ahead of audio playback. When the new pattern takes over, it does so **at the next cycle boundary** so the change is musical rather than abrupt.

The full latency from "press Enter" to "hear change" is `minLatency + query_interval`, typically 50ms + 100ms = ~150ms worst case.

## Keybindings

| Shortcut | What it does |
|---|---|
| `Ctrl+Enter` | Evaluate (play / re-evaluate the document) |
| `Ctrl+.` | Stop (hush everything) |
| `Cmd+/` (Mac) / `Ctrl+/` (Win) | Toggle comment on current line |
| Click into editor | Resume AudioContext (required by browser) |

## The `$:` and `_$:` prefixes

The single biggest convenience for live coding. Multiple `$:` lines auto-stack:

```js
$: s("bd*4").bank("RolandTR909")
$: s("- sd").bank("RolandTR909")
$: s("hh*8").gain(.5)
$: note("c2 eb2 g2").s("sawtooth")
```

This is equivalent to wrapping everything in `stack(...)` but lets you organize layers as flat lines.

**`_$:`** mutes that line:

```js
$:  s("bd*4")        // playing
_$: s("hh*8")        // muted
$:  note("c").s("piano")
```

To unmute, just remove the underscore. The line is still parsed (so it doesn't break the document), but produces silence.

This pattern is the "solo" / "mute" of live coding. Build up a stack, then `_$:`-mute layers to "solo" individual elements, then unmute progressively for a buildup.

## `hush()`, `silence`, `.hush()`

Three related concepts:

- **`hush()`** (a function call) — silences everything. Called as the stop button.
- **`silence`** (a pattern) — a pattern that produces no events. Used as a placeholder in `arrange`, `stack`, etc.
- **`.hush()`** (a method) — silences a specific pattern inside a stack:

```js
stack(
    s("bd").hush(),       // muted
    s("hh*8")               // playing
)
```

`silence` is useful when you want explicit empty slots:

```js
arrange([2, silence], [4, s("bd*4")], [2, silence])
```

Two cycles silent, then 4 cycles of kick, then 2 silent.

## The "build it up" workflow

The traditional live-coding flow:

1. **Start blank.** Empty document. `Ctrl+Enter` does nothing.
2. **Add a kick.** `$: s("bd*4")` — bare four-on-the-floor. Re-evaluate.
3. **Add hats.** `$: s("hh*8")`. Re-evaluate. Now you have a beat.
4. **Add bass.** `$: note("c2 c2 eb2 c2").s("sawtooth").lpf(800)`. Re-evaluate.
5. **Add chord pad.** `$: chord("Cm7").voicing().s("gm_epiano1").room(.5)`.
6. **Add a melody.** `$: n("0 2 4 6").scale("C:minor").s("triangle").delay(.3)`.
7. **Modulate.** Add `.lpf(sine.range(...).slow(8))` to the bass, change the chord progression, mask sections in and out.
8. **Bring it down.** Mute some layers (`_$:`), re-evaluate. Re-introduce them for a build.

Each step is a small edit followed by `Ctrl+Enter`. The audio never stops; changes snap in at cycle boundaries.

## Cycle quantization (and how to feel it)

Every `Ctrl+Enter` waits for the next cycle boundary to swap the new pattern in. This means:

- If you edit slow patterns (long cycles), changes feel delayed.
- If your CPS is high (fast cycles), changes feel snappy.
- The change is *quantized* — beats don't get clipped mid-event.

If you want immediate change (cuts mid-cycle), `hush()` then re-evaluate.

## Sample loading lifecycle

Strudel is **lazy** about loading samples. The first time you play `s("amen")`, it fetches the sample over the network. This can introduce silence on first play. To avoid:

1. Use `samples('github:tidalcycles/dirt-samples')` near the top to pre-register the index.
2. The samples themselves still only download on first play — but the index is cached.
3. After first play, subsequent plays of the same sound are instant (cached).

For performance, do all your sample setup at the top of the document, even if you don't play those sounds immediately.

## The performance mindset

Live coding is performed. Things that matter:

- **Predictability.** Practice changes ahead so you know what each will sound like. Don't surprise yourself live.
- **Cycle anticipation.** Edit a layer's parameter *just before* the cycle ends so the change lands on the downbeat.
- **Visible code.** Audiences appreciate seeing the code. Format it cleanly. Comment intentionally — comments are part of the performance.
- **Use `.color()` everywhere.** Visualizers light up; it gives the audience visual feedback that matches what they hear.
- **Pace yourself.** Don't type too much. A few impactful changes per minute beats constant tweaking.

## Performance recipes

### Pre-stage variants

Write multiple versions of a layer commented out; uncomment one at a time:

```js
$: s("bd*4")
// $: s("bd*4, [- cp]*2")
// $: s("bd(3,8)")
```

Each represents a "section" — uncomment to switch.

### Use `cat()` or `<>` for hands-free progression

```js
const verse = stack(s("bd*4"), s("hh*8"));
const chorus = stack(s("bd*4, [- cp]*2"), s("hh*16"));

cat(verse, verse, chorus, verse).slow(4)
```

Auto-cycles through sections every 4 cycles. Pre-composed arrangement.

### Toggle layers via `mask`

```js
$: s("bd*4").mask("<x x x ~>/4")   // mute every 4th cycle
$: s("hh*8").mask("<~ x x x>/4")   // mute every 1st cycle
```

Use `<x x x ~>/N` patterns to schedule mute/unmute across many cycles without editing live.

### `solo` pattern

There's a `solo()` function in Strudel for spotlighting one pattern from a stack — useful when teaching or debugging.

## Editor integrations

The browser REPL is the canonical environment, but external editors exist:

- **VS Code** — "Strudel VS" extension. Edit in your favorite editor, evaluate against the browser.
- **Neovim** — `strudel.nvim` plugin.
- **strudelplay** — local file watcher; saves trigger re-evaluation.
- **Flok** — multiplayer live coding session.

For solo bedroom practice, browser-only is fine. For collaborative sessions or extended composition, external editors give you better text-editing features.

## Embedded usage

If you embed Strudel in your own page (via `@strudel/web` or `@strudel/repl` npm packages), you typically:

1. Initialize with `initStrudel({ prebake: () => samples(...) })`.
2. Wire a "play" button to call `evaluate(textareaContent)`.
3. Wire a "stop" button to call `hush()`.

The browser's autoplay policy requires a user gesture before AudioContext resumes — wiring play to a button click satisfies that.

## Common workflow problems and fixes

| Problem | Cause | Fix |
|---|---|---|
| No sound on first play | Autoplay policy not satisfied | Click into the editor or a button first |
| First sample plays silent | Lazy sample loading | Pre-load with `samples(...)` at top |
| Change doesn't take effect immediately | Cycle quantization | Wait one cycle; or `hush()` + re-eval |
| Edit broke everything | Syntax error | Check the console for the JS error message |
| Audio glitches when re-evaluating | Too many voices, voice stealing | Reduce polyphony, add `cut()` to drum stacks |
| Phantom delay/reverb tails | Multiple patterns sharing same orbit | Use `.orbit(2)`, `.orbit(3)` for independent FX |
| Sample doesn't exist | Bank prefix mismatch | Check the sounds tab in REPL; verify `.bank()` |
| Scale name doesn't parse | Used spaces instead of `:` | `"C:major"` not `"C major"` |

## The "save your set" approach

Many performers don't compose from scratch live — they prepare a "set" of patches in advance, then perform by switching/modifying them. Save your favorite patterns in `.str` or `.js` files; copy into the REPL during performance and tweak from there.

The Strudel REPL has built-in "patterns" tab where you can save patches with metadata (`@title`, `@by`, etc.) for later retrieval.
