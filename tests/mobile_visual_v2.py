import os,shutil,subprocess,sys,time,urllib.request
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
P=8765

def wait(d,x,n=180):
 for _ in range(n):
  try:
   if d.execute_script('return !!('+x+')'):return
  except:pass
  time.sleep(.1)
 raise AssertionError('wait failed: '+x)

def check(d,w,h):
 print(f'VISUAL navigate {w}x{h}',flush=True)
 d.execute_cdp_cmd('Emulation.setDeviceMetricsOverride',{'width':w,'height':h,'deviceScaleFactor':1,'mobile':True,'screenWidth':w,'screenHeight':h})
 d.get(f'http://127.0.0.1:{P}/index.html?visual-test=1&v={w}x{h}&t={time.time_ns()}')
 wait(d,"document.readyState!=='loading'&&window.ChessPuzzleViewV12&&document.getElementById('v18Modes')")
 d.execute_script("document.querySelector('[data-go=\"puzzles\"]')?.click()")
 wait(d,"document.body.classList.contains('puzzle-screen-active')&&document.getElementById('puzzleMobileHud')&&document.getElementById('v12PuzzleBoard')?.children.length===64")
 wait(d,"[...document.querySelectorAll('#v12PuzzleBoard img.piece-art')].length>0&&[...document.querySelectorAll('#v12PuzzleBoard img.piece-art')].every(i=>i.complete&&i.naturalWidth>0)")
 m=d.execute_script("""const $=s=>document.querySelector(s),r=e=>{let x=e.getBoundingClientRect();return [x.left,x.top,x.right,x.bottom,x.width,x.height]},b=r($('#v12PuzzleBoard')),c=r($('.v12-coach')),u=r($('#puzzleMobileHud')),n=r($('.topbar nav')),t=r($('.topbar')),q=r($('main')),f=[...document.querySelectorAll('#v12PuzzleBoard .coord.file')].map(x=>x.textContent).join(''),k=[...document.querySelectorAll('#v12PuzzleBoard .coord.rank')].map(x=>x.textContent).join(''),side=window.ChessPuzzleViewV12.side(),wantF=side==='b'?'hgfedcba':'abcdefgh',wantK=side==='b'?'12345678':'87654321',sideText=$('#pmSide b')?.textContent.trim(),z=[];if(b[4]<250)z.push('small board');if(Math.abs(b[4]-b[5])>2)z.push('not square');if(b[0]<-1||b[2]>innerWidth+1)z.push('horizontal board overflow');if(b[3]>c[1]+2)z.push('board overlaps coach');if(c[3]>n[1]-2)z.push('coach under nav');if(u[1]<t[3]-3)z.push('HUD over top');if(u[3]>b[1]+2)z.push('HUD over board');if(q[3]>n[1]+2)z.push('main under nav');if(getComputedStyle($('#v18Modes')).display!=='none'||getComputedStyle($('.v12-themes')).display!=='none')z.push('old controls visible');if(f!==wantF)z.push('files '+f+' want '+wantF);if(k!==wantK)z.push('ranks '+k+' want '+wantK);if(sideText!==(side==='w'?'WHITE':'BLACK'))z.push('side HUD mismatch '+sideText);if(!$('#v12Prompt')?.textContent.includes('You play '+(side==='w'?'White':'Black')))z.push('prompt side unclear');if(!$('#v12How')?.textContent.toLowerCase().includes('drag'))z.push('drag help missing');if(!$('#v12Next')?.hidden)z.push('next visible before solve');if(document.documentElement.scrollWidth>innerWidth+1)z.push('horizontal page scroll');return {z,b,c,u,n,t,q,f,k,side,sideText};""")
 d.save_screenshot(f'/tmp/chess-command-{w}x{h}.png')
 if m['z']:raise AssertionError(f'{w}x{h}: '+', '.join(m['z'])+' '+str(m))
 print(f"Mobile visual PASS {w}x{h}: board={round(m['b'][4])}px side={m['sideText']} orientation={m['f']}/{m['k']}",flush=True)

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
 check(d,360,760);check(d,390,844);print('Mobile visual gate PASS',flush=True)
finally:
 if d:
  try:d.quit()
  except:pass
 s.terminate()
