# 05 — Notes and Pitch

## Three ways to specify pitch

```
note("57 61 64 69")         // MIDI numbers
note("a3 c#4 e4 a4")         // letter + octave
freq("220 275 330 440")      // frequency in Hz
```

All three end up as the same pitched events. Pick whichever is least painful for the music you have in mind.

### Letter notation

`a3` means "A in octave 3." `b` after a letter is flat, `#` after is sharp. Some examples:

```
"c"    "c#"   "db"   "d"   "d#"   "eb"   "e"   "f"   "f#"   "gb"   "g"   "g#"   "ab"   "a"   "a#"   "bb"   "b"
```

Octave numbers follow scientific pitch notation: middle C is `c4`. So `a4 = 440 Hz`, `c5` is one octave up from middle C, `c2` is two octaves below middle C.

Without octave, the pitch is in some default octave (typically octave 3) but it's safer to be explicit.

### MIDI notation

MIDI numbers: `60 = c4`, `61 = c#4`, ... each integer is one semitone. `57 = a3 = 220 Hz`. Decimals are allowed for microtones: `note("60.5")` plays a quarter-tone-sharp middle C. This is unique to Strudel — most software doesn't expose decimal MIDI.

### Frequency

Direct Hz. `freq("220")` is a pure 220 Hz event regardless of any scale. Useful for synthesis experiments and FM ratios.

## `note` vs `n` — they are NOT aliases

```
note("c e g")       // literal pitch
n("0 2 4")          // index into something
```

This trips people up. `s` and `sound` are aliases of each other, but `n` and `note` are *not*. They mean different things:

- `note(x)` says "play this literal pitch" — `c4`, `MIDI 60`, etc.
- `n(x)` says "select the x-th item from a list."

What does `n()` index into? Depends on context:

- If `.s("bd")` is in scope (no scale), `n` selects the **sample variant** (`bd:0`, `bd:1`, ...).
- If `.scale("…")` is in scope, `n` selects the **scale degree** (0 = root, 1 = next note, etc.).
- If `.chord("…")` is in scope, `n` selects a **chord tone** (0 = bottom, 1 = next, ...).

So `n` is "indexed selection" and the list it indexes depends on what context you've set up.

## Scales — `.scale()`

```
n("0 2 4 6").scale("C:major")
n("0 2 4 6").scale("D:dorian")
n("0 1 2 3 4").scale("A2:minor:pentatonic")
```

`.scale("Root:Type")` says "interpret integers as scale degrees in this scale." `0` is the root, `1` is the next scale tone (a 2nd up), etc. **Negative numbers and accidentals are allowed** — they reach beyond/around the scale.

The format separates parts with `:` because the parser needs to break a string into fields without spaces (since spaces would mean "next event"). So:

- `C:major` ✓
- `D:dorian` ✓
- `A2:minor:pentatonic` ✓ (root note + scale qualifier)
- `C bebop major` ✗ (spaces inside the name break the parser)

Scale types Strudel understands (via tonal.js):
- Major modes: `major`, `dorian`, `phrygian`, `lydian`, `mixolydian`, `minor` (= aeolian), `locrian`
- Minor variants: `harmonic minor`, `melodic minor`
- Pentatonics: `major pentatonic`, `minor pentatonic`
- Other: `blues`, `whole`, `chromatic`, `bebop major`, `bebop minor`, `ritusen`, `hirajoshi` (Japanese), `iwato`, `kumoi`, `prometheus`, ... (full tonal.js dictionary)

You can pattern the scale itself:
```
n("0 2 4 6").scale("<C:major D:mixolydian>/4")
```
Switches scale every 4 cycles.

## `transpose` and `scaleTranspose`

Two different "shifts":

- **`.transpose(n)`** — shift all notes by `n` semitones (chromatic). Numeric or interval string (`"P5"`, `"m3"`).
  ```
  note("c e g").transpose(7)        // +7 semitones = up a fifth
  ```

- **`.scaleTranspose(n)`** — shift by `n` *scale steps*, staying in the scale.
  ```
  n("0 2 4").scale("C:minor").scaleTranspose(1)
  // becomes degrees 1, 3, 5 of C:minor
  ```

`transpose` is for key changes; `scaleTranspose` is for diatonic harmonization (parallel thirds, fifths, etc. that stay in key).

## `add` and `sub` for pitch — closer to scaleTranspose

```
note("c e g").add(7)              // +7 semitones (chromatic)
n("0 2 4").scale("C:minor").add(2)  // +2 scale degrees (diatonic)
```

`.add(n)` and `.sub(n)` add/subtract numbers. When applied to:
- a numeric `n()` pattern: it shifts scale degrees.
- a `note()` pattern: it shifts semitones (each integer = 1 semitone).

