# 24 — The /understand/ Essays

Strudel's website has a short `/understand/` section — only three essays, all worth absorbing carefully. They're not feature documentation; they're explainers of why Strudel works the way it does.

## /understand/cycles — Cycles

Source: <https://strudel.cc/understand/cycles/>

**Thesis**: "The concept of cycles is very central to be able to understand how Strudel works."

### Key ideas

1. **A cycle is the fundamental time unit.** Not a beat, not a bar — a cycle. By default, one cycle = 2 seconds (0.5 cps).

2. **Subdivision is by event count.** `"bd"` plays once per cycle. `"bd bd"` plays twice. `"bd bd bd bd"` plays four times. The number of top-level events determines the subdivision.

3. **The cycle is perceptually flexible.** What you hear as the "beat" depends on the pattern's content, not the cycle itself. The same cycle can sound like a slow drone or a fast roll depending on event count.

   ```js
   s("bd")                    // one event per 2s — feels slow
   s("bd bd bd bd")           // four events per 2s — feels like a beat
   s("bd hh bd hh")           // four events with variation — feels musical
   ```

4. **Tempo translates via cpm.** Most music thinks in BPM. To translate: `setcpm(BPM / beats_per_cycle)`. If you want 110 BPM in 4-beat bars, use `setcpm(110/4)`.

5. **You can have any time signature.** Strudel doesn't care if you want 5/8 or 7/4:

   ```js
   setcpm(110/4)
   s("bd sd bd rim, hh*8")    // 4 over 8
   ```

   For 7-beat cycles, write 7 events. For 5-beat cycles, write 5. The cycle accommodates whatever you put in it.

6. **Bars don't exist.** Conventional sequencers force you into bars and time signatures. Strudel does not. The cycle is the only time unit; everything else is convention.

### My takeaway

The cycle is a "container of arbitrary content." Music with bars and time signatures works as a special case (one cycle = one bar with N beats). Music without is just as natural — you can have a 13-event cycle and it'll feel like a 13-event cycle.

## /understand/pitch — Pitch

Source: <https://strudel.cc/understand/pitch/>

**Thesis**: Pitch is logarithmic, and Strudel exposes three notations for it.

### Key ideas

1. **Frequency is the physical quantity.** A note is a periodic waveform; its frequency in Hz determines its pitch. `freq("220")` = 220 Hz = the A below middle C.

2. **Human hearing is logarithmic.** Doubling frequency = up one octave. So 220, 440, 880, 1760 are all "A" at different octaves. The interval from 220 to 440 sounds the same as from 440 to 880 — even though one is +220 Hz and the other is +440 Hz.

   This is why most pitch notations use *steps* (semitones) rather than Hz — equal intervals in steps = equal perceptual intervals.

3. **MIDI notation** = integer semitones. A4 = MIDI 69 = 440 Hz. Each integer step is one semitone (×2^(1/12) frequency ratio).

   ```js
   note("69 73 76 81")    // A4 C#5 E5 A5
   ```

4. **Scientific pitch notation** = letter + octave. A4, C#5, E5, A5. Same as MIDI but more readable for musicians.

   ```js
   note("A4 C#5 E5 A5").piano()
   ```

5. **Decimals work in MIDI.** `note("60.5")` plays a quarter-tone-sharp middle C. This is Strudel-specific (most software doesn't expose decimal MIDI). Use for microtonal music without going full xen.

6. **All three notations interconvert.** You can mix them freely; Strudel handles the math:

   ```js
   freq("0 4 7 12".fmap(n => 440 * 2**(n/12)))   // semitone offsets from A
   note("A4 C#5 E5 A5")                           // letter notation
   note("69 73 76 81")                            // MIDI
   ```

### Why this matters

When designing patterns, choose the notation that's most natural:

- **For melodies**: scientific (letters with octaves) — easy to think in.
- **For atonal / chromatic**: MIDI integers — easy to do math on.
- **For microtones**: MIDI decimals — easy fractional offsets.
- **For tuning experiments**: `freq()` with explicit Hz, or `xen()` for systematic alternative tunings.

## /understand/voicings — Chord Voicings

Source: <https://strudel.cc/understand/voicings/>

**Thesis**: A chord is an abstraction (a set of intervals from a root); a *voicing* is a specific arrangement of those intervals across octaves and instrument ranges.

### Key ideas

1. **A chord can be voiced many ways.** "C major" = {C, E, G} as pitch classes, but you can play it as:

   ```js
   note("[0,4,7]")          // close root position
   note("[0,12,16]")         // root + octave + 10th
   note("[0,4,12,19]")       // root, 3rd, octave, 12th (5th up an octave)
   note("[7,12,16]")         // first inversion (5th in bass)
   note("[4,7,12]")          // second inversion (3rd in bass)
   ```

   Same chord, different *voicings*. They each have a different sonic character — open vs close, bright vs warm.

2. **Manual voicing is laborious.** You can spell out every chord:

   ```js
   note("<[0,3,7,12] [0,15,24] [0,3,12]>".add("48")).room(.5)
   ```

   That works but is hard to write and edit. Hence the auto-voicer.

3. **`.voicing()` handles voice leading automatically.** Given a chord progression, `.voicing()` picks voicings that move smoothly:

   ```js
   chord("<Am C D F Am E Am E>").voicing().room(.5)
   ```

   Internally, this uses a voicing *dictionary* (`.dict('lefthand')` by default) that knows multiple voicings for each chord type. The voicer picks the voicing closest to the previous one, which tends to produce smooth voice leading (small jumps).

4. **Voicing parameters:**
   - **`anchor`** — target note. The voicer picks a voicing whose top note is near the anchor.
     ```js
     anchor("<c4 g4 c5 g5>").chord("C").voicing()
     ```
   - **`mode`**:
     - `'below'` — top note ≤ anchor.
     - `'above'` — bottom note ≥ anchor.
     - `'duck'` — top note safely below anchor (used to avoid clashing with melody).
     - `'root'` — bass note = anchor.
     ```js
     mode("<below above duck root>")
     ```
   - **`offset`** — shift up/down through voicing variations.
   - **`n`** — pick individual voices: `n(0)` plays bottom, `n(3)` plays the 4th voice from bottom.

5. **Custom voicing dictionaries.** You can define your own:

   ```js
   addVoicings('house', {
       '': ['7 12 16', '0 7 16', '4 7 12'],
       'm': ['0 3 7']
   })
   ```

   Then use `.dict('house')`.

### Why this matters

A naive chord progression sounds amateurish if voicings jump around randomly. Professional-sounding chord parts use *voice leading* — moving each voice as little as possible from chord to chord, often by step. Strudel's automatic voicer does this for you when you specify `.dict('lefthand')` (jazz voicings) or `.dict('ireal')` (pop voicings).

The `.anchor().mode('duck')` combination is critical for chord-plus-melody arrangements: it tells the voicer "keep the chord voicings below the melody so they don't fight."

## Across all three essays

The thread is: **Strudel's design follows from a small set of mathematical primitives** (cycles as time, frequencies in log space, chords as interval sets). Once you understand the primitives, the operators are obvious. Trying to memorize all the methods without understanding cycles, pitch, and voicings as concepts will leave you using Strudel as a syntax soup rather than as a coherent expressive medium.

These three essays are short. They're worth re-reading whenever I feel stuck on a pattern.
