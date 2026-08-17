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
  local size="$1"
  local name="$2"
  local out="/tmp/chess-command-${name}.html"
  local log="/tmp/chess-command-${name}.chrome.log"
  timeout 20s "$CHROME" --headless=new --no-sandbox --disable-gpu --disable-background-networking --window-size="$size" --virtual-time-budget=7000 --dump-dom "http://127.0.0.1:${PORT}/tests/mobile-puzzle-visual.html" >"$out" 2>"$log" || { echo "Chrome visual run failed/timed out at ${size}" >&2; cat "$log"; return 1; }
  if ! grep -q 'data-result="PASS"' "$out"; then echo "Mobile visual smoke failed at ${size}" >&2; grep -o '<pre id="result">[^<]*' "$out" || true; return 1; fi
  echo "Mobile visual smoke passed at ${size}."
}
run_viewport "360,760" "360x760"
run_viewport "390,844" "390x844"
