# 00 — Overview

## What is Strudel?

Strudel is a **browser-based live-coding music environment**. You type code into a text editor, press `Ctrl+Enter`, and the browser starts playing music. You edit the code while it plays; on the next cycle boundary, the new code takes over. You stop with `Ctrl+.`.

The official URL is <https://strudel.cc>. There's nothing to install — it's all JavaScript + Web Audio API, running in the page.

## Lineage

Strudel is a **JavaScript port of TidalCycles** (often just "Tidal"), the Haskell-based live-coding language created by Alex McLean (2009). Tidal is the originator of most of what Strudel can do — the mini-notation, the cyclic time model, the pattern combinators. Strudel preserves the same conceptual model. The differences are surface-level (Tidal's `$` becomes JS method chaining, `|+` becomes `.add.in`, etc.) — see `16-strudel-vs-tidal.md`.

This is significant for me because: when documentation is thin on Strudel, I can fall back on Tidal's documentation and most concepts carry over verbatim.

## What kind of music does it make?

Anything where rhythmic patterns and pitch sequences can be expressed as functions of time. In practice that means: techno, house, breakbeat, drum-and-bass, ambient, generative compositions, IDM-style mangling, jazz changes, classical transcriptions. The official examples gallery covers all of these — Coltrane's *Giant Steps*, Mario themes, dub patterns, Roland TR-909 acid, ambient bell drones.

It is **not** a DAW. It doesn't replace audio recording, mixing, or arrangement of long-form pieces with verses and choruses. It's a tool for *generating* musical structure live, in code. (Though you can render to MIDI and pull it into a DAW.)

## How it makes sound

Strudel is layered:

1. **Pattern engine** — turns code into a stream of *events* (notes, sample names, parameter values) over time.
2. **SuperDough** — Strudel's default audio engine, built on Web Audio API. Renders synth voices, plays samples, applies FX.
3. **Outputs** — alternatively, Strudel can send patterns to MIDI devices, OSC (driving SuperCollider/SuperDirt), or CSound, instead of (or in addition to) playing in the browser.

Most of the time you're hearing SuperDough.

## Why the design exists (what problem it solves)

Traditional music production tools are GUI-driven: you arrange clips on a timeline. That's good for finished pieces, terrible for *exploring* musical ideas. Live-coding flips it: a few keystrokes can produce a fully-formed groove, and small edits transform it instantly. The cost of trying something is zero, so the search space you can explore in an hour is enormous.

The design choice that makes this possible: **a pattern is just a function from time to events** (covered in `01-core-mental-model.md`). Pure, composable, replaceable. You replace one function with another and the music seamlessly switches at the next cycle boundary.

## What I expect to learn

By the end of these notes I should be able to read any Strudel snippet and predict, structurally:

- When events happen (the rhythm)
- What pitch / sample each event has (the content)
- What FX each event has on it (the timbre)
- How that all changes over time (the modulation)

…without needing to play it back. If I can do that, I understand it.
