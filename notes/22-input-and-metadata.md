# 22 — Input Devices and Metadata

Two smaller topics bundled together.

## Gamepad input

Strudel supports gamepad input via `gamepad(index)`. Use cases: live performance with a controller, audience-interactive installations.

```js
const gp = gamepad(0);     // first connected gamepad
const gp2 = gamepad(1);    // second gamepad
```

The returned handle exposes buttons and axes as patterns you can use anywhere a pattern would go.

### Buttons

Each button returns a 0/1 pattern indicating whether it's currently pressed.

| Button | Aliases |
|---|---|
| `a`, `b`, `x`, `y` (and `A`, `B`, `X`, `Y`) | Face buttons |
| `tglA`, `tglB`, `tglX`, `tglY` | Toggle versions — each press flips state, persists |
| `lb`, `rb`, `lt`, `rt` (and uppercase) | Shoulder buttons + triggers |
| `tglLB`, `tglRB`, `tglLT`, `tglRT` | Toggle versions of shoulders |
| `up`, `down`, `left`, `right` (or `u`, `d`, `l`, `r`) | D-pad |
| `l3`, `r3` (aliases `ls`, `rs`) | Stick clicks |
| `start`, `back` | System buttons |

### Analog sticks

| Axis | Range |
|---|---|
| `x1`, `y1` | Left stick, 0..1 |
| `x1_2`, `y1_2` | Left stick, -1..1 |
| `x2`, `y2` | Right stick, 0..1 |
| `x2_2`, `y2_2` | Right stick, -1..1 |

### Usage examples

#### Mute drums with a button

```js
const gp = gamepad(0);
note("c a f e").mask(gp.a)
```

When you hold the A button, the pattern plays; otherwise muted.

#### Drum kit triggered by buttons

```js
const gp = gamepad(0);
setcpm(120);
$: stack(
    s("[[hh hh] oh hh oh]/2").mask(gp.tglX).bank("RolandTR909"),
    s("cr*1").mask(gp.Y).bank("RolandTR909"),
    s("bd").mask(gp.tglA).bank("RolandTR909"),
    s("[ht - - mt - - lt - ]/2").mask(gp.tglB).bank("RolandTR909"),
    s("sd*4").mask(gp.RB).bank("RolandTR909"),
)
```

Each toggle/button gates a different drum part. Build up a beat by pressing buttons.

#### Stick controls filter/decay

```js
const gp = gamepad(0);
setcpm(120);
$: note("c4 d3 a3 e3").sound("sawtooth")
    .lpf(gp.x1.range(100, 4000))     // left stick X = cutoff
    .lpq(gp.y1.range(5, 30))         // left stick Y = resonance
    .decay(gp.y2.range(0.1, 2))      // right stick Y = decay
    .lpenv(gp.x2.range(-5, 5))       // right stick X = envelope depth
```

Real-time control of synth parameters with stick movement.

### Button sequences (fighting-game style)

```js
const gp = gamepad(0);
setcpm(120);
const HADOUKEN = ['d', 'r', 'a'];
const KONAMI = 'uuddlrlrba';

$: s("free_hadouken -").slow(2)
    .mask(gp.btnSequence(HADOUKEN))
    .room(1)
```

`btnSequence(sequence)` returns a pattern that fires once when the sequence is typed correctly. Fun for triggering special events during a performance.

## Device motion (phone/tablet)

There's a separate `/learn/devicemotion/` page for accelerometer / gyroscope input from mobile devices. Same conceptual approach — get a sensor handle, use it as a pattern with `.range()` mapping.

Use cases: gesture-controlled music, audience-participation installations (everyone's phones contribute), tilt-controlled filter.

## Metadata tags

Strudel patterns can carry metadata embedded in comments. The engine ignores it; the REPL search and visualization use it.

### Tags

| Tag | Purpose | Multi-value |
|---|---|---|
| `@title` | Song name | no |
| `@by` | Author(s); can include `<email>` or `<url>` | yes |
| `@license` | SPDX license identifier(s) | yes |
| `@genre` | Style(s) | yes |
| `@album` | Album name | no |
| `@details` | Free text, multi-line OK | no |
| `@url` | Related links | yes (repeat tag) |
| `@tag` | Custom tags | yes |

### Comment formats

Line comments:
```js
// @title My Cool Song
// @by John Doe
// @license CC-BY-SA-4.0
```

Block comments:
```js
/*
@title My Cool Song
@by John Doe
@license CC-BY-SA-4.0
*/
```

Quoted-title shortcut:
```js
// "My Cool Song" @by John Doe
```

Multi-line / multi-value:
```js
/*
@by John Doe
    Jane Doe
@genre pop, jazz
@url https://example.com
@url https://example.org
*/
```

Multi-line details:
```js
/*
@details I wrote this song in February 19th, 2023.
         It was around midnight and I was lying on
         the sofa in the living room.
*/
```

### REPL search

In the Strudel REPL's "Patterns" tab, the search bar uses these tags:

- `by: Ada L` — filter by author name (partial match)
- `genre: unicorns` — filter by genre
- Bare query — matches `@title`, `@by`, or `@tag`

### Why include metadata

- **Discovery** — other people browsing the REPL's pattern library can find your work.
- **Attribution** — license tags clarify what others can do with your patches.
- **Archive** — your own future self can grep across patches by year, genre, etc.
- **Performance** — projected metadata becomes part of the on-screen aesthetic.

### License conventions

Most Strudel examples use `CC-BY-NC-SA-4.0` (Creative Commons, Attribution, Non-Commercial, ShareAlike). The official examples use this — preserving the live-coding culture's emphasis on sharing while protecting commercial use.

Other common: `MIT`, `CC0` (public domain), `AGPL-3.0`.

### Example with full metadata

```js
// @title Aurora
// @by Claude <noreply@anthropic.com>
// @license CC-BY-SA-4.0
// @genre ambient, generative
// @tag practice, c-minor
// @url https://example.com/aurora
/*
@details Slow-evolving pad piece in C minor.
         Built around a perlin-modulated cutoff
         on the chord pad.
*/

setcps(0.5)
chord("Cm7").voicing().s('sawtooth').lpf(perlin.range(400, 2000).slow(16)).room(2)
```
