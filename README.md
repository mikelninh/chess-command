# Chess Command

> A free, mobile-first personal chess gym: play, review, learn, solve puzzles, track progress, prepare for friends, and grow from beginner to serious chess. Tri-D lives in the Lab as the strange bonus experiment that started this journey.

## Why I built it

One of my best friends is really into chess. I wanted to start properly from scratch, understand the important openings, practise against a computer at increasingly difficult levels, and eventually give him a much harder game.

A job ad mentioned Star Trek, I discovered the multi-level Tri-D chess board, and curiosity added an experimental Lab mode along the way.

## Demo

**https://mikelninh.github.io/chess-command/**

## Current release — V12

### V1 · Play
- full legal standard chess board
- phone-first, no-scroll Play screen
- local SVG chess-piece set
- computer opponents from beginner through 1800 / 2000 / 2200 / 2400 / 2600 / 2800 / 3000+ and MAX
- Stockfish 18 integration for stronger levels when available
- local practice-bot fallback
- undo, flip, resign, move log and material display
- lightweight local rating progression
- installable PWA and offline core app

### V2 · Game Review
- saves completed games locally
- Stockfish position analysis with deterministic fallback
- Best / Excellent / Good / Inaccuracy / Mistake / Blunder classifications
- approximate accuracy from centipawn loss
- opening recognition and coaching notes
- mistakes become personal practice positions

### V3 · Opening Memory
- interactive Opening Academy
- hints, explanations and restart
- spaced repetition for individual opening positions
- due queue, mastery percentage and weakest-pattern view

### V4 · Adaptive Puzzles
- rated tactical puzzles
- adaptive selection around puzzle rating
- personal puzzles generated from reviewed games

### V5 · Complete Learning Loop
- middlegame foundations
- endgame foundations
- SAN notation
- PGN export / copy / import
- adaptive next-training recommendation

### V6 · Weakness Model
- derives a skill profile from reviewed moves and training results
- tracks Opening Memory, Tactics, Calculation, Development, King Safety and Endgame
- records evidence/confidence rather than pretending to know the player after one game

### V7 · Adaptive Curriculum
- builds a short daily session from due openings, personal mistakes, weakest skill and current rating
- prioritises spaced repetition and real-game mistakes over random content

### V8 · Opponent Prep
- creates local opponent profiles from imported PGNs
- remembers recurring opening families
- turns the most common opening into a prep target

### V9 · Long-Term Chess Memory
- records daily games, puzzles, opening reps and study actions locally
- seven-day activity view and training streak
- exports a portable `chess-command-memory.json` profile

### V10 · Personal Chess Coach
- chooses the next best training action from measured weaknesses
- target-rating goals
- recommendations adapt as Review, SRS and puzzle history grow
- deterministic recommendation core is independently tested

### V11 · Deep Review
- Stockfish MultiPV support for multiple candidate moves
- evaluation graph across the game
- turning-point detection and mistake taxonomy
- candidate lines translated into SAN
- deep-review evidence feeds back into the weakness model
- local fallback remains available when Stockfish cannot load

### V12 · Tactical Gym
- 20 curated, CI-validated starter puzzles plus personal puzzles created from your own reviewed games
- themes: Mate, Fork, Pin, Skewer, Hanging Piece, Deflection, Removing Defender, Defense and Discovered Attack
- short multi-move tactical lines with automatic opponent replies
- adaptive Mixed mode biased toward weak tactical themes
- separate puzzle rating
- per-theme mastery tracking
- XP, levels and rank titles
- current streak + best streak
- daily five-puzzle quest
- first-try, difficulty, streak and daily-completion XP bonuses
- achievements and milestone unlocks
- mobile-first, one-viewport Tactical Gym with horizontal theme selection and tap-friendly controls
- offline/PWA cache includes the full V12 gym

## Mobile / PWA

**Play** and **Puzzles** are deliberately designed as one-screen mobile experiences. The board stays visible while essential actions remain reachable with one thumb. Longer study surfaces such as Learn, Review and Progress may scroll because they contain actual study material.

The PWA supports home-screen installation, offline access to the core app and automatic refresh when a new service-worker build activates.

## Architecture

```text
Browser / PWA
├── Play
│   ├── deterministic chess core
│   ├── local SVG piece renderer
│   ├── Stockfish bridge
│   └── local practice-bot fallback
├── Review
│   ├── V2 fast review
│   └── V11 deep review
│       ├── MultiPV candidate lines
│       ├── evaluation graph
│       ├── mistake taxonomy
│       └── coach evidence
├── Learn
│   ├── Opening Academy + SRS
│   ├── Middlegame foundations
│   └── Endgame foundations
├── Tactical Gym / V12
│   ├── curated + personal puzzle bank
│   ├── adaptive theme selection
│   ├── puzzle Elo
│   ├── XP / levels / streaks / quests
│   └── per-theme mastery
├── Intelligence
│   ├── weakness model
│   ├── adaptive curriculum
│   ├── opponent preparation
│   ├── long-term local memory
│   └── personal coach
├── Themes
├── Tri-D Lab
└── service worker / offline shell
```

Chess truth stays deterministic. An LLM is not required for legal moves, engine evaluation, puzzle validation, mistake taxonomy or the recommendation core.

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
- V5 queen-mate, rook-mate and promotion drills
- V10 weakness scoring, adaptive priorities, opponent summaries and streak memory
- V11 loss classes, tactical themes, review priority and deep-review → coach integration
- all V12 curated tactical lines are legal from their supplied FENs
- V12 theme coverage, XP, rating and mastery behaviour
- JavaScript syntax across the game, Stockfish bridge, mobile/PWA and V5–V12 modules

```bash
npm run release:check
```

## What V12 is — and is not

V12 is a fast-moving local-first product prototype with a complete play → review → diagnose → train loop and a genuinely usable Tactical Gym. It is still not the production depth of a mature chess platform: the puzzle bank is intentionally small compared with large chess services, engine calibration needs real games, the curriculum needs much more content, and low-Elo bots still need more human-like behaviour.

The next versions should deepen content and real learning quality rather than adding navigation for its own sake.

## V13+

1. hundreds/thousands of licensed or generated-and-verified tactical positions
2. puzzle rush / timed survival mode
3. richer middlegame curriculum: pins, skewers, pawn structures, planning, prophylaxis
4. richer endgame curriculum: opposition, pawn races, Lucena, Philidor
5. calibrated skill estimates from many real games
6. stronger human-like computer personalities at low and intermediate Elo
7. opening explorer and repertoire tree
8. optional cloud sync and accounts
9. friend challenges and multiplayer
10. creator-friendly skin specification and community theme packs
11. richer coach explanations grounded in deterministic engine output
12. deeper opponent modelling and Tri-D Lab

## Open-source direction

The intention is to keep the core learning/game project open and make themes extensible. Future artist or premium cosmetic packs should remain separate from chess correctness and learning access.

## Tri-D disclaimer

The Tri-D experiment is an unofficial fan implementation. Star Trek and related marks belong to their respective owners. No affiliation with Paramount or CBS is implied.