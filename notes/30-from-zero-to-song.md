# 30 — From Zero to Song

A narrated walkthrough of building a complete Strudel track from an empty buffer. Every step of the iterative live-coding process — what I'd type, what each line adds, why it goes in that order.

The target track: a four-on-the-floor minor-key house piece, around 120 BPM, with bassline, chord pad, and a melodic lead. About 8 cycles of intro → 16 cycles of full → 4 cycles of breakdown → 16 cycles of full again.

## Step 0 — empty buffer

Start in the REPL with nothing. Press Ctrl+Enter — silence.

```js
// (empty)
```

## Step 1 — set tempo and a kick

```js
setcpm(120/4)
$: s("bd*4").bank("RolandTR909")
```

`setcpm(120/4)` = 120 BPM in 4-beat bars. Each cycle is one bar.

`bd*4` — four kicks per cycle. The `RolandTR909` bank gives me the punchy 909 kick.

I press Ctrl+Enter. I'd hear a steady four-on-the-floor.

## Step 2 — add a hi-hat

```js
setcpm(120/4)
$: s("bd*4").bank("RolandTR909")
$: s("hh*8").bank("RolandTR909").gain(.4)
```

`hh*8` = eight hi-hats per cycle (eighth notes). `.gain(.4)` quiets them so they don't dominate. The kick is loud; the hat is texture.

## Step 3 — add a clap on 2 and 4

```js
setcpm(120/4)
$: s("bd*4").bank("RolandTR909")
$: s("hh*8").bank("RolandTR909").gain(.4)
$: s("- cp - cp").bank("RolandTR909")
```

`- cp - cp` = rest, clap, rest, clap → claps on beats 2 and 4. This is the classic backbeat.

Now I have a complete house drum kit: kick on every beat, hat on every eighth, clap on 2 and 4.

## Step 4 — bassline

```js
setcpm(120/4)
$: s("bd*4").bank("RolandTR909")
$: s("hh*8").bank("RolandTR909").gain(.4)
$: s("- cp - cp").bank("RolandTR909")
$: note("<c2 c2 ab1 g1>").s("sawtooth").lpf(800).lpa(.05).lpenv(4)
    .attack(0).decay(.15).sustain(0).release(.05)
```

Bassline notes: c2, c2, ab1, g1 — four bars cycling. In C minor that's i, i, VI, V — a typical minor progression.

The synth voice:
- `s("sawtooth")` — rich harmonic source
- `.lpf(800)` — tame the high end, keep it bassy
- `.lpa(.05).lpenv(4)` — filter envelope: 50ms attack, sweeps up by 4 (semitones-equivalent). Pluck character.
- ADSR `.attack(0).decay(.15).sustain(0).release(.05)` — pure pluck, no sustain.

That's a typical "acid bass" recipe — cuts through the kick because of the resonance and pluck shape.

## Step 5 — chord pad

```js
setcpm(120/4)
$: s("bd*4").bank("RolandTR909")
$: s("hh*8").bank("RolandTR909").gain(.4)
$: s("- cp - cp").bank("RolandTR909")
$: note("<c2 c2 ab1 g1>").s("sawtooth").lpf(800).lpa(.05).lpenv(4)
    .attack(0).decay(.15).sustain(0).release(.05)
$: chord("<Cm Cm Ab^7 G7>").voicing().s("gm_epiano1")
    .gain(.3).room(.5).attack(.1).release(.5)
```

Chord progression matches the bassline (i, i, VI, V in C minor). `.voicing()` picks reasonable inversions automatically. `.s("gm_epiano1")` is the soundfont electric piano. Gentle attack/release for pad-like character.

`.room(.5)` adds reverb so the chords sit in a space.

I now have: drums + bass + chord pad. That's a complete groove. Could loop this for minutes and it'd be listenable.

## Step 6 — melody

```js
$: n("<0 2 4 6 [4 2] 4 2 0>").scale("C:minor")
    .s("triangle").gain(.4).delay(.3).delaytime(.125).delayfeedback(.4)
    .room(.4)
```

Scale-degree melody: 0, 2, 4, 6, [4 2], 4, 2, 0 in C minor. That's c, eb, g, bb, [g f], g, eb, c — a descending pentatonic-ish line.

