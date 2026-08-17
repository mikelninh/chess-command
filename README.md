# Chess Command

> A free, mobile-first personal chess gym: play, review, learn openings, solve serious tactical puzzles, track progress, prepare for friends, and grow from beginner to strong chess. Tri-D lives in the Lab as the strange bonus experiment that started this journey.

## Why I built it

One of my best friends is really into chess. I wanted to start properly from scratch, understand the important openings, practise against a computer at increasingly difficult levels, and eventually give him a much harder game.

A job ad mentioned Star Trek, I discovered the multi-level Tri-D chess board, and curiosity added an experimental Lab mode along the way.

## Demo

**https://mikelninh.github.io/chess-command/**

## Current release — V21 · Premium Clarity

### V1–V5 · Play → Review → Learn
- full legal standard chess with phone-first, no-scroll Play
- computer opponents from beginner through 3000+ and MAX
- Stockfish integration with local practice fallback
- Game Review, mistake classifications and personal puzzles
- Opening Academy + spaced repetition
- middlegame / endgame foundations
- SAN + PGN import/export

### V6–V11 · Personal chess intelligence
- weakness model with evidence/confidence
- adaptive curriculum and next-best-action coach
- opponent preparation from imported PGNs
- long-term local training memory
- Stockfish MultiPV Deep Review
- evaluation graph, turning points and deterministic mistake taxonomy

### V12–V15 · Tactical Gym + Opening Lab
- curated tactical motifs and personal puzzles generated from reviewed games
- puzzle rating, mastery, streaks, XP and achievements
- mobile repertoire dashboard, weakest-line drilling and Opening SRS
- Adaptive / timed / survival puzzle training
- global player journey and Road to 1000

### V16 · Puzzle Depth
- **3,000 filtered Lichess CC0 puzzles** bundled for fast/offline training
- generated from the official Lichess open puzzle database
- rating window 400–2400 with popularity/play-count filtering
- Mate, Fork, Pin, Skewer and additional tactical motifs, supplemented by Chess Command's curated teaching pack
- the Lichess setup move is applied automatically before the player sees the position
- long cross-session anti-repeat history so the same positions do not keep resurfacing
- existing 80-position curated/offline bank remains available
- mistakes from your own games remain first-class personal puzzles
- every imported full UCI line is replayed by the deterministic chess core in CI before release

Source dataset: https://database.lichess.org/#puzzles — CC0.

### V17 · Premium Game Feel
- tap-to-move + native-feeling drag-to-move
- smooth piece travel instead of teleporting after a DOM rerender
- capture fade and castling animation
- clearer last-move, legal-move and selected-square feedback
- move / capture / check / result audio cues
- optional haptic feedback
- reduced-motion support
- Board Feel settings for sound, haptics and motion
- proper post-game result moment with rating change, **Review Game** and **Rematch**

### V18 · Progression + Puzzle Sessions
- **Adaptive** endless tactical training
- **Rush 3:00** — wrong attempts cost five seconds
- **Survival** — three lives
- **Daily Five** — a deliberately small daily tactical dose
- **Theme Run** — ten positions in one tactical motif
- session recap: solved, accuracy, average solve time and best flow/combo
- personal bests for Rush, Survival and Theme Run
- global XP and ranks separated from actual chess/puzzle rating
- daily missions with real completion bonuses
- five-day weekly consistency reward
- tactical mastery from actual theme performance
- progression milestones at puzzle counts, streaks, ratings and XP
- visible Road to 1000

### V19–V20 · Viewport reliability
- Play and Puzzles are treated as viewport applications rather than long web pages
- desktop and mobile board dimensions are constrained by both width **and** available height
- mobile-only controls cannot leak into desktop layouts
- browser-default white buttons are rejected by the visual release gate
- real Chrome renders are tested at 360×760, 390×844, 1366×768 and 1440×900
- CI stores the rendered screenshots for inspection before release

