'use strict';
const assert=require('assert');
const C=require('../chess-core.js');
const V=require('../puzzle-pack-v15.js');
assert(V.PACK.length>=60,'V15 should expand the offline tactical bank substantially');
const ids=new Set();for(const p of V.PACK){assert(!ids.has(p.id),`duplicate id ${p.id}`);ids.add(p.id);let s=C.fromFEN(p.fen);assert(s,`${p.id}: transformed FEN must parse`);for(const u of p.line||[]){const n=C.make(s,u);assert(n,`${p.id}: transformed move ${u} must remain legal`);s=n}}
assert.equal(V.mapUci('e2e4','h'),'d2d4','horizontal UCI mirror');
assert.equal(V.mapUci('e2e4','rs'),'d7d5','rotated/color-swapped UCI map');
console.log(`Puzzle V15 pack tests passed: ${V.PACK.length} legal offline tactical positions.`);
