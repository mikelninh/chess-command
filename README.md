# Chess Command

> A free, mobile-first personal chess gym: play, review, learn openings, solve tactical puzzles, track progress, prepare for friends, and grow from beginner to serious chess. Tri-D lives in the Lab as the strange bonus experiment that started this journey.

## Why I built it

One of my best friends is really into chess. I wanted to start properly from scratch, understand the important openings, practise against a computer at increasingly difficult levels, and eventually give him a much harder game.

A job ad mentioned Star Trek, I discovered the multi-level Tri-D chess board, and curiosity added an experimental Lab mode along the way.

## Demo

**https://mikelninh.github.io/chess-command/**

## Current release — V15

### V1 · Play
- full legal standard chess board
- phone-first, no-scroll Play screen
- local SVG chess pieces
- computer opponents from beginner through 1800 / 2000 / 2200 / 2400 / 2600 / 2800 / 3000+ and MAX
- Stockfish 18 integration for stronger levels when available
- local practice-bot fallback
- undo, flip, resign, move log and material display
- local rating progression
- installable PWA and offline core app

### V2–V5 · Learning loop
- Game Review with engine evaluation and mistake → personal puzzle conversion
- Opening Academy with hints, explanations and spaced repetition
- adaptive tactical puzzles and personal positions
- middlegame / endgame foundations
- SAN + PGN import/export
- adaptive next-training recommendation

### V6–V10 · Personal chess intelligence
- weakness model: Opening, Tactics, Calculation, Development, King Safety and Endgame
- evidence/confidence tracking
- adaptive daily curriculum
- opponent profiles from imported PGNs
- long-term local training memory
- target-rating goals and next-best-action coach

### V11 · Deep Review
- Stockfish MultiPV candidate moves
- evaluation graph
- turning-point detection
- deterministic mistake taxonomy
- candidate lines in SAN
- Deep Review feeds evidence back into the weakness model

### V12 · Tactical Gym
- curated tactical puzzle bank + personal puzzles from reviewed games
- Mate, Fork, Pin, Skewer, Hanging Piece, Deflection, Removing Defender, Defense and Discovered Attack
- puzzle rating, theme mastery, XP, levels, streaks, daily quest and achievements
- one-screen mobile Tactical Gym

### V13 · Game Feel
- drag-to-move alongside tap-to-move
- lightweight Web Audio move / capture / check / success feedback
- optional haptic feedback where the browser supports it
- check, capture and victory board feedback
- game-feel toggle in the app shell

### V14 · Opening Lab
- mobile repertoire dashboard over the existing Opening Academy
- per-opening mastery from real attempts
- weakest-line drilling
- spaced-repetition due count
- Memory Mode hides explanatory copy until needed
- focused beginner repertoire map for White, Black vs e4 and Black vs d4

### V15 · Solo Training Release
- **80 CI-validated offline tactical positions** generated from the curated tactical set through legality-preserving board symmetries
- Adaptive, **Sprint 3:00**, **Survival** and **Daily 5** puzzle modes
- global progression across puzzles, openings, games and Deep Review
- global XP / levels / rank titles
- daily missions and milestone achievements
- Road to 1000 rating view
- V15 layers are cached by the PWA for offline use
- multiplayer deliberately postponed: V15 focuses on making the solo learning loop excellent first

## Mobile / PWA

**Play** and **Puzzles** are deliberately designed as one-screen mobile experiences. The board stays visible while essential actions remain reachable with one thumb. Longer study surfaces such as Learn, Review and Progress can scroll because they contain actual study material.

The PWA supports home-screen installation, offline access to the core app and automatic refresh when a new service-worker build activates.

## Architecture

```text
Browser / PWA
├── Play
│   ├── deterministic chess core
│   ├── Stockfish bridge
│   ├── local practice-bot fallback
│   └── V13 game-feel layer
├── Review
│   ├── fast review
│   └── V11 Deep Review / MultiPV / taxonomy
├── Learn
│   ├── Opening Academy + SRS
│   ├── V14 Opening Lab / mastery / memory mode
│   ├── Middlegame foundations
│   └── Endgame foundations
├── Tactical Gym
│   ├── curated tactical seeds
│   ├── V15 symmetry-expanded offline pack
│   ├── personal puzzles from your games
│   ├── Adaptive / Sprint / Survival / Daily 5
│   ├── puzzle Elo + theme mastery
│   └── tactical XP / streaks
├── Intelligence
│   ├── weakness model
│   ├── adaptive curriculum
│   ├── opponent preparation
│   ├── long-term memory
│   └── personal coach
├── V15 Player Journey
│   ├── global XP + ranks
│   ├── daily missions
│   ├── milestones
│   └── Road to 1000
├── Themes
├── Tri-D Lab
└── service worker / offline shell
```

Chess truth stays deterministic. An LLM is not required for legal moves, engine evaluation, puzzle validation, mistake taxonomy or recommendation logic.

## Run locally

```bash
python -m http.server 8080
# open http://localhost:8080
```

## Tests

The release gate checks:
- initial-position perft 20 / 400 / 8902
- castling, en passant and checkmate
- SAN and PGN round-trip
- V5 endgame drills
- V10 weakness scoring and adaptive priorities
- V11 review taxonomy and Deep Review → Coach integration
- all V12 curated tactical lines are legal
- **all V15 transformed tactical lines are legal from their transformed FENs**
- JavaScript syntax across the game, review, puzzles, opening lab, game-feel, progression, mobile and PWA modules

```bash
npm run release:check
```

## What V15 is — and is not

V15 is a strong local-first solo chess-training prototype. It now has a coherent loop from play → review → diagnose → puzzles/opening practice → progression → play again, with a substantially better mobile experience.

It is still not a mature chess platform. The biggest remaining gaps are content scale, deeper opening data, richer middlegame/endgame curriculum, more human-like low-Elo bots, production-grade calibration, accounts/cloud sync and eventually multiplayer.

The next work should deepen those areas rather than add navigation for its own sake.

## Open puzzle / content direction

The puzzle provider is intentionally separable from the Tactical Gym UI. This lets the project later ingest a much larger open puzzle corpus while keeping a fast offline seed pack and personal puzzles generated from the player's own games.

## Open-source direction

The intention is to keep the core learning/game project open and make themes extensible. Future artist or premium cosmetic packs should remain separate from chess correctness and learning access.

## Tri-D disclaimer

The Tri-D experiment is an unofficial fan implementation. Star Trek and related marks belong to their respective owners. No affiliation with Paramount or CBS is implied.
