# 20 — MIDI, OSC, and MQTT

Strudel can drive external gear (MIDI synths/drum machines, software synths via virtual MIDI, SuperCollider via OSC) and receive input (MIDI controllers, keyboards). It can also publish to MQTT for IoT or networked-music scenarios.

## MIDI output

The core function is `.midi(outputName?, options?)`:

```js
chord("<C^7 A7 Dm7 G7>").voicing().midi('IAC Driver')
note("d e c a f").midi('IAC Driver', { isController: true, midimap: 'default' })
```

Pattern events get translated to MIDI note-ons / note-offs. Notes from `note()` become MIDI note numbers; rhythm comes from the pattern's event timing.

### `midi()` options

| Option | Default | What it does |
|---|---|---|
| `isController` | false | Suppress note-ons (use this when sending only CC) |
| `latencyMs` | 34 | Offset to align MIDI to Strudel's audio |
| `noteOffsetMs` | 10 | Stagger note-off vs next note-on to avoid glitches |
| `midichannel` | 1 | MIDI channel 1-16 |
| `velocity` | 0.9 | Default velocity (0..1) |
| `gain` | 1 | Velocity multiplier |
| `midimap` | 'default' | Named CC map (see below) |
| `midiport` | | Output device name or index |

### `midichan(n)` and `midiport(out)`

These can also be applied as separate methods, and they're patternable:

```js
note("c a f e").midichan(5).midi()

$: midiport('IAC Driver')
$: note('c a f e').midiport('<0 1 2 3>').midi()   // round-robin across 4 outputs
```

## MIDI control change (CC)

Send CC alongside or independent of notes:

```js
note("c a f e").control([74, sine.slow(4)]).midi()
note("c a f e").ccn(74).ccv(sine.slow(4)).midi()
```

- `.control([cc, value])` — explicit pair.
- `.ccn(cc).ccv(value)` — separated controller number and value.

To send only CC (no notes), use `isController: true`:

```js
$: note("c a f e").midi()
$: ccv(sine.segment(16).slow(4)).ccn(74).midi()    // independent CC stream
```

### `midimaps` — map effects to CCs

You can define a mapping from Strudel's effect names to MIDI CC numbers:

```js
midimaps({ mymap: { lpf: 74 } })

$: note("c a f e").lpf(sine.slow(4)).midimap('mymap').midi()
```

When Strudel sends MIDI, it now also sends CC 74 with the current `lpf` value mapped from Strudel's range to MIDI's 0-127.

Advanced form with range and curve:

```js
midimaps({ mymap: {
    lpf: { ccn: 74, min: 0, max: 20000, exp: 0.5 }
}})
```

`defaultmidimap({...})` sets a global mapping used when no `.midimap()` is specified.

## MIDI clock and transport

Sync external gear to Strudel's tempo:

```js
$: midicmd("clock*48,<start stop>/2").midi('IAC Driver')
```

`clock*48` = 48 clock pulses per cycle (standard MIDI clock is 24 PPQ, so 48 PPQ for two beats per cycle). The `<start stop>/2` alternates start and stop messages every 2 cycles.

Other commands: `"start"`, `"stop"`, `"continue"`.

## Program change, pitch bend, aftertouch, sysex

```js
progNum("<0 1>").midi()                                        // bank-switch
note("c3 e3 g3").progNum("<0 1 2>").midi()
note("c a f e").midibend(sine.slow(4).range(-0.4, 0.4)).midi() // pitch bend -1..1
note("c a f e").miditouch(sine.slow(4).range(0, 1)).midi()     // channel pressure
note("c a f e").sysex(0x43, "0x79:0x09:0x11").midi()           // SysEx
```

## MIDI input

### CC input — `midin()`

```js
const cc = await midin('IAC Driver Bus 1');

note("c a f e").lpf(cc(0).range(0, 1000))
```

`midin(deviceName?)` opens an input. The returned function `cc(ccNum)` gives you a pattern that reads incoming CC values.

Channel-scoped:

```js
const allCC = await midin('IAC Driver Bus 1');
const cc = (n) => allCC(n, 2);   // only listen on channel 2
```

### Keyboard input — `midikeys()`

```js
const kb = await midikeys('Arturia KeyStep 32');

kb().s("tri").lpf(800).lpe(6).lpd(0.1).room(2).delay(0.35)
```

`midikeys()` gives you a pattern source that triggers on keyboard input. Note: **note length is fixed** because Strudel's audio engine (SuperDough) doesn't currently support open-ended note durations.

You can wrap the input in a struct for rhythmic gating:

```js
kb("0.5 1").s("saw").add(note(rand.mul(0.3)))
  .lpf(1000).lpe(2).room(0.5)
```

## OSC (to SuperCollider / SuperDirt)

Strudel can talk to SuperCollider/SuperDirt instead of using its own SuperDough engine. Setup is heavier:

1. Install SuperCollider + sc3-plugins + SuperDirt (or StrudelDirt).
2. Install Node.js, clone the Strudel repo, run `pnpm install`.
3. Run `pnpm run osc` to start the OSC bridge.
4. In the Strudel REPL settings, set "Audio Engine Target" to OSC.

After setup, `.osc()` is automatic — every pattern routes to SuperCollider:

```js
$: bd("sd").osc()
```

Use this when you want SuperCollider's richer synthesis and effects without giving up Strudel's pattern language.

## MQTT

```js
note("c a f e").s("sawtooth").mqtt("mqtt.eclipseprojects.io", "/strudel-pattern")
```

Sends events as JSON over MQTT to a topic. Currently **send-only** — Strudel doesn't receive MQTT yet.

Requirements:
- A broker accepting **secure WebSocket** connections (WSS).
- Public brokers work for prototyping; for production, run your own Mosquitto with SSL.

Use cases:
- IoT — trigger physical lights, motors based on patterns.
- Networked music — multiple performers' computers subscribing to one stream.
- Visualization sidecar — a separate process subscribes and renders.

## Latency considerations

MIDI over USB or IAC has some latency. Strudel's `latencyMs` (default 34 ms) compensates the *expected* MIDI delay so that what plays at the audio output and what plays on the MIDI device line up.

If you find MIDI events arriving early/late vs the audio:
- Increase/decrease `latencyMs`.
- Adjust `noteOffsetMs` if you hear note-off / note-on clashes.

For MIDI clock to external gear, tune the latency until the external device's groove lines up with Strudel's.

## When to use which

- **MIDI output** — driving hardware synths, sequencing soft-synth plugins via virtual MIDI bus, syncing drum machines.
- **OSC + SuperDirt** — when you want SuperCollider's audio engine (richer synthesis, better polyphony, sample-accurate timing). Heavier setup but more capable.
- **MQTT** — when you need to broadcast pattern events to non-music systems.
- **MIDI input** — for controllers (mod wheels, faders, encoders) shaping Strudel parameters in real time.
- **MIDI keyboard input** — for playing notes directly into Strudel rather than typing them.

For just making music, none of this is needed — SuperDough is fine. These features are for integration with the wider music-tech ecosystem.
