# 32 — Version History and Stragglers

This page covers two things: (1) what came in each Strudel release so I know which features are old-stable vs new-experimental, and (2) the smaller / less-prominent operators that didn't fit cleanly into the other notes.

## Release history

### v0.8.0 "Himbeermuffin" (June 2023)
- Tauri desktop app (Linux/macOS/Windows)
- Spiral visualization
- Editor improvements: line numbers, autocomplete toggle, line wrapping
- Local disk sample loading

### v0.9.0 "Bananenbrot" (September 2023)
- **`superdough` audio engine** extracted as standalone reusable package
- **FM synthesis** (`fm`, `fmh`, FM envelope params)
- **Filter envelopes** (`lpenv` family — separate AD envelopes for filter cutoff)
- **Looping samples / wavetable synthesis** (`wt_` prefix, `loopBegin`/`loopEnd`)
- **Vibrato** (`vib`, `vibmod`)
- **ZZFX** integration
- Desktop app: Rust-based MIDI/OSC backend
- `_scope` / `_fscope` visualizations
- Chord voicings system (`voicing()`)

### v1.0.0 "Geburtstagskuchen" (January 2024)
- **Domain moved to strudel.cc**
- **Default CPS changed from 1 to 0.5**
- **Slider controls** — inline GUI widgets
- **Phaser** effect
- **Multichannel audio**, device selection
- **Improved convolution reverb**
- **Noise types**: white, pink, brown, crackle
- **Vibrato** functions
- **MIDI**: CC control, clock sync to DAWs
- **Hydra** video synth integration
- REPL refactored from React to vanilla JS
- Community bakery / patterns tab

### v1.1.0 "Bananensplit" (June 2024)
- **Stereo Supersaw** with `spread`, `unison`, `detune`
- **Analog ladder filter** — `.ftype("ladder")`
- **Stereo distortion**
- **Inline visualizations**: `_pianoroll`, `_punchcard`, `_scope`, `_pitchwheel`
- **Label notation** for patterns (extending `$:`)
- **Clock sync across windows** (NeoCyclist via SharedWorker)
- **Faster sample uploads** (iOS friendly)
- Experimental `tidal()` function — accept Tidal syntax inline
- New: `pickOut`, `pickRestart`, `pickReset`, nested controls, scale-degree accidentals, `tactus`, `wax`, `wane`, `taper`, `taperlist`, `swing`, `swingBy`, **stepwise functions**
- Breaking changes:
  - `trig` → `reset`, `trigzero` → `restart`
  - `fanchor` default → 0
  - Legacy legato/duration removed
  - velocity/color absorbed into values

### v1.2.0 "Kardinalschnitten" (May 2025)
- **Stepwise functions** polished and documented
- **`midimaps`** for controller mapping
- **`_spectrum()`** visualization
- **MQTT** support
- **Pulse oscillator with variable PWM**
- **Max polyphony control** (`setMaxPolyphony`)
- Theme system improvements
- New functions: `scramble`, `shuffle`, `polyJoin`, `seqPLoop`, `filter`, `filterWhen`, `within`, `bite`, `markcss`, `beat`, `s_zip`, `stretch` (phase vocoder), `onKey`, `binary`, `binaryN`, improved `chop`, `scrub`
- Breaking changes:
  - Sample signals query at onset (was midpoint)
  - `polymeterSteps` removed
  - Polymeter behavior changed

### Repo migration (June 2025)
- GitHub repo `tidalcycles/strudel` archived.
- Active development moved to **codeberg.org/uzu/strudel**.
- Domain stays at strudel.cc.

## Operators I haven't covered deeply elsewhere

### `xfade(a, mix, b)` — crossfade between patterns

```js
xfade(s("bd*4"), "<0 .5 1>", s("hh*8"))
```

Mix value 0 plays `a`; mix 1 plays `b`; in between, weighted blend. Patternable mix.

### `bite(n, pat)`

Selects sub-windows from a pattern. Like `slice` but for patterns rather than samples.

### `within(arc, fn, pat)`

Apply `fn` only to events within a sub-arc of the cycle:

```js
note("c d e f").within([0, .5], rev)
// only the first half gets reversed
```

### `filter(fn, pat)` and `filterWhen(fn, pat)`

Drop haps where `fn` returns false. `filterWhen` filters based on a binary control pattern.

### `wax(n)`, `wane(n)`, `taper(n)`, `taperlist(...)`

Stepwise volume envelopes — gradually fade in/out across step count.

### `tactus`

A "step count marker." When stepwise functions need to know a pattern's step count, `.tactus(n)` declares it explicitly. Usually inferred automatically.

### `arp(idxPat)` and `arpWith(fn)`

Arpeggiator over chord-tone stacks. `note("[c, e, g]").arp("0 2 1")` plays the bottom, top, middle notes in sequence — converts a vertical chord into a horizontal arpeggio.

### `inv` / `invert`

Swaps 1s and 0s in binary patterns. Useful for masks:

```js
s("bd").struct("1 0 0 1 0 0 1 0".lastOf(4, invert))
// every 4th cycle, the rhythm is inverted
```

### `scramble(n, pat)` and `shuffle(n, pat)` (v1.2)

Random rearrangements of pattern sub-divisions. `scramble` picks new orders each cycle; `shuffle` picks one new order and sticks with it (less chaotic).

### `polyJoin`, `seqPLoop` (v1.2)

Specialized join variants — `polyJoin` for polymeter-aware joins, `seqPLoop` for sequenced pattern looping.

### `stretch` (v1.2)

Phase-vocoder time-stretching. Adjust sample duration without changing pitch:

