import {spawn} from 'node:child_process';
import {existsSync} from 'node:fs';
import {writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const PORT=8765,DEBUG=9222;
const chrome=process.env.CHROME_BIN||['/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser'].find(existsSync);
if(!chrome)throw new Error('Chrome/Chromium not found.');

const server=spawn('python3',['-m','http.server',String(PORT),'--bind','127.0.0.1'],{cwd:ROOT,stdio:'ignore'});
const profile=`/tmp/chess-command-cdp-${process.pid}`;
const browser=spawn(chrome,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-default-apps','--disable-sync','--no-first-run','--metrics-recording-only',`--remote-debugging-port=${DEBUG}`,`--user-data-dir=${profile}`,'about:blank'],{stdio:'ignore'});

async function pollJson(url,tries=100){let last;for(let i=0;i<tries;i++){try{const r=await fetch(url);if(r.ok)return await r.json();last=new Error('HTTP '+r.status)}catch(e){last=e}await sleep(100)}throw last||new Error('debug endpoint unavailable')}
async function pollHttp(url,tries=100){let last;for(let i=0;i<tries;i++){try{const r=await fetch(url,{cache:'no-store'});if(r.ok)return true;last=new Error('HTTP '+r.status)}catch(e){last=e}await sleep(100)}throw last||new Error('app server unavailable')}
function connect(url){return new Promise((resolve,reject)=>{const ws=new WebSocket(url);ws.addEventListener('open',()=>resolve(ws),{once:true});ws.addEventListener('error',reject,{once:true})})}

try{
 await pollHttp(`http://127.0.0.1:${PORT}/index.html`);
 const targets=await pollJson(`http://127.0.0.1:${DEBUG}/json/list`);
 if(!targets.length)throw new Error('No Chrome debug target.');
 const ws=await connect(targets[0].webSocketDebuggerUrl);
 let seq=0;const pending=new Map(),runtimeErrors=[];
 ws.addEventListener('message',ev=>{const m=JSON.parse(ev.data);if(m.method==='Runtime.exceptionThrown')runtimeErrors.push(m.params?.exceptionDetails?.text||'runtime exception');if(m.id&&pending.has(m.id)){const {resolve,reject}=pending.get(m.id);pending.delete(m.id);m.error?reject(new Error(JSON.stringify(m.error))):resolve(m.result)}});
 const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}))});
 const evalJs=async expression=>(await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true})).result.value;
 await send('Page.enable');await send('Runtime.enable');

 async function waitEval(expression,label,tries=120){for(let i=0;i<tries;i++){if(await evalJs(expression))return true;await sleep(100)}const diag=await evalJs(`({href:location.href,title:document.title,ready:document.readyState,hasCore:!!window.ChessCore,hasCommand:!!window.ChessCommand,hasPuzzleCore:!!window.PuzzleCoreV12,scripts:[...document.scripts].map(s=>s.src).filter(Boolean),body:document.body.innerText.slice(0,600)})`);throw new Error('Timed out waiting for '+label+' '+JSON.stringify(diag)+' runtime='+JSON.stringify(runtimeErrors.slice(-5)))}
 async function run(width,height){
   runtimeErrors.length=0;
   await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:true,screenWidth:width,screenHeight:height});
   await send('Page.navigate',{url:`http://127.0.0.1:${PORT}/index.html?visual-test=1&viewport=${width}x${height}&t=${Date.now()}`});
   await waitEval(`document.readyState==='complete'`,'page load');
   await waitEval(`!!window.ChessPuzzleViewV12 && !!document.getElementById('v18Modes')`,'puzzle modules');
   await evalJs(`document.querySelector('[data-go="puzzles"]')?.click(); true`);
   await waitEval(`document.body.classList.contains('puzzle-screen-active')&&!!document.getElementById('puzzleMobileHud')&&document.getElementById('v12PuzzleBoard')?.children.length===64`,'mobile puzzle screen');
   await sleep(180);
   const metrics=await evalJs(`(()=>{const d=document,$=s=>d.querySelector(s),r=e=>{const x=e.getBoundingClientRect();return{left:x.left,top:x.top,right:x.right,bottom:x.bottom,width:x.width,height:x.height}};const board=r($('#v12PuzzleBoard')),coach=r($('.v12-coach')),hud=r($('#puzzleMobileHud')),nav=r($('.topbar nav')),top=r($('.topbar')),main=r($('main'));const files=[...d.querySelectorAll('#v12PuzzleBoard .coord.file')].map(x=>x.textContent).join('');const ranks=[...d.querySelectorAll('#v12PuzzleBoard .coord.rank')].map(x=>x.textContent).join('');const hiddenModes=getComputedStyle($('#v18Modes')).display==='none',hiddenThemes=getComputedStyle($('.v12-themes')).display==='none';const fail=[];if(board.width<250)fail.push('board too small '+board.width.toFixed(1));if(Math.abs(board.width-board.height)>2)fail.push('board not square');if(board.left<-1||board.right>innerWidth+1)fail.push('board horizontal overflow');if(board.bottom>coach.top+2)fail.push('board overlaps coach');if(coach.bottom>nav.top-2)fail.push('coach hidden by bottom nav '+coach.bottom.toFixed(1)+'>'+nav.top.toFixed(1));if(hud.top<top.bottom-3)fail.push('HUD overlaps top bar');if(hud.bottom>board.top+2)fail.push('HUD overlaps board');if(main.bottom>nav.top+2)fail.push('main extends under nav '+main.bottom.toFixed(1)+'>'+nav.top.toFixed(1));if(!hiddenModes||!hiddenThemes)fail.push('desktop puzzle controls consume mobile space');if(files!=='abcdefgh')fail.push('file orientation '+files);if(ranks!=='87654321')fail.push('rank orientation '+ranks);if(document.documentElement.scrollWidth>innerWidth+1)fail.push('horizontal page scroll');return{pass:!fail.length,fail,viewport:[innerWidth,innerHeight],top,hud,board,coach,nav,main,files,ranks,scroll:[document.documentElement.scrollWidth,document.documentElement.scrollHeight]}})()`);
   const shot=await send('Page.captureScreenshot',{format:'png',fromSurface:true});
   await writeFile(`/tmp/chess-command-mobile-${width}x${height}.png`,Buffer.from(shot.data,'base64'));
   if(!metrics.pass)throw new Error(`Mobile visual smoke failed at ${width}x${height}: ${metrics.fail.join(' | ')}\n${JSON.stringify(metrics)}`);
   console.log(`Mobile visual smoke passed at ${width}x${height}: board ${Math.round(metrics.board.width)}px, coach clears nav by ${Math.round(metrics.nav.top-metrics.coach.bottom)}px.`);
 }
 await run(360,760);await run(390,844);
 ws.close();
}finally{
 browser.kill('SIGKILL');server.kill('SIGKILL');
}
