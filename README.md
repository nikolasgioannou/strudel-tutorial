# Strudel — Learning Notebook

This is my (Claude's) own knowledge base on **Strudel** — the browser-based live-coding music environment at <https://strudel.cc>. I'm building this so that, after reading the notes end-to-end, I have a rigorous conceptual understanding of every operator, every symbol, and every idiom Strudel offers.

Constraint: **I can't hear audio.** So everything in here is described in terms of what each operator does to the *structure* of a pattern — its timing, layering, transformation, randomness, harmony — not "how it sounds." That turns out to be the right level anyway, because Strudel patterns are fundamentally structural objects.

## Reading order

### Foundations (read these first)

| # | File | What it covers |
|---|---|---|
| 00 | [overview.md](notes/00-overview.md) | What Strudel is, where it came from |
| 01 | [core-mental-model.md](notes/01-core-mental-model.md) | **The keystone idea**: pattern = function from time to events |
| 02 | [the-cycle.md](notes/02-the-cycle.md) | Cycles, CPS, CPM, the rhythm-pitch continuum |
| 24 | [understand-essays.md](notes/24-understand-essays.md) | The three official /understand/ essays |

### Operator vocabulary

| # | File | What it covers |
|---|---|---|
| 03 | [mini-notation.md](notes/03-mini-notation.md) | Every symbol in the string DSL |
| 04 | [sounds-and-samples.md](notes/04-sounds-and-samples.md) | `s` / `n` / `bank`, drum names, sample loading |
| 05 | [notes-and-pitch.md](notes/05-notes-and-pitch.md) | `note` / `n` / `freq`, scales, chords, voicings |
| 06 | [effects.md](notes/06-effects.md) | Filters, envelopes, delay, reverb, distortion, panning |
| 07 | [pattern-transforms.md](notes/07-pattern-transforms.md) | `fast` / `slow` / `rev` / `jux` / `off` / `ply` / `echo` / `chunk` |
| 08 | [conditional-and-random.md](notes/08-conditional-and-random.md) | `every` / `sometimes` / `degrade` / `choose` |
| 09 | [signals-and-modulation.md](notes/09-signals-and-modulation.md) | `sine` / `saw` / `perlin` / `range` / `segment` / LFO |
| 10 | [synthesis.md](notes/10-synthesis.md) | Built-in synths, FM, additive, wavetable, ZZFX, noise |
| 11 | [pattern-alignment.md](notes/11-pattern-alignment.md) | `in` / `out` / `mix` / `squeeze` — which side controls structure |
| 17 | [stepwise-patterns.md](notes/17-stepwise-patterns.md) | `pace` / `expand` / `take` / `drop` / `grow` |
| 32 | [version-history-and-extras.md](notes/32-version-history-and-extras.md) | Release notes + smaller operators |

### Application

| # | File | What it covers |
|---|---|---|
| 12 | [workshop-walkthrough.md](notes/12-workshop-walkthrough.md) | All six workshop pages, annotated |
| 13 | [example-deep-dives.md](notes/13-example-deep-dives.md) | Annotated walkthroughs of real songs |
| 14 | [idioms-and-recipes.md](notes/14-idioms-and-recipes.md) | The repeated moves that show up everywhere |
| 18 | [live-coding-workflow.md](notes/18-live-coding-workflow.md) | REPL, `$:`, `_$:`, mute/solo, performance tips |
| 19 | [visualizations.md](notes/19-visualizations.md) | Pianoroll, scope, spectrum, spiral, pitchwheel |
| 26 | [generative-strategies.md](notes/26-generative-strategies.md) | Patterns that generate music |
| 27 | [granular-and-breakbeat.md](notes/27-granular-and-breakbeat.md) | `chop` / `slice` / `splice` / Amen tradition |
| 28 | [music-theory-primer.md](notes/28-music-theory-primer.md) | Modes, voicings, progressions — Strudel-flavored |
| 30 | [from-zero-to-song.md](notes/30-from-zero-to-song.md) | Narrated walkthrough: empty buffer to finished track |

### Integrations

| # | File | What it covers |
|---|---|---|
| 20 | [midi-and-osc.md](notes/20-midi-and-osc.md) | MIDI in/out, MIDI clock, OSC to SuperDirt, MQTT |
| 21 | [hydra-csound-xen.md](notes/21-hydra-csound-xen.md) | Hydra visuals, CSound, xenharmonic tunings |
| 22 | [input-and-metadata.md](notes/22-input-and-metadata.md) | Gamepad, device motion, metadata tags |

### Background and theory

| # | File | What it covers |
|---|---|---|
| 15 | [glossary.md](notes/15-glossary.md) | Alphabetical lookup of every operator |
| 16 | [strudel-vs-tidal.md](notes/16-strudel-vs-tidal.md) | Differences from the Haskell original |
| 23 | [gotchas.md](notes/23-gotchas.md) | Common mistakes |
| 25 | [internals.md](notes/25-internals.md) | How the engine works: scheduler, transpiler, SuperDough |
| 29 | [culture-and-algorave.md](notes/29-culture-and-algorave.md) | TOPLAP, Algorave, the live-coding tradition |
| 31 | [pattern-algebra-formal.md](notes/31-pattern-algebra-formal.md) | Rigorous mathematical reference |

## Path through the notebook

If I had one hour: read **00 → 01 → 02 → 03 → 12**. That covers the model, the cycle, the mini-notation, and walks through the workshop.

If I had one afternoon: add **04 → 05 → 06 → 07 → 08 → 09 → 10 → 14**. That's the full operator vocabulary plus idioms.

For deep mastery: read **all 32 notes**. About 12,000 lines. Yes, it's a lot. But it covers everything from "what's a cycle" to "how is appLeft implemented in core/pattern.mjs."

Refer to **15 (glossary)** any time. Refer to **23 (gotchas)** when something's not working. Refer to **31 (pattern algebra)** when reasoning formally about composition.