### V21 · Premium Clarity
- **four real piece sets**: Command Classic (Chessnut), Spatial, Fantasy and Celtic
- persistent piece-skin selector in Themes plus a quick picker in the top bar
- permissively licensed upstream artwork with licences documented in `THIRD_PARTY_ASSETS.md`
- puzzles automatically orient the solver's colour at the bottom
- explicit **YOU · WHITE / YOU · BLACK** state on desktop and mobile
- Play explicitly identifies **WHITE · YOU** and **BLACK · OPPONENT**
- puzzle instructions say exactly how to interact: drag a piece or tap source → highlighted destination
- legal quiet moves use dots; legal captures use rings
- tapping the wrong colour tells the solver which side they own
- fixed the drag-to-move suppression bug that could block the synthetic source/destination clicks
- Hint / Reveal / Skip are available before solving; **Next puzzle** appears after completion
- full interaction gate now proves Play drag, Puzzle tap, Puzzle drag, wrong-colour feedback and all four skin switches in a real browser

## Mobile / PWA

**Play** and **Puzzles** are one-screen experiences. The board remains the primary surface and essential controls stay reachable without scrolling.

Puzzle mode uses the current solver colour as the default perspective: White puzzles show White at the bottom; Black puzzles show Black at the bottom. The compact mobile HUD makes the side explicit before the first move.

The PWA supports home-screen installation, caches the local application shell, caches premium piece artwork after it is first loaded, and refreshes when the service-worker version changes.

## Architecture

```text
Browser / PWA
├── Play
│   ├── deterministic chess core
│   ├── Stockfish bridge
│   ├── local practice-bot fallback
│   ├── premium piece-skin layer
│   └── board-feel / motion layer
├── Review
│   └── V11 Deep Review / MultiPV / taxonomy
├── Learn
│   ├── Opening Academy + SRS
│   ├── Opening Lab / mastery / memory mode
│   ├── Middlegame foundations
│   └── Endgame foundations
├── Tactical Gym
│   ├── curated teaching pack
│   ├── 80 transformed offline positions
│   ├── 3,000 filtered Lichess CC0 positions
│   ├── personal puzzles from your own games
│   ├── adaptive anti-repeat provider
│   ├── Adaptive / Rush / Survival / Daily Five / Theme Run
│   ├── side-aware board orientation
│   └── puzzle rating + per-theme mastery
├── Intelligence
│   ├── weakness model
│   ├── adaptive curriculum
│   ├── opponent preparation
│   ├── long-term memory
│   └── personal coach
├── Player Journey
│   ├── global XP + ranks
│   ├── daily + weekly missions
│   ├── session personal bests
│   ├── milestones
│   └── Road to 1000
├── Themes / piece skins
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
- all curated and V15 transformed tactical lines are legal
- **all 3,000 V16 imported Lichess puzzle lines are replayed legally from their source FENs**
- imported rating/popularity constraints and broad motif coverage
- JavaScript syntax across the game, Stockfish bridge, review, puzzle provider/modes, Opening Lab, board feel, progression, clarity and PWA modules
- rendered mobile geometry at 360×760 and 390×844
- rendered desktop geometry at 1366×768 and 1440×900
- correct White/Black puzzle orientation and explicit solver-side labels
- premium SVG artwork actually loads
- no leaked mobile controls, horizontal overflow, puzzle scrolling or browser-default white action buttons
- real-browser **Play drag**, **Puzzle tap**, **Puzzle drag**, wrong-side feedback and all four premium skin switches

```bash
npm run release:check
```

## What V21 is — and is not

V21 is a strong local-first solo chess-training product with a coherent loop:

**play → review → diagnose → solve / drill → see progress → play again**

The product now has a much stricter visual and interaction release bar. It is still not a mature Chess.com/Lichess-scale platform: multiplayer is deliberately postponed, the Opening Lab needs a deeper repertoire tree/database, middlegame/endgame content needs much more depth, and low-Elo bots need more human-like calibration.

## Open-source direction

The intention is to keep the core learning/game project open and make themes extensible. Future artist or premium cosmetic packs should remain separate from chess correctness and learning access.

See `THIRD_PARTY_ASSETS.md` for piece artwork attribution and licences.

## Tri-D disclaimer

The Tri-D experiment is an unofficial fan implementation. Star Trek and related marks belong to their respective owners. No affiliation with Paramount or CBS is implied.
