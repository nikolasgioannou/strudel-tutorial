# 23 — Gotchas

The mistakes I'll make. Catalogued so I can save myself the debugging time.

## `n` vs `note` are NOT aliases

The single most common beginner trip:

- `note("c3 e3 g3")` — literal pitches.
- `n("0 2 4").scale("C:major")` — scale degree indices.
- `n("0 1 2 3").s("hh")` — sample variant indices.

`s` and `sound` *are* aliases. `n` and `note` are not. Yet they live next to each other in every example.

Symptom of confusion: you write `note("0 2 4")` and get... actually it might work but interpret 0, 2, 4 as MIDI numbers (C-1, D-1, E-1, very low). Or you write `n("c e g")` and get nothing because `n` expects numbers.

## Single vs double quotes

This is the second-biggest trip, especially for JavaScript people:

- `"..."` (double quotes) → **mini-notation, parsed**.
- `'...'` (single quotes) → **plain string, NOT parsed**.

So:

```js
n("0 1 2 3").scale("C:major")    // OK — both parsed (but scale doesn't need parsing here)
n("0 1 2 3").scale('C:major')    // OK — scale lookup uses literal string anyway
n("0 1 2 3").scale("C major")    // BROKEN — space treated as sequence separator
n("0 1 2 3").scale('C major')    // BROKEN — tonal.js rejects this format
```

Scale names must use `:` to separate fields because spaces in the mini-notation parser mean "next event."

Special case: `markcss('text-decoration:underline')` — **must** be single quotes because the value is literal CSS, not a pattern.

## `cb` is cowbell, not C-flat

When you write `s("cb")`, you're playing the cowbell sample. When you write `note("cb")`, you're playing a C-flat note (= B natural).

The context (`s()` vs `note()`) decides. Watch out for this when transposing — a note named `cb` is fine, but only in `note()`.

## `fast(n)` vs `hurry(n)` vs `extend(n)`

- `fast(n)` — n× more events per cycle. Pure timing change.
- `hurry(n)` — n× faster events AND sample playback (so audible pitch shift on samples).
- `extend(n)` — stepwise: n× density AND n× step count. Different beast.

If your sample sounds pitched up when speeding up, you used `hurry` not `fast`.

## `*N` and `/N` inside vs `.fast(N)` outside

- `"bd*4 sd"` — *just* the bd is multiplied; total 5 events, unequal slots.
- `s("bd sd").fast(4)` — entire pattern is multiplied; total 8 events, equal slots.

The mini-notation `*` is local to one event. The JS `.fast()` is global to the pattern. They are not equivalent in the general case.

## Scale name format requires colons

```js
.scale("C:major")          // OK
.scale("A2:minor:pentatonic")  // OK
.scale("C major")          // BROKEN
.scale("D dorian")         // BROKEN
```

Fields separated by `:`, not space.

## AudioContext requires a user gesture

Browsers refuse to start audio until the user clicks something. So:

- The first time you open the Strudel REPL, you must click into the editor (or hit the play button) before sound works.
- If you embed Strudel in your own page, wire `evaluate()` and `hush()` to button clicks — not page-load events.

Symptom: code seems to evaluate fine, no errors, no sound.

## Sample loading is lazy

