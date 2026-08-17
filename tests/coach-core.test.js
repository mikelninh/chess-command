'use strict';
const assert=require('assert');
const K=require('../coach-core.js');
const games=[{review:{moves:[
 {side:'w',moveNo:3,loss:20,classification:'Good',explain:'Develop a minor piece.'},
 {side:'w',moveNo:7,loss:260,classification:'Blunder',explain:'The capture looks tempting, but calculate one reply further.'},
 {side:'w',moveNo:26,loss:180,classification:'Mistake',explain:'Endgame conversion was inaccurate.'}
]}}];
const model=K.skillScores({games,puzzleStats:{Fork:{attempts:4,correct:2}},openingStats:{attempts:4,correct:3},lessonProgress:{}});
assert(model.scores.calculation<80,'blunders must lower calculation score');
assert(model.scores.tactics<80,'weak tactical evidence must lower tactics score');
assert(model.confidence.opening>0,'opening confidence must be tracked');
let r=K.recommendation({rating:650,goal:1000,scores:model.scores,due:3,personalPuzzles:2});
assert.equal(r.kind,'opening','due spaced repetition must take priority');
r=K.recommendation({rating:650,goal:1000,scores:{opening:80,tactics:35,calculation:40,development:75,kingSafety:70,endgame:65},due:0,personalPuzzles:2});
assert.equal(r.kind,'personal','personal mistakes should be preferred for tactical/calculation weakness');
const o=K.opponentSummary([{opening:'Sicilian Defence'},{opening:'Italian Game'},{opening:'Sicilian Defence'}]);
assert.equal(o.topOpening,'Sicilian Defence');assert.equal(o.topCount,2);
const now=new Date('2026-08-17T10:00:00Z');const days={'2026-08-17':{games:1},'2026-08-16':{puzzles:2},'2026-08-15':{openings:1}};
assert.equal(K.streak(days,now),3,'streak should count consecutive active days');
console.log('Coach V10 tests passed: weakness model, adaptive priority, opponent prep and memory streak.');