`s("triangle")` — soft synth tone, doesn't fight the saw bass.

`.delay(.3).delaytime(.125)` — 1/8-note delay at 30% level. Adds dub-style echo trails.

I now have 5 layers. The track has body.

## Step 7 — modulate the bass cutoff

```js
$: note("<c2 c2 ab1 g1>").s("sawtooth")
    .lpf(sine.range(400, 1500).slow(8))    // ← changed from static 800
    .lpa(.05).lpenv(4)
    .attack(0).decay(.15).sustain(0).release(.05)
```

Replace static `lpf(800)` with `sine.range(400, 1500).slow(8)`. Now the bass cutoff sweeps slowly between 400 and 1500 Hz over 8 cycles (16 seconds). Adds movement to a part that was static.

## Step 8 — variation on the kick every 4 bars

```js
$: s("bd*4").bank("RolandTR909").every(4, x => x.fast(2))
```

Every 4th cycle, the kick doubles to 8 hits per cycle — a kick fill. Subtle but adds anticipation.

## Step 9 — add some humanization

```js
$: s("hh*8").bank("RolandTR909").gain(.4)
    .velocity(rand.range(.6, 1))    // random velocity per hit
    .late(perlin.range(0, .005))    // micro-late timing (0-5ms)
```

Each hi-hat hit gets a slightly different velocity (loudness) and timing offset. Makes the machine feel less rigid.

## Step 10 — add jux for stereo

```js
$: n("<0 2 4 6 [4 2] 4 2 0>").scale("C:minor")
    .s("triangle").gain(.4).delay(.3).delaytime(.125).delayfeedback(.4)
    .room(.4)
    .jux(rev)    // ← left forward, right reverse
```

The melody now has wide stereo presence. Left channel plays forward; right plays it reversed. Total stereo magic for one method call.

## Step 11 — long-form arrangement via mask

This is where the song becomes a song. I want:
- 8 cycles of bass + drums (intro)
- 8 cycles full mix (verse 1)
- 4 cycles breakdown (just chords + melody)
- 8 cycles full mix (verse 2)
- 4 cycles tag (just kick)

That's 32 cycles total. A `<...>/32` mask schedules events across that.

```js
setcpm(120/4)

// kick: present everywhere except the breakdown
$: s("bd*4").bank("RolandTR909").every(4, x => x.fast(2))
    .mask("<x@8 x@8 ~@4 x@8 x@4>/32")

// hat: present everywhere except breakdown and tag
$: s("hh*8").bank("RolandTR909").gain(.4).velocity(rand.range(.6, 1))
    .mask("<x@8 x@8 ~@4 x@8 ~@4>/32")

// clap: only verses
$: s("- cp - cp").bank("RolandTR909")
    .mask("<~@8 x@8 ~@4 x@8 ~@4>/32")

// bass: intro + verses, NOT breakdown
$: note("<c2 c2 ab1 g1>").s("sawtooth")
    .lpf(sine.range(400, 1500).slow(8))
    .lpa(.05).lpenv(4)
    .attack(0).decay(.15).sustain(0).release(.05)
    .mask("<x@8 x@8 ~@4 x@8 ~@4>/32")

// chord pad: verses + breakdown
$: chord("<Cm Cm Ab^7 G7>").voicing().s("gm_epiano1")
    .gain(.3).room(.5).attack(.1).release(.5)
    .mask("<~@8 x@8 x@4 x@8 ~@4>/32")

// melody: verses + breakdown
$: n("<0 2 4 6 [4 2] 4 2 0>").scale("C:minor")
    .s("triangle").gain(.4).delay(.3).delaytime(.125).delayfeedback(.4)
    .room(.4)
    .jux(rev)
    .mask("<~@8 x@8 x@4 x@8 ~@4>/32")
```

The pattern `<x@8 x@8 ~@4 x@8 x@4>/32` reads as: 8 cycles on, 8 on, 4 off, 8 on, 4 on — over 32 cycles total. Each layer has a different mask.

Total: 32 cycles = 32 bars at 120 BPM ≈ 1 minute, then loops.

## Step 12 — polish

A few last details:

