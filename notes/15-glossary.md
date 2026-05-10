# 15 — Glossary

Alphabetical lookup. One-line definitions; cross-references to the detailed notes for full explanations.

## Symbols (mini-notation)

| Symbol | Meaning |
|---|---|
| ` ` (space) | Sequence separator — divides cycle into N equal slots. |
| `[ ]` | Subgroup — recursive subdivision of one slot. |
| `{ }` | Polymeter — multiple patterns at same step rate. |
| `< >` | Alternate — one element per cycle, cycling across iterations. |
| `,` | Parallel — top-level: stack; in `[]`: chord/polyphony. |
| `*N` | Repeat N times in slot (faster). |
| `/N` | Stretch over N cycles (slower). |
| `!N` | N adjacent slots of same value (no speedup). |
| `@N` | Elongate — this event has weight N. |
| `_` | Extend previous event by one unit (= `@++`). |
| `~` / `-` | Rest. |
| `?` / `?0.x` | Probabilistic drop (50% / x%). |
| `\|` | Random pick between alternatives. |
| `:N` | Sample variant index. |
| `(p,s)` / `(p,s,r)` | Euclidean rhythm: p pulses, s steps, r rotation. |
| `.` | Foot divider — equal-duration sections. |
| `b` / `#` | Flat / sharp accidental. |
| `x` | Trigger marker (in `struct` masks). |
| `` ` ` `` | Multi-line mini-notation. |

## Functions A–Z

