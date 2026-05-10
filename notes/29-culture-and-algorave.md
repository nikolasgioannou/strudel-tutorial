# 29 — Culture and Algorave

Strudel is not a standalone tool. It is the latest node in a 25-year performance tradition with its own manifesto, its own dance-floor genre, its own conferences, and its own philosophical commitments. To understand *why* Strudel is designed the way it is — browser-only, immediate, share-by-URL, multiplayer-ready, with built-in visualizers — you have to understand the culture this tool was built for.

## TOPLAP Manifesto (2004)

TOPLAP — Temporary/Transnational/Terrestrial/Transdimensional Organisation for the Promotion of Live Algorithm Programming — was founded in February 2004 in a Hamburg pub by an international group of live coders. Their Draft Manifesto is the genre's foundational text.

**They demand:**

- "Give us access to the performer's mind, to the whole human instrument."
- **"Show us your screens."** (The single most-cited live-coding slogan — became a cultural rule.)
- Programs are instruments that can change themselves.
- The program is to be transcended — artificial language is the way.
- Code should be seen as well as heard, underlying algorithms viewed as well as their products.
- "Algorithms are thoughts. Chainsaws are tools. That tools should be tightly connected and obedient extensions of one's will is the central tenet of TOPLAP."

**They acknowledge:**

