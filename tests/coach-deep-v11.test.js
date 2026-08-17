'use strict';
const assert=require('assert');
const K=require('../coach-core.js');
const games=[{id:'g1',review:{moves:[{side:'w',moveNo:5,loss:20,explain:'good'}],deepRows:[{side:'w',moveNo:7,loss:260,theme:'missed-tactic',explain:'tactic'}]}}];
const model=K.skillScores({games,puzzleStats:{},openingStats:{},lessonProgress:{}});
assert.equal(model.rows,1,'deep review should replace shallow rows for the same game');
assert(model.scores.tactics<40,'deep tactical miss must lower tactics score');
assert(model.scores.calculation<40,'deep tactical miss must lower calculation score');
console.log('Coach V11 deep-review integration passed.');
