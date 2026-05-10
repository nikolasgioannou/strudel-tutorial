# 12 — Workshop Walkthrough

The official Strudel workshop is six short pages. This is my annotated walkthrough — every code example from the workshop with conceptual notes about what each does.

The pages are:

1. Getting Started
2. First Sounds
3. First Notes
4. First Effects
5. Pattern Effects
6. Recap

## Page 1 — Getting Started

The intro page. Key claims:

> "Strudel is an official port of the Tidal Cycles pattern language to JavaScript."
> "You don't need to know JavaScript or Tidal Cycles to make music with Strudel."

Featured demo "coastline" by eddyflux:

```
samples('github:eddyflux/crate')
setcps(.75)
let chords = chord("<Bbm9 Fm9>/4").dict('ireal')
stack(
  stack( // DRUMS
    s("bd").struct("<[x*<1 2> [~@3 x]] x>"),
    s("~ [rim, sd:<2 3>]").room("<0 .2>"),
    n("[0 <1 3>]*<2!3 4>").s("hh"),
    s("rd:<1!3 2>*2").mask("<0 0 1 1>/16").gain(.5)
  ).bank('crate').mask("<[0 1] 1 1 1>/16".early(.5))
  , chords.offset(-1).voicing().s("gm_epiano1:1").phaser(4).room(.5)
  , n("<0!3 1*2>").set(chords).mode("root:g2").voicing().s("gm_acoustic_bass")
  , chords.n("[0 <4 3 <2 5>>*2](<3 5>,8)")
    .anchor("D5").voicing()
    .segment(4).clip(rand.range(.4,.8))
    .room(.75).shape(.3).delay(.25)
    .fm(sine.range(3,8).slow(8))
    .lpf(sine.range(500,1000).slow(8)).lpq(5)
    .rarely(ply("2")).chunk(4, fast(2))
    .gain(perlin.range(.6, .9))
    .mask("<0 1 1 0>/16")
)
.late("[0 .01]*4").late("[0 .01]*2").size(4)
```

This is impenetrable for a beginner — and that's the point. The workshop teaches the pieces.

Controls to remember:
- `Ctrl+Enter` — play / re-evaluate
- `Ctrl+.` — stop
- `Ctrl+/` — toggle comment

## Page 2 — First Sounds

### Code field basics

```
sound("casio")
```

Single sound, repeating. The first thing to type.

### Sample variants

```
sound("casio")
sound("casio:1")
```

Many sounds have multiple samples. `:0` is default; `:1`, `:2` etc. select alternates.

Sounds to try (workshop suggestions): `insect, wind, jazz, metal, east, crow, casio, space, numbers`.

### Drum sounds

```
sound("bd hh sd oh")
sound("bd hh sd oh").bank("RolandTR909")
```

Drum abbreviations: `bd, sd, rim, hh, oh, lt, mt, ht, rd, cr` (kick, snare, rim, hihat, open hat, low/mid/high tom, ride, crash). `.bank()` switches drum machines.

Banks: `AkaiLinn, RhythmAce, RolandTR808, RolandTR707, RolandTR909, ViscoSpaceDrum`.

### Sequences

```
sound("bd hh sd hh")
sound("bd bd hh bd rim bd hh bd")
```

Spaces separate events. The cycle splits evenly. More events = faster (per cycle).

The currently-playing event is highlighted in the editor — visual feedback for which event is current.

### Angle brackets — one event per cycle

```
sound("<bd bd hh bd rim bd hh bd>")
sound("<bd bd hh bd rim bd hh bd>*8")
```

`<...>` plays one element per cycle. `*8` says "eight events per cycle, alternating across cycles." This is how you get a 1-event-per-step "sequencer" feel where each cycle picks a different note from the list.

### Tempo

```
setcpm(90/4)
sound("<bd hh rim hh>*8")
```

`setcpm(BPM/4)` is the convention for "BPM in 4-beat bars."

> "cpm = cycles per minute. The default is 30 cpm = 1 cycle every 2 seconds."

### Rests

```
sound("bd hh - rim - bd hh rim")
```

`-` (or `~`) is silence. The slot exists but nothing plays.

### Sub-sequences

```
sound("bd [hh hh] sd [hh bd] bd - [hh sd] cp")
```

`[ ]` groups events into a sub-pattern occupying one slot.

### Repetition with `*`

```
sound("bd hh*2 rim hh*3 bd [- hh*2] rim hh*2")
sound("bd [hh rim]*2 bd [hh rim]*1.5")
sound("bd hh*32 rim hh*16")    // pitch territory
```

