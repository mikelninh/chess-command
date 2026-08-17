#!/usr/bin/env python3
"""Build a compact, high-quality offline pack from the Lichess CC0 puzzle CSV.

Input: decompressed CSV on stdin.
Output: browser/CommonJS JS module on stdout.

Lichess rows store the position BEFORE the opponent's setup move. We keep the
original FEN and full UCI move list; puzzle-provider-v16.js applies the first
move at runtime and presents the remainder as the solution.
"""
import csv, json, sys
from collections import defaultdict

TARGET_TOTAL = 3000
PER_THEME = 420
MIN_RATING, MAX_RATING = 400, 2400
MIN_POPULARITY = 82
MIN_PLAYS = 80
MAX_PLIES = 9

THEME_MAP = [
    ("mate", "Mate"),
    ("fork", "Fork"),
    ("pin", "Pin"),
    ("skewer", "Skewer"),
    ("hangingPiece", "Hanging piece"),
    ("deflection", "Deflection"),
    ("removeDefender", "Removing defender"),
    ("defensiveMove", "Defense"),
    ("discoveredAttack", "Discovered attack"),
]

# Spread the pack across the ratings a developing player is likely to traverse.
BANDS = [(400,700),(700,1000),(1000,1300),(1300,1600),(1600,1900),(1900,2200),(2200,2401)]
PER_CELL = 58  # theme x rating-band cap; enough diversity without a huge bundle
picked = []
counts = defaultdict(int)
seen_ids = set()

reader = csv.reader(sys.stdin)
for row in reader:
    if len(row) < 9:
        continue
    try:
        pid, fen, moves_s = row[0], row[1], row[2]
        rating = int(row[3]); popularity = int(row[5]); plays = int(row[6])
    except (ValueError, IndexError):
        continue
    if pid == "PuzzleId" or pid in seen_ids:
        continue
    if not (MIN_RATING <= rating <= MAX_RATING) or popularity < MIN_POPULARITY or plays < MIN_PLAYS:
        continue
    moves = moves_s.split()
    if not (2 <= len(moves) <= MAX_PLIES):
        continue
    tags = set(row[7].split())
    friendly = next((label for raw,label in THEME_MAP if raw in tags or (raw == "mate" and any(t.startswith("mateIn") for t in tags))), None)
    if not friendly:
        continue
    band = next((i for i,(lo,hi) in enumerate(BANDS) if lo <= rating < hi), None)
    if band is None:
        continue
    cell = (friendly, band)
    if counts[cell] >= PER_CELL or sum(1 for x in picked if x[4] == friendly) >= PER_THEME:
        continue
    # Compact tuple: id, fen-before-setup, full UCI line, rating, friendly theme, popularity.
    picked.append([pid, fen, moves_s, rating, friendly, popularity])
    counts[cell] += 1
    seen_ids.add(pid)
    if len(picked) >= TARGET_TOTAL:
        break

# Stable ordering makes diffs reproducible. Runtime selection handles adaptation/randomness.
picked.sort(key=lambda x: (x[4], x[3], x[0]))
print("/* Generated from the Lichess CC0 puzzle database. Do not hand edit. */")
print("(function(g){const PACK=" + json.dumps(picked, separators=(",", ":")) + ";")
print("if(typeof module!=='undefined'&&module.exports)module.exports=PACK;else g.LICHESS_PUZZLE_PACK_V16=PACK;})(typeof window!=='undefined'?window:globalThis);")
print("// puzzles=" + str(len(picked)), file=sys.stderr)
