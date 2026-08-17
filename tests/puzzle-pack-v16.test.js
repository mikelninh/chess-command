'use strict';
const assert=require('assert');
const C=require('../chess-core.js');
const pack=require('../puzzle-pack-lichess-v16.js');
const curated=require('../puzzle-core-v12.js');
assert(pack.length>=2500,`expected a large V16 pack, got ${pack.length}`);
const themes=new Map(),ratings=[];
for(const row of pack){
  const [id,fen,movesS,rating,theme,popularity]=row;
  assert(id&&fen&&movesS,`${id||'unknown'}: required fields`);
  assert(rating>=400&&rating<=2400,`${id}: rating range`);
  assert(popularity>=82,`${id}: popularity filter`);
  themes.set(theme,(themes.get(theme)||0)+1);ratings.push(rating);
  let s=C.fromFEN(fen);assert(s,`${id}: FEN parses`);
  const moves=movesS.split(' ');assert(moves.length>=2,`${id}: setup + solution`);
  for(const u of moves){const n=C.make(s,u);assert(n,`${id}: ${u} legal`);s=n}
}
assert(themes.size>=6,`expected broad imported theme coverage, got ${themes.size}`);
for(const theme of ['Mate','Fork','Pin','Skewer'])assert(themes.has(theme),`import pack missing core theme ${theme}`);
const combined=new Set([...themes.keys(),...curated.PUZZLES.map(x=>x.theme)]);
for(const theme of ['Mate','Fork','Pin','Skewer','Hanging piece','Deflection','Removing defender','Defense','Discovered attack'])assert(combined.has(theme),`combined training bank missing ${theme}`);
assert(Math.min(...ratings)<=700,'beginner puzzles present');assert(Math.max(...ratings)>=2000,'advanced puzzles present');
console.log(`Puzzle V16 tests passed: ${pack.length} validated Lichess CC0 positions across ${themes.size} imported themes, with full curated motif coverage.`);
