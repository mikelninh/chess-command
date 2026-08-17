'use strict';
const assert=require('assert');
const C=require('../chess-core.js');
const P=require('../puzzle-core-v12.js');
assert(P.PUZZLES.length>=20,'V12 should ship a meaningful starter puzzle bank');
const themes=new Set(P.PUZZLES.map(x=>x.theme));
for(const t of ['Mate','Fork','Pin','Skewer','Hanging piece','Deflection','Removing defender','Defense','Discovered attack'])assert(themes.has(t),`missing theme ${t}`);
for(const p of P.PUZZLES){
  let s=C.fromFEN(p.fen);assert(s,`${p.id}: FEN must parse`);
  for(let i=0;i<p.line.length;i++){
    const u=p.line[i],n=C.make(s,u);assert(n,`${p.id}: line move ${i+1} ${u} must be legal`);s=n;
  }
}
assert(P.levelForXp(0)===1,'zero XP starts level 1');
assert(P.levelForXp(500)>1,'XP must increase level');
assert(P.xpGain({correct:true,firstTry:true,streak:5})>P.xpGain({correct:true,firstTry:false,streak:1}),'clean streak should earn more XP');
assert(P.ratingDelta(600,900,true,true)>0,'solving above rating should gain rating');
assert(P.ratingDelta(900,600,false,false)<0,'missing below rating should lose rating');
assert(P.mastery({attempts:12,correct:12,firstTry:12})>=95,'perfect volume should reach high mastery');
console.log(`Puzzle V12 tests passed: ${P.PUZZLES.length} legal curated puzzles, theme coverage, XP, rating and mastery.`);