This is one place where the semantic of "+1" depends on whether you're working in `n` (scale step) or `note` (semitone). Be aware which you're operating on.

## Chords

### Simple chord literals

```
note("[c3, e3, g3] [f3, a3, c4]")            // letter chords
note("<[0, 4, 7] [0, 5, 9]>".add(48))         // interval chords
```

Inside `[ ]`, the comma stacks notes vertically — that's a chord. Each event in the resulting pattern carries multiple notes simultaneously.

### Chord symbols — `chord()`

```
chord("<C^7 A7b13 Dm7 G7>").voicing()
```

`chord()` takes lead-sheet chord symbols and converts to a pattern of *chord references*. By itself this doesn't produce notes — you need to follow it with `.voicing()` (or pick chord tones with `.n()`).

Chord symbol vocabulary:
- `C` major triad
- `Cm` minor triad
- `C7` dominant 7
- `C^7` major 7
- `Cm7` minor 7
- `Cm7b5` half-diminished
- `Co7` diminished 7
- `C7b13`, `C7#11`, etc. — extensions
- `C/E` slash chord (with bass note)

### `.voicing()` — chord → notes

```
chord("<Am Dm G C>").voicing()
chord("<Am Dm G C>").dict('lefthand').voicing()
```

`.voicing()` looks up the chord in a *voicing dictionary* and returns concrete notes. Dictionaries:

- `'lefthand'` — left-hand jazz piano voicings.
- `'ireal'` — iReal-style voicings (more common in pop/rock contexts).
- `'triads'` — bare triads.

You can define custom dicts with `addVoicings(name, {...})`.

### Voicing controls

- **`.anchor("c4")`** — target note. The voicing tries to position itself near this note.
- **`.mode("below")`** — relative to anchor: `below` (top ≤ anchor), `above` (bottom ≥ anchor), `duck` (top below to avoid clashing with melody), `root` (bass = anchor).
- **`.offset(n)`** — shift the voicing up/down through its variations.
- **`.n(idx)`** — pick individual voices: `n("0 1 2")` plays bottom, middle, top of the chord; higher numbers wrap into next octave.

So a voicing is a higher-level abstraction than a chord symbol: you say "Am7" and "anchor near melody," and Strudel picks the actual notes.

### `rootNotes(octave)` — extract bass

```
chord("<Cm7 Fm7 G7 C^7>").rootNotes(2).note()
```

`.rootNotes(octave)` strips the chord down to just the root note in the given octave. Useful for generating basslines from chord progressions:

```
let chords = chord("<Cm7 Fm7 G7 C^7>");
stack(
    chords.voicing().s("piano"),               // chord pad
    chords.rootNotes(2).note().s("sawtooth"),  // bassline
)
```

## Octave manipulation

There's no dedicated `.octave()` method, but you can use `.add(12)` (in `note`) or octave numbers in mini-notation (`c2`, `c3`, etc.).

Inside `note()`, `+12` per octave. Inside `n()` with a scale, `+7` per octave (in heptatonic scales like major) or `+5` (in pentatonic) or `+12` (in chromatic).

## Microtones and xenharmonic

```
note("60.5")                       // quartertone
xen("31edo").note("0 8 18")        // 31-tone equal temperament
tune("hexany15")                   // alternative tuning
```

- Decimal MIDI gives you arbitrary microtones in the standard 12-EDO grid.
- `.xen(n)` switches to N-tone equal temperament. `.xen("31edo")` gives you 31 equal divisions of the octave; integers 0..30 cover one octave.
- `.tune("name")` loads a named alternative scale (hexany, gumbeng, sanza, gunkali, tranh3, iraq, ...).
- `.xen([1, 9/8, 5/4])` accepts arbitrary frequency ratios.

These are advanced but they're there — Strudel reaches into ethnomusicology and contemporary microtonal practice.

## Conceptual summary

Pitch in Strudel has three layers:

1. **Raw pitch** — `note(x)` or `freq(x)`. Direct value. No scale awareness.
2. **Scale-relative** — `n(x).scale("…")`. Numbers as degrees of a chosen scale.
3. **Chord-relative** — `chord("…").voicing()` or `n(x).chord("…")`. Numbers as chord-tone selections from a voiced chord.

Each layer adds harmony intelligence. Layer 1 is "raw notes." Layer 2 quantizes to a key. Layer 3 voices full chord progressions. They compose: a single piece often uses all three (e.g., a chord pad via `chord().voicing()`, a bassline via `chord().rootNotes(2).note()`, and a melody via `n("…").scale("…")`).
