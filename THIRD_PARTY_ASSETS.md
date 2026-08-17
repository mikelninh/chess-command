# Third-party visual assets

Chess Command's application code is licensed under the repository's MIT License. The optional chess piece skins below are loaded from the open-source `lichess-org/lila` repository and remain under their respective upstream licences.

| Chess Command name | Upstream Lichess set | Author / upstream attribution | Licence |
| --- | --- | --- | --- |
| Command Classic | `chessnut` | Alexis Luengas | Apache-2.0 |
| Spatial | `spatial` | Maurizio Monge | MIT |
| Fantasy | `fantasy` | Maurizio Monge | MIT |
| Celtic | `celtic` | Maurizio Monge | MIT |

Upstream source: `https://github.com/lichess-org/lila/tree/master/public/piece`

Upstream licence manifest: `https://github.com/lichess-org/lila/blob/master/COPYING.md`

The runtime loads those SVG files from the matching raw GitHub paths and caches assets after use for the PWA. The original small `pieces.svg` set remains in Chess Command only as an offline/error fallback.
