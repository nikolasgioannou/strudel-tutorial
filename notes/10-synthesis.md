# 10 — Synthesis

Strudel's audio engine SuperDough has several different synthesis methods built in. You select them by passing the right name to `.s()` or `.sound()`.

## Basic waveforms

```
note("c2 eb2 g2").s("sawtooth")
note("c").s("square")
note("c").s("triangle")
note("c").s("sine")
note("c").s("pulse")
```

| Waveform | Spectrum | Common use |
|---|---|---|
| `sine` | Pure tone (no harmonics) | Sub-bass, soft pads, FM modulators |
| `square` | Odd harmonics, hollow | Chiptune leads, retro synths |
| `triangle` | Soft odd harmonics | Default for `note()` without `s` — gentle tone |
| `sawtooth` (alias `saw`) | All harmonics, rich | Bass lines, lead synths, pads |
| `pulse` | Adjustable square (use `.pw(0..1)` for width) | PWM leads, strings |

If you call `note("c")` without a `.s(...)`, the default synth is **triangle**.

These are the workhorse oscillators. Combine with filters, ADSR, FX to shape them.

### Layered waveforms

```
note("c2").s("sawtooth, square")
```

The comma layers two oscillators per event — both play simultaneously. With slight detuning (`.add(note("0,.05"))`), this gives a fat unison sound.

You can also assign per-voice gain:

```
note("c2").s("sawtooth:0:.5, square:0:1")
```

## Noise

```
sound("white")
sound("pink")
sound("brown")
sound("crackle*4").density(.2)
note("c").noise(0.3)               // adds noise to oscillator
```

Three noise colors, plus crackle:

| Type | Spectrum | Sounds like |
|---|---|---|
| `white` | Flat across spectrum | Hiss, static |
| `pink` | -3dB/octave | Wind, ocean |
| `brown` | -6dB/octave | Distant rumble, deep wind |
| `crackle` | Random impulses | Vinyl crackle (use `density()` to control rate) |

`.noise(amount)` mixes noise into an oscillator (between 0 and 1). Useful for adding hiss/breath to synth tones.

## Additive synthesis — `partials`

```
note("c2 eb2 g2").s("user").partials([1, 0, 0.3, 0, 0.1, 0, 0, 0.3])
```

The sound `"user"` lets you define a custom waveform from harmonic amplitudes. `partials([h1, h2, h3, ...])`:
- `h1` = fundamental amplitude
- `h2` = 2nd harmonic
- `h3` = 3rd harmonic
- etc.

A square wave is `partials([1, 0, 1/3, 0, 1/5, 0, 1/7, ...])` (odd harmonics with 1/n amplitude). A sawtooth is all integers `[1, 1/2, 1/3, 1/4, ...]`. Custom partials let you sculpt any spectrum.

`phases([...])` controls the phase of each harmonic. Often paired with `randL(n)` (random phases per harmonic) for "bell-like" rather than "buzzy" timbres.

Conceptually: additive synthesis = building sounds from sine waves. Computationally expensive but harmonically pure.

## FM synthesis

```
note("c e g b").fm(4).fmh("<1 2 1.5 1.61>")
```

FM = frequency modulation: a "modulator" oscillator modulates the frequency of a "carrier."

Parameters:
- `.fm(amount)` — modulation depth (intensity of the FM)
- `.fmh(ratio)` — harmonicity ratio (modulator freq / carrier freq)
  - Whole numbers (1, 2, 3) = clear, harmonic tones
  - Decimals (1.5, 1.61) = bell-like, metallic, inharmonic
- `.fmattack` / `.fmatt` — modulator envelope attack
- `.fmdecay` / `.fmdec` — decay
- `.fmsustain` / `.fmsus` — sustain
- `.fmenv` / `.fme` — envelope mode (`'lin'` or `'exp'`)

Numbered suffixes (`fmh2`, `fmatt5`) target individual operators in stacked-FM configurations.

Conceptual sounds:
- Low fmh + low fm = subtle vibrato-ish
- Mid fmh + mid fm = electric piano, woody tones
- High fmh + high fm = bells, metallic chimes
- Decimal fmh = inharmonic, glassy

