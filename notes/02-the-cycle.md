# 02 — The Cycle

## The unit

Strudel's fundamental time unit is the **cycle**. Not a beat. Not a bar. Not a measure. A cycle is an abstract repeating period whose internal subdivision is determined entirely by the pattern's content.

This is the single biggest mental shift coming from traditional music software. There is no pre-existing grid of beats. You write `"bd bd bd bd"` and you get 4 events per cycle. You write `"bd bd bd"` and you get 3 events per cycle. The cycle is the canvas; events fill it proportionally.

## CPS and CPM

Two ways to set tempo:

- **CPS** — cycles per second. `setcps(0.5)` = 1 cycle every 2 seconds. Tidal-native.
- **CPM** — cycles per minute. `setcpm(120)` = 2 cycles per second. Same thing, different unit.

Conversion: `setcpm(x) === setcps(x / 60)`.

Strudel's default is somewhere around **0.5 CPS** (one cycle every 2 seconds). Tidal's default is 0.5625 CPS. Don't trust the exact number — it has shifted across versions and just call `setcps` / `setcpm` explicitly when you care.

## Translating to BPM

There is no built-in concept of "beat." A cycle is what you make of it. If you want a 4-on-the-floor pattern at 120 BPM, you decide that one cycle = one bar of 4 beats, then:

```
setcpm(120 / 4)    // 120 BPM ÷ 4 beats per cycle = 30 cpm
sound("bd*4")
```

The convention `setcpm(BPM/4)` shows up everywhere in tutorials. It just means "make one cycle hold 4 beats at this BPM."

## Why this matters

### 1. Patterns are tempo-independent.

Because the cycle just *is* whatever its current duration is, the same pattern at any CPS preserves its internal proportions. You can drop tempo from 120 to 60, and `"bd hh sd hh"` still divides the cycle into four equal parts.

### 2. Subdivision is recursive.

When you write `"bd [hh hh] sd"`, the cycle splits into 3 equal slots: bd, [hh hh], sd. The middle slot is itself a cycle-like region, divided into 2: hh, hh. Each `hh` lasts 1/6 of the outer cycle. You can nest forever; brackets always create a new local cycle.

### 3. The same pattern at audio rate becomes timbre.

Crank CPS to ~50 and `"bd"` becomes an unintelligible buzz at ~50 Hz. There is no special-casing in the engine — rhythm and pitch are *the same phenomenon at different time scales*. A 100 Hz tone is just 100 cycles per second of "events."

This is why Strudel's pattern language scales seamlessly between rhythm-rate (~1 Hz) and audio-rate (~hundreds of Hz). It's all "events per second."

This isn't just a curiosity — workshop pages explicitly show `sound("bd hh*32 rim hh*16")` where the `hh*16` and `*32` push into pitched-buzz territory: "Pitch = really fast rhythm."

### 4. There are no bars.

I keep saying this because it's the rule that breaks every musician's brain coming in: Strudel does not have measures. You can simulate them by setting CPS so one cycle equals one bar, but the engine doesn't know about bars. There's just the cycle.

If you want long-form structure (verse / chorus), you use angle brackets `< >` (alternate per cycle) or `cat()` (one pattern per cycle) or `arrange()` (a pattern per N cycles).

### 5. Live changes snap to cycle boundaries.

When you edit code and press Ctrl+Enter, the new pattern starts taking effect at the *next cycle boundary*, not immediately. This keeps phrasing musical — beats don't get clipped mid-event.

## Anatomy of a cycle

When I see `"bd hh sd hh"`, here's what's happening structurally:

```
Cycle:  |---------- one cycle ----------|
Events: | bd  | hh  | sd  | hh  |
Time:   0    1/4   1/2   3/4   1
```

Each event occupies an arc of 1/4 cycle, with `whole = part = [n/4, (n+1)/4)`.

For `"bd [hh hh] sd hh"`:

```
Cycle:  |---------- one cycle ----------|
Events: | bd  | hh hh | sd  | hh  |
Time:   0    1/4    1/2   3/4   1
        bd: [0,    1/4)
        hh: [1/4,  3/8)    ← the bracket gave them 1/4..1/2, divided by 2
        hh: [3/8,  1/2)
        sd: [1/2,  3/4)
        hh: [3/4,  1)
```

Notice how the `[hh hh]` group still occupies the slot it would have had as a single element — *the bracket is one slot of the parent that gets internally subdivided*.

## Cycles vs cycles vs cycles (3 senses, watch out)

The word "cycle" gets used three ways in Strudel docs and I should keep them separate:

1. **The cycle** — the time unit (this whole page).
2. **The pattern's cycle structure** — how a particular pattern divides its cycle into events.
3. **A cycle of repetition** — `<a b c>` "alternates between three things across cycles" — meaning across multiple iterations of the time-cycle.

When I read documentation, I have to figure out which sense from context.

## Useful tempo helpers

- `setcps(n)` / `setcpm(n)` — global tempo.
- `cpm(n)` — pattern-level chained version: `s("bd*4").cpm(120)`.
- `.fast(n)` — multiply this pattern's internal speed by n; doesn't change the global cycle. Equivalent to `*n` inside mini-notation.
- `.slow(n)` — divide this pattern's internal speed by n. Equivalent to `/n` inside mini-notation.
- `.hurry(n)` — like `.fast(n)` but ALSO speeds up sample playback (so audible pitch shift on samples, not just timing change).
