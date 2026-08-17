# Chess Command

> A free, mobile-first personal chess gym: play, learn, solve puzzles, track progress, customise the board, and grow from beginner to serious chess. Tri-D lives in the Lab as the strange bonus experiment that started this journey.

## Why I built it

One of my best friends is really into chess. I wanted to start properly from scratch, understand the important openings, practise against a computer at increasingly difficult levels, and eventually give him a much harder game.

A job ad mentioned Star Trek, I discovered the multi-level Tri-D chess board, and curiosity added an experimental Lab mode along the way.

## Demo

**https://mikelninh.github.io/chess-command/**

## What works today

### Play
- full legal standard chess board
- mobile-first tap controls
- computer opponents from beginner levels through 1800 / 2000 / 2200 / 2400 / 2600 / 2800 / 3000+ and MAX
- Stockfish 18 integration for stronger levels when available
- local practice-bot fallback
- undo, flip, resign, move log and material display
- lightweight local rating progression

### Learn
- interactive Opening Academy
- play the moves yourself instead of watching an animation
- opening principles and move explanations
- hints, reveal and restart
- curriculum structure ready for middlegame and endgame modules

### Puzzles
- playable tactical positions
- puzzle rating, theme, hints and explanations
- local solved-puzzle progress
- personal puzzles generated from your own games are on the roadmap

### Progress
- local-first profile
- games / W-D-L
- estimated rating
- opening repetitions
- puzzle count
- daily training plan

### Themes
- multiple board skins
- multiple piece styles
- theme system separated from chess logic
- designed so community / artist skin packs can be added later

### Lab
Tri-D chess remains as an experimental mode rather than defining the main product. The existing Tri-D engine models three fixed 4×4 main boards, four movable 2×2 attack boards, multi-level projected movement, attack-board movement and pawn transport.

## Mobile / PWA
Chess Command is designed to be playable on a phone: responsive board sizing, touch-sized controls, mobile navigation, safe-area support and a progressive-web-app shell for home-screen installation and offline access to the core app.

## Architecture

```text
Browser / PWA
├── Chess Command UI
│   ├── Play
│   ├── Learn
│   ├── Puzzles
│   ├── Progress
│   ├── Themes
│   └── Lab
├── deterministic standard-chess core
├── Stockfish bridge
├── local practice-bot fallback
├── localStorage profile
└── service worker / offline shell

Optional companion API
└── ASP.NET Core + SQLite
```

Chess truth stays deterministic. An LLM is not required for legal moves, engine evaluation or puzzle validation; AI explanations can be layered on later without becoming the source of truth.

## Run locally

```bash
python -m http.server 8080
# open http://localhost:8080
```

## Tests

The standard chess core includes initial-position perft checks and targeted rules tests, including castling, en passant, checkmate and opening-line behaviour.

```bash
npm test
```

## Roadmap
1. installable PWA + offline practice
2. hardened Stockfish Web Worker integration
3. post-game engine review
4. spaced-repetition Opening Academy
5. adaptive puzzle training
6. middlegame curriculum
7. endgame curriculum
8. personal weakness model
9. PGN import / export and friend preparation
10. optional accounts + cloud sync
11. creator-friendly skin specification
12. multiplayer / challenge links
13. deeper Tri-D Lab integration

## Open-source direction
The intention is to keep the core learning/game project open and make themes extensible. Future artist or premium cosmetic packs should remain separate from chess correctness and learning access.

## Tri-D disclaimer
The Tri-D experiment is an unofficial fan implementation. Star Trek and related marks belong to their respective owners. No affiliation with Paramount or CBS is implied.
