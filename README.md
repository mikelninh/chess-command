# Chess Command

> A free, mobile-first personal chess gym: play, review, learn, solve puzzles, track progress, prepare for friends, and grow from beginner to serious chess. Tri-D lives in the Lab as the strange bonus experiment that started this journey.

## Why I built it

One of my best friends is really into chess. I wanted to start properly from scratch, understand the important openings, practise against a computer at increasingly difficult levels, and eventually give him a much harder game.

A job ad mentioned Star Trek, I discovered the multi-level Tri-D chess board, and curiosity added an experimental Lab mode along the way.

## Demo

**https://mikelninh.github.io/chess-command/**

## Current release — V10

### V1 · Play
- full legal standard chess board
- phone-first, no-scroll Play screen
- local SVG chess-piece set instead of platform-dependent Unicode glyphs
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
- adaptive selection around your puzzle rating
- personal puzzles generated from reviewed games
- tactical and endgame themes

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
- keeps the default session around 20 minutes

### V8 · Opponent Prep
- creates local opponent profiles from imported PGNs
- remembers recurring opening families
- turns the most common opening into a prep target
- designed for preparing against friends without uploading their games anywhere

### V9 · Long-Term Chess Memory
- records daily games, puzzles, opening reps and study actions locally
- seven-day activity view and training streak
- combines rating history, review memory and puzzle/opening evidence
- exports a portable `chess-command-memory.json` profile for future integrations

### V10 · Personal Chess Coach
- chooses the next best training action from measured weaknesses
- lets the player set a target rating
- adapts recommendations as Review, SRS and puzzle history grow
- integrates the V6–V9 intelligence layer into Progress instead of adding another cluttered navigation tab
- deterministic recommendation core is independently tested

## Mobile / PWA

Play is deliberately a one-screen mobile experience: opponent row → board → player row → compact actions → bottom navigation. Opponent strength, Coach and Moves open as a bottom sheet instead of forcing the board off screen.

Learn, Review and Progress can scroll because they contain study material; the live game itself should not require scrolling.

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
│   ├── engine evaluations
│   ├── move classifications
│   └── mistake → personal puzzle
├── Learn
│   ├── Opening Academy + SRS
│   ├── Middlegame foundations
│   └── Endgame foundations
├── Puzzles
│   ├── adaptive puzzle rating
│   └── personal positions
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

Chess truth stays deterministic. An LLM is not required for legal moves, engine evaluation, puzzle validation or the V10 recommendation core. Richer natural-language coaching can be layered on later without becoming the source of truth.

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
- JavaScript syntax across the game, mobile, PWA, V5 and V10 modules

```bash
npm run release:check
```

## What V10 is — and is not

V10 is a fast-moving, local-first product prototype with a complete personal-learning loop. It is not yet the production depth of a mature chess platform: the puzzle corpus is still small, engine review needs deeper multi-PV analysis, the curriculum needs much more content, and long-term calibration needs real playing data.

The next phase is therefore depth, quality and real-user learning evidence rather than adding ten more navigation items.

## V11+

1. deeper multi-ply Game Review, evaluation graph and multi-PV comparisons
2. much larger curated puzzle corpus and tactical-theme mastery
3. richer middlegame curriculum: pins, skewers, pawn structures, planning, prophylaxis
4. richer endgame curriculum: opposition, pawn races, Lucena, Philidor
5. calibrated skill estimates from many real games
6. stronger human-like computer personalities at low and intermediate Elo
7. optional cloud sync and accounts
8. friend challenges and multiplayer
9. creator-friendly skin specification and community theme packs
10. richer coach explanations grounded in deterministic engine output
11. deeper opponent modelling
12. deeper Tri-D Lab and other experimental variants

## Open-source direction

The intention is to keep the core learning/game project open and make themes extensible. Future artist or premium cosmetic packs should remain separate from chess correctness and learning access.

## Tri-D disclaimer

The Tri-D experiment is an unofficial fan implementation. Star Trek and related marks belong to their respective owners. No affiliation with Paramount or CBS is implied.
