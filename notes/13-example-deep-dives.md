# 13 — Example Deep Dives

Reading other people's code is how you internalize idiom. Here I walk through several examples from the official gallery line by line, decoding what each piece does conceptually.

I'm going to pick examples that demonstrate different aspects:

1. **Chop** — minimal sample mangling
2. **Delay** — compact dub idiom
3. **Echo piano** — harmonized echo cascade
4. **Jux und tollerei** — pattern transforms showcase
5. **Caverave** — full song with shared chains
6. **Belldub** — multi-orbit, multi-layer ambient
7. **Coastline** (the workshop demo) — the deep end

---

## 1. Chop

```js
samples({ p: 'https://cdn.freesound.org/previews/648/648433_11943129-lq.mp3' })

s("p")
  .loopAt(32)
  .chop(128)
  .jux(rev)
  .shape(.4)
  .decay(.1)
  .sustain(.6)
```

### What's happening

Line 1: register a custom sample under name `p` from a freesound URL.

Line 3: play sample `p`.
- `.loopAt(32)` — make this sample fit exactly into 32 cycles. So instead of playing at its native length, Strudel time-stretches it.
- `.chop(128)` — cut the sample into 128 grains, play them sequentially. So per cycle: 128/32 = 4 grains audible per cycle.
- `.jux(rev)` — left channel plays grains in order; right channel reverses them.
- `.shape(.4)` — wave-shape distortion at 0.4 amount.
- `.decay(.1).sustain(.6)` — short envelope decay to 60% sustain.

### Key concept

The shortest possible "interesting" Strudel patch. With *one* sample and the granular tools, you get an evolving, stereo-rich texture. The trick is `loopAt(32).chop(128)` — that combination guarantees the sample plays back in chronological order, just chopped up, never at its native rate.

`jux(rev)` here is doing a lot: with 128 grains, the right channel is playing them in reverse order, which creates a phasing-like motion against the left channel.

---

## 2. Delay

```js
stack(
    s("bd <sd cp>")
    .delay("<0 .5>")
    .delaytime(".16 | .33")
    .delayfeedback(".6 | .8")
).sometimes(x => x.speed("-1"))
```

### What's happening

Inside the stack:
- Pattern: `s("bd <sd cp>")` — bd on every other event, with snare-OR-clap alternating each cycle on the off-beats.
- `.delay("<0 .5>")` — alternates delay level: cycle 0 has no delay (level 0), cycle 1 has 0.5 delay.
- `.delaytime(".16 | .33")` — delay time is randomly picked per event (the `|` mini-notation operator).
- `.delayfeedback(".6 | .8")` — delay feedback also random per event.

Outside the stack: `.sometimes(x => x.speed("-1"))` — 50% chance any event plays in reverse.

### Key concept

This is "set and forget" probabilistic dub. With:
- alternating delay on/off per cycle
- randomized delay times
- randomized feedback
- random reverse

…you get evolving dubby rhythm from very little code. Three random parameters compounding produces enough variation for several minutes of listening.

The `<0 .5>` pattern in delay is structural: it makes the dubby effect "come and go" in a regular cycle, while the `|` patterns inside the values keep individual events unpredictable. Macro-determinism + micro-randomness.

---

## 3. Echo piano

```js
n("<0 2 [4 6](3,4,2) 3*2>").color('salmon')
.off(1/4, x => x.add(n(2)).color('green'))
.off(1/2, x => x.add(n(6)).color('steelblue'))
.scale('D minor')
.echo(4, 1/8, .5)
.clip(.5)
.piano()
.pianoroll()
```

### What's happening

Source: `n("<0 2 [4 6](3,4,2) 3*2>")` — scale degree pattern that varies per cycle:
- Cycle 0: scale degree 0
- Cycle 1: scale degree 2
- Cycle 2: euclidean (3,4,2) of `[4 6]` — that's a rotated 3-pulse-in-4 rhythm of two notes
- Cycle 3: 3 played twice (so `3*2`)

So the source is a four-cycle melodic phrase.

`.off(1/4, x => x.add(n(2)))` — adds a copy delayed by 1/4 cycle, transposed up 2 scale degrees.
`.off(1/2, x => x.add(n(6)))` — adds another copy delayed by 1/2 cycle, transposed up 6 scale degrees.

Now we have three voices: original, +2 at offset 1/4, +6 at offset 1/2.

`.scale('D minor')` — interpret all those numeric scale degrees in D minor.

`.echo(4, 1/8, .5)` — add 4 echoes spaced at 1/8 cycle, each at half the previous gain.

`.clip(.5)` — each note lasts only half its slot.

`.piano()` — render with the piano synth.

### Key concept

Layered offsets are how you build "canon"-style harmonized echoes from a single melodic source. Two `off`s give you three voices in a triadic harmony. Add `.echo` and you get cascading repeats that sound like Reich-style minimalist tape music.

