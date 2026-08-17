# Chess Command

> A free, mobile-first personal chess gym: play, review, learn, solve puzzles, track progress, customise the board, and grow from beginner to serious chess. Tri-D lives in the Lab as the strange bonus experiment that started this journey.

## Why I built it

One of my best friends is really into chess. I wanted to start properly from scratch, understand the important openings, practise against a computer at increasingly difficult levels, and eventually give him a much harder game.

A job ad mentioned Star Trek, I discovered the multi-level Tri-D chess board, and curiosity added an experimental Lab mode along the way.

## Demo

**https://mikelninh.github.io/chess-command/**

## Current release — V5

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
- move classifications: Best / Excellent / Good / Inaccuracy / Mistake / Blunder
- approximate accuracy score based on centipawn loss
- opening recognition
- human-oriented coaching notes
- converts important mistakes into personal practice positions

### V3 · Opening Memory
- interactive Opening Academy
- play the moves yourself
- hints, explanations and restart
- spaced repetition for individual opening positions
- due queue, mastery percentage and weakest-pattern view
- direct review of forgotten positions

### V4 · Adaptive Puzzles
- rated tactical puzzles
- adaptive next-puzzle selection around your puzzle rating
- personal puzzles generated from mistakes in your own reviewed games
- puzzle themes, hints and explanations
- endgame drill positions included in the same practice system

### V5 · Complete Learning Loop
- middlegame foundations: checks/captures/threats, forks, loose pieces
- endgame foundations: king + queen mate, king + rook mate, pawn promotion
- adaptive “what should I train next?” recommendation
- SAN notation
- PGN export / copy / import
- imported games can enter the review workflow
- local-first learning history
- Themes and experimental Tri-D Lab remain available without cluttering the phone Play screen

## Mobile / PWA

Play is deliberately a one-screen mobile experience: opponent row → board → player row → four compact actions → bottom navigation. Opponent strength, Coach and Moves open as a bottom sheet instead of forcing the board off screen.

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
│   ├── Opening Academy
│   ├── spaced repetition
│   ├── Middlegame foundations
│   └── Endgame foundations
├── Puzzles
│   ├── puzzle rating
│   ├── adaptive selection
│   └── personal positions
├── Progress / adaptive training plan
├── Themes
├── Tri-D Lab
├── localStorage learning profile
└── service worker / offline shell

Optional companion API
└── ASP.NET Core + SQLite
```

Chess truth stays deterministic. An LLM is not required for legal moves, engine evaluation or puzzle validation; richer natural-language coaching can be layered on later without becoming the source of truth.

## Run locally

```bash
python -m http.server 8080
# open http://localhost:8080
```

## Tests

The release gate checks:
- initial-position perft 20 / 400 / 8902
- castling
- en passant
- checkmate
- SAN
- PGN round-trip
- V5 queen-mate, rook-mate and promotion drills
- JavaScript syntax for the game, mobile, PWA and V5 learning modules

```bash
npm run release:check
```

## Next — V6+

V5 is the first complete personal learning loop, not the end state.

1. deeper multi-ply Game Review and evaluation graph
2. larger curated puzzle corpus and tactical-theme mastery
3. richer middlegame curriculum: pins, skewers, pawn structures, planning, prophylaxis
4. richer endgame curriculum: opposition, pawn races, Lucena, Philidor
5. longitudinal weakness model across all games
6. personalised daily curriculum and difficulty progression
7. friend/opponent preparation from imported PGNs
8. cloud sync and optional accounts
9. multiplayer / challenge links
10. creator-friendly theme specification and community skin packs
11. richer coach explanations grounded in deterministic engine output
12. deeper Tri-D Lab and other experimental chess variants

## Open-source direction

The intention is to keep the core learning/game project open and make themes extensible. Future artist or premium cosmetic packs should remain separate from chess correctness and learning access.

## Tri-D disclaimer

The Tri-D experiment is an unofficial fan implementation. Star Trek and related marks belong to their respective owners. No affiliation with Paramount or CBS is implied.
