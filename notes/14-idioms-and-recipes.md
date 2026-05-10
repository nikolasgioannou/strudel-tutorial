# 14 — Idioms and Recipes

The vocabulary is finite; the combinations are infinite. But certain combinations come up *constantly* in Strudel code. This page is my catalog of the moves.

## The starter — drum + bass + chord + melody

The most common Strudel composition has 4 layers. A reusable template:

```js
let chords = chord("<Cm7 Fm7 Bb^7 Eb^7>/4").dict('lefthand');

stack(
    // 1. Drums
    s("bd*2, ~ <sd cp>, [~ hh]*4").bank('RolandTR909'),

    // 2. Bass (root notes from chord progression)
    chords.rootNotes(2).note().s('sawtooth').lpf(600).lpa(.1).lpenv(-4),

    // 3. Chord pad
    chords.voicing().s('gm_epiano1').room(.5).gain(.4),

    // 4. Melody
    n("0 [2 4] <3 5> [~ <4 1>]")
        .off(1/8, add(7))
        .scale("C:minor")
        .s('triangle').delay(.25).room(.3)
        .jux(rev)
)
```

This is the "Hello World" of full Strudel tracks. Each layer is independent; you can mute any with `// .hush()` or by changing `$:` to `_$:`.

## Drum pattern templates

### Four-on-the-floor (house, techno)

```
sound("bd*4, [- cp]*2, [- hh]*4").bank("RolandTR909")
```

### Rock beat

```
setcpm(100/4)
sound("[bd sd]*2, hh*8").bank("RolandTR505")
```

### Hip-hop / boom-bap

```
sound("bd ~ [~ bd] sd, [~ hh]*4").bank("RolandTR808")
```

### Drum and bass / breakbeat

```
samples('github:tidalcycles/dirt-samples')
s("amen/4").fit().chop(16).cut(1)
   .sometimesBy(.5, ply("2"))
   .sometimesBy(.25, mul(speed("-1")))
```

### Trap-style hat rolls

```
$: sound("bd ~ ~ bd ~ ~ bd ~").bank("RolandTR808")
$: sound("hh*16").gain("[1 .3 .5 .3]*4").sometimes(ply(2))
```

### Polyrhythmic 3-against-4

```
s("bd*3, hh*4")
```

### Gentle ambient drum

```
s("[~ rim]*2, [~ ~ ~ sd]").gain(.3).room(.5)
```

## Bass patterns

### Chord-derived bassline (canonical)

```
chord("<Am7 Dm7 G7 C^7>").rootNotes(2).note().s('sawtooth')
```

### Walking bass

```
"<c2 e2 g2 a2>".note().s('gm_acoustic_bass')
```

### Acid bass (303-style)

```
note("<c2 c3 c2 c3>").s('sawtooth')
   .lpf("<400 1500>".slow(4)).lpq(15)
   .lpa(0).lpd(.1).lpenv(8)
   .attack(0).decay(.05).sustain(0).release(.05)
   .delay(.1).delayfeedback(.6)
```

### Sub-bass (sine, simple)

```
note("c1*2 ~ eb1 ~").s('sine').gain(.8)
```

## Chord progressions

### Jazz ii-V-I

```
chord("<Dm7 G7 C^7>").dict('ireal').voicing()
```

### Pop progression (vi-IV-I-V)

```
chord("<Am F C G>/2").dict('ireal').voicing().s('gm_epiano1')
```

### Coltrane changes (giant steps)

```
seq(
  "[B^7 D7] [G^7 Bb7] Eb^7 [Am7 D7]",
  "[G^7 Bb7] [Eb^7 F#7] B^7 [Fm7 Bb7]",
  "Eb^7 [Am7 D7] G^7 [C#m7 F#7]",
  "B^7 [Fm7 Bb7] Eb^7 [C#m7 F#7]"
).chord().dict('lefthand').voicing()
```

### Modal pad

```
chord("Cm7").voicing().slow(4).attack(2).gain(.3).s('sawtooth').lpf(800)
```

## Melodic motifs

### Random walk in scale

```
n(perlin.range(0, 7).segment(8)).scale("C:minor").note()
```

### Harmonized line (parallel thirds)

```
n("0 2 4 6").scale("C:major").layer(
    x => x,
    x => x.scaleTranspose(2)
)
```

### Arpeggio (4 ways)

```js
// 1. Note string
note("c eb g c4").clip(2).s("piano")

// 2. Scale degrees
n("0 2 4 7").scale("C:minor").clip(2).s("piano")

// 3. Chord-tone select
n("0 1 2 3").chord("Cm").voicing().clip(2).s("piano")

// 4. off-cascade
"0".off(1/3, add(2)).off(1/2, add(4)).n().scale("C:minor").s("piano")
```

### Generative melody from signal

```
n(stack(sine, cosine.slow(3)).range(0, 12).segment(16))
   .scale("D:dorian")
   .note()
   .clip(.5).s('triangle')
```

## Magic spices (one-liners that always sound good)

### `.jux(rev)`

```
ANY_PATTERN.jux(rev)
```

The single most common spice. Splits stereo, reverses the right channel.

### Harmonized echo

```
.off(1/8, x => x.add(7))
```

A delayed copy transposed up a fifth. Substitute the offset and interval to taste.

### Modulated cutoff

```
.lpf(sine.range(200, 2000).slow(4))
```

Slow filter sweep. Makes any synth feel alive.

### Probabilistic ply

```
.sometimesBy(.4, ply(2))
```

40% chance of doubling each event. Adds glitch energy.

### Random pitch jitter (perlin)

```
.add(perlin.range(0, .5))
```

Adds 0-50 cents of pitch wobble. Sounds like an acoustic instrument's natural pitch variation.

