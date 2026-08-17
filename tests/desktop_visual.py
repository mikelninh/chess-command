import os,shutil,subprocess,sys,time,urllib.request
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
P=8766

def wait(d,x,n=180):
 for _ in range(n):
  try:
   if d.execute_script('return !!('+x+')'):return
  except:pass
  time.sleep(.1)
 raise AssertionError('wait failed: '+x)

def play_check(d,w,h):
 wait(d,"document.body.classList.contains('viewport-play-active')&&document.getElementById('gameBoard')?.children.length===64")
 m=d.execute_script("""const $=s=>document.querySelector(s),r=e=>{let x=e.getBoundingClientRect();return [x.left,x.top,x.right,x.bottom,x.width,x.height]},b=r($('#gameBoard')),p=r($('#play .player-row:not(.opponent)')),s=r($('#play .side-panel')),t=r($('.topbar')),z=[];const hidden=x=>getComputedStyle($(x)).display==='none';if(!hidden('.mobile-gamebar'))z.push('mobile gamebar visible');if(!hidden('.sheet-close'))z.push('sheet close visible');if(!hidden('.sheet-backdrop'))z.push('sheet backdrop visible');if(Math.abs(b[4]-b[5])>2)z.push('board not square');if(b[1]<t[3]-1||b[3]>innerHeight+1)z.push('board outside viewport');if(p[3]>innerHeight+1)z.push('player row clipped');if(s[3]>innerHeight+1)z.push('side panel clipped');if(document.documentElement.scrollWidth>innerWidth+1)z.push('horizontal scroll');if(getComputedStyle(document.body).overflowY!=='hidden')z.push('body can scroll');return {z,b,p,s,t,sh:document.documentElement.scrollHeight,ih:innerHeight};""")
 d.save_screenshot(f'/tmp/chess-command-desktop-play-{w}x{h}.png')
 if m['z']:raise AssertionError(f'PLAY {w}x{h}: '+', '.join(m['z'])+' '+str(m))
 print(f"Desktop PLAY PASS {w}x{h}: board={round(m['b'][4])}px playerBottom={round(m['p'][3])}/{h}",flush=True)

def puzzle_check(d,w,h):
 d.execute_script("document.querySelector('[data-go=\"puzzles\"]')?.click()")
 wait(d,"document.body.classList.contains('viewport-puzzle-active')&&document.getElementById('v12PuzzleBoard')?.children.length===64")
 m=d.execute_script("""const $=s=>document.querySelector(s),r=e=>{let x=e.getBoundingClientRect();return [x.left,x.top,x.right,x.bottom,x.width,x.height]},b=r($('#v12PuzzleBoard')),c=r($('.v12-coach')),t=r($('.topbar')),m=r($('#puzzles .v12-main')),z=[];if(Math.abs(b[4]-b[5])>2)z.push('board not square');if(b[4]<390)z.push('board too small');if(b[1]<t[3]-1||b[3]>innerHeight+1)z.push('board outside viewport');if(c[3]>innerHeight+1)z.push('coach clipped');if(m[3]>innerHeight+1)z.push('puzzle main clipped');if(document.documentElement.scrollWidth>innerWidth+1)z.push('horizontal scroll');if(getComputedStyle(document.body).overflowY!=='hidden')z.push('body can scroll');return {z,b,c,t,m,sh:document.documentElement.scrollHeight,ih:innerHeight};""")
 d.save_screenshot(f'/tmp/chess-command-desktop-puzzles-{w}x{h}.png')
 if m['z']:raise AssertionError(f'PUZZLES {w}x{h}: '+', '.join(m['z'])+' '+str(m))
 print(f"Desktop PUZZLES PASS {w}x{h}: board={round(m['b'][4])}px coachBottom={round(m['c'][3])}/{h}",flush=True)

def check(d,w,h):
 print(f'DESKTOP navigate {w}x{h}',flush=True)
 d.execute_cdp_cmd('Emulation.setDeviceMetricsOverride',{'width':w,'height':h,'deviceScaleFactor':1,'mobile':False,'screenWidth':w,'screenHeight':h})
 d.get(f'http://127.0.0.1:{P}/index.html?visual-test=1&desktop={w}x{h}&t={time.time_ns()}')
 wait(d,"document.readyState!=='loading'&&window.ChessPuzzleViewV12&&document.querySelector('.mobile-gamebar')&&document.body.classList.contains('viewport-play-active')")
 play_check(d,w,h);puzzle_check(d,w,h)

s=subprocess.Popen([sys.executable,'-m','http.server',str(P),'--bind','127.0.0.1'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
d=None
try:
 for _ in range(80):
  try:
   if urllib.request.urlopen(f'http://127.0.0.1:{P}/index.html',timeout=1).status==200:break
  except:time.sleep(.1)
 chrome=os.getenv('CHROME_BIN') or shutil.which('google-chrome') or shutil.which('chromium');o=Options();o.binary_location=chrome;o.page_load_strategy='none'
 for a in ['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-extensions','--disable-background-networking','--disable-sync','--no-first-run']:o.add_argument(a)
 d=webdriver.Chrome(options=o);d.set_page_load_timeout(10);d.set_script_timeout(8)
 check(d,1366,768);check(d,1440,900);print('Desktop visual gate PASS',flush=True)
finally:
 if d:
  try:d.quit()
  except:pass
 s.terminate()