The `.color()` calls are visualizer hints — the original is salmon, the +2 voice green, the +6 voice steelblue. So you can see the parts in the pianoroll.

---

## 4. Jux und tollerei

```js
note("c3 eb3 g3 bb3").palindrome()
.s('sawtooth')
.jux(x => x.rev().color('green').s('sawtooth'))
.off(1/4, x => x.add(note("<7 12>/2")).slow(2).late(.005).s('triangle'))
.lpf(sine.range(200, 2000).slow(8))
.lpa(.2).lpenv(-2)
.decay(.05).sustain(0)
.room(.6)
.delay(.5).delaytime(.1).delayfeedback(.4)
.pianoroll()
```

### What's happening

Source: `note("c3 eb3 g3 bb3")` — minor 7th arpeggio.

`.palindrome()` — alternates: cycle 0 forward (c eb g bb), cycle 1 reversed (bb g eb c). Pendulum.

`.s('sawtooth')` — sawtooth source.

`.jux(x => x.rev().color('green').s('sawtooth'))` — right channel: reverse the (already palindromic) source and color it green.

`.off(1/4, x => x.add(note("<7 12>/2")).slow(2).late(.005).s('triangle'))` — add a copy:
- delayed by 1/4 cycle
- transposed alternately by 7 (fifth) or 12 (octave) every 2 cycles
- played at half-speed (slow 2)
- with 0.005 cycle micro-late shift (flam)
- on triangle wave instead of sawtooth

`.lpf(sine.range(200, 2000).slow(8))` — slow-modulated cutoff over 8 cycles.

`.lpa(.2).lpenv(-2)` — filter envelope: 0.2s attack, modulating *down* by 2 semitones-equivalent. So filter sweeps down each note.

`.decay(.05).sustain(0)` — ultra-short envelope. Pluck.

`.room(.6).delay(.5).delaytime(.1).delayfeedback(.4)` — wet space.

### Key concept

Three voices, all interacting:
1. Original sawtooth (left channel).
2. Reversed sawtooth (right channel via jux).
3. Triangle harmony, offset and slow, 1/4 cycle behind, flammed.

Plus the slow filter modulation evolves the timbre. This is how you get "evolving, lush" from short input.

The micro-late `.late(.005)` is the giveaway of professional patch design — that tiny offset prevents the off-voice from being phase-perfect with the original, which avoids comb-filtering and gives the impression of two musicians who aren't *quite* playing together.

---

## 5. Caverave

```js
const keys = x => x.s('sawtooth').cutoff(1200).gain(.5)
  .attack(0).decay(.16).sustain(.3).release(.1);

const drums = stack(
  s("bd*2").mask("<x@7 ~>/8").gain(.8),
  s("~ <sd!7 [sd@3 ~]>").mask("<x@7 ~>/4").gain(.5),
  s("[~ hh]*2").delay(.3).delayfeedback(.5).delaytime(.125).gain(.4)
);

const synths = stack(
  "<eb4 d4 c4 b3>/2"
  .scale("<C:minor!3 C:melodic:minor>/2")
  .struct("[~ x]*2")
  .layer(
    x => x.scaleTranspose(0).early(0),
    x => x.scaleTranspose(2).early(1/8),
    x => x.scaleTranspose(7).early(1/4),
    x => x.scaleTranspose(8).early(3/8)
  ).note().apply(keys).mask("<~ x>/16")
  .color('darkseagreen'),

  note("<C2 Bb1 Ab1 [G1 [G2 G1]]>/2")
  .struct("[x [~ x] <[~ [~ x]]!3 [x x]>@2]/2".fast(2))
  .s('sawtooth').attack(0.001).decay(0.2).sustain(1).cutoff(500)
  .color('brown'),

  chord("<Cm7 Bb7 Fm7 G7b13>/2")
  .struct("~ [x@0.2 ~]".fast(2))
  .dict('lefthand').voicing()
  .every(2, early(1/8))
  .apply(keys).sustain(0)
  .delay(.4).delaytime(.12)
  .mask("<x@7 ~>/8".early(1/4))
).add(note("<-1 0>/8"))

stack(
  drums.fast(2).color('tomato'),
  synths
).slow(2)
```

### What's happening

This shows real composition idioms.

**Shared effect chain**: `const keys = x => x...` captures a sawtooth-with-envelope chain that gets reused via `.apply(keys)`. This is JS-as-music: you build factories.

**Drums** are a separate `const`:
- `bd*2` masked by `<x@7 ~>/8` — kick plays for 7 cycles, drops for 1, every 8 cycles.
- snare alternates: 7 cycles of `sd!7` (sd repeated), then 1 cycle of `sd@3 ~` (long sd then rest), gated by `<x@7 ~>/4` (every 4 cycles, on for 7 quarters off for 1).
- hi-hats with delay.

