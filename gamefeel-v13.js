(function(){
'use strict';
const C=window.ChessCore;const KEY='chess-command-gamefeel-v13';
function load(){try{return Object.assign({sound:true,haptics:true},JSON.parse(localStorage.getItem(KEY)||'{}'))}catch{return{sound:true,haptics:true}}}
let S=load(),ctx=null,synthetic=false,drag=null,suppressUntil=0;
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch{}}
function audio(){if(!S.sound)return null;try{ctx=ctx||new(window.AudioContext||window.webkitAudioContext)();if(ctx.state==='suspended')ctx.resume();return ctx}catch{return null}}
function tone(freq=420,dur=.035,gain=.035,type='sine'){const a=audio();if(!a)return;const o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(gain,a.currentTime);g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+dur);o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+dur)}
function buzz(pattern){if(S.haptics&&navigator.vibrate)navigator.vibrate(pattern)}
function piecesInFen(fen){return((fen||'').split(' ')[0].match(/[prnbqkPRNBQK]/g)||[]).length}
function pulse(cls,ms=420){const shell=document.querySelector('#play .board-shell');if(!shell)return;shell.classList.remove(cls);requestAnimationFrame(()=>shell.classList.add(cls));setTimeout(()=>shell.classList.remove(cls),ms)}
function addToggle(){const actions=document.querySelector('.top-actions');if(!actions||document.getElementById('feelToggle'))return;const b=document.createElement('button');b.id='feelToggle';b.className='icon-btn';b.title='Sound & haptics';b.textContent=S.sound?'♪':'×';b.onclick=()=>{S.sound=!S.sound;S.haptics=S.sound;save();b.textContent=S.sound?'♪':'×';if(S.sound){tone(620,.05,.04);buzz(12)}};actions.insertBefore(b,actions.firstChild)}
let lastPieces=32;
document.addEventListener('cc:move',e=>{const n=piecesInFen(e.detail.fen),capture=n<lastPieces;lastPieces=n;let st=null;try{st=C?.status(C.fromFEN(e.detail.fen))}catch{}if(st?.check){tone(760,.06,.05,'triangle');setTimeout(()=>tone(520,.05,.035,'triangle'),65);buzz([18,20,28]);pulse('cc-check-flash',520)}else if(capture){tone(230,.05,.05,'square');buzz(16);pulse('cc-capture-pulse',260)}else{tone(e.detail.side==='w'?470:390,.03,.025);buzz(7)}});
document.addEventListener('cc:newgame',()=>{lastPieces=32;cancelDrag()});
document.addEventListener('cc:gameover',e=>{if(e.detail.score===1){tone(523,.08,.05);setTimeout(()=>tone(659,.08,.05),90);setTimeout(()=>tone(784,.13,.05),180);buzz([30,35,60]);pulse('cc-win-glow',1200)}else{tone(240,.12,.04,'triangle');buzz(25)}});
document.addEventListener('cc:puzzle',e=>{if(e.detail.correct){tone(660,.05,.035);setTimeout(()=>tone(880,.06,.03),55);buzz(10)}else{tone(180,.05,.025,'square');buzz(18)}});

function purgeGhosts(){document.querySelectorAll('.cc-drag-ghost').forEach(n=>n.remove())}
function cancelDrag(){if(drag?.ghost)drag.ghost.remove();drag=null;purgeGhosts()}
function makeGhost(d,x,y){if(d.ghost)return;purgeGhosts();const piece=d.from.querySelector('.piece');if(!piece)return;d.ghost=piece.cloneNode(true);d.ghost.classList.add('cc-drag-ghost');document.body.appendChild(d.ghost);placeGhost(d,x,y,d.size)}
function placeGhost(d,x,y,size){if(!d?.ghost)return;const s=size||d.size||d.from.getBoundingClientRect().width;Object.assign(d.ghost.style,{width:s+'px',height:s+'px',left:(x-s/2)+'px',top:(y-s/2)+'px'})}
function dragStart(e){
 if(e.button!==undefined&&e.button!==0)return;
 const sq=e.target.closest('.square'),board=e.target.closest('#play .chess-board, #puzzles .chess-board');
 if(!sq||!board||!sq.querySelector('.piece'))return;
 cancelDrag();
 const r=sq.getBoundingClientRect();
 drag={board,from:sq,ghost:null,x:e.clientX,y:e.clientY,moved:false,pid:e.pointerId,size:r.width};
 try{sq.setPointerCapture?.(e.pointerId)}catch{}
}
function dragMove(e){
 if(!drag||e.pointerId!==drag.pid)return;
 const distance=Math.hypot(e.clientX-drag.x,e.clientY-drag.y);
 if(!drag.moved&&distance>8){drag.moved=true;makeGhost(drag,e.clientX,e.clientY)}
 if(drag.moved)placeGhost(drag,e.clientX,e.clientY);
}
function dragEnd(e){
 if(!drag||e.pointerId!==drag.pid)return;
 const d=drag;drag=null;
 if(d.ghost)d.ghost.remove();purgeGhosts();
 if(!d.moved)return;
 const hit=document.elementFromPoint(e.clientX,e.clientY)?.closest('.square');
 if(!hit||hit.closest('.chess-board')!==d.board)return;
 suppressUntil=Date.now()+450;synthetic=true;d.from.click();hit.click();setTimeout(()=>synthetic=false,0);
}
function dragCancel(e){if(!drag)return;if(e?.pointerId!==undefined&&e.pointerId!==drag.pid)return;cancelDrag()}

document.addEventListener('pointerdown',dragStart,{passive:true});
document.addEventListener('pointermove',dragMove,{passive:true});
document.addEventListener('pointerup',dragEnd,{passive:true});
document.addEventListener('pointercancel',dragCancel,{passive:true});
document.addEventListener('lostpointercapture',dragCancel,true);
document.addEventListener('click',e=>{if(!synthetic&&Date.now()<suppressUntil){e.preventDefault();e.stopImmediatePropagation()}},true);
document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelDrag()});
window.addEventListener('blur',cancelDrag);
window.addEventListener('pagehide',cancelDrag);
document.addEventListener('click',e=>{if(e.target.closest('[data-go]'))cancelDrag()},true);

purgeGhosts();
addToggle();new MutationObserver(addToggle).observe(document.body,{childList:true,subtree:true});
})();
