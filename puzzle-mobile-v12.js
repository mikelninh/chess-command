(function(){
'use strict';
const section=document.getElementById('puzzles');if(!section)return;
const mobileQuery=matchMedia('(max-width:760px)');
let built=false,sheet=null;
function text(sel,fallback=''){return section.querySelector(sel)?.textContent?.trim()||fallback}
function activeMode(){return section.querySelector('#v18Modes [data-mode].active')?.dataset.mode||'adaptive'}
function activeTheme(){return section.querySelector('.v12-themes button.active')?.dataset.theme||'Mixed'}
function cap(s){return String(s||'').replace(/(^|[-_ ])([a-z])/g,(_,a,b)=>a+b.toUpperCase())}
function build(){
 if(built)return true;const main=section.querySelector('.v12-main'),modes=section.querySelector('#v18Modes'),themes=section.querySelector('.v12-themes');if(!main||!modes||!themes)return false;
 const hud=document.createElement('div');hud.id='puzzleMobileHud';hud.className='puzzle-mobile-hud';hud.innerHTML=`
  <button id="pmMode" aria-label="Puzzle mode"><small>MODE</small><b>∞ Adaptive</b></button>
  <button id="pmTheme" aria-label="Puzzle theme"><small>THEME</small><b>Mixed</b></button>
  <button id="pmRating" aria-label="Puzzle rating"><small>RATING</small><b>500</b></button>
  <button id="pmFlip" class="pm-icon" aria-label="Flip puzzle board" title="Flip puzzle board">↻</button>`;
 main.insertAdjacentElement('beforebegin',hud);
 sheet=document.createElement('div');sheet.id='puzzleMobileSheet';sheet.className='puzzle-mobile-sheet';sheet.hidden=true;sheet.innerHTML=`<button class="puzzle-mobile-backdrop" data-pm-close aria-label="Close"></button><section><div class="puzzle-mobile-sheet-head"><div><small>PUZZLE SETUP</small><h3>Choose your training.</h3></div><button data-pm-close>×</button></div><div class="pm-group"><span>MODE</span><div id="pmModes"></div></div><div class="pm-group"><span>THEME</span><div id="pmThemes"></div></div></section>`;document.body.appendChild(sheet);
 sheet.querySelectorAll('[data-pm-close]').forEach(b=>b.onclick=closeSheet);
 hud.querySelector('#pmMode').onclick=()=>openSheet('mode');hud.querySelector('#pmTheme').onclick=()=>openSheet('theme');
 hud.querySelector('#pmRating').onclick=()=>document.getElementById('v12Rating')?.click();
 hud.querySelector('#pmFlip').onclick=()=>{window.ChessPuzzleViewV12?.flip();syncHud()};
 built=true;refreshSheet();syncHud();return true;
}
function refreshSheet(){if(!built||!sheet)return;const modes=[...section.querySelectorAll('#v18Modes [data-mode]')],themes=[...section.querySelectorAll('.v12-themes button')];const mm=sheet.querySelector('#pmModes'),tt=sheet.querySelector('#pmThemes');mm.innerHTML=modes.map(b=>`<button data-proxy-mode="${b.dataset.mode}" class="${b.classList.contains('active')?'active':''}">${b.querySelector('span')?.textContent||cap(b.dataset.mode)}</button>`).join('');tt.innerHTML=themes.map(b=>`<button data-proxy-theme="${b.dataset.theme}" class="${b.classList.contains('active')?'active':''}">${b.dataset.theme}</button>`).join('');mm.querySelectorAll('button').forEach(b=>b.onclick=()=>{section.querySelector(`#v18Modes [data-mode="${CSS.escape(b.dataset.proxyMode)}"]`)?.click();setTimeout(()=>{refreshSheet();syncHud();closeSheet()},30)});tt.querySelectorAll('button').forEach(b=>b.onclick=()=>{[...section.querySelectorAll('.v12-themes button')].find(x=>x.dataset.theme===b.dataset.proxyTheme)?.click();setTimeout(()=>{refreshSheet();syncHud();closeSheet()},30)})}
function openSheet(group){if(!sheet)return;refreshSheet();sheet.hidden=false;sheet.dataset.focus=group||'';document.body.classList.add('puzzle-mobile-sheet-open');requestAnimationFrame(()=>sheet.querySelector(group==='theme'?'#pmThemes .active':'#pmModes .active')?.scrollIntoView({block:'nearest',inline:'center'}))}
function closeSheet(){if(!sheet)return;sheet.hidden=true;document.body.classList.remove('puzzle-mobile-sheet-open')}
function syncHud(){if(!built)return;const mode=activeMode(),theme=activeTheme(),rating=text('#v12Rating b','500'),flip=window.ChessPuzzleViewV12?.isFlipped?.();const modeButton=document.getElementById('pmMode'),themeButton=document.getElementById('pmTheme');if(modeButton)modeButton.querySelector('b').textContent=(mode==='adaptive'?'∞ ':'')+cap(mode==='daily'?'Daily Five':mode==='focus'?'Theme Run':mode);if(themeButton)themeButton.querySelector('b').textContent=theme;const ratingButton=document.getElementById('pmRating');if(ratingButton)ratingButton.querySelector('b').textContent=rating;const flipButton=document.getElementById('pmFlip');if(flipButton){flipButton.classList.toggle('active',!!flip);flipButton.title=flip?'White at bottom':'Flip board'};refreshSheet()}
function sync(){const mobile=mobileQuery.matches,active=section.classList.contains('active');document.body.classList.toggle('puzzle-screen-active',mobile&&active);if(mobile)build();if(!active)closeSheet();if(built)syncHud()}
new MutationObserver(sync).observe(section,{attributes:true,attributeFilter:['class']});
new MutationObserver(()=>{if(!built)build();else syncHud()}).observe(section,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['class']});
mobileQuery.addEventListener?.('change',sync);document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>requestAnimationFrame(sync)));document.addEventListener('cc:puzzlemeta',syncHud);document.addEventListener('cc:puzzleview',syncHud);document.addEventListener('cc:puzzle',()=>setTimeout(syncHud,0));
sync();
})();
