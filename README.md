# Tri-D Command

> One of my best friends is really into chess. I’m learning from scratch and wanted a visual way to understand the important openings. Then a job ad mentioned Star Trek, I discovered Tri-D chess, and curiosity did the rest.

**Tri-D Command** is two things in one:

1. an interactive opening academy for learning standard chess by playing the moves on a real board and understanding why they exist;
2. an experimental playable Tri-D chess mode inspired by the multi-level board seen in Star Trek and the community-developed Federation Standard / Federation Revised Standard rules.

## Demo

**https://mikelninh.github.io/trid-command/**

### Preview

![Opening Academy](assets/opening-academy.png)

![Tri-D Experiment](assets/trid-experiment.png)

## Opening Academy

- full 8×8 board and all 32 pieces
- 16 important classical / hypermodern opening families
- click-to-play training rather than passive animation
- hints, reveal, rewind and reset
- explanation of why the next move exists
- visual progress through each line

## Tri-D Experiment

- three fixed 4×4 main boards
- four movable 2×2 attack boards
- 64 playable squares total
- projected multi-level movement
- highest-path / alternate-path validation
- attack-board movement, inversion and ownership
- pawn transport on attack boards
- check, checkmate and stalemate
- castling, promotion and standard en passant
- king-safety validation for piece and board moves
- optional rook-pawn side movement
- draggable 3D camera with top / bridge / side presets
- a 60-second Warp-Pawn mission demonstrating the strangest mechanic: **the board itself can move**

The Tri-D engine is deliberately labelled **FRS 5.0 Beta**. The common gameplay path works and is tested; obscure interactions in a community-developed ruleset still deserve more conformance testing before claiming completeness.

## Stack

- HTML / CSS / vanilla JavaScript
- deterministic Tri-D rules engine
- CSS 3D scene — no WebGL dependency
- Node-based engine tests
- ASP.NET Core companion API
- SQLite session / progress storage

The game rules do not depend on an LLM.

## Run locally

```bash
python -m http.server 8080
# open http://localhost:8080
```

Build and test:

```bash
npm run build
npm test
```

Optional .NET API:

```bash
cd api/TriDCommand.Api
dotnet restore
dotnet run
```

## Project structure

```text
.
├── index.html
├── styles.css
├── bundle.js
├── src/
│   ├── engine.js
│   ├── openings.js
│   └── app.js
├── tests/
│   └── engine.test.js
├── scripts/
│   └── build.mjs
├── api/
│   └── TriDCommand.Api/
└── .github/workflows/
    └── pages.yml
```

## Rules lineage

The Star Trek television prop did not ship with a complete canonical on-screen ruleset. This project follows the community-developed Federation Standard / Federation Revised Standard lineage associated with Andrew Bartmess and later clarifications. It is an unofficial fan implementation.

## Disclaimer

Unofficial fan project. Star Trek and related marks belong to their respective owners. No affiliation with Paramount or CBS is implied.