## Wavetable synthesis

```
samples('bubo:waveforms')
note("c d e").n("<1 2 3>").s("wt_flute").release(.125)
```

Wavetable = a stored single-cycle waveform you index through. Strudel ships with the AKWF wavetable library (1000+ waveforms) accessible via the `bubo:waveforms` sample pack.

Once loaded, names with the `wt_` prefix are wavetables: `wt_flute`, `wt_bass`, `wt_string`, etc. Use `loopBegin`/`loopEnd` to scan within a wavetable for evolving timbres:

```
note("c2*8").s("wt_dbass").loopBegin(perlin.range(0, .5))
```

Conceptually: between sample-playback (a long sample played once) and synthesis (an oscillator). You scan through frozen-in-time spectral snapshots.

## ZZFX

```
note("c d e").s("z_sawtooth").zcrush(.5).slide(.1)
```

ZZFX (Zuper Zmall Zound Zynth) is a tiny chiptune-style synth originally for game jams. Strudel includes it.

Waveforms (with `z_` prefix): `z_sine`, `z_square`, `z_sawtooth`, `z_tan`, `z_noise`.

Special parameters:
- `.curve` (1..3) — wave shape curvature
- `.zcrush(0..1)` — bit crushing
- `.zmod(amt)` — FM speed
- `.slide(amt)` / `.deltaSlide(amt)` — pitch slide
- `.pitchJump(amt)` / `.pitchJumpTime(s)` — pitch jump after delay
- `.zdelay(s)` — built-in echo
- `.lfo(amt)` / `.tremolo(amt)` — built-in modulation

Conceptually: cheap, distinctive, retro. Good for chiptune-style sounds without heavy FX chains.

## Vibrato

Lightweight pitch modulation, available on any synth:

```
note("a").vib(4).vibmod(.5)
note("a").vib("4:.5")     // shorthand
```

- `.vib(rate)` (alias `.v`) — Hz
- `.vibmod(depth)` (alias `.vmod`) — semitones

Conceptually: a small, fast pitch wobble. Adds expressivity to held notes.

## Choosing a synth — quick guide

- **Pure tones** → sine
- **Bass/lead** → sawtooth, sometimes square
- **Pad** → triangle or sawtooth with long attack/release
- **Chiptune** → square, pulse, ZZFX
- **Bells/metallic** → FM with decimal `fmh`, or additive with sparse partials
- **Strings/wind/scape** → noise + heavy filtering, or wavetable scanning
- **Custom timbres** → `partials()` (additive)
- **Maximum expressivity** → start with sawtooth, add filter envelope, ADSR, light FM, gentle distortion

The synth is just the source. The character comes from filters, envelopes, and FX.

## Sound name resolution order

When you call `s("foo")`, Strudel looks for `foo` in this order (roughly):

1. Custom samples loaded with `samples({...})`
2. Bank-prefixed (if `.bank("X")`, looks for `X_foo`)
3. Default dirt-samples library (drum abbrevs)
4. GM soundfonts (`gm_*`, `piano`)
5. Built-in synth waveforms (`sine`, `square`, etc.)
6. Wavetables (`wt_*`)
7. ZZFX presets (`z_*`)
8. Noise (`white`, `pink`, `brown`, `crackle`)

If nothing matches, you get silence (and probably a console warning).

## A "design my own synth voice" mental model

To synthesize a sound from scratch, walk through:

1. **Pick a source** — `sawtooth`, `square`, `partials([...])`, `wt_xxx`?
2. **Add a filter** — `lpf`, `hpf`, `bpf`, `vowel`. Static or modulated?
3. **Filter envelope** — `lpa`, `lpd`, `lps`, `lpenv`. Pluck (sharp env) or pad (gentle)?
4. **Amp envelope** — `attack`, `decay`, `sustain`, `release` or `adsr("a:d:s:r")`.
5. **Modulation** — `fm`, `vib`, `phaser`, LFO?
6. **FX** — `delay`, `room`, `distort`, `crush`?
7. **Stereo** — `pan`, `jux(rev)`?

Each of those is a step. A "good synth voice" is just a coherent set of choices across these steps.
