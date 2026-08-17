import os,shutil,subprocess,sys,time,urllib.request
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
P=8767

def wait(d,x,n=180):
 for _ in range(n):
  try:
   if d.execute_script('return !!('+x+')'):return
  except:pass
  time.sleep(.1)
 raise AssertionError('wait failed: '+x)

def square(d,name):return d.find_element('css selector',f'#v12PuzzleBoard .square[data-square="{name}"]')

s=subprocess.Popen([sys.executable,'-m','http.server',str(P),'--bind','127.0.0.1'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
d=None
try:
 for _ in range(80):
  try:
   if urllib.request.urlopen(f'http://127.0.0.1:{P}/index.html',timeout=1).status==200:break
  except:time.sleep(.1)
 chrome=os.getenv('CHROME_BIN') or shutil.which('google-chrome') or shutil.which('chromium');o=Options();o.binary_location=chrome;o.page_load_strategy='none'
 for a in ['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-extensions','--disable-background-networking','--disable-sync','--no-first-run']:o.add_argument(a)
 d=webdriver.Chrome(options=o);d.set_page_load_timeout(10);d.set_script_timeout(8);d.execute_cdp_cmd('Emulation.setDeviceMetricsOverride',{'width':1366,'height':768,'deviceScaleFactor':1,'mobile':False,'screenWidth':1366,'screenHeight':768})
 d.get(f'http://127.0.0.1:{P}/index.html?visual-test=1&interaction=1&t={time.time_ns()}')
 wait(d,"window.ChessPuzzleViewV12&&window.ChessPieceSkins&&document.getElementById('v12PuzzleBoard')")
 d.execute_script("document.querySelector('[data-go=\"puzzles\"]')?.click()")
 wait(d,"document.getElementById('v12PuzzleBoard')?.children.length===64")
 # Wrong-side feedback must explicitly tell the solver which colour they own.
 side=d.execute_script('return window.ChessPuzzleViewV12.side()')
 wrong='black' if side=='w' else 'white'
 wrong_el=d.find_element('css selector',f'#v12PuzzleBoard .piece.{wrong}')
 d.execute_script('arguments[0].closest(".square").click()',wrong_el)
 wait(d,"document.getElementById('v12Feedback').textContent.includes('You play')")
 # Tap-to-move must advance the training line.
 uci=d.execute_script('return window.ChessPuzzleViewV12.expected()')
 square(d,uci[:2]).click();wait(d,f"document.querySelector('#v12PuzzleBoard .square[data-square=\"{uci[:2]}\"]')?.classList.contains('selected')")
 square(d,uci[2:4]).click();wait(d,'window.ChessPuzzleViewV12.step()>0')
 print('Puzzle tap interaction PASS',flush=True)
 # New puzzle, then exercise the actual pointer drag path that previously suppressed its own clicks.
 d.execute_script("document.getElementById('v12Skip').click()")
 wait(d,'window.ChessPuzzleViewV12.step()===0')
 uci=d.execute_script('return window.ChessPuzzleViewV12.expected()')
 result=d.execute_script("""const from=arguments[0],to=arguments[1],a=document.querySelector(`#v12PuzzleBoard .square[data-square="${from}"]`),b=document.querySelector(`#v12PuzzleBoard .square[data-square="${to}"]`),ar=a.getBoundingClientRect(),br=b.getBoundingClientRect(),ax=ar.left+ar.width/2,ay=ar.top+ar.height/2,bx=br.left+br.width/2,by=br.top+br.height/2,opt=(type,x,y)=>({bubbles:true,cancelable:true,pointerId:77,pointerType:'mouse',button:0,buttons:type==='pointerup'?0:1,clientX:x,clientY:y});a.dispatchEvent(new PointerEvent('pointerdown',opt('pointerdown',ax,ay)));document.dispatchEvent(new PointerEvent('pointermove',opt('pointermove',bx,by)));document.dispatchEvent(new PointerEvent('pointerup',opt('pointerup',bx,by)));return [from,to];""",uci[:2],uci[2:4])
 wait(d,'window.ChessPuzzleViewV12.step()>0')
 print('Puzzle drag interaction PASS '+str(result),flush=True)
 # All premium skins must be selectable and load real artwork.
 count=d.execute_script("document.getElementById('pieceSkinQuick').click();return document.querySelectorAll('#pieceSkinSheet [data-piece-skin-choice]').length")
 assert count==4,f'expected 4 piece skins, found {count}'
 for skin in ['chessnut','spatial','fantasy','celtic']:
  d.execute_script('window.ChessPieceSkins.set(arguments[0])',skin)
  wait(d,f"document.body.dataset.pieceSkin==='{skin}'&&[...document.querySelectorAll('#v12PuzzleBoard img.piece-art')].every(i=>i.complete&&i.naturalWidth>0&&i.src.includes('/{skin}/'))")
 print('Premium piece skin switching PASS',flush=True)
 d.save_screenshot('/tmp/chess-command-interaction-pass.png')
 print('Interaction gate PASS',flush=True)
finally:
 if d:
  try:d.quit()
  except:pass
 s.terminate()