| Name | Type | What it does | See |
|---|---|---|---|
| `add` | transform | Pattern arithmetic: add values element-wise. | 11 |
| `addLeft` / `addRight` | transform | Alignment-explicit add (= `.add.in` / `.add.out`). | 11 |
| `addVoicings(name, dict)` | setup | Register a custom voicing dictionary. | 05 |
| `adsr("a:d:s:r")` | effect | Combined attack/decay/sustain/release. | 06 |
| `almostAlways(fn)` | conditional | 90% probability application. | 08 |
| `almostNever(fn)` | conditional | 10% probability application. | 08 |
| `always(fn)` | conditional | 100% probability (just always applies). | 08 |
| `anchor(noteOrPat)` | voicing | Anchor note for chord voicing. | 05 |
| `arp(idxPat)` | conditional | Arpeggiator over chord tones. | 08 |
| `arpWith(fn)` | conditional | Functional arpeggiator. | 08 |
| `arrange([n,p],...)` | factory | Multi-cycle arrangement. | 07 |
| `attack(s)` | effect | Amp envelope attack time. | 06 |
| `bank(name)` | source | Drum-machine prefix selection. | 04 |
| `begin(0..1)` | sample | Start position in sample. | 04 |
| `binary(n)` | factory | Rhythm from binary representation. | 07 |
| `binaryN(n, bits)` | factory | Padded version. | 07 |
| `bpf(hz)` | effect | Band-pass filter cutoff. | 06 |
| `bpq(q)` | effect | Band-pass filter Q. | 06 |
| `brand` / `brandBy(p)` | signal | Random binary 0/1. | 09 |
| `cat(...)` | factory | Concatenate; one cycle each. | 07 |
| `chunk(n, fn)` | conditional | Apply fn to one of n chunks per cycle, rotating. | 07 |
| `chunkBack(n, fn)` | conditional | Backward-rotating chunk. | 07 |
| `choose(...)` | random | Random pick (per event). | 08 |
| `chooseCycles(...)` | random | Random pick (per cycle). | 08 |
| `chord(symbols)` | source | Chord-symbol pattern. | 05 |
| `clip(n)` | time | Multiply event duration. | 07 |
| `coarse(n)` | effect | Sample-rate reduction. | 06 |
| `color(name)` | visual | Highlight color. | 06 |
| `compress(a,b)` | time | Squash pattern into [a,b], pad with silence. | 07 |
| `compressor(...)` | effect | Dynamic compressor. | 06 |
| `cosine` | signal | Cosine wave (0..1). | 09 |
| `cpm(n)` | tempo | Cycles per minute. | 02 |
| `crackle` | source | Crackle noise. | 10 |
| `crush(depth)` | effect | Bit-crusher. | 06 |
| `cut(group)` | sample | Cut group: kills earlier samples in group. | 04 |
| `cutoff(hz)` | effect | Alias for `lpf`. | 06 |
| `decay(s)` | effect | Amp envelope decay. | 06 |
| `degrade()` / `degradeBy(p)` | random | Drop p of events. | 08 |
| `delay(level)` | effect | Delay send level. | 06 |
| `delaytime(s)` / `dt` | effect | Delay time. | 06 |
| `delayfeedback(0..1)` / `dfb` | effect | Delay feedback. | 06 |
| `density(n)` | source | Crackle density. | 10 |
| `dict(name)` | voicing | Voicing-dictionary key. | 05 |
| `distort(amt)` | effect | Wave-shape distortion. | 06 |
| `div` | transform | Element-wise division. | 11 |
| `duckorbit(n)` | effect | Sidechain to orbit n. | 06 |
| `early(t)` | time | Shift earlier by t. | 07 |
| `echo(n, t, fb)` | accumulation | n echoes at t-spacing, fb-decay. | 07 |
| `echoWith(n, t, fn)` | accumulation | Parametric echo with per-iter transform. | 07 |
| `end(0..1)` | sample | End position in sample. | 04 |
| `euclid(p, s)` | factory | Euclidean rhythm. | 07 |
| `euclidLegato(p, s)` | factory | Euclidean with note-tying. | 07 |
| `euclidRot(p, s, r)` | factory | Rotated euclidean. | 07 |
| `every(n, fn)` | conditional | Apply fn on cycle 0 of every n. | 08 |
| `expand(factor)` | stepwise | Scale up step size. | — |
| `fast(n)` | time | Speed up by n. | 07 |
| `fastChunk(n, fn)` | conditional | chunk without source repeat. | 07 |
| `fastGap(n)` | time | Fast but with rest filler. | 07 |
| `firstOf(n, fn)` | conditional | = every. | 08 |
| `fit()` | sample | Fit sample to event duration. | 04 |
| `floor` | transform | Floor pattern values. | — |
| `fm(amt)` | synth | FM modulation depth. | 10 |
| `fmh(ratio)` | synth | FM harmonicity ratio. | 10 |
| `freq(hz)` | source | Frequency in Hz. | 05 |
| `ftype(t)` | effect | Filter topology. | 06 |
| `gain(g)` | effect | Volume (exponential). | 06 |
| `hpf(hz)` | effect | High-pass cutoff. | 06 |
| `hpq(q)` | effect | High-pass Q. | 06 |
| `hurry(n)` | time | fast + speed (so audible pitch shift on samples). | 07 |
| `hush()` | conditional | Mute pattern. | 08 |
| `iresponse(sample)` | effect | Convolution reverb IR. | 06 |
| `inhabit(idx, list)` | conditional | Like pick, but compresses to fit. | 08 |
| `initHydra()` | integration | Boot Hydra visuals. | — |
| `inside(n, fn)` | time | Apply fn as if pattern were n cycles long. | 07 |
| `invert` | transform | Swap 0/1. | 08 |
| `irand(n)` | signal | Continuous random ints in [0, n-1]. | 09 |
| `iter(n)` | time | Rotate by 1/n each cycle. | 07 |
| `iterBack(n)` | time | Reverse-rotating iter. | 07 |
| `juxBy(width, fn)` | accumulation | Stereo split with width control. | 07 |
| `jux(fn)` | accumulation | Stereo split: original left, fn(...) right. | 07 |
| `lastOf(n, fn)` | conditional | Apply on cycle n-1 of every n. | 08 |
| `late(t)` | time | Shift later by t. | 07 |
| `layer(...fns)` | accumulation | Stack fn-transformed copies (drop original). | 07 |
| `legato(n)` | time | Alias for clip. | 07 |
| `lfo({...})` | effect | Audio-rate parameter modulation. | 09 |
| `linger(f)` | time | Repeat first f-fraction. | 07 |
| `loadCsound\`...\`` | integration | Load CSound orchestra. | — |
| `loadOrc(url)` | integration | Load CSound .orc file. | — |
| `loop(0/1)` | sample | Enable sample loop. | 04 |
| `loopAt(n)` | sample | Stretch sample to n cycles. | 04 |
| `loopBegin/End(0..1)` | sample | Loop region. | 04 |
| `lpa(s)` / `lpattack` | effect | LP filter envelope attack. | 06 |
| `lpd(s)` / `lpdecay` | effect | LP filter envelope decay. | 06 |
| `lpe(amt)` / `lpenv` | effect | LP filter envelope depth. | 06 |
| `lpf(hz)` / `cutoff` | effect | Low-pass cutoff. | 06 |
| `lpq(q)` / `resonance` | effect | Low-pass Q. | 06 |
| `lpr(s)` / `lprelease` | effect | LP filter envelope release. | 06 |
| `lps(level)` / `lpsustain` | effect | LP filter envelope sustain. | 06 |
| `mask(pat)` | conditional | Gate events. | 08 |
| `markcss(...)` | visual | CSS override on highlighted code. | 06 |
| `midi(out, opts?)` | integration | Send pattern to MIDI device. | — |
| `midichan(n)` | integration | MIDI channel 1-16. | — |
| `midikeys()` | integration | MIDI keyboard input. | — |
| `midin(name?)` | integration | MIDI CC input. | — |
| `mod` | transform | Element-wise modulo. | — |
| `mode(name)` | voicing | Voicing mode (below/above/duck/root). | 05 |
| `mouseX/Y` | signal | Mouse position 0..1. | 09 |
| `mul` | transform | Element-wise multiplication. | 11 |
| `n(pat)` | source | Index pattern (sample variant or scale degree). | 04, 05 |
| `never(fn)` | conditional | 0% probability (never applies). | 08 |
| `noise(amt)` | synth | Mix noise into oscillator. | 10 |
| `note(pat)` | source | Pitched note pattern. | 05 |
| `o(n)` / `orbit(n)` | meta | FX bus group. | 06 |
| `off(t, fn)` | accumulation | Time-shifted transformed copy. | 07 |
| `offset(n)` | voicing | Voicing variation offset. | 05 |
| `often(fn)` | conditional | 75% probability. | 08 |
| `osc()` | integration | Send pattern over OSC. | — |
| `palindrome` | time | Alternate forward/reverse cycles. | 07 |
| `pan(0..1)` | effect | Stereo position. | 06 |
| `partials([...])` | synth | Additive synthesis amplitudes. | 10 |
| `pace(n)` | stepwise | Fit pattern to n steps. | — |
| `patt(s)` / `pattack` | effect | Pitch envelope attack. | 06 |
| `pdec(s)` / `pdecay` | effect | Pitch envelope decay. | 06 |
| `penv(semi)` | effect | Pitch envelope depth (in semitones). | 06 |
| `perlin` | signal | Smooth random noise. | 09 |
| `phasercenter(hz)` / `phc` | effect | Phaser center freq. | 06 |
| `phaserdepth(0..1)` / `phd` | effect | Phaser depth. | 06 |
| `phaser(rate)` / `ph` | effect | Phaser rate. | 06 |
| `phasersweep(hz)` / `phs` | effect | Phaser sweep. | 06 |
| `phases([...])` | synth | Per-harmonic phases. | 10 |
| `pick(idx, list)` | conditional | Index-pick from list. | 08 |
| `pickF(idx, fnList)` | conditional | Pick a function from list. | 08 |
| `pickmod` / `pickmodF` | conditional | Wrapping versions. | 08 |
| `pickRestart` / `pickReset` | conditional | Pick + restart/reset. | 08 |
| `piano()` | source | Quick piano synth. | 04 |
| `pianoroll(opts?)` | visual | Pianoroll visualization. | 06 |
| `ply(n)` | time | Repeat each event n times in place. | 07 |
| `polymeter(...)` / `pm` | factory | Polymetric stack. | 07 |
| `polyrhythm(...)` / `pr` | factory | Polyrhythmic stack. | 07 |
| `postgain(g)` | effect | Post-FX gain. | 06 |
| `progNum(n)` | integration | MIDI program change. | — |
| `pure(x)` | factory | Constant pattern. | 07 |
| `range(min, max)` | signal | Linear range mapping. | 09 |
| `range2(min, max)` | signal | Bipolar range mapping. | 09 |
| `rangex(min, max)` | signal | Exponential range mapping. | 09 |
| `rand` | signal | Continuous random 0..1. | 09 |
| `rand2` | signal | Continuous random -1..1. | 09 |
| `rarely(fn)` | conditional | 25% probability. | 08 |
| `release(s)` | effect | Amp envelope release. | 06 |
| `register(name, fn)` | meta | Register custom chained method. | — |
| `reset(pat)` | conditional | Reset to start of current cycle. | 08 |
| `restart(pat)` | conditional | Restart to cycle 0. | 08 |
| `rev` | time | Reverse within each cycle. | 07 |
| `ribbon(off, n)` | time | Loop a window. | 07 |
| `room(level)` | effect | Reverb send level. | 06 |
| `roomdim(hz)` / `rdim` | effect | Reverb dimming. | 06 |
| `roomfade(s)` / `rfade` | effect | Reverb fade time. | 06 |
| `roomlp(hz)` / `rlp` | effect | Reverb low-pass. | 06 |
| `roomsize(0..10)` / `rsize` / `size` | effect | Reverb size. | 06 |
| `rootNotes(octave)` | voicing | Extract chord roots. | 05 |
| `round` | transform | Round values. | — |
| `run(n)` | factory | Pattern of 0..n-1. | 07 |
| `s(pat)` / `sound(pat)` | source | Sound by name. | 04 |
| `samples(map, base?)` | setup | Register sample dictionary. | 04 |
| `saw` / `saw2` | signal | Sawtooth wave. | 09 |
| `scale(name)` | meta | Apply scale to numeric pattern. | 05 |
| `scaleTranspose(steps)` | transform | Diatonic transpose by scale steps. | 05 |
| `scrub(pos)` | sample | Scrub sample position. | 04 |
| `segment(n)` | time | Sample signal n times per cycle. | 09 |
| `seq(...)` / `fastcat` | factory | Concatenate within one cycle. | 07 |
| `set(pat)` | transform | Replace value with another pattern's. | 11 |
| `setcps(n)` | tempo | Cycles per second. | 02 |
| `setcpm(n)` | tempo | Cycles per minute. | 02 |
| `setVoicingRange(name, [lo, hi])` | voicing | Constrain voicing octaves. | 05 |
| `shape(amt)` | effect | Wave-shape distortion. | 06 |
| `silence` | factory | Empty pattern. | 07 |
| `sine` / `sine2` | signal | Sine wave. | 09 |
| `slice(n, idxPat)` | sample | Trigger named slices. | 04 |
| `slow(n)` | time | Slow down by n. | 07 |
| `slowcat(...)` | factory | = cat. | 07 |
| `someCycles(fn)` / `someCyclesBy(p, fn)` | random | Per-cycle probabilistic. | 08 |
| `sometimes(fn)` / `sometimesBy(p, fn)` | random | Per-event probabilistic. | 08 |
| `splice(n, idxPat)` | sample | Slice + auto-tempo-fit. | 04 |
| `square` / `square2` | signal | Square wave. | 09 |
| `squeeze(idx, list)` | conditional | Like inhabit. | 08 |
| `stack(...)` | factory | Parallel stack. | 07 |
| `stepcat([n,p],...)` / `timeCat` | factory | Weighted concat. | 07 |
| `striate(n)` | sample | Interleaved sample slicing. | 04 |
| `struct(pat)` | conditional | Apply rhythmic structure. | 08 |
| `sub` | transform | Element-wise subtraction. | 11 |
| `superimpose(fn)` | accumulation | Original ∪ fn(original). | 07 |
| `sustain(0..1)` | effect | Amp envelope sustain. | 06 |
| `swing(n)` / `swingBy(x, n)` | time | Shuffle feel. | 07 |
| `transpose(semis)` | transform | Chromatic transpose. | 05 |
| `tremdepth(0..1)` / `tremolodepth` | effect | Tremolo depth. | 06 |
| `tremshape(name)` / `tremoloshape` | effect | Tremolo waveform. | 06 |
| `tremsync(n)` / `tremolosync` | effect | Tremolo sync rate. | 06 |
| `tri` / `tri2` | signal | Triangle wave. | 09 |
| `tune(name)` | xen | Alternative tuning. | 05 |
| `undegrade()` / `undegradeBy(p)` | random | Inverse of degrade. | 08 |
| `useRNG('legacy')` | meta | Set deterministic RNG seed. | 08 |
| `v(rate)` / `vib(rate)` | effect | Vibrato rate. | 06 |
| `velocity(0..1)` | effect | Linear amplitude. | 06 |
| `vmod(semi)` / `vibmod` | effect | Vibrato depth. | 06 |
| `voicing()` | voicing | Realize chord as notes. | 05 |
| `vowel(letter)` | effect | Formant filter. | 06 |
| `wchoose(...)` / `wchooseCycles(...)` | random | Weighted random. | 08 |
| `when(condPat, fn)` | conditional | Conditional apply by binary pattern. | 08 |
| `xen(n_or_arr)` | xen | Equal-temperament or ratio-based tuning. | 05 |
| `xfade(a, mix, b)` | effect | Crossfade between patterns. | 06 |
| `zoom(a, b)` | time | Play slice [a, b] stretched to cycle. | 07 |