- The audience need not understand the code to enjoy it (just as you don't have to play guitar to enjoy Hendrix).
- Live coding is not the ultimate art form — it just has interesting things to say.

**They promote:**

- Insight into algorithms.
- The skilful extemporisation of algorithm as an essential element of art.
- Algorithms in performance — no backup safety nets.

Source: <https://toplap.org/wiki/ManifestoDraft>

## Algorave (2012–present)

Algorave is the dance-floor face of live coding. Coined and launched by **Alex McLean and Nick Collins** in Sheffield in 2012. The original name played on the UK Criminal Justice Act 1994's legal definition of rave music — "the emission of a succession of repetitive conditionals."

### Aesthetic

Techno, jungle, breakcore, glitch, footwork, noise. Tempo and density usually pushed harder than seated live-coding-as-art-music. The visual signature: huge projected editors behind the performer; the audience can read the code.

### Ethics

- Musicians take credit (not "the AI").
- The audience and dancers are co-creators.
- "Show your screen" is non-negotiable.
- Errors are part of the performance.
- Pre-recorded tracks or "backup playback" are taboo.

### Geographic spread

Hundreds of nights from Sheffield, London, Tokyo, Mexico City, Bogotá, Berlin, Barcelona, Buenos Aires, Shanghai. Strong scenes in Latin America (RGGTRN, CNDSD's network in Mexico) and East Asia.

### Notable performers

- **Alex McLean (yaxu)** — Tidal creator, Algorave co-founder
- **Nick Collins** — academic/composer, Sheffield
- **Renick Bell** — Tokyo-based, "algorave kingpin," uses Haskell-based Conductive
- **Heavy Lifting / Lucy Cheesman** — UK
- **Miri Kat**, **Eye Measure (Dan Hett)**, **Joanne Armitage**, **Shelly Knotts** — UK
- **CNDSD (Malitzin Cortés)** — Mexico
- **Atsushi Tadokoro**, **Sick Lincoln**, **TYPE**, **Kindohm** — international

Source: <https://algorave.com/about/>

## The live-coding language family

Strudel sits in a dense ecosystem. The neighbors:

| System | Creator(s) | Substrate | Distinctive trait |
|---|---|---|---|
| **SuperCollider / sclang** | James McCartney, 1996 | Smalltalk-influenced | The OG real-time synthesis engine. Powers TidalCycles via SuperDirt |
| **Csound** | Barry Vercoe, MIT, 1985 | C-derived, descends from MUSIC-N | Score+orchestra; deep DSP; not originally live-coded |
| **ChucK** | Ge Wang & Perry Cook, Princeton, 2003 | Strongly-timed concurrent language | Time as a first-class type |
| **Impromptu / Extempore** | Andrew Sorensen, 2005 → | Scheme → xtlang | Solo piano+laptop performance aesthetic |
| **TidalCycles** | Alex McLean, ~2009 | Haskell DSL | Pattern algebra; cyclic time. **Direct ancestor of Strudel.** |
| **Sonic Pi** | Sam Aaron, 2012 | Ruby DSL → Erlang scheduler | Education-first; built with UK schoolteachers; reached 2,000+ children across 10 African countries |
| **Overtone** | Jeff Rose & Sam Aaron, ~2009 | Clojure → SuperCollider | Lisp on SC; Aaron's duo Meta-eX |
| **FoxDot** | Ryan Kirkbride, Leeds, 2015 | Python → SuperCollider | Pythonic player objects |
| **Gibber** | Charlie Roberts, 2012 | Plain JavaScript in browser | First serious browser live-coder; audio + ray-marched 3D |
| **Mercury** | Timo Hoogland | Custom minimal language on Max/MSP | Designed for audience legibility; 30-line cap |
| **Orca** | Devine Lu Linvega (Hundred Rabbits) | 2D ASCII esolang on a grid | Each letter is an operator; sends MIDI/OSC out |
| **Hydra** | Olivia Jack, 2018 | JavaScript → WebGL | Live-coding **video**. Default visuals system at modern algoraves |

### Strudel's specific position

- TidalCycles' pattern algebra
- Ported to JavaScript
- Running in any browser
- With WebAudio synthesis built-in (no SuperCollider required)
- Shareable as a URL
- Multiplayer-ready via Flok

It's the most accessible entry point to Tidal-style pattern thinking ever built.

## Alex McLean / yaxu — the prime mover

The single most influential figure in modern pattern-based live coding.

- **Live-coded since the late 1990s** in Perl (`feedback.pl`).
- **Co-founded TOPLAP** (2004) and **Algorave** (2012).
- **Created TidalCycles** — work began ~2006, formalized ~2009 during his EPSRC-funded PhD at Goldsmiths.
- **Co-founded Strudel** with Felix Roos in 2022.
- Performs as **Slub** (with Dave Griffiths and Adrian Ward) — one of the earliest live-coding bands.
- Runs the **Algorithmic Pattern** project and **AlgoMech** festival (Sheffield).
- Recent practice: handweaving, examining textile and music as the same algorithmic substrate.

His paper **"Algorithmic Pattern" (NIME 2020)** is the manifesto-paper for pattern-based live coding. Its thesis: pattern is not decoration but a *creative interface* — a generative process unfolding in time — and the same cognitive activity underlies weaving, rhythm, dance steps, and code. TidalCycles is presented as an instantiation: a language whose primary type *is* the pattern (a function from time to events), with combinators (`fast`, `slow`, `every`, `rev`, `jux`, `chunk`, `struct`) operating on that type.

McLean draws lineages to:
- **Bernard Bel's Bol Processor** (representing North Indian tabla)
- **Laurie Spiegel's "Manipulations of Musical Pattern"** (1981)
- Weaving notation traditions

This is the philosophical scaffolding under Strudel. Every function I write is participating in this argument.

Sources:
- <https://slab.org/>
- <https://www.nime.org/proceedings/2020/nime2020_paper50.pdf>

## Pre-history — Algorithmic Composition

Live coding inherits from a deeper computer-music tradition:

- **Iannis Xenakis** — *Pithoprakta* (1956), Stochastic Music Programme. Translated Maxwell-Boltzmann gas physics into orchestral sound-mass; later hand-coded GENDYN (dynamic stochastic synthesis) on his UPIC system.
- **Gottfried Michael Koenig** — *Projekt 1* (1964): rule-based serialism turned into programs that emit scores.
- **David Cope** — EMI (Experiments in Musical Intelligence), 1980s–90s. "Recombinacy": analyze a corpus, generate new pieces in the style. Grandfather of music ML.
- **Max Mathews** — MUSIC-N (1957–) at Bell Labs: the first family of synthesis languages.
- **Laurie Spiegel** — *Music Mouse*, "Manipulations of Musical Pattern" (1981).

Live coding's innovation over this lineage: **it moves the algorithm from the studio to the stage**. Composition becomes performance; the score is rewritten while it's being read.

## Community resources for Strudel

- **Strudel REPL / docs**: <https://strudel.cc/> and <https://strudel.cc/learn/>
- **Discord**: dedicated Strudel Discord + `#strudel` in the TidalCycles Discord
- **Source / issues**: GitHub `tidalcycles/strudel` (also mirrored at `codeberg.org/uzu/strudel`)
- **Flok** — the de-facto multiplayer environment. Browser-based, P2P, runs Strudel + Hydra + Tidal + Sonic Pi + Mercury simultaneously. <https://flok.cc>
- **YouTube**: Felix Roos's demos; *Make Music with Code*; *Lee Tusman* (NYUAD/Purchase coursework); *kindohm*; *Switch Angel*. WAC 2022 talk "Strudel: Algorithmic Patterns for the Web" is the canonical introduction.
- **Papers**: "Strudel: Live Coding Patterns on the Web" (Roos & McLean, ICLC 2023)
- **Events**:
  - **Algoraves** in dozens of cities
  - **ICLC** (International Conference on Live Coding) — Shanghai 2024, Barcelona 2025
  - **AlgoMech** (Sheffield)
  - **Eulerroom Equinox** — 24-hour global live-stream marathons, December & June
  - **NL_CL** (Netherlands) and **TOPLAP Barcelona** local nodes

## Performance practices (the unwritten norms)

- **Show your screen.** Editor projected huge behind the performer. Audiences read code as part of the experience.
- **From scratch.** Canonical format: start with an empty buffer, build a whole track in 9 minutes (standard slot at "from scratch" sessions and Eulerroom). High-stakes, no pre-prepared material.
- **Saved sets.** The alternative tradition: bring a sketched file and improvise modifications around it. Both are accepted; "from scratch" carries more cred.
- **No safety net.** TOPLAP's "no backup, no MIDI playback" principle. If it breaks, the audience hears it break.
- **Error as music.** Compile errors, stuck loops, wrong samples are aesthetic events. Renick Bell, Heavy Lifting, others actively cultivate error-edge sounds.
- **Live coding battles.** Two coders on split screen, alternating bars, often with audience-vote outcomes.
- **Visuals partner.** Standard rig: audio coder + visual coder. Latter usually on Hydra, often syncing via OSC/WebRTC.
- **Multiplayer / networked.** Flok sessions with 4–6 coders sharing a screen, each in a slot.
- **Dancing.** Algoraves are *raves*. The audience is on a dance floor, not seated. This is what separates algorave from the more academic ICLC concert format.

## Philosophy — why people live code

Drawn from Blackwell, Cocker, Cox, McLean & Magnusson's *Live Coding: A User's Manual* (MIT Press, 2022) and the *Organised Sound* live-coding issues:

1. **Transparency / honesty.** The DJ booth is a black box; the laptop musician is a meme. Live coding answers "what are you actually doing up there?" by literally showing it.

2. **Code as notation.** Code is treated like a score that is being written and read simultaneously — a real-time musical text. Continues 60 years of expanding what "notation" means (Cage's graphic scores, Cardew's *Treatise*).

3. **Constraints as creativity.** Thor Magnusson's argument: each language *embeds* an aesthetic. TidalCycles' cyclic time *makes* certain rhythms easy and others hard; that's not a limitation, it's the instrument's voice. Choosing Strudel is choosing a way of thinking.

4. **Error as expressive material.** Because the program is the instrument, bugs are sounds. Re-frames "failure" as the medium's grain — closer to free jazz than to recorded music.

5. **Pedagogy.** Sam Aaron's Sonic Pi argument: teaching *is* a performance, and performance *is* teaching. A live-coded set demonstrates that programming is creative, embodied, expressive — a powerful counter-narrative to "coding = corporate work."

6. **Anti-virtuosity / democracy.** You don't need years of finger training. A teenager with a browser tab can play a festival. (This is precisely what Strudel maximizes.)

7. **Process over product.** The recording is a souvenir; the *event* is the work. Aligns live coding with performance art and improvisation traditions (Derek Bailey, AMM, Pauline Oliveros).

8. **Critical computing.** Geoff Cox and others read live coding as a political practice — making software's authorship visible inside a culture that wants software to feel inevitable and authorless.

## What this means for me opening strudel.cc

When I type `s("bd sd")` and press Ctrl+Enter, I am:

- Operating a **Tidal pattern algebra** invented by McLean to encode Bol Processor / Spiegel-style cyclic thinking.
- Participating in a **20-year manifesto tradition** that demands my screen be shown.
- Standing in a lineage from **Xenakis → MUSIC-N → SuperCollider → Tidal**.
- Possessing a tool **specifically designed for algoraves** — for dancing humans, not seated academics.
- Joining a community whose flagship venues are **Flok rooms, Eulerroom Equinox, ICLC, and local algorave nights** in dozens of cities.
- Inheriting an ethic of **from-scratch performance, audible error, and visible thinking**.

Strudel's design choices (browser-only, no install, immediate sound, sharable URL, Flok integration, in-page visualizers) are not just engineering decisions — they are an explicit political move to *lower the floor* of the practice as far as it will go, so anyone can show their screen.

## References

- TOPLAP Manifesto Draft: <https://toplap.org/wiki/ManifestoDraft>
- Algorave: <https://algorave.com/about/>
- Alex McLean: <https://slab.org/>
- *Algorithmic Pattern* (NIME 2020): <https://www.nime.org/proceedings/2020/nime2020_paper50.pdf>
- *Live Coding: A User's Manual* (MIT Press 2022): <https://livecodingbook.toplap.org/book/>
- ICLC: <https://iclc.toplap.org/>
- Strudel ICLC 2023 paper: <https://iclc.toplap.org/2023/catalogue/paper/strudel-live-coding-patterns-on-the-web.html>
- Flok: <https://flok.cc>
