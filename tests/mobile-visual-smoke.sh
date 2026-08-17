#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
CHROME="$(command -v google-chrome || command -v chromium || command -v chromium-browser || true)"
if [[ -z "$CHROME" ]]; then echo "Chrome/Chromium is required for mobile visual smoke tests." >&2; exit 1; fi
PORT=8765
python3 -m http.server "$PORT" --bind 127.0.0.1 >/tmp/chess-command-mobile-http.log 2>&1 &
SERVER=$!
trap 'kill "$SERVER" >/dev/null 2>&1 || true' EXIT
sleep .5
run_viewport(){
  local size="$1" name="$2" out="/tmp/chess-command-${name}.html"
  "$CHROME" --headless=new --no-sandbox --disable-gpu --disable-background-networking --window-size="$size" --virtual-time-budget=9000 --dump-dom "http://127.0.0.1:${PORT}/tests/mobile-puzzle-visual.html" >"$out" 2>/tmp/chess-command-${name}.chrome.log || { cat /tmp/chess-command-${name}.chrome.log; return 1; }
  if ! grep -q 'data-result="PASS"' "$out"; then echo "Mobile visual smoke failed at ${size}" >&2; grep -o '<pre id="result">[^<]*' "$out" || true; return 1; fi
  echo "Mobile visual smoke passed at ${size}."
}
run_viewport "360,760" "360x760"
run_viewport "390,844" "390x844"