## Specialty terms

| Term | Meaning |
|---|---|
| **Cycle** | The fundamental time unit. Length = 1/cps. |
| **CPS / CPM** | Cycles per second / per minute. |
| **Mini-notation** | The string DSL inside `"..."`. |
| **Hap** | Strudel's name for "Event" (the type) — to avoid colliding with browser `Event`. |
| **Arc** | A time interval `[start, stop)`. Patterns query against arcs. |
| **Query** | The act of asking a pattern for events in an arc. |
| **Pattern** | A function `Arc → [Event]`. The fundamental Strudel value. |
| **Signal** | A continuous pattern (events lack `whole` arcs). |
| **Orbit** | An FX-bus group; patterns on the same orbit share global FX. |
| **Bank** | A drum-machine-prefix label for `s()` lookup. |
| **Voicing** | A way of arranging chord tones (octave, inversion, etc.). |
| **Scale degree** | An integer index into a named scale (0 = root). |
| **Polyrhythm** | Same cycle period, different event rates (e.g., 3-against-4). |
| **Polymeter** | Same step rate, different bar lengths. |
| **Struct** | A rhythmic skeleton that gates the source pattern. |
| **Mask** | A binary pattern that gates events on/off. |
| **Probability shortcuts** | always (1), almostAlways (0.9), often (0.75), sometimes (0.5), rarely (0.25), almostNever (0.1), never (0). |
| **`$:` line prefix** | Defines a stack member; multiple `$:` lines auto-stack. |
| **`_$:` prefix** | Mutes that stack member. |
