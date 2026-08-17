from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import time
import urllib.request
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.chrome.options import Options

ROOT = Path(__file__).resolve().parents[1]
PORT = 8765
URL = f"http://127.0.0.1:{PORT}/index.html?visual-test=1"


def wait_http(url: str, timeout: float = 8.0) -> None:
    end = time.time() + timeout
    last = None
    while time.time() < end:
        try:
            with urllib.request.urlopen(url, timeout=1) as response:
                if response.status == 200:
                    return
        except Exception as exc:
            last = exc
        time.sleep(0.1)
    raise RuntimeError(f"Local app server did not start: {last}")


def wait_js(driver, expression: str, label: str, timeout: float = 10.0) -> None:
    end = time.time() + timeout
    last = None
    while time.time() < end:
        try:
            if driver.execute_script(f"return !!({expression});"):
                return
        except Exception as exc:
            last = exc
        time.sleep(0.1)
    diag = driver.execute_script(
        "return {href:location.href,title:document.title,ready:document.readyState,"
        "core:!!window.ChessCore,command:!!window.ChessCommand,"
        "puzzle:!!window.ChessPuzzleViewV12,body:document.body.innerText.slice(0,500)};"
    )
    raise AssertionError(f"Timed out waiting for {label}: {json.dumps(diag)} last={last}")


def measure(driver):
    return driver.execute_script(
        r"""
        const $=s=>document.querySelector(s);
        const r=e=>{const x=e.getBoundingClientRect();return {left:x.left,top:x.top,right:x.right,bottom:x.bottom,width:x.width,height:x.height}};
        const board=r($('#v12PuzzleBoard')), coach=r($('.v12-coach')), hud=r($('#puzzleMobileHud')),
              nav=r($('.topbar nav')), top=r($('.topbar')), main=r($('main'));
        const files=[...document.querySelectorAll('#v12PuzzleBoard .coord.file')].map(x=>x.textContent).join('');
        const ranks=[...document.querySelectorAll('#v12PuzzleBoard .coord.rank')].map(x=>x.textContent).join('');
        const hiddenModes=getComputedStyle($('#v18Modes')).display==='none';
        const hiddenThemes=getComputedStyle($('.v12-themes')).display==='none';
        const fail=[];
        if(board.width<250) fail.push('board too small '+board.width.toFixed(1));
        if(Math.abs(board.width-board.height)>2) fail.push('board not square');
        if(board.left<-1||board.right>innerWidth+1) fail.push('board horizontal overflow');
        if(board.bottom>coach.top+2) fail.push('board overlaps coach');
        if(coach.bottom>nav.top-2) fail.push('coach hidden by bottom nav '+coach.bottom.toFixed(1)+'>'+nav.top.toFixed(1));
        if(hud.top<top.bottom-3) fail.push('HUD overlaps top bar');
        if(hud.bottom>board.top+2) fail.push('HUD overlaps board');
        if(main.bottom>nav.top+2) fail.push('main extends under nav '+main.bottom.toFixed(1)+'>'+nav.top.toFixed(1));
        if(!hiddenModes||!hiddenThemes) fail.push('desktop puzzle controls consume mobile space');
        if(files!=='abcdefgh') fail.push('file orientation '+files);
        if(ranks!=='87654321') fail.push('rank orientation '+ranks);
        if(document.documentElement.scrollWidth>innerWidth+1) fail.push('horizontal page scroll');
        return {pass:!fail.length,fail,viewport:[innerWidth,innerHeight],top,hud,board,coach,nav,main,files,ranks,
                scroll:[document.documentElement.scrollWidth,document.documentElement.scrollHeight]};
        """
    )


def run_viewport(driver, width: int, height: int) -> None:
    driver.execute_cdp_cmd(
        "Emulation.setDeviceMetricsOverride",
        {"width": width, "height": height, "deviceScaleFactor": 1, "mobile": True,
         "screenWidth": width, "screenHeight": height},
    )
    driver.get(f"{URL}&viewport={width}x{height}&t={time.time_ns()}")
    wait_js(driver, "document.readyState==='complete'", "page load")
    wait_js(driver, "window.ChessPuzzleViewV12 && document.getElementById('v18Modes')", "puzzle modules")
    driver.execute_script("document.querySelector('[data-go=\"puzzles\"]')?.click();")
    wait_js(
        driver,
        "document.body.classList.contains('puzzle-screen-active') && document.getElementById('puzzleMobileHud') && document.getElementById('v12PuzzleBoard')?.children.length===64",
        "mobile puzzle screen",
    )
    time.sleep(0.2)
    metrics = measure(driver)
    shot = Path(f"/tmp/chess-command-mobile-{width}x{height}.png")
    driver.save_screenshot(str(shot))
    if not metrics["pass"]:
        raise AssertionError(
            f"Mobile visual smoke failed at {width}x{height}: {' | '.join(metrics['fail'])}\n"
            + json.dumps(metrics, sort_keys=True)
            + f"\nScreenshot: {shot}"
        )
    clearance = round(metrics["nav"]["top"] - metrics["coach"]["bottom"])
    print(
        f"Mobile visual smoke passed at {width}x{height}: "
        f"board {round(metrics['board']['width'])}px; coach/nav clearance {clearance}px; "
        f"files {metrics['files']}; ranks {metrics['ranks']}."
    )


def main() -> int:
    server = subprocess.Popen(
        [sys.executable, "-m", "http.server", str(PORT), "--bind", "127.0.0.1"],
        cwd=ROOT,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    driver = None
    try:
        wait_http(f"http://127.0.0.1:{PORT}/index.html")
        chrome = os.environ.get("CHROME_BIN") or shutil.which("google-chrome") or shutil.which("chromium") or shutil.which("chromium-browser")
        if not chrome:
            raise RuntimeError("Chrome/Chromium not found")
        options = Options()
        options.binary_location = chrome
        for arg in [
            "--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage",
            "--disable-extensions", "--disable-background-networking", "--disable-sync", "--no-first-run",
            "--window-size=390,844",
        ]:
            options.add_argument(arg)
        driver = webdriver.Chrome(options=options)
        driver.set_page_load_timeout(15)
        run_viewport(driver, 360, 760)
        run_viewport(driver, 390, 844)
        print("Mobile visual gate passed.")
        return 0
    finally:
        if driver is not None:
            driver.quit()
        server.terminate()
        try:
            server.wait(timeout=2)
        except subprocess.TimeoutExpired:
            server.kill()


if __name__ == "__main__":
    raise SystemExit(main())