```js
s("amen").stretch(2)   // play sample at half speed, same pitch
```

Different from `.speed(.5)` which both stretches AND pitches down.

### `onKey(keyboardKey, fn)` (v1.2)

Bind a keyboard shortcut to apply a transform during live performance. Press the key, the transform applies; release, it stops.

### `beat(stepsPattern)` (v1.2)

A step-sequencer-style notation:

```js
beat("bd*4, hh*8, ~ cp")
// equivalent to s("bd*4, hh*8, ~ cp")  but with step-aware semantics
```

### `s_zip` (v1.2)

Sound-zip: alternates sources within a single sample event. Specialized stepwise tool.

### `markcss(cssString)` (v1.2)

CSS-based highlight customization beyond `.color()`. Use single quotes: `.markcss('text-decoration:underline')`.

## Bipolar signal variants

I covered the unipolar signals (sine, saw, etc., 0..1). The bipolar versions (-1..1) are:

- `sine2`, `cosine2`, `saw2`, `tri2`, `square2`, `rand2`
- `itri` — inverted triangle (`tri` mirrored)

Use these when you want symmetric modulation around a center point. `.range2(min, max)` is the bipolar mapper.

## `inside(n, fn)` vs `outside(n, fn)`

```js
"0 1 2 3".inside(4, rev).note()
// applies rev as if the pattern were 4 cycles long
```

- **`inside(n, fn)`** — applies `fn` *inside* an n-cycles-long version of the pattern. Equivalent to `pat.slow(n).fn().fast(n)`.
- **`outside(n, fn)`** — opposite: `pat.fast(n).fn().slow(n)`. Apply `fn` as if zoomed out by n cycles.

Useful for "I want `rev` to reverse over 4 cycles, not 1 cycle" — that's `inside(4, rev)`.

## `ribbon(offset, cycles)`

```js
note("<c d e f>").ribbon(1, 2)
```

Cuts a `cycles`-long window out of the pattern's timeline starting at `offset`, and loops just that window. Useful for grabbing a specific phrase from a longer pattern source.

## `reset(pat)` vs `restart(pat)` vs `hush()`

Three subtly different "start over" operations:

- **`reset(pat)`** — resets the pattern's internal time to start of *current cycle* whenever the control pattern fires.
- **`restart(pat)`** — restarts from cycle 0 (more disruptive — rewinds to the very beginning).
- **`hush()`** — silences everything (Ctrl+. binds to this).

`reset` is gentle, makes the pattern feel fresh each cycle. `restart` is disruptive, rewinds to the source's beginning.

## Sub-control functions in LFO

`.lfo({...})` accepts a `subControl` (or `sc`) parameter. This lets one LFO modulate another LFO's parameter. Recursive modulation:

```js
s("saw")
  .lfo({c: 'lpf', rate: 4, depth: 0.5,
        sc: { c: 'rate', rate: .25, depth: 1 }})
// LFO modulates lpf, while a slower LFO modulates the LFO's rate
```

Allows dynamic LFOs that themselves evolve.

## `register(name, fn)` for custom methods

You can define custom chained methods at user-level:

```js
const heavy = register('heavy', (pat) => pat
    .s('sawtooth').lpf(800).distort(.5).gain(.7))

note("c d e g").heavy()
```

After registering, `.heavy()` becomes available as a Pattern method. Equivalent to using `.apply(fn)` but with a permanent name.

## Academic / community references

If I want to go deeper than the official docs:

- **WAC 2022 paper**: "Strudel: Algorithmic Patterns for the Web" (Felix Roos). DOI: 10.5281/zenodo.6768844. The original announcement paper.
- **ICLC 2023 paper**: "Strudel: Live Coding Patterns on the Web" (Felix Roos & Alex McLean). DOI: 10.5281/zenodo.7842142. Covers WebAudio, MIDI, OSC, REPL design, comparison with Tidal, alignment innovations.
- **Felix Roos's blog "Loophole Letters"** (loophole-letters.vercel.app): implementation deep-dives.
- **Emil Gerlach blog** (emilgerlach.com/blog/strudel): Strudel tutorials.
- **Mirakl Tech blog**: "Beats, Bytes, and Basslines: An Introduction to Live Coding with Strudel" (Valentin Binjacar).

## Pages I've seen referenced as 404 in docs

If I link these and they don't work:
- `/functions/control-parameters/` — content lives at `/learn/effects/` + `/functions/value-modifiers/`
- `/functions/strum/` — doesn't exist
- `/learn/pickfunctions/` — moved to `/learn/conditional-modifiers/`
- `/learn/recipes/` — moved to `/recipes/recipes/` (note the double-recipes)
- `/blog/v1.x.x/` — real slug is `/blog/release-1.x.x-codename/`

## Pattern Club fork

`strudel.patternclub.org` is a community fork with additional workshop materials. Worth bookmarking if I want non-official educational content.

## What this means for me

When I write Strudel code now, I should know:
- v1.0+ is the modern era; tutorials older than 2024 may use removed APIs (`trig`/`trigzero`, old `fanchor`).
- Stepwise functions are still considered experimental and may shift.
- The Codeberg repo is the source of truth for active development.
- Some tutorials reference `t1`/`t2`/`d1`-style multi-track aliases — these were Tidal-style shortcuts that mostly got replaced by `$:` labels in modern Strudel.
- Anything mentioning "ChatGPT can write Strudel" should be treated skeptically — the Strudel FAQ explicitly notes LLMs frequently hallucinate Strudel code (yes, including me).

This is a moving target. My notes should be re-validated against `strudel.cc/learn/` every few months.