```js
// scope and color for visualization
$: s("bd*4")...mask(...).color("salmon")
$: s("hh*8")...mask(...).color("yellow")
$: s("- cp - cp")...mask(...).color("orange")
$: note(...)...mask(...).color("cyan")     // bass
$: chord(...)...mask(...).color("magenta") // chords
$: n(...)...mask(...).color("lime")         // melody

// background visualizer
all(x => x.spiral({steady: .96}))
```

`color()` tags each layer for the visualizer. `all(x => x.spiral(...))` applies a spiral visualization to the entire stack.

## Step 13 — the breakdown bonus

In the breakdown (cycles 16-19), the full mix is just chords + melody. To make the breakdown more interesting, I can apply a transform specifically during those cycles using `when`:

```js
$: chord("<Cm Cm Ab^7 G7>").voicing().s("gm_epiano1")
    .gain(.3).room(.5).attack(.1).release(.5)
    .mask("<~@8 x@8 x@4 x@8 ~@4>/32")
    .when("<~@16 x@4 ~@12>/32", x => x.delay(.6).delayfeedback(.7))
```

The `.when()` adds extra delay only during cycles 16-19. The breakdown gets a wash of dub echoes.

## The complete code

```js
setcpm(120/4)

$: s("bd*4").bank("RolandTR909").every(4, x => x.fast(2))
    .mask("<x@8 x@8 ~@4 x@8 x@4>/32").color("salmon")

$: s("hh*8").bank("RolandTR909").gain(.4)
    .velocity(rand.range(.6, 1)).late(perlin.range(0, .005))
    .mask("<x@8 x@8 ~@4 x@8 ~@4>/32").color("yellow")

$: s("- cp - cp").bank("RolandTR909")
    .mask("<~@8 x@8 ~@4 x@8 ~@4>/32").color("orange")

$: note("<c2 c2 ab1 g1>").s("sawtooth")
    .lpf(sine.range(400, 1500).slow(8))
    .lpa(.05).lpenv(4)
    .attack(0).decay(.15).sustain(0).release(.05)
    .mask("<x@8 x@8 ~@4 x@8 ~@4>/32").color("cyan")

$: chord("<Cm Cm Ab^7 G7>").voicing().s("gm_epiano1")
    .gain(.3).room(.5).attack(.1).release(.5)
    .mask("<~@8 x@8 x@4 x@8 ~@4>/32").color("magenta")
    .when("<~@16 x@4 ~@12>/32", x => x.delay(.6).delayfeedback(.7))

$: n("<0 2 4 6 [4 2] 4 2 0>").scale("C:minor")
    .s("triangle").gain(.4).delay(.3).delaytime(.125).delayfeedback(.4)
    .room(.4).jux(rev)
    .mask("<~@8 x@8 x@4 x@8 ~@4>/32").color("lime")

all(x => x.spiral({steady: .96}))
```

About 30 lines of code = a full structured house track with intro, verses, breakdown, and tag.

## What I notice about the iteration

1. **I started simple** (one kick) and added one thing at a time. Each step was a single Ctrl+Enter.
2. **I never deleted** — I only added. Even when a layer wasn't quite right, I tweaked rather than restarted.
3. **Drums first, melody last.** The rhythm was the foundation; melody is the topping.
4. **Static parameters first, modulated parameters second.** The bass had `.lpf(800)` for several iterations before I changed it to a signal-modulated value.
5. **Layers got a `.mask()` last.** Arrangement structure came after I knew each layer worked.
6. **Visualizer at the end.** `.color()` and `.spiral()` are polish.

That's a typical Strudel composition flow. Real performances iterate faster — every Ctrl+Enter is a few seconds, audience hears the change, you respond.

## What this teaches me

- **Each layer needs three things**: a pattern (the notes/hits), a synth voice (s + effects), and an arrangement gate (mask).
- **A complete song is just enough layers**. 6 layers (kick, hat, clap, bass, chord, melody) is plenty.
- **Modulation makes static patterns alive**. `sine.range(400, 1500).slow(8)` on the bass cutoff transforms the entire feel.
- **Masks structure long-form**. Without them, everything is a 1-cycle loop. With them, you get verses and choruses.
- **Stereo and reverb are not optional**. Even basic patterns sound 10x better with `.jux(rev)` and `.room(.5)`.

Once I can read this whole flow back without reference, I'll have internalized Strudel.