**Synths** has three voices stacked:

1. **Lead arpeggios** — `"<eb4 d4 c4 b3>/2"` (one note per 2 cycles), `.struct("[~ x]*2")` (4-event rhythm with rests), then `.layer(...)` with four offset-and-transposed copies (staggered chords).

2. **Bass** — `note("<C2 Bb1 Ab1 [G1 [G2 G1]]>/2")` (chord roots), with a complex struct rhythm.

3. **Chord pad** — `chord("<Cm7 Bb7 Fm7 G7b13>/2")` voiced left-hand style, every-2-cycles-off-by-1/8 for swing, with delay.

Then everything stacked together via `stack(drums.fast(2), synths).slow(2)`.

### Key concept

This pattern shows **macro-arrangement via masks**. The `mask("<x@7 ~>/8")` patterns create A-B sectional structure: parts come in and out over 8-cycle periods, creating verses and breakdowns without changing code. The core melodic material loops, but masking creates the illusion of arrangement.

Also: the `.apply(keys)` pattern is the right way to share synth voices across different layers without copy-pasting. A const-bound function = a synth preset.

---

## 6. Belldub

```js
samples({ bell: { b4: 'https://cdn.freesound.org/previews/339/339809_5121236-lq.mp3' }})

stack(
  // bass
  note("[0 ~] [2 [0 2]] [4 4*2] [[4 ~] [2 ~] 0@2]".scale('g1 dorian').superimpose(x => x.add(.02)))
  .s('sawtooth').cutoff(200).resonance(20).gain(.15).shape(.6).release(.05),

  // perc
  s("[~ hh]*4").room("0 0.5".fast(2)).end(perlin.range(0.02, 1)),
  s("mt lt ht").struct("x(3,8)").fast(2).gain(.5).room(.5).sometimes(x => x.speed(".5")),
  s("misc:2").speed(1).delay(.5).delaytime(1/3).gain(.4),

  // chords
  chord("[~ Gm7] ~ [~ Dm7] ~")
  .dict('lefthand').voicing()
  .add(note("0,.1"))
  .s('sawtooth').gain(.8)
  .cutoff(perlin.range(400, 3000).slow(8))
  .decay(perlin.range(0.05, .2)).sustain(0)
  .delay(.9).room(1),

  // blips
  note(
    "0 5 4 2".iter(4)
    .off(1/3, add(7))
    .scale('g4 dorian')
  ).s('square').cutoff(2000).decay(.03).sustain(0)
  .degradeBy(.2)
  .orbit(2).delay(.2).delaytime(".33 | .6 | .166 | .25")
  .room(1).gain(.5).mask("<0 1>/8"),

  // bell
  note(rand.range(0, 12).struct("x(5,8,-1)").scale('g2 minor pentatonic'))
  .s('bell').begin(.05)
  .delay(.2).degradeBy(.4).gain(.4)
  .mask("<1 0>/8")
).slow(5)
```

### What's happening

Five layers stacked:

1. **Bass** — sawtooth playing scale-degree pattern in g dorian, with super-low cutoff (200), high resonance (20), heavy distortion (`shape(.6)`), and slight detuning via `superimpose(x => x.add(.02))`.

2. **Hats** — `[~ hh]*4` (off-beat hats) with `room("0 0.5".fast(2))` (alternating wet/dry) and randomized end time `.end(perlin.range(0.02, 1))` (each hat plays a random sample length).

3. **Toms** — euclidean (3,8) struct, with sometimes-half-speed playback for variation.

4. **Misc fx** — `misc:2` with rhythmic delay (1/3 cycle = triplet feel).

5. **Chords** — left-hand-voiced Gm7-and-Dm7 alternating, slightly detuned (`add(note("0,.1"))`), perlin-modulated cutoff and decay (slowly evolving), heavy delay and reverb.

6. **Blips** — square wave melodic motif on **orbit 2** (separate FX bus). `iter(4)` rotates each cycle. `.off(1/3, add(7))` adds parallel-fifth echo. Mask gates it on/off every 8 cycles.

7. **Bell** — random pitches in pentatonic, euclidean (5,8,-1) struct. Custom-loaded bell sample from freesound. Mask gates on alternate 8-cycle blocks (so when blips play, bell rests; when bell plays, blips rest — they alternate).

Everything `.slow(5)` to spread out.

### Key concept

This shows full ambient-dub composition technique. The use of **alternating masks** (blips on `<0 1>/8`, bell on `<1 0>/8`) creates a call-and-response between two melodic elements without scripting it explicitly.

`.orbit(2)` on the blips means they have their own delay (separate from the chord delay) — that's why the blips can have `.delay(.2)` while the chords have `.delay(.9)` without those two getting tangled.

The use of `perlin.range(0, .5).slow(N)` for cutoff and decay = generative timbre. Every cycle the synth sounds slightly different, but smoothly so.

