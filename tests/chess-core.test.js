'use strict';
const assert=require('assert');
const C=require('../chess-core.js');
function perft(s,d){if(d===0)return 1;let n=0;for(const m of C.legalMoves(s)){const next=C.make(s,C.moveUci(m));n+=perft(next,d-1)}return n}
let s=C.start();
assert.equal(C.legalMoves(s).length,20,'start position must have 20 legal moves');
assert.equal(perft(s,2),400,'start perft depth 2');
assert.equal(perft(s,3),8902,'start perft depth 3');
const e4=C.legalMoves(s,'e2').find(m=>m.to==='e4');assert.equal(C.san(s,e4),'e4','SAN e4');
s=C.make(s,'e2e4');assert(s,'e2e4 must be legal');assert.equal(s.turn,'b');assert.equal(C.legalMoves(s).length,20);
s=C.make(s,'e7e5');s=C.make(s,'g1f3');s=C.make(s,'b8c6');s=C.make(s,'f1c4');assert(s,'Italian line should be legal');
let ep=C.fromFEN('8/8/8/3pP3/8/8/8/4K2k w - d6 0 1');assert(C.legalMoves(ep,'e5').some(m=>m.to==='d6'&&m.ep),'en passant must be generated');
let castle=C.fromFEN('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1');const km=C.legalMoves(castle,'e1');assert(km.some(m=>m.castle==='K'),'white kingside castle');assert(km.some(m=>m.castle==='Q'),'white queenside castle');assert.equal(C.san(castle,km.find(m=>m.castle==='K')),'O-O','castle SAN');
let mate=C.fromFEN('7k/6Q1/6K1/8/8/8/8/8 b - - 0 1');assert(C.status(mate).checkmate,'checkmate detection');
const line=['e2e4','e7e5','g1f3','b8c6','f1c4'];const pgn=C.pgnFromMoves(line,{White:'Michael',Black:'Practice Bot'});assert(pgn.includes('1. e4 e5 2. Nf3 Nc6 3. Bc4'),'PGN must use SAN');const parsed=C.parsePgn(pgn);assert.deepEqual(parsed.moves,line,'PGN must round-trip opening line');assert.equal(parsed.errors.length,0,'PGN parse should not error');
console.log('Chess core tests passed: legal moves, perft 20/400/8902, en passant, castling, checkmate, SAN and PGN roundtrip.');
