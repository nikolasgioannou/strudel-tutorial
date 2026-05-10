# 19 — Visualizations

Strudel has many in-browser visualizers. They're not just decorative — they help you understand what your pattern is doing, debug timing problems, and (in performance contexts) give the audience visual context for what they hear.

## Bare-name vs underscore-prefix

Two render targets:

- **Bare name** — `.pianoroll()`, `.spiral()`, `.scope()`, `.spectrum()`, `.pitchwheel()` — render to the **page background** (large, fills the screen behind the editor).
- **Underscore prefix** — `._pianoroll()`, `._spiral()`, `._scope()`, etc. — render **inline** beneath the pattern in the editor (smaller, embedded).

Same `_` convention as `_$:` for muting — underscore means "local / inline / smaller scope."

Pick bare-name for performances (visual fills the screen). Pick `_` for development (visual stays next to the code).

## Mini-notation highlighting (automatic)

You don't have to do anything — when patterns play, the events in your mini-notation strings (the parts inside `"..."`) light up as they trigger. This is the default visualizer everyone uses.

Customize the highlight color:

```js
note("c d e g").color("cyan")
```

Or use `.color("salmon | orange | green")` to randomize.

For CSS override (advanced):

```js
note("c d e").markcss('text-decoration:underline')
```

Note: `markcss` requires **single quotes** because the value is a literal CSS string, not parsed mini-notation.

## Pianoroll

```js
note("c2 a2 eb2")
  .euclid(5, 8)
  .s('sawtooth')
  .lpenv(4).lpf(300)
  .pianoroll({ labels: 1 })
```

A scrolling piano-roll view of the upcoming pattern. Notes scroll past a playhead in the middle.

**Options:**

| Option | Default | What it does |
|---|---|---|
| `cycles` | 4 | How many cycles visible at once |
| `playhead` | 0.5 | Position of playhead (0=left edge, 1=right edge) |
| `vertical` | 0 | Rotate 90° |
| `labels` | 0 | Show note name labels |
| `flipTime`/`flipValues` | 0 | Flip axes |
| `overscan` | 1 | Extra cycles to render outside window |
| `hideNegative`/`hideInactive` | | Don't draw certain events |
| `smear`/`fold` | | Visual modes |
| `fill`/`fillActive` | | Solid vs outline |
| `stroke`/`strokeActive` | | Outline appearance |
| `active`, `inactive`, `background` | colors | Color scheme |
| `playheadColor` | white | Playhead color |
| `colorizeInactive` | 1 | Whether past events show color or fade |
| `fontFamily` | monospace | Label font |
| `minMidi`, `maxMidi` | 10, 90 | Y-axis MIDI range |
| `autorange` | 0 | Auto-fit Y-axis to pattern range |

Use cases: see what notes will play, verify rhythm structure, presentation.

## Punchcard

Like pianoroll, but **shows the pattern *after* all transformations** (whereas pianoroll shows the source as written). So if you have `note("c d e").every(4, rev)`, pianoroll shows `c d e`, punchcard shows `c d e` on most cycles and `e d c` on every 4th.

Punchcard is also less resource-intensive — better for complex patterns.

Same options as pianoroll.

## Scope (oscilloscope)

```js
s("sawtooth")._scope()
```

A real-time time-domain plot of the audio waveform. Shows the actual shape of the sound.

**Options:**

| Option | Default | What it does |
|---|---|---|
| `align` | 1 | Snap to zero crossing (avoids jitter) |
| `color` | white | Trace color |
| `thickness` | 3 | Trace line thickness |
| `scale` | 0.25 | Vertical scaling |
| `pos` | | Vertical position |
| `trigger` | | Trigger threshold |

Use cases: debug distortion, see the actual waveform shape, presentation of synth design.

## Spectrum (frequency analyzer)

```js
n("<0 4 <2 3> 1>*3").scale("d3:minor:pentatonic").s('sine')
  .dec(.3).room(.5)._spectrum()
```

Scrolling frequency-domain analyzer (FFT). Vertical = frequency (low at bottom, high at top); horizontal = time scrolling.

**Options:**

| Option | Default | What it does |
|---|---|---|
| `thickness` | 3 | Vertical line thickness |
| `speed` | 1 | Scroll speed |
| `min` | -80 | Min dB |
| `max` | 0 | Max dB |

Use cases: spot resonant peaks, see harmonics, debug filter sweeps.

## Spiral

```js
note("c2 a2 eb2").euclid(5, 8).s('sawtooth')
  .lpenv(4).lpf(300)._spiral({ steady: .96 })
```

Renders the pattern's progress around an Archimedean (or log) spiral. Visually beautiful for performances.

**Options:**

| Option | Default | What it does |
|---|---|---|
| `stretch`, `size`, `thickness`, `cap` | | Visual shape |
| `inset` | 3 | Center hole size |
| `playheadColor`, `playheadLength` (0.02), `playheadThickness` | | Playhead |
| `padding`, `steady` (1 = spiral fixed, playhead moves) | | Animation behavior |
| `activeColor`, `inactiveColor`, `colorizeInactive` | | Color scheme |
| `fade` | 1 | Fade past events |
| `logSpiral` | | Use logarithmic spiral |

`steady: .96` (or similar) gives a slowly rotating spiral — very cinematic.

## Pitchwheel

```js
n("0 .. 12").scale("C:chromatic").s("sawtooth").lpf(500)._pitchwheel()
```

Folds frequencies into one octave on a circular display. Shows pitch class regardless of octave. Good for seeing harmonic relationships.

**Options:**

| Option | What it does |
|---|---|
| `hapcircles`, `circle` | Visual elements |
| `edo` | Divisions per octave (default 12) |
| `root` | Where 0 sits on the circle |
| `thickness`, `hapRadius` | Sizes |
| `mode` | Visual mode |
| `margin` | Padding |

Useful for xenharmonic music (`edo` param) and seeing scale relationships.

## Combining visualizers

Multiple per-pattern visualizations work; they layer:

```js
note("c d e").s('saw')
  ._scope()
  ._spectrum()
```

Or chain pattern-level visual modifiers:

```js
note("c d e").color("cyan").s('saw')._pianoroll()
```

## Performance / aesthetic tips

- For live performance, set a bare-name visualizer like `.spiral({steady: .96})` once near the bottom. It becomes the full-screen background.
- Use `.color()` aggressively on different layers — gives the audience visual grouping cues.
- The pianoroll's playhead is at 0.5 by default (middle). For "upcoming events from the right" feel, set `playhead: 0`.
- Spectrum is best for synth-heavy patches where you want to show off filtering.
- Spiral is best for rhythmic/cyclic patterns where you want to show off the cycle structure.
- Scope is best for synth design demos — show the actual waveform.

## When NOT to use visualizers

Each visualizer takes CPU. On a slow machine, running pianoroll + spiral + scope + spectrum simultaneously can stutter the audio. In performance, pick one. In development, the inline `_pianoroll()` is usually enough.
