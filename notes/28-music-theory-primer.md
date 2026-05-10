# 28 — Music Theory Primer (Strudel-Flavored)

This page is the bridge between traditional music theory and Strudel's APIs. The goal: when I think "I want a Phrygian feel" or "ii-V-I" or "tresillo," I know the exact mini-notation / chained-method equivalent. Theory is a *shopping list* of musical effects; Strudel is the *cash register*.

Cross-references: scales/chords/voicings live in `05-notes-and-pitch.md`, rhythm primitives in `02-the-cycle.md` + `03-mini-notation.md`, transforms in `07-pattern-transforms.md`.

---

## 1. Scales and modes

A scale is a recipe for "which 7 (or 5, or 6, or 12) notes are in-bounds." Strudel takes all the math out: `n("0 2 4").scale("D:dorian")` gives you the right notes. The interesting decision is *which* scale — i.e., what you want it to *feel* like.

### Why modes matter conceptually

The seven church modes are all derived from the same 7 notes — they just choose a different note to be "home." That single choice changes everything: which intervals are stable vs colorful, which chords feel resolved, which scale degrees you lean on.

**Trick to remember**: every mode is the major scale starting from a different degree.
- Ionian = 1st degree (C from C major)
- Dorian = 2nd degree (D from C major)
- Phrygian = 3rd degree (E from C major)
- Lydian = 4th degree (F from C major)
- Mixolydian = 5th degree (G from C major)
- Aeolian = 6th degree (A from C major)
- Locrian = 7th degree (B from C major)

In Strudel you do not exploit that derivation — you just name the mode. But it's useful to know that "C lydian" and "G major" share the same 7 pitches, so a phrase in C lydian over a C drone *sounds* lydian; the same phrase over a G drone sounds like major. **The drone/bass picks the mode.**

### The seven diatonic modes

#### Ionian (major) — bright, stable, default-Western

Intervals: W W H W W W H. The "happy" scale of pop, classical, hymns, anthems. Use when you want clarity and resolution.

```js
n("0 2 4 6 4 2 0").scale("C:major").note().s("piano")
```

#### Dorian — minor with raised 6th, jazzy/celtic

Intervals: W H W W W H W. Sounds minor (flat 3rd) but with a hopeful, bluesy uplift from the natural 6th. Used in: *So What* (Miles Davis), *Scarborough Fair*, Celtic tunes, lots of D&B/jungle pads.

```js
// D dorian — the canonical Miles Davis "So What" mode
n("0 2 4 6 4 2 0").scale("D:dorian").note().s("gm_epiano1")

// Modal vamp: Dm7 + G7 (the only two diatonic chords in D dorian
// that DON'T belong to C major's tonic, advertising the mode)
chord("<Dm7 G7>/2").dict('lefthand').voicing().s('gm_epiano1')
```

#### Phrygian — Spanish/Middle Eastern

Intervals: H W W W H W W. Flat 2 is the calling card — that half-step from root to b2 is the "Spanish guitar" sound. Flamenco, metal, evil-cinematic.

```js
n("0 1 2 3 4 5 6 7").scale("E:phrygian").note().s("gm_acoustic_guitar_nylon")

// Common flamenco-ish vamp: i - bII over a Phrygian drone
$: note("e2*4").s("sawtooth").lpf(400)              // pedal root
$: n("0 1 0 -1 0 1 2 1").scale("E:phrygian").note().s("triangle").delay(.3)
```

#### Lydian — dreamy, floating

Intervals: W W W H W W H. Raised 4th is the calling card — that #4 makes the scale feel like it's hovering, never quite landing. Steven Spielberg / John Williams "wonder" sound, lots of Sufjan Stevens, chillwave.

```js
n("0 2 4 6 7 6 4 2").scale("F:lydian").note().s("triangle").room(1.5)

// A lydian pad — major 7 chord with #11 spelled out
note("[c4, e4, g4, b4, f#5]").s("sawtooth").attack(2).release(2).gain(.3)
```

#### Mixolydian — bluesy, dominant-feel

Intervals: W W H W W H W. Major scale with a flat 7. The b7 is what makes a dominant chord (e.g., G7 in C major) feel "bluesy" rather than "classical." Rock, blues, Celtic music, sea shanties, lots of Allman Brothers.

```js
n("0 2 4 6 4 2 0").scale("G:mixolydian").note().s("gm_acoustic_guitar_steel")

// Static mixolydian vamp on G7 — implies the mode without resolving
chord("<G7 F^7>/2").dict('ireal').voicing().s('gm_epiano1')
```

#### Aeolian (natural minor) — sad, minor pop

Intervals: W H W W H W W. The "sad" scale. Most pop minor-key songs. *Hotel California*, *Stairway to Heaven*'s opening, basically anything labelled "minor."

```js
n("0 2 3 5 7 5 3 2").scale("A:minor").note().s("piano")

// vi-IV-I-V in C major IS i-VI-III-VII in A aeolian — same chords,
// different "home." Strudel doesn't care; you anchor the listener
// via bass and starting/ending notes.
chord("<Am F C G>").dict('ireal').voicing().s('gm_epiano1')
```

#### Locrian — unstable, rarely used as tonal center

Intervals: H W W H W W W. Diminished 5th from root means there's no stable tonic chord (the i-chord is diminished, i.e., m7b5). Almost never used as a key — usually as a passing flavor over a half-diminished chord. Metal sometimes uses it.