`*N` repeats inside a slot. Decimals work. Very high counts push into pitched-buzz audio rate territory ("Pitch = really fast rhythm" — workshop's words).

### Nested

```
sound("bd [[rim rim] hh] bd cp")
```

You can nest brackets to any depth.

### Parallel patterns (comma)

```
sound("hh hh hh, bd casio")
sound("hh hh hh, bd bd, - casio")
sound("hh hh hh, bd [bd,casio]")
```

Top-level comma stacks. Inside brackets, comma is polyphony (chord).

### Multi-line backticks

```
sound(`bd*2, - cp,
- - - oh, hh*4,
[- casio]*2`)
```

Backticks let mini-notation span multiple lines.

### Sample number — two ways

```
sound("jazz:0 jazz:1 [jazz:4 jazz:2] jazz:3*2")
n("0 1 [4 2] 3*2").sound("jazz")
```

Both produce the same events. The `n()` form is more flexible.

### Worked examples

The workshop gives full songs:

**Basic Rock Beat**
```
setcpm(100/4)
sound("[bd sd]*2, hh*8").bank("RolandTR505")
```

Conceptual breakdown:
- 100 BPM in 4-beat bars (so 25 cpm).
- `[bd sd]*2` = "bd sd bd sd" = standard rock beat.
- `hh*8` = 8 hi-hats over the cycle.
- Comma stacks them.

**Classic House**
```
sound("bd*4, [- cp]*2, [- hh]*4").bank("RolandTR909")
```

- `bd*4` = four-on-the-floor kick.
- `[- cp]*2` = clap on beats 2 and 4.
- `[- hh]*4` = hi-hat on the off-beats (eighths).
- Together: classic house pattern.

**We Will Rock You**
```
setcpm(81/2)
sound("bd*2 cp").bank("RolandTR707")
```

- 81 BPM in 2-beat bars.
- `bd*2 cp` = "bd bd cp" — boom boom clap.

**YMO Firecracker**
```
setcpm(120/2)
sound("bd sd, - - - hh - hh - -, - perc - perc:1*2")
.bank("RolandCompurhythm1000")
```

Three layered patterns with offset hi-hats and percussion.

**16-step grid**
```
setcpm(90/4)
sound(`
[- - oh -] [- - - -] [- - - -] [- - - -],
[hh hh - -] [hh - hh -] [hh - hh -] [hh - hh -],
[- - - -] [cp - - -] [- - - -] [cp - - -],
[bd - - -] [- - - bd] [- - bd -] [- - - bd]
`)
```

Four lines, each a single drum part. The grid layout reads like a step sequencer.

## Page 3 — First Notes

### Number and letter notes

```
note("48 52 55 59").sound("piano")
note("c e g b").sound("piano")
note("db eb gb ab bb")
note("c2 e3 g4 b5").sound("piano")
```

Numbers = MIDI; letters = note names; `b` = flat, `#` = sharp; octave = number after letter.

### Multiple sounds simultaneously

```
note("36 43, 52 59 62 64").sound("piano")
note("48 67 63 [62, 58]").sound("piano gm_electric_guitar_muted")
note("48 67 63 [62, 58]").sound("piano, gm_electric_guitar_muted")
```

Inside `note()`, the comma is polyphony. Inside `sound()`, the comma plays both sounds simultaneously (every event has both timbres).

The space-separated `sound("piano gm_electric_guitar_muted")` alternates between sounds for each event — round-robin. That's a different kind of multi-instrument behavior.

### Longer sequences with `/`

```
note("[36 34 41 39]/4").sound("gm_acoustic_bass")
```

`/4` plays the bracket over 4 cycles. Slow phrases.

### `<>` for cycle alternation

```
note("<36 34 41 39>").sound("gm_acoustic_bass")
note("<[36 48]*4 [34 46]*4 [41 53]*4 [39 51]*4>").sound("gm_acoustic_bass")
note("60 <63 62 65 63>").sound("gm_xylophone")
```

`<...>` cycles through one element per cycle. Combine with `*N` for "N events per cycle, alternating across cycles."

### Drum + bass combo

```
sound("bd*4, [~ <sd cp>]*2, [~ hh]*4").bank("RolandTR909")
```

The `<sd cp>` makes the snare alternate with a clap each cycle. Subtle variation.

### Scales

```
setcpm(60)
n("0 2 4 <[6,8] [7,9]>").scale("C:minor").sound("piano")
```

`n` indexes into the scale. `0` is C, `2` is E♭, etc. Negative numbers and beyond-7 numbers reach into octaves above/below.

The chord shorthand `[6,8]` plays scale degrees 6 and 8 simultaneously.

Scales: `C:major, A2:minor, D:dorian, G:mixolydian, A2:minor:pentatonic, F:major:pentatonic`.

### Patterned scales

```
setcpm(60)
n("<0 -3>, 2 4 <[6,8] [7,9]>")
.scale("<C:major D:mixolydian>/4")
.sound("piano")
```

The scale itself can be a pattern — every 4 cycles, it switches.

### Repeat with `!` and elongate with `@`

```
note("c@3 eb").sound("gm_acoustic_bass")
```

c lasts 3 units, eb 1 unit (so c is 3/4 of cycle, eb is 1/4).

```
note("c!2 [eb,<g a bb a>]").sound("piano")
```

`c!2` = c c (two slots). Then a chord/melody combo.

### Shuffle pattern

```
setcpm(60)
n("<[4@2 4] [5@2 5] [6@2 6] [5@2 5]>*2")
.scale("<C2:mixolydian F2:mixolydian>/4")
.sound("gm_acoustic_bass")
```

Each beat has two notes, first 2x as long as second — that's a "shuffle" feel.

### Multi-pattern with `$:`

```
$: note("<[c2 c3]*4 [bb1 bb2]*4 [f2 f3]*4 [eb2 eb3]*4>")
.sound("gm_synth_bass_1").lpf(800)

$: n(`<
[~ 0] 2 [0 2] [~ 2]
[~ 0] 1 [0 1] [~ 1]
[~ 0] 3 [0 3] [~ 3]
[~ 0] 2 [0 2] [~ 2]
>*4`).scale("C4:minor")
.sound("gm_synth_strings_1")

$: sound("bd*4, [~ <sd cp>]*2, [~ hh]*4").bank("RolandTR909")
```

The `$:` prefix is the multi-line stack idiom. Each `$:` line is a layer. To mute a layer during dev: change `$:` to `_$:`.

## Page 4 — First Effects

### Low-pass filter (lpf)

```
note("<[c2 c3]*4 [bb1 bb2]*4 [f2 f3]*4 [eb2 eb3]*4>")
.sound("sawtooth").lpf(800)
```

Try `200` (muffled) and `5000` (bright). Patterns work too:

```
.lpf("200 1000 200 1000")
```

Note: patterning lpf doesn't change the rhythm — only the cutoff value.

### Vowel formant filter

```
note("<[c3,g3,e4] [bb2,f3,d4] [a2,f3,c4] [bb2,g3,eb4]>")
.sound("sawtooth").vowel("<a e i o>")
```

Sounds vocal-like.

### Gain (volume)

```
$: sound("hh*16").gain("[.25 1]*4")
$: sound("bd*4,[~ sd:1]*2")
```

Patterned gain creates accents. Workshop's claim: "Rhythm is all about dynamics."

### ADSR

```
note("c3 bb2 f3 eb3")
.sound("sawtooth").lpf(600)
.attack(.1).decay(.1).sustain(.25).release(.2)
```

Or shorthand: `.adsr(".1:.1:.5:.2")`.

Workshop suggests experimenting with each value (0 vs .5 vs 1) to feel its effect.

### Delay

```
$: note("[~ [[<[d3,a3,f4]!2 [d3,bb3,g4]!2> ~]]*2")
.sound("gm_electric_guitar_muted").delay(.5)

$: sound("bd rim").bank("RolandTR707").delay(".5")
```

Try: `.delay(".8:.125")` (level 0.8, time 0.125), `.delay(".8:.06:.8")` (with feedback).

### Reverb (room)

```
n("<4 [3@3 4] [<2 0> ~@16] ~>")
.scale("D4:minor").sound("gm_accordion:2")
.room(2)
```

### Pan

```
sound("numbers:1 numbers:2 numbers:3 numbers:4")
.pan("0 0.3 .6 1")
```

### Speed (sample playback rate)

```
sound("bd rim [~ bd] rim").speed("<1 2 -1 -2>").room(.2)
```

Negative speed = reverse playback.

### Fast and slow

```
sound("bd*4,~ rim ~ cp").slow(2)
sound("[bd*4,~ rim ~ cp]*<1 [2 4]>")
```

Inside mini-notation, `*N` is fast and `/N` is slow. JS-side, `.fast(N)` and `.slow(N)`.

### Modulation signals

```
sound("hh*16").gain(sine)
sound("hh*16").lpf(saw.range(500, 2000))

note("<[c2 c3]*4 [bb1 bb2]*4 [f2 f3]*4 [eb2 eb3]*4>")
.sound("sawtooth")
.lpf(sine.range(100, 2000).slow(4))
```

Signals: `sine, saw, square, tri, rand, perlin`. `.range(min, max)` maps them. `.slow(N)` stretches them over N cycles.

## Page 5 — Pattern Effects

These are the "more uniquely Tidal" transforms.

### `rev`

```
n("0 1 [4 3] 2 0 2 [~ 3] 4").sound("jazz").rev()
```

Reverse within each cycle.

### `jux`

```
n("0 1 [4 3] 2 0 2 [~ 3] 4").sound("jazz").jux(rev)
```

Split L/R, apply transform to right channel only.

Equivalent expansion:

```
$: n("0 1 [4 3] 2 0 2 [~ 3] 4").sound("jazz").pan(0)
$: n("0 1 [4 3] 2 0 2 [~ 3] 4").sound("jazz").pan(1).rev()
```

### Multiple tempos via patterned slow

```
note("c2, eb3 g3 [bb3 c4]").sound("piano").slow("0.5,1,1.5")
```

`slow("0.5,1,1.5")` applies three different slowdown factors simultaneously. Equivalent:

```
$: note(...).s("piano").slow(0.5).color('cyan')
$: note(...).s("piano").slow(1).color('magenta')
$: note(...).s("piano").slow(1.5).color('yellow')
```

### `add` for harmonization

```
setcpm(60)
note("c2 [eb3,g3]".add("<0 <1 -1>>"))
```

Adding numbers to notes treats notes as numbers (semitones). So `.add(7)` = up a fifth.

```
note("c2 [eb3,g3]".add("<0 <1 -1>>").add("0,7"))
```

Multiple adds compose. Adding `"0,7"` creates parallel: original + a copy 7 semitones up.

```
n("0 [2 4] <3 5> [~ <4 1>]".add("<0 [0,2,4]>")).scale("C5:minor")
```

In a scale context, `add` works in scale-degree units, not semitones.

### `ply`

```
sound("hh hh, bd rim [~ cp] rim").bank("RolandTR707").ply(2)
```

Each event repeats twice in its slot. Equivalent to multiplying everything by 2 in mini-notation.

### `off`

```
n("0 [4 <3 2>] <2 3> [~ 1]"
.off(1/16, x => x.add(4))
).scale("<C5:minor Db5:mixolydian>/2")
.s("triangle").room(.5).dec(.1)
```

> "Take the original pattern named as `x`, modify `x` with `.add(4)`, and play it offset to the original pattern by `1/16` of a cycle."

The most quoted Strudel idiom. Nesting:

```
s("bd sd [rim bd] sd,[~ hh]*4").bank("CasioRZ1")
.off(2/16, x => x.speed(1.5).gain(.25)
.off(3/16, y => y.vowel("<a e i o>*8")))
```

## Page 6 — Recap

The recap page is just lookup tables of everything covered. It's reproduced (with my conceptual notes) across:

- `03-mini-notation.md` (all symbols)
- `04-sounds-and-samples.md` (`s`, `bank`, `n`)
- `05-notes-and-pitch.md` (`note`, `n+scale`, `$:`)
- `06-effects.md` (`lpf`, `vowel`, `gain`, `delay`, `room`, `pan`, `speed`, signals, range)
- `07-pattern-transforms.md` (`fast`, `slow`, `rev`, `jux`, `add`, `ply`, `off`)
- `02-the-cycle.md` (`setcpm`)

## What the workshop covers vs what it doesn't

The 6 workshop pages cover roughly these concepts:
- Mini-notation: spaces, `*`, `/`, `[]`, `<>`, `~`, `,`, `@`, `!`, `:`
- Functions: `sound`/`s`, `n`, `note`, `bank`, `setcpm`
- Effects: `lpf`, `vowel`, `gain`, ADSR, `delay`, `room`, `pan`, `speed`
- Pattern transforms: `fast`, `slow`, `rev`, `jux`, `add`, `ply`, `off`
- Signals: `sine, saw, square, tri, rand, perlin`, `.range()`
- Multi-line: `$:`, backticks

What it does *not* cover (but I should still know):
- `stack()`, `cat()`, `seq()` (functions — workshop uses `,` mini-notation and `$:` instead)
- `every`, `lastOf`, `sometimes`, `often`, `rarely` (probabilistic / periodic)
- `degrade`, `?` (random drops)
- `hpf`, `bpf` (high/band-pass filters)
- `{}` (polymeter)
- Euclid `(p,s,r)` notation
- `chord()`, `voicing()`, `dict()` (chord/voicing engine)
- `chunk`, `iter`, `swing`, `compress`, `zoom`, `linger` (advanced time)
- LFO, ZZFX, FM, additive, wavetable
- Custom samples beyond the defaults
- MIDI, Hydra, CSound, MQTT integration

Those are covered in the `/learn/` documentation and across these notes.
