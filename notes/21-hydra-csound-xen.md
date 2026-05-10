# 21 — Hydra, CSound, and Xenharmonic

Three more specialized integrations. None are needed for daily use; all open major creative possibilities.

## Hydra — live coding visuals

[Hydra](https://hydra.ojack.xyz/) is a browser-based live-coding *video* synthesis environment by Olivia Jack. It composes visuals from feedback chains of oscillators (`osc`), shapes (`shape`), noise (`noise`), Voronoi tessellation (`voronoi`), etc., rendered to output buffers `o0` through `o3`.

Strudel can integrate Hydra so audio and visuals share a single performance.

### Setup

```js
await initHydra()
```

Place at the top of the document. Boots Hydra inside Strudel. Accepts all Hydra-synth options.

### Pattern → Hydra (`H()`)

Feed a Strudel pattern into Hydra as a numeric input that updates each frame with the pattern's value-at-time:

```js
await initHydra()
let pattern = "3 4 5 [6 7]*2"
shape(H(pattern)).out(o0)
n(pattern).scale("A:minor").piano().room(1)
```

Now the `shape` parameter of Hydra is driven by the same pattern that's making the music. Visuals and audio are mathematically linked.

### Audio-reactive

```js
await initHydra({ detectAudio: true })
```

Hydra's built-in `a.fft[bin]` array now reflects Strudel's actual audio output (FFT-analyzed in real time). You can wire amplitude/spectrum data to Hydra visuals:

```js
osc(20).modulate(osc(() => a.fft[0])).out(o0)
```

### feedStrudel

Lets Hydra consume Strudel's own visualizations (pianoroll, scope, etc.) as a texture. Then you can apply Hydra effects (kaleidoscope, color shift, modulation) to the visualizer output.

Use cases:
- Combine pianoroll visuals with Hydra glitch.
- Apply Hydra color/feedback effects to the spectrum analyzer.

### Why this matters

For live performance, projected visuals are standard. The Strudel-Hydra link means visuals can be driven by the *same code* generating the music — true audiovisual unity, not just "audio + slideshow."

## CSound

[CSound](https://csound.com/) is a venerable computer music language (descended from MUSIC IV / V from the 1960s). It's the most mature/expressive sound-synthesis language in existence. Strudel can route patterns to CSound instruments running in the browser via `@csound/browser`.

### Loading instruments

```js
await loadCsound`
instr CoolSynth
    iduration = p3
    ifreq = p4
    igain = p5
    ioct = octcps(ifreq)
    
    kpwm = oscili(.05, 8)
    asig = vco2(igain, ifreq, 4, .5 + kpwm)
    asig += vco2(igain, ifreq * 2)
    
    acut = transegr:a(0, .005, 0, 2, .06, -4.2, 0.001, .01, -4.2, 0)
    asig = zdf_2pole(asig, cpsoct(ioct + acut + 2), 0.5)
    
    asig *= linsegr:a(0, .01, 1, .1, .5, iduration, .5, .1, 0)
    out(asig, asig)
endin`
```

This is CSound orchestra syntax — instrument definitions with their own oscillators, filters, envelopes. Strudel embeds the whole CSound engine.

Or load from a file:

```js
await loadOrc('github:kunstmusik/csound-live-code/master/livecode.orc')
```

`livecode.orc` by Steven Yi is a popular set of pre-built CSound instruments.

### Triggering CSound from patterns

```js
"<0 2 [4 6] 3*2>"
.off(1/4, add(2))
.off(1/2, add(6))
.scale('D minor')
.note()
.csound('CoolSynth')
```

`.csound(instrumentName)` sends each event to the named CSound instrument with:

| p-value | Meaning |
|---|---|
| p1 | Instrument name |
| p2 | Time offset |
| p3 | Event duration |
| p4 | Frequency (Hz) |
| p5 | Gain (0..1) |

Alternative: `.csoundm(instrumentName)` uses MIDI key (0..127) and MIDI velocity (0..127) for p4 and p5.

### Limitations

Strudel's effect chain (`.lpf`, `.room`, `.delay`) does NOT work with CSound — CSound has its own internal effects, and Strudel currently only sends p-values. So if you go CSound, you do all your sound design inside the CSound orchestra.

Future work plans to route patterned controls into CSound channels so the effect library can integrate, but as of writing this is experimental.

### When to use CSound

- You want richer synthesis than SuperDough provides (granular, physical modeling, complex modulation routings).
- You have existing CSound instruments you want to reuse.
- You're an academic or research musician working in the CSound tradition.

For most live coding, SuperDough is sufficient and easier.

## Xenharmonic / microtonal

12-tone equal temperament (`12-EDO`) is just one tuning system among many. Strudel has first-class support for alternative tunings via `xen()` and `tune()`.

### `xen(scale)`

Treats numeric scale-degrees as steps in an alternative tuning, returning frequencies based at **220 Hz**.

```js
i("0 8 18").xen("31edo").piano()
```

`"31edo"` = 31 equal divisions of the octave (a finer microtonal grid than 12-EDO). Numeric pattern values become steps in 31-EDO.

Other accepted forms:
- Named scales from the tunejs library
- EDO strings: `"5edo"`, `"19edo"`, `"31edo"`, `"53edo"`, ...
- Frequency-ratio arrays: `xen([1, 9/8, 5/4, 4/3, 3/2, 5/3, 15/8])` for just-intonation

### `tune(scale)`

Similar but designed to be combined with `.mul(freq).freq()`:

```js
i("0 1 2 3 4 5").tune("hexany15").mul("220").freq()
```

You supply the base frequency yourself, multiplying the scale-relative frequency by it.

### Named tunings

From the tunejs library:

| Name | What it is |
|---|---|
| `hexany1`, `hexany15` | Erv Wilson's hexany scales (combinatorial 6-note scales) |
| `iraq` | Maqam-like scale |
| `gumbeng`, `gunkali` | Indonesian gamelan scales |
| `tranh3` | Vietnamese tranh |
| `sanza` | African sanza (thumb piano) scale |

Plus many more — full list at <http://abbernie.github.io/tune/scales.html>.

### Why use xen

- **Educational** — hear what other tuning systems sound like (Indian, Indonesian, Persian, Just Intonation).
- **Compositional** — escape 12-EDO sameness. Different tunings have different emotional colors.
- **Experimental** — extreme tunings (53-EDO, 72-EDO) for microtonal composition.

### Practical tips from docs

- Strum or arpeggiate rather than play block chords — close microtonal intervals can beat ugly when played simultaneously.
- Use legato and reverb to blend close intervals smoothly.
- Combine xenharmonic scales with polyrhythm for distinctive textures.

## A combined example

What if I want CSound-synthesis on a microtonal scale with Hydra visuals?

```js
await initHydra()
await loadOrc('github:kunstmusik/csound-live-code/master/livecode.orc')

let p = i("<0 8 [13 21] 18>*4").xen("31edo")
shape(H(p)).out(o0)
p.csound('Bass')
```

The pattern drives:
1. A `shape` in Hydra visuals.
2. Notes in 31-EDO microtonal tuning.
3. CSound's `Bass` instrument.

One pattern, three layers of output.

## When NOT to bother

If you're new to Strudel, ignore all of this until you're comfortable with patterns, effects, and signals. These are integrations for *after* you've mastered the basics. They expand horizontally; they don't simplify anything.