---

## 7. Coastline (the workshop intro demo)

This was reproduced in `12-workshop-walkthrough.md`. Going through it now with the vocabulary I've built:

```js
samples('github:eddyflux/crate')           // load custom drum pack
setcps(.75)                                // 0.75 cycles per second
let chords = chord("<Bbm9 Fm9>/4").dict('ireal')   // 2-chord progression, 4 cycles each

stack(
  // ===== DRUMS layer =====
  stack(
    s("bd").struct("<[x*<1 2> [~@3 x]] x>"),
    // kick: complex struct that varies per cycle:
    //  cycle 0: [x*1, ~~~ x] then x = 4 events with last being kick
    //  cycle 1: [x*2, ~~~ x] then x = 5 events
    
    s("~ [rim, sd:<2 3>]").room("<0 .2>"),
    // rim+snare layer: rest, then [rim simultaneous with sd:variant]
    // alternating snare variant per cycle, alternating reverb amount
    
    n("[0 <1 3>]*<2!3 4>").s("hh"),
    // hi-hat: index 0, then 1 or 3 (alternating), at speed 2!3 (2,2,2,4) per cycle
    
    s("rd:<1!3 2>*2").mask("<0 0 1 1>/16").gain(.5)
    // ride: 2 hits per cycle, only on cycles 8-15 of every 16
  ).bank('crate')                                       // all drums use the loaded crate pack
  .mask("<[0 1] 1 1 1>/16".early(.5))                   // gate the entire drum layer

  // ===== CHORD pad =====
  , chords.offset(-1).voicing().s("gm_epiano1:1").phaser(4).room(.5)
  // electric piano with phaser

  // ===== BASS =====
  , n("<0!3 1*2>").set(chords).mode("root:g2").voicing().s("gm_acoustic_bass")
  // bass: pattern indexes into the chord; mode "root:g2" picks root note in octave 2

  // ===== MELODY =====
  , chords.n("[0 <4 3 <2 5>>*2](<3 5>,8)")
    .anchor("D5").voicing()
    .segment(4)
    .clip(rand.range(.4, .8))
    .room(.75).shape(.3).delay(.25)
    .fm(sine.range(3, 8).slow(8))                       // FM modulated
    .lpf(sine.range(500, 1000).slow(8)).lpq(5)          // sweeping cutoff
    .rarely(ply("2"))                                   // 25% of events double-played
    .chunk(4, fast(2))                                   // every 4th chunk gets sped up
    .gain(perlin.range(.6, .9))                          // perlin-varied gain
    .mask("<0 1 1 0>/16")                               // arrangement gate
)
.late("[0 .01]*4")                                       // micro-late on 4 events
.late("[0 .01]*2")                                       // micro-late on 2 events (compounding)
.size(4)                                                 // global reverb size
```

### Why it's intimidating

It uses *every* major Strudel feature simultaneously:
- Custom samples (`samples('github:eddyflux/crate')`)
- Chord progression with iReal voicings
- Patterned struct with nested `<...>` for polymetric drum patterns
- Multiple banks
- Multi-orbit FX
- Pitched signal modulation (`sine.range(...)`)
- Probabilistic transforms (`rarely`, `chunk`)
- Mask-based arrangement
- Micro-timing (`.late("[0 .01]*4")`)

### What I take away

Every individual ingredient in here is something I can read line-by-line now. The whole *together* looks dense, but it's just multiple layers each doing one or two things.

The `late("[0 .01]*4").late("[0 .01]*2")` chain is interesting: applying `late` twice with different patterns creates compound micro-timing — a kind of jittery groove that's almost imperceptible but humanizes the result.

`.size(4)` at the end is the reverb roomsize for the whole stack.

---

## What I learned from these examples

1. **Const-bound effect chains** are how real Strudel code stays DRY. `const keys = x => x.s('sawtooth')...` reused via `.apply(keys)`.

2. **Mask-based arrangement** is the standard idiom for verses/choruses. `.mask("<x@7 ~>/8")` instead of writing out 8 separate cycles.

3. **Orbits** matter when you want different FX per layer. Without orbits, your delay times collide.

4. **Modulation signals are everywhere**. Almost every example has at least one `perlin.range(...)` or `sine.range(...).slow(N)` slowly evolving some parameter.

5. **`jux(rev)` is the magic spice**. Used in 80%+ of examples. It's the cheapest way to add stereo character.

6. **`off` cascades = harmonized echoes**. Two stacked `off`s with different transforms = three voices.

7. **Micro-timing** (`.late(.005)`) at fractional values is what separates "rigid" from "alive."

8. **`.color()` everywhere**. Visualization is part of the medium.

The vocabulary I've learned is enough to read any of these. The skill I still need is *composition* — knowing which combinations *work* musically.