The first time you play `s("amen")`, Strudel fetches the sample over the network. You'll hear:
1. A pause / silence for the first cycle (sample isn't loaded yet).
2. Then the sample starts playing on the next cycle.

To preempt this:
- Call `samples('github:tidalcycles/dirt-samples')` near the top of your code.
- This registers the index immediately so the actual sample fetch is faster.

## "First sound is silent" — sample timing

> "You'll hear the beginning of the phrase not where the pattern begins."

Many samples have a brief silence at the start before the audible attack. Strudel triggers at the file's start, so the audible hit lands slightly after the cycle position.

Fix with `.early(.05)` or similar — shift the trigger earlier by the sample's lead silence.

## Latency budget

There's ~50-150 ms between pressing Ctrl+Enter and hearing the change. This is by design (allows for cycle quantization and lookahead). Don't expect immediate response.

For "live" controllers (gamepad, MIDI keyboard), latency is shorter (~10-30 ms) but still not zero.

## `_` for visualization vs `_` for mute is different

- `_pianoroll()` (method, underscore prefix) → render inline instead of background.
- `_$:` (line prefix) → mute this stack member.

Same underscore character, different functions. Don't confuse "underscore = inline" with "underscore = mute" — they're separate features that happen to share a character.

## `hush()` vs `silence` vs `.hush()`

- `hush()` — function call to silence everything (Ctrl+. binds to this).
- `silence` — bare identifier, a pattern that produces no events. Use as placeholder.
- `.hush()` — method, silences a specific pattern in a stack.

Don't write `silence()` — it's not a function.

## `.color()` vs `.bank()`

- `.color("cyan")` — visualizer highlight color.
- `.bank("RolandTR909")` — drum sample bank prefix.

Both take a string, both feel similar to type, but they do completely different things. `color` affects visuals only; `bank` changes which sounds play.

## Pattern alignment surprises

By default, `pat.add(other)` uses left structure (`.in`). If you do `note("c").add("0,7")` you get a chord per event (1 event → 1 chord). If you do `note("c").add.out("0 7 12")` you get 3 events.

If your `.add` produces unexpected event counts, you probably want `.add.out`, `.add.mix`, or to restructure the source pattern.

## Reverb size shouldn't pattern fast

`.roomsize(...)`, `.roomfade(...)`, `.roomlp(...)`, `.roomdim(...)` recalculate the reverb impulse response each time their value changes. So patterning them quickly is expensive and can cause audio glitches.

Set them once (or pattern very slowly); pattern `.room(level)` instead — that just changes the send level, no IR recalc.

## `?` in mini-notation rolls fresh each cycle

`"hh hh? hh?"` — the marked `hh`s have a 50% chance to drop on *each cycle*. So the result varies cycle to cycle. If you want a deterministic dropout, use `mask` instead.

For reproducible randomness, set `useRNG('legacy')` at the top.

## Coarse only works in Chromium

`.coarse(n)` (sample-rate reduction) only works in Chromium-based browsers (Chrome, Edge, Brave). In Firefox or Safari it silently does nothing.

## Closed-source use is forbidden

Strudel is AGPLv3 licensed. You cannot ship Strudel embedded in proprietary software. Open-source projects (also AGPL-compatible) are fine. Commercial use is fine as long as your project is also AGPL.

## Pattern equality / hashing

Patterns are functions — they're not equality-comparable in any meaningful way. Don't try `if (pat1 === pat2)` — it'll always be false unless they're literally the same reference. Most pattern operations create new pattern objects each time you compose them.

## `?0.5` vs `?` semantics

In mini-notation `?N` — `N` is the **probability of removal**, not the probability of keeping.

- `?0` — never removes (always plays).
- `?` (no number) — 50% removal.
- `?1` — always removes (never plays).

This is the opposite of how `undegradeBy(p)` works (where `p` is probability of keeping). Easy to swap mentally.

## Multiple delays on same orbit collide

If you have two patterns on the same orbit (default orbit 1), and each has `.delay(...)` with different parameters, the engine processes them with one shared delay — the second pattern's delay settings overwrite the first.

Use `.orbit(2)`, `.orbit(3)`, etc. for independent FX per layer.

## ChatGPT / LLMs are wrong about Strudel

The FAQ explicitly notes: "ChatGPT generally give wrong answers" about Strudel. Same likely applies to me (Claude). I should always verify against the actual docs at strudel.cc rather than trust LLM-generated Strudel code, including my own outputs in these notes.

Common LLM mistakes:
- Inventing function names that don't exist (e.g., `.octave()`).
- Confusing TidalCycles syntax with Strudel.
- Wrong scale name format.
- Hallucinating sample names.

When in doubt: look at the actual REPL's sounds tab, the docs, or the examples gallery.

## Block evaluation doesn't exist

Strudel evaluates the entire document, not selected blocks. If you have multiple "songs" in one buffer, they'll all play simultaneously (overlapping). Workaround: use multiple browser tabs, or comment out the patches you don't want playing.

## Re-evaluating live

When you press Ctrl+Enter mid-performance, currently-playing samples *continue* to their natural end — Strudel doesn't kill voices in flight. New events from the new pattern start at the next cycle boundary.

If you change a pattern's pitch and the change feels "delayed," it's because the previous notes are still ringing out their releases. Use `.release(0)` or `.cut(1)` to make changes snappier.

## Quick-checklist when something's not working

1. **Is AudioContext running?** Click into the editor.
2. **Is the sample loaded?** First play takes a moment; subsequent plays are instant.
3. **Quote type correct?** Double quotes for mini-notation, single for literal strings.
4. **Scale name format correct?** Use `:` not space.
5. **`s` not `n` for samples?** And vice versa.
6. **Comment-out test:** Mute layers to isolate which one is wrong.
7. **Check console.** JS errors show up there.
8. **Cycle quantization:** Did I wait one cycle for the change?