### Detune fattening

```
.add(note("0,.1"))    // 0 semitones AND 0.1 semitones — slight chorus
```

Stacks two slightly-detuned voices. Instant fat sound.

### Velocity humanization

```
.velocity(rand.range(.5, 1))
```

Per-event random velocity. Makes drums feel played-by-hand.

### Reverse 50% of events

```
.sometimes(x => x.speed(-1))
```

Random reverses for variation.

### Tape warble (subtle pitch flutter)

```
.add(note(perlin.range(0, .5)))
```

## Arrangement idioms

### Mask-based section gating

```
.mask("<x@7 ~>/8")     // play 7 cycles, rest 1, every 8
.mask("<0 1 1 0>/16")  // structured 16-cycle on/off
.mask("<x ~ x x>/4")   // play 3 of every 4 cycles
```

### Slow build-up via `.fast` patterning

```
[base_pattern].fast("<1 1 2 4>/16")
```

Pattern doubles every 4 cycles, climbing to 4× over 16.

### Per-bar variation via `every`

```
.every(4, x => x.fast(2))
.every(8, rev)
.every(16, ply(2))
```

Layer multiple periodic transforms; they compound musically.

### A/B/A/C song form via `cat`

```
cat(verse, verse, chorus, bridge).slow(4)
```

Where `verse`, `chorus`, `bridge` are pre-built patterns. Each plays for 4 cycles.

### Live-coding mute

```
$: s("bd*4")          // playing
_$: s("hh*8")         // muted (rename $: to _$:)
```

Or `.hush()` at the end of a layer to silence it during dev.

## Effect chains as functions

### Define once, reuse everywhere

```js
const keys = x => x
    .s('sawtooth')
    .cutoff(1200)
    .gain(.5)
    .attack(0)
    .decay(.16)
    .sustain(.3)
    .release(.1);

note("c d e g").apply(keys)
note("c2 g2 c3 g3").apply(keys)
```

`.apply(fn)` calls `fn(this)`. Lets you build a "patch" once and instantiate it on different patterns.

### Pluck synth preset

```js
const pluck = x => x
    .s('sawtooth')
    .lpf(800).lpq(8).lpa(.05).lpenv(4)
    .attack(0).decay(.15).sustain(0).release(.05)
    .gain(.5).room(.3);
```

### Pad preset

```js
const pad = x => x
    .s('sawtooth')
    .lpf(800)
    .attack(2).decay(.2).sustain(.7).release(2)
    .gain(.3).room(1.5).delay(.4);
```

### Bell preset

```js
const bell = x => x
    .s('sine')
    .fm(8).fmh(2.7)              // inharmonic FM
    .attack(0).decay(.5).sustain(0).release(.3)
    .gain(.5).room(1).delay(.5);
```

## Generative composition tricks

### 1-note source, transformed

Take a single root note and let transforms do the work:

```
note("c2").every(4, fast(2)).off(1/3, add(7)).off(1/2, add(12))
```

### Bound-then-degrade

```
n("0 1 2 3 4 5 6 7").degradeBy(.4).scale("C:minor").note()
```

40% of the events drop. Keeps overall shape but introduces holes that change each cycle.

### Iter for cycle rotation

```
n("0 1 2 3 4 5 6 7").iter(4).scale("C:dorian")
```

Each cycle starts at a different position in the source pattern. Endless variation.

### Choose-cycles for selection

```
chooseCycles("Cm7", "Fm7", "Bbm7", "Ebm7").chord().voicing()
```

Each cycle picks a random chord — generative jazz progression.

## Quick problem-solving recipes

### "It sounds too rigid"

- Add `.swing(8)` for shuffle.
- Add `.gain("[1 .5 .8 .5]*4")` for accents.
- Add `.velocity(rand.range(.7, 1))`.
- Add `.late(perlin.range(-.005, .005))` for micro-timing humanization.

### "It sounds too busy"

- `.degradeBy(.3)` to drop random events.
- `.struct("x ~ x x ~ x ~ x")` to impose a sparser rhythm.
- `.mask("<x ~>/2")` for sectional silence.

### "It sounds too dry"

- Add `.room(.5)` and `.delay(.3)`.
- Use `.jux(rev)` for stereo width.
- Add `.add(note("0,.1"))` for chorus.

### "It sounds too wet"

- Lower `.room()` and `.delay()` values.
- Add `.cut(1)` to drum hits to prevent reverb tails colliding.
- Use `.orbit(2)` to isolate FX.

### "It sounds too thin"

- Layer waveforms: `.s("sawtooth, square")`.
- Add `.add(note(12))` to double an octave up.
- Use `.layer(x => x, x => x.add(.05))` for detune.

### "It's not evolving"

- Modulate cutoff with a slow signal: `.lpf(sine.range(200, 2000).slow(8))`.
- Add `.every(4, fast(2))` for periodic variation.
- Use `.iter(4)` to rotate the source.
- Use `.chunk(4, jux(rev))` to vary which fragments get treated.

## The composer's loop

When I'm reading or writing Strudel code, the typical iterative process is:

1. Pick a vibe (genre/mood).
2. Set a base pattern with mini-notation.
3. Choose synth voices via `.s(...)` and effect chains.
4. Layer 3-5 stacked patterns.
5. Add variation: `every(N, fn)` + `sometimes(fn)` + signal-modulated parameters.
6. Add arrangement structure: `mask(...)` for section transitions.
7. Polish: `.late(perlin...)` micro-timing, `.jux(rev)` for stereo, `.color(...)` for visuals.
8. Listen, adjust, repeat.

Each step has 5-10 idiomatic options. The notebook I've built up here should give me enough to navigate them.