```js
// Locrian sounds wrong-on-purpose. Build over a sustained b5 to hear it.
n("0 1 2 3 4 5 6 7").scale("B:locrian").note().s("triangle")
```

### Minor variants

#### Harmonic minor — Eastern European, classical-minor

Natural minor with a **raised 7th**. That gives you the strong leading tone (the half-step pull to the tonic) while keeping the minor 3rd. The augmented 2nd between b6 and natural 7 is the "exotic" sound — Eastern European, Klezmer, flamenco, classical minor-key cadences.

```js
n("0 2 3 5 7 8 11 12").scale("A:harmonic minor").note().s("piano")

// V7 → i is THE harmonic minor cadence — the b6 and natural 7
// supply the half-step tension that resolves to the tonic.
chord("<E7 Am>/2").dict('lefthand').voicing()
```

Note Strudel's scale name is `"harmonic minor"` (with space). Inside `.scale("…")` the parser separates fields with `:`, so:

```js
n("0 2 3").scale("A:harmonic minor")   // works (no space in field)
```

#### Melodic minor — jazz minor

Traditionally: ascending uses raised 6 and 7 (so it's just major with a b3); descending reverts to natural minor. **Jazz melodic minor** ignores the descending rule — it's just one scale: 1 2 b3 4 5 6 7. Rich source of jazz chords. The 7 modes of melodic minor give you altered, lydian-dominant, locrian #2, etc.

```js
n("0 2 3 5 7 9 11 12").scale("C:melodic minor").note().s("gm_epiano1")
```

### Pentatonic scales

Five notes instead of seven. The trick: by removing the half-steps that cause dissonance, *almost everything sounds good*. Beginner-safe.

#### Major pentatonic — bright, country/folk

Degrees 1 2 3 5 6. No 4 (avoids the tritone with 7) and no 7 (avoids the leading-tone clash with 1). Country, folk, rock solos, Asian music.

```js
n("0 1 2 3 4 3 2 1").scale("C:major pentatonic").note().s("piano")
```

#### Minor pentatonic — bluesy, rock

Degrees 1 b3 4 5 b7. The "rock guitar solo" scale.

```js
n("0 1 2 3 4 3 2 1").scale("A:minor pentatonic").note().s("gm_distortion_guitar")
```

#### Blues scale — pentatonic + blue note

Minor pentatonic with an added b5 (the "blue note"). The b5 is a passing tone, not a chord tone — it's the *grease*.

```js
n("0 1 2 2.5 3 4").scale("A:minor pentatonic").note()
// or, if Strudel's blues scale dict knows it:
n("0 1 2 3 4 5").scale("A:blues").note()
```

### Whole-tone — Debussy ambiguity

6 notes, all whole steps: 1 2 3 #4 #5 b7. No half-steps means no clear tonic — every note feels like it could be home. Debussy, dream sequences, "wonder" cues. Two whole-tone scales exist (starting on C or C#); they exhaust the chromatic 12.

```js
n("0 1 2 3 4 5").scale("C:whole tone").note().s("triangle").room(2)
// equivalently (Strudel's tonal dict): "C:whole"
```

### Chromatic — all 12 notes

```js
n("0 1 2 3 4 5 6 7 8 9 10 11").scale("C:chromatic").note().s("piano")
```

Useful as a *passing-note source*, not a tonal scheme. In practice you never compose "in chromatic" — you use chromatic motion as decoration over a key.

### Japanese scales

Strudel's tonal-js dictionary includes:

- **Hirajoshi** — 1 2 b3 5 b6. Stark, koto-like.
- **Iwato** — 1 b2 4 b5 b7. Very dark, rare.
- **Kumoi** — 1 2 b3 5 6. Floating, less dark than hirajoshi.

```js
n("0 1 2 3 4 3 2 1").scale("D:hirajoshi").note().s("gm_koto").room(.8)
n("0 1 2 3 4").scale("E:iwato").note().s("gm_shakuhachi")
n("0 1 2 3 4 3 2 0").scale("F:kumoi").note().s("triangle")
```

### Bebop scales

Diatonic scales with a **chromatic passing tone** added so that chord tones (1, 3, 5, 7) land on strong beats during 8th-note bebop runs. Strudel knows `bebop major` and `bebop minor`.

```js
// Bebop major adds a #5 (or b6) between 5 and 6
n("0 1 2 3 4 5 6 7 8").scale("C:bebop major").note().s("piano").fast(2)

// Bebop dominant adds a natural 7 to the mixolydian scale,
// so over a G7 chord the 8-note line lands chord tones on the beats
n("0 1 2 3 4 5 6 7 8").scale("G:bebop minor").note().s("piano").fast(2)
```

### Strudel scale-name reference

Inside `.scale("Root:Type")`, the parser splits on `:`. Spaces inside the type are allowed because `:` already segments fields. Common types:

| Type string | Notes |
|---|---|
| `major`, `ionian` | bright |
| `dorian` | minor + nat6 |
| `phrygian` | minor + b2 |
| `lydian` | major + #4 |
| `mixolydian` | major + b7 |
| `minor`, `aeolian` | natural minor |
| `locrian` | minor + b2 + b5 |
| `harmonic minor` | minor + nat7 |
| `melodic minor` | minor + nat6 + nat7 |
| `major pentatonic` | 5-note major |
| `minor pentatonic` | 5-note minor |
| `blues` | pent + b5 |
| `whole`, `whole tone` | 6-note WT |
| `chromatic` | 12-tone |
| `bebop major` | major + #5 passing |
| `bebop minor` | minor + nat7 passing |
| `hirajoshi`, `iwato`, `kumoi` | Japanese 5-note |
| `prometheus`, `ritusen` | exotic 6/7-tone |

### Switching scales mid-piece

```js
// Modulate every 4 cycles
n("0 2 4 6 4 2 0").scale("<C:major D:dorian E:phrygian F:lydian>/4").note()
```

Because `.scale(...)` accepts a pattern, you can patternize the key just like any other parameter.

---

## 2. Chord voicings

A *chord* is "these N notes." A *voicing* is "these N notes laid out in this specific order, register, and spacing." Different voicings of the same chord communicate radically different moods.

### Open vs close voicings

- **Close voicing**: chord tones packed within an octave. Sounds compact, clear.
  ```js
  note("[c4, e4, g4, b4]").s("piano")     // close C maj7
  ```

- **Open voicing**: chord tones spread across more than an octave. Sounds spacious, "wider."
  ```js
  note("[c3, g3, e4, b4]").s("piano")     // open C maj7
  ```

Open voicings are what jazz pianists use for richness. Close voicings are what hymnals use for clarity.

### Drop-2, drop-3 voicings

Take a close 4-note voicing in *root position* (e.g., C E G B). To make it sound nicer:

- **Drop-2**: take the 2nd voice from the top (G in CEGB), drop it down an octave → G C E B (i.e., reorder to G B C E in pitch order, with G in the bass). Open, balanced.
- **Drop-3**: drop the 3rd voice from the top (E in CEGB) down an octave → E C G B (i.e., E G B C in pitch order). Even more open.

These show up everywhere in jazz piano and big-band horn arrangements.

```js
// Close C maj7 root position
note("[c4, e4, g4, b4]").s("piano")

// Drop-2 C maj7
note("[g3, c4, e4, b4]").s("piano")

// Drop-3 C maj7
note("[e3, c4, g4, b4]").s("piano")
```

### Rootless voicings (jazz)

When there's a bass player, the pianist doesn't need to play the root — they can use those fingers for *colors* (9, 11, 13). A classic rootless C maj7 is `[e, g, b, d]` (3-5-7-9, no root). Strudel's `'lefthand'` dict is full of these.

```js
chord("<C^7 A7 Dm7 G7>").dict('lefthand').voicing().s('gm_epiano1')
// .dict('lefthand') gives idiomatic rootless jazz LH voicings
```

### Quartal voicings

Stack 4ths instead of 3rds. McCoy Tyner / *So What* / modern jazz signature sound.

```js
// Quartal stack on D: D-G-C-F (4ths from D)
note("[d3, g3, c4, f4]").s("gm_epiano1").attack(.3).release(1)
```

### Shell voicings (root + 3rd + 7th)

Bare-bones jazz voicing: just root, 3rd, 7th. The 3rd tells you major/minor; the 7th tells you the chord quality (dom7 vs maj7); the root anchors. Drop the 5th — it's redundant. Solo-piano accompaniment 101.

```js
// C^7 shell: C E B
note("[c3, e3, b3]").s("piano")
// Cm7 shell: C Eb Bb
note("[c3, eb3, bb3]").s("piano")
// G7 shell: G B F
note("[g2, b2, f3]").s("piano")
```

### Strudel's voicing dictionaries

Strudel ships with named voicing dicts that you select via `.dict(name)`:

| Dict | Use case |
|---|---|
| `'lefthand'` | Idiomatic jazz left-hand (rootless, 3-7 + extensions) |
| `'ireal'` | iReal-style — closer to pop/rock comping; richer, root included |
| `'triads'` | Bare 3-note triads |

```js
// Same chord progression, three radically different sounds
chord("<C^7 A7 Dm7 G7>").dict('lefthand').voicing().s('gm_epiano1')
chord("<C^7 A7 Dm7 G7>").dict('ireal').voicing().s('gm_epiano1')
chord("<C^7 A7 Dm7 G7>").dict('triads').voicing().s('gm_epiano1')
```

You can also register your own voicing dicts with `addVoicings(name, {...})`.

### Voicing controls

Once you've chosen a chord+dict, four controls position the voicing:

- **`.anchor("c4")`** — the target note. The dict will pick the variant that lands closest to this note.
- **`.mode("below")`** — relationship to anchor:
  - `"below"` — top note ≤ anchor
  - `"above"` — bottom note ≥ anchor
  - `"duck"` — top note safely below the anchor (so a melody on `c5` doesn't clash with the comp)
  - `"root"` — bass note = anchor
- **`.offset(n)`** — shift through dict's available variants (try 0, ±1, ±2 to taste).
- **`.n("0 1 2")`** — pick individual voices (0 = bottom, 1 = next up, ...). Lets you arpeggiate a voicing.

```js
// Comp ducked under a melody
$: chord("<C^7 Am7 Dm7 G7>")
     .dict('lefthand').voicing()
     .anchor("c5").mode("duck")
     .s('gm_epiano1').gain(.4)

$: n("0 2 4 7").scale("C:major").note()
     .s('triangle').gain(.6)
```

This is the single most useful Strudel-specific harmony idea: the comp dynamically dodges the melody. Voice-leading-by-engine.

---

## 3. Voice leading

Voice leading is the art of moving from one chord to the next *smoothly*, by minimizing the distance each voice travels. Two principles:

1. **Common tones** — if two chords share a note, keep that note in the same voice.
2. **Stepwise motion** — voices that must move should move by step (1 or 2 semitones), not leap.

Example: C → F. Both have C and F? No — C has {C, E, G}; F has {F, A, C}. Common tone: C. So in C → F, hold C in one voice, move E → F (half-step), move G → A (whole-step). Each voice moves at most 2 semitones. That's good voice leading.

The lazy version (root-position triads everywhere) violates this: C-major root → F-major root = C E G → F A C, which forces all three voices to leap by 5+ semitones. It works, but it's blocky.

### How Strudel helps

- **Voicing dictionaries (`.dict('lefthand')`, `.dict('ireal')`)** already encode good voice leading. Each dict contains *multiple* voicings of each chord, and the engine picks the one closest to the previous chord (or the anchor).
- **`.anchor(note)`** gives a target so consecutive voicings end up near each other.
- **`.mode('duck')`** auto-positions the voicing under the melody, which incidentally smooths voice leading because all voicings end up in the same register.

### A demo

```js
// Compare blocky vs smooth voicing of the same progression
const prog = "<C Am F G>";

// Blocky — root-position triads
$: chord(prog).dict('triads').voicing().s('piano')

// Smooth — lefthand dict picks shape that minimizes voice motion
$: chord(prog).dict('lefthand').voicing().anchor("g4").s('piano')
```

If you listen, the second one feels like one continuous fabric; the first feels like four jumps.

### Manual voice leading

If you want full control, write voicings as note-stacks and adjust by hand:

```js
// C → Am → F → G with explicit voice leading
note("<[c4, e4, g4] [c4, e4, a4] [c4, f4, a4] [b3, d4, g4]>")
   .s("piano")
// The top voice walks: g, a, a, g
// The middle voice walks: e, e, f, d
// The bottom voice walks: c, c, c, b
// Every move ≤ 2 semitones. That's smooth voice leading.
```

This is the *art* — Strudel just gives you the tools.

---

## 4. Common progressions

Progressions are the architecture of Western popular and jazz music. The chord *qualities* and the *root-motion intervals* are what define the style.

Notation: **Roman numerals**. Uppercase = major, lowercase = minor. So in C major:
- I = C, ii = Dm, iii = Em, IV = F, V = G, vi = Am, vii° = Bdim.

### I-vi-IV-V (50s doo-wop)

Major-tonic, deceptive cadence to vi, then plagal IV, then dominant V. *Stand By Me*, *Earth Angel*, *Heart and Soul*. Sounds nostalgic.

```js
chord("<C Am F G>").dict('ireal').voicing().s('gm_epiano1')
```

### I-V-vi-IV (modern pop)

The *Don't Stop Believin'* / *Let It Be* / approximately-half-of-pop progression. Strong tonic-dominant opening, then deceptive vi, plagal IV. Endlessly singable.

```js
chord("<C G Am F>").dict('ireal').voicing().s('gm_epiano1')
```

### vi-IV-I-V (the "sensitive female" rotation)

Same chords, different starting point — opens on minor, feels emotional.

```js
chord("<Am F C G>").dict('ireal').voicing().s('gm_epiano1')
```

### ii-V-I (jazz)

The most important jazz progression. The ii (predominant) sets up the V (dominant), which resolves to I (tonic). In a major key: ii is minor 7, V is dominant 7, I is major 7.

```js
// ii-V-I in C
chord("<Dm7 G7 C^7>").dict('lefthand').voicing().s('gm_epiano1')

// ii-V-I in F (notice how the same shape transposes)
chord("<Gm7 C7 F^7>").dict('lefthand').voicing().s('gm_epiano1')
```

Minor ii-V-i variant uses ii half-diminished (m7b5):

```js
chord("<Dm7b5 G7b9 Cm7>").dict('lefthand').voicing().s('gm_epiano1')
```

### 12-bar blues

Three 4-bar phrases over I, IV, V chords. Most common form:

```
I  I  I  I        bars 1-4
IV IV I  I        bars 5-8
V  IV I  V/I      bars 9-12
```

In Strudel, encode it as a 12-element angle-bracket pattern slowed to taste:

```js
let blues = "<C7 C7 C7 C7  F7 F7 C7 C7  G7 F7 C7 G7>";
chord(blues).dict('ireal').voicing().slow(3).s('gm_epiano1')
// .slow(3) so each chord lasts 3 cycles = "1 bar of 4 beats" if cps is set right.
```

A jazz-blues variant ("blues with changes") elaborates the form with ii-V's:

```js
let jazzBlues = "<C7 F7 C7 [Gm7 C7]  F7 F#o7 C7 [A7]  Dm7 G7 C7 [Dm7 G7]>";
chord(jazzBlues).dict('lefthand').voicing()
```

### Modal vamps (just two chords)

Static back-and-forth between two chords that don't form a functional resolution — they advertise the *mode*. Hallmark of '60s modal jazz, plus everything from Sunset Boulevard to Yacht Rock.

```js
// Dorian vamp (Miles Davis "So What")
chord("<Dm7 Em7>/2").dict('lefthand').voicing().s('gm_epiano1')

// Lydian vamp
chord("<F^7 G/F>/2").dict('ireal').voicing().s('gm_epiano1')

// Mixolydian vamp
chord("<G7 F^7>/2").dict('ireal').voicing().s('gm_epiano1')

// Phrygian vamp
chord("<Em F^7>/2").dict('ireal').voicing().s('gm_epiano1')
```

### Coltrane changes / "Giant Steps" cycle

Coltrane's reharmonization moves through three keys spaced a major 3rd apart (B → G → Eb → B), with a ii-V into each. Famously hard to improvise over because the harmonic motion is so fast.

```js
seq(
  "[B^7 D7] [G^7 Bb7] Eb^7 [Am7 D7]",
  "[G^7 Bb7] [Eb^7 F#7] B^7 [Fm7 Bb7]",
  "Eb^7 [Am7 D7] G^7 [C#m7 F#7]",
  "B^7 [Fm7 Bb7] Eb^7 [C#m7 F#7]"
).chord().dict('lefthand').voicing().s('gm_epiano1')
```

Conceptually: standard tonal music moves by 4ths and 5ths; Coltrane moves by major 3rds. It splits the octave into 3 equal parts (12 / 3 = 4 semitones = M3), creating a symmetric rather than functional cycle.

### Andalusian cadence (i-VII-VI-V)

Spanish/flamenco descending bass: A minor → G → F → E (in A minor). The final V (E major) is borrowed from harmonic minor — that *raised* 3rd (G#) is the leading tone pulling back to A.

```js
chord("<Am G F E>").dict('ireal').voicing().s('gm_acoustic_guitar_nylon')
```

### Pachelbel (D, A, Bm, F#m, G, D, G, A — I V vi iii IV I IV V)

The quintessential canonic progression — used in *Canon in D*, *Streets of London*, half of K-pop ballads.

```js
chord("<D A Bm F#m G D G A>").dict('ireal').voicing().s('piano')
```

The descending-bass version (Pachelbel walked over the bass D-C#-B-A-G-F#-G-A) gives it the inevitability.

### Other useful progressions

```js
// Backdoor ii-V (jazz)
chord("<Fm7 Bb7 C^7>").dict('lefthand').voicing()

// Tritone substitution: replace G7 with Db7 (tritone away)
chord("<Dm7 Db7 C^7>").dict('lefthand').voicing()

// Minor blues
chord("<Cm7 Cm7 Cm7 Cm7  Fm7 Fm7 Cm7 Cm7  Ab7 G7 Cm7 G7>")
  .dict('lefthand').voicing().slow(3)
```

---

## 5. Rhythm primer

Rhythm in Strudel = how you fill a cycle. Time signatures are interpretations *we* impose, not engine-level constructs.

### Time signatures via cycle subdivision

The convention `setcpm(BPM/4)` means "one cycle = one bar of 4 beats." Generalize:

| Time sig | Convention | Setup |
|---|---|---|
| 4/4 | 1 cycle = 1 bar of 4 quarter-notes | `setcpm(BPM/4)` + 4 top-level slots |
| 3/4 | 1 cycle = 1 bar of 3 quarter-notes | `setcpm(BPM/3)` + 3 top-level slots |
| 6/8 | 1 cycle = 1 bar of 6 eighth-notes | `setcpm(BPM/6)` + 6 slots, often felt as 2 groups of 3 |
| 7/8 | 1 cycle = 1 bar of 7 eighth-notes | `setcpm(BPM/7)` + 7 slots, usually `[3,2,2]` or `[2,2,3]` groupings |
| 5/4 | 1 cycle = 1 bar of 5 quarter-notes | `setcpm(BPM/5)` + 5 slots, often `[3,2]` like *Take Five* |

```js
// 4/4 at 120 BPM
setcpm(120/4)
s("bd*4, hh*8")

// 3/4 waltz at 120 BPM
setcpm(120/3)
s("bd ~ ~, ~ hh hh")    // oom-pah-pah

// 6/8 (compound duple)
setcpm(120/6)
s("bd ~ ~ sd ~ ~, hh*6")

// 7/8 (3+2+2)
setcpm(120/7)
s("bd ~ ~ bd ~ bd ~, hh*7")

// 5/4 (Take Five — 3+2)
setcpm(120/5)
s("bd ~ ~ sd ~, hh*5")
```

The simplest reading: count the events in the top-level mini-notation; that's your "denominator-of-the-time-signature × beats-per-bar." Strudel doesn't care.

### Polyrhythm vs polymeter

Both are "two patterns happening at once with different counts," but they differ in *what they share*:

- **Polyrhythm**: same cycle period, *different event rates*. `"bd*3, hh*4"` plays 3 against 4 in the same cycle. The events misalign within the bar but the bars themselves stay synchronized.
- **Polymeter**: same step rate, *different bar lengths*. `{bd sd, hh hh hh}` (using `{}`) means each pattern uses the same step duration but the 2-step cycles every 2 steps and the 3-step cycles every 3, so they realign every 6 steps.

```js
// Polyrhythm: 3 vs 4 in one cycle
s("bd*3, hh*4")

// Polymeter: 4-step kick against 3-step hat at the same step rate
s("{bd ~ ~ sd, hh hh hh}")
```

You hear polyrhythm as a *texture* (3 against 4 always feels skippy in the same way each bar). You hear polymeter as a *phasing* (the patterns drift past each other and re-sync periodically).

### Common Latin/Afro patterns

#### Tresillo — `(3, 8)`

Fundamental cell of Cuban son, Brazilian samba, reggaeton. Three pulses Euclideanly distributed across 8 sixteenth-note grid: x . . x . . x .

```js
s("bd(3, 8)")           // tresillo kick
s("bd(3, 8), [- cp]*2") // tresillo + back-beat clap
```

#### Cinquillo — `(5, 8)`

Five against 8. x . x x . x x . — adds two "fills" to the tresillo skeleton.

```js
s("bd(5, 8)")
```

#### Son clave (3-2)

Two-bar pattern: x . . x . . x . (bar 1, tresillo) | . . x . x . . . (bar 2). Key Cuban rhythm.

```js
s("[bd ~ ~ bd ~ ~ bd ~] [~ ~ bd ~ bd ~ ~ ~]")
// Or written more compactly with rests as 16th cells
```

#### Rumba clave (3-2)

Variant: x . . x . . . x | . . x . x . . . — the third stroke is delayed.

```js
s("[bd ~ ~ bd ~ ~ ~ bd] [~ ~ bd ~ bd ~ ~ ~]")
```

#### Bossa nova clave

x . . x . . x . | . . x . . x . . — softer, smoother than son clave.

```js
s("[~ bd ~ ~ bd ~ ~ bd ~] [~ ~ bd ~ ~ bd ~ ~]")
```

### Euclidean rhythms as world rhythms

Euclidean rhythms `(p, s)` distribute p pulses as evenly as possible across s steps. Surprisingly, many traditional world rhythms come out of this algorithm — Euclidean coverage exhausts the space of "maximally-even" rhythms.

```js
s("bd(2, 5)")    // Khafif-e-ramal (Persian)
s("bd(3, 7)")    // Ruchenitza (Bulgarian)
s("bd(3, 8)")    // tresillo (Cuban)
s("bd(4, 9)")    // Aksak (Turkish)
s("bd(5, 6)")    // York-Samai (Arab)
s("bd(5, 7)")    // Nawakhat (Arab)
s("bd(5, 8)")    // cinquillo (Cuban)
s("bd(5, 9)")    // Agsag-Samai (Turkish)
s("bd(7, 8)")    // Bulgarian
s("bd(7, 12)")   // West African bell
s("bd(9, 16)")   // Brazilian samba bell variant
```

The third argument is rotation — `bd(3, 8, 2)` rotates the tresillo by 2 steps, which is musically the difference between starting the pattern on the *down* or *up*.

### Shuffle / swing

Straight 8ths sound mechanical. Swing delays the second of each pair — often by a 2:1 ratio (triplet feel) or somewhere between 1:1 and 2:1 (light swing).

Strudel's `.swing(n)` divides the cycle into n parts and pushes the off-beats back:

```js
s("hh*8").swing(4)             // shorthand for swingBy(1/3, 4) — triplet swing
s("hh*8").swingBy(1/2, 4)      // halfway-swing (more subtle)
s("hh*8").swingBy(.6, 4)       // hard swing
```

`.swing(4)` means "treat 4 segments per cycle as the swing grid"; with `hh*8` you have 8 hats divided into 4 pairs, and the second hat of each pair gets delayed.

A genre rule of thumb:
- Hip-hop: `.swingBy(.5, 4)` to `.swingBy(.6, 4)` — heavy.
- Jazz medium swing: `.swingBy(.6, 4)` to `.swingBy(.66, 4)` — full triplet.
- Funk: subtle, `.swingBy(.55, 4)`.
- Bossa: usually straight, no swing.

For full control, micro-timing the off-beats with `.late()`:

```js
s("hh*8").late("0 .02 0 .02 0 .02 0 .02")
```

---

## 6. Bass patterns

Bass is *the* harmonic anchor. The note in the bass tells the listener which chord they're in; in pop it's even more important than the melody.

### Root-fifth bass (country, polka, march)

Alternate root and 5th. Simple, foundational.

```js
let chords = chord("<C G Am F>");
chords.rootNotes(2).note().fast(2)
   .add(note("<0 7>*2"))    // 0 = root, 7 = fifth
   .s('gm_acoustic_bass')
```

### Walking bass (jazz)

One quarter note per beat, mostly stepwise, mixing chord tones (1, 3, 5, 7) with passing/approach tones. Connects chords smoothly.

```js
// Manual walking line over ii-V-I-VI in C
note("d2 f2 a2 c3  g2 b2 d3 f3  c2 e2 g2 a2  a2 g2 f2 e2")
   .s('gm_acoustic_bass')
```

A trick: end every bar on a half-step away from the next chord's root. So if next chord is G, your last note in the previous bar should be F# or Ab.

### Octave bass (disco, synth-pop)

Alternating root and root-up-an-octave. Driving, bouncy.

```js
let chords = chord("<Am F C G>");
chords.rootNotes(2).note().fast(2)
   .add(note("<0 12>*4"))
   .s('sawtooth').lpf(800)
```

### Pedal point

Hold a single bass note while chords change above. Creates tension (when pedal note clashes with the chords) and release (when they align). Often used over the V chord at the end of a section.

```js
$: note("g2*4").s('sawtooth').lpf(400)            // pedal G
$: chord("<C^7 F^7 Em7 G7>").voicing().s('piano') // chords above

// Or pedal the tonic under a wandering progression
$: note("c2*8").s('sine').gain(.6)
$: chord("<C^7 Eb^7 Ab^7 Db^7>").voicing().s('gm_epiano1').gain(.3)
```

### Bass with chromatic passing tones

Walk between chord roots using half-steps:

```js
// Cm → Fm: walk down c2 → b1 → bb1 → a1 → ab1 → fm-arrival
note("c2 c2 b1 bb1  ab1 ab1 g1 gb1  f1 f1 ...").s('gm_acoustic_bass')
```

### Synced to chord progression (canonical Strudel pattern)

```js
let chords = chord("<Cm7 Fm7 Bb^7 Eb^7>/4").dict('lefthand');

stack(
  // Bass: chord roots in octave 2, doubled 8th-notes
  chords.rootNotes(2).note().fast(2).s('sawtooth').lpf(600).lpa(.05),

  // Pad: voicings above
  chords.voicing().s('gm_epiano1').gain(.3).room(.5),
)
```

This pattern — derive bass + pad from one shared `chord()` source — is the most reliable way to keep them in sync across edits.

---

## 7. Melody construction

Notes are easy. Melodies are hard. Some principles that help:

### Step-and-leap balance

Most good melodies are mostly stepwise (intervals of 1-2 scale steps), with occasional leaps (3+ steps) for drama. After a leap, return by step in the opposite direction — it sounds resolved.

```js
// Mostly step-wise, one leap for color, then step recovery
n("0 2 4 2 0  -2 0 2 7  5 4 2 0").scale("C:major").note().s("piano")
//                       ^leap up to 7, then step down
```

### Tension and release (dissonance to consonance)

Land on chord tones (1, 3, 5, 7) on strong beats. Use scale tones (2, 4, 6) and chromatic notes as passing/approach tones on weak beats — they create tension that resolves into the chord tone.

The lazy version: improvise with `.scale()` matching the chord, use `.struct()` to put chord tones on strong beats:

```js
$: chord("<C^7 F^7>/2").dict('lefthand').voicing().s('gm_epiano1')

$: n("<0 2 4 6> <-1 1 3 5>").scale("C:major").note().s('triangle')
//   ^chord tones of C^7  ^chord tones of F^7 (voiced as Dm in C major)
//   On each chord, strong beats hit chord tones.
```

### Motivic development

Take a 2-4-note "motif" and transform it: transpose, invert, augment (slow), diminish (fast), reverse. Coherence comes from repetition with variation.

```js
// Source motif: a 4-note shape
let motif = n("0 2 4 2").scale("C:major");

stack(
  motif.note(),                              // original
  motif.scaleTranspose(4).late(.5).note(),   // transposed up a 5th
  motif.rev().late(1).note(),                // reversed
  motif.fast(2).late(1.5).note(),            // diminished (faster)
)
```

`.scaleTranspose(n)` keeps it in key (diatonic transposition); `.transpose(n)` is chromatic. For staying-in-key motivic development, `scaleTranspose` is your friend.

### Call and response

Two phrases: one "asks" (ends on tension), one "answers" (resolves). In Strudel, this is just two patterns in a `<>` alternation:

```js
n("<[0 2 4 7] [4 2 0 ~]>")    // call lands on 7 (tension), response lands on 0 (rest)
   .scale("C:major").note().s("piano")
```

### Generative melody from signals

A perlin-driven random walk, quantized to a scale, sounds surprisingly musical:

```js
n(perlin.range(0, 8).segment(8))
   .scale("D:dorian")
   .note().s('triangle').room(.3)
```

`perlin` is smooth random — successive values are correlated, so the melody walks rather than jumps. `.segment(8)` samples it 8 times per cycle.

---

## 8. Genre templates

Here is a starter for each major electronic / jazz idiom. The point is not perfection — it's having a known-good baseline you can mutate.

### Techno

Hallmarks: 4/4 kick, off-beat (16th-position 3) hi-hat, syncopated synth/bass, hypnotic repetition, BPM ~125-135.

```js
setcpm(130/4)

stack(
  // 4-on-the-floor kick
  s("bd*4").bank("RolandTR909").gain(.9),
  // Off-beat hat (the "tssss" between kicks)
  s("[~ hh]*4").bank("RolandTR909").gain(.5),
  // Open hat on the upbeat of beat 4
  s("~ ~ ~ oh").bank("RolandTR909").gain(.4),
  // Clap/snare on 2 and 4
  s("~ cp ~ cp").bank("RolandTR909").gain(.7),
  // Acid-style synth bass
  note("<c2 c2 [eb2 c2] g2>")
    .s("sawtooth")
    .lpf(sine.range(300, 1200).slow(4)).lpq(12)
    .lpa(0).lpd(.1).lpenv(8)
    .attack(0).decay(.05).sustain(0).release(.05)
    .gain(.6),
)
```

### House

4/4 kick, clap on 2 and 4, off-beat hat, more melodic/soulful than techno. BPM ~120-128.

```js
setcpm(124/4)

stack(
  s("bd*4").bank("RolandTR909").gain(.9),
  s("~ cp ~ cp").bank("RolandTR909").gain(.5).room(.3),
  s("[~ hh]*4").bank("RolandTR909").gain(.4),
  // Percussion: shaker pattern
  s("[~ rim]*2, [~ ~ ~ tb]").gain(.3),
  // Chords (vi-IV-I-V in C)
  chord("<Am F C G>")
    .dict('ireal').voicing()
    .s('gm_epiano1').gain(.4).room(.5)
    .anchor("c5").mode("duck"),
  // Bass: root of each chord, octave-bouncing
  chord("<Am F C G>").rootNotes(2).note().fast(2)
    .add(note("<0 12>*4"))
    .s("sawtooth").lpf(600).gain(.6),
)
```

### Hip-hop / boom-bap

Half-time feel (snare on 3 instead of 2 and 4), heavy swung 16ths on hats, sample-flip aesthetic. BPM ~85-95 (or 170-180 felt as 85).

```js
setcpm(90/4)

stack(
  // Boom-bap kick: 1 and "and-of-3" type hits
  s("bd ~ ~ bd  ~ bd ~ ~").bank("RolandTR808"),
  // Snare on 3 (half-time)
  s("~ ~ sd ~").bank("RolandTR808").gain(.7).room(.2),
  // Swung 16th hats with velocity variation
  s("hh*16").bank("RolandTR808")
    .gain("[1 .3 .5 .3]*4")
    .swingBy(.55, 4),
  // Sample-style chord stab on the offbeat
  chord("<Cm7 Fm7>/2").dict('lefthand').voicing()
    .s('gm_epiano1').room(.5).gain(.3)
    .struct("~ x ~ ~"),
  // Fat bass
  chord("<Cm7 Fm7>/2").rootNotes(1).note()
    .s('sawtooth').lpf(400).gain(.7),
)
```

### Drum and bass

175 BPM (felt as 87.5 with half-time bass). Amen breaks chopped and rearranged. Sub-bass with reese / wobble.

```js
setcpm(175/4)
samples('github:tidalcycles/dirt-samples')

stack(
  // Amen break, chopped
  s("amen/4").fit().chop(16).cut(1)
    .sometimesBy(.4, ply(2))
    .sometimesBy(.2, mul(speed("-1")))
    .gain(.8),
  // Heavy sub-bass on chord roots, half-time
  chord("<Am Am F F>/2").rootNotes(1).note()
    .s('sine').gain(.9),
  // Reese-style bass riding on top of sub
  chord("<Am Am F F>/2").rootNotes(2).note().fast(2)
    .s('sawtooth')
    .add(note("0,.1,-.1"))   // detune for reese
    .lpf(sine.range(400, 1200).slow(8)).lpq(8)
    .gain(.4),
)
```

### Ambient

No kick or drums — or very sparse. Slow tempo, evolving textures, long reverb tails, slow harmonic motion.

```js
setcpm(60/4)

stack(
  // Slow chord pad
  chord("<C^7 Em7 Am7 F^7>/4")
    .dict('lefthand').voicing()
    .s('sawtooth')
    .attack(3).release(4)
    .lpf(sine.range(400, 1500).slow(16))
    .gain(.3).room(2).delay(.5),
  // Sparse bell punctuation
  n(perlin.range(0, 5).segment(2))
    .scale("C:major")
    .note().s('sine')
    .fm(8).fmh(2.7)
    .attack(0).release(2)
    .gain(.4).room(2).delay(.7)
    .struct("x ~ ~ ~  ~ ~ x ~"),
  // Slow drone in low register
  note("c2").s('sawtooth')
    .attack(8).release(8).gain(.2)
    .lpf(300),
)
```

### Jazz (swing, walking bass, comping)

Swung 8ths, walking bass, brush-snare ride pattern, comp on the off-beats.

```js
setcpm(140/4)

stack(
  // Ride cymbal: dotted "spang-a-lang" pattern
  s("rd ~ rd rd  ~ rd rd ~")
    .bank("RolandTR808").swingBy(.6, 4)
    .gain(.6),
  // Brush snare on 2 and 4
  s("~ sd ~ sd").gain(.4).room(.2),
  // Walking bass over Rhythm Changes
  note("<c2 e2 g2 a2  bb2 a2 g2 f2  e2 g2 c3 b2  a2 g2 f2 e2>")
    .s('gm_acoustic_bass').gain(.7),
  // Piano comp on off-beats (the "Charleston" hit)
  chord("<C^7 A7 Dm7 G7>")
    .dict('lefthand').voicing()
    .struct("~ x ~ ~  ~ x ~ x")
    .anchor("c5").mode("duck")
    .s('gm_epiano1').gain(.5).swingBy(.6, 4),
)
```

---

## Putting it all together

The composer's loop, theory-aware:

1. **Pick a key + mode.** This sets the emotional palette. (`scale("D:dorian")` or `chord("<...>")`)
2. **Pick a progression.** Choose ii-V-I, vamp, modal, blues, etc. depending on harmonic richness needed.
3. **Pick voicings.** `'lefthand'` for jazz feel, `'ireal'` for pop, `'triads'` for clarity. Use `.anchor()` + `.mode('duck')` for melody-comp interaction.
4. **Derive the bass.** `.rootNotes(2)` for simplicity, walking line for jazz, octave bass for disco, pedal for tension.
5. **Pick a rhythm grid.** 4/4 for most genres; tresillo / clave / euclidean for Latin and world; odd meters for prog.
6. **Compose melody on top.** Use `.scale()` to stay in key. Aim chord tones on strong beats. Build motifs with `.scaleTranspose()`, `.rev()`, `.fast()`.
7. **Polish.** Swing if needed. Add `.jux(rev)` for stereo. Modulate cutoffs with `sine` / `perlin`. Mask sections in/out.

When in doubt: lift the structure of a song you know. *Don't Stop Believin'* — I-V-vi-IV. *So What* — Dm7/Em7 vamp. *Giant Steps* — major-3rd cycle. Theory is just a vocabulary for *naming* what worked, so you can rebuild it.
