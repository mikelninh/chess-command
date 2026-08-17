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
for i in {1..40}; do curl -fsS "http://127.0.0.1:${PORT}/index.html" >/dev/null 2>&1 && break; sleep .1; done
run_viewport(){
  local size="$1" name="$2" out="/tmp/chess-command-${2}.html" log="/tmp/chess-command-${2}.chrome.log" code=0
  set +e
  timeout 14s "$CHROME" --headless=new --no-sandbox --disable-gpu --disable-extensions --disable-component-extensions-with-background-pages --disable-background-networking --disable-default-apps --disable-sync --no-first-run --metrics-recording-only --window-size="$size" --virtual-time-budget=8500 --dump-dom "http://127.0.0.1:${PORT}/tests/mobile-puzzle-visual.html" >"$out" 2>"$log"
  code=$?
  set -e
  if grep -q 'data-result="PASS"' "$out"; then
    local result
    result="$(grep -o '<pre id="result">[^<]*' "$out" | head -1 | sed 's/<pre id="result">//')"
    echo "Mobile visual smoke passed at ${size}. ${result}"
    return 0
  fi
  echo "Mobile visual smoke failed at ${size} (Chrome exit ${code})." >&2
  grep -o '<pre id="result">[^<]*' "$out" | head -1 >&2 || true
  tail -30 "$log" >&2 || true
  return 1
}
run_viewport "360,760" "360x760"
run_viewport "390,844" "390x844"
