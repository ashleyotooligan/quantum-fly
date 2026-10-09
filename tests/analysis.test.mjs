import test from 'node:test';
import assert from 'node:assert/strict';
import {noiseSweep,phaseSweep,FIXED_PARAMS,summarize} from '../src/lab/analysis.mjs';
import {runSimulation} from '../src/core/simulation.mjs';
test('phase sweep covers both endpoints and probabilities remain normalized',()=>{const p=phaseSweep(FIXED_PARAMS);assert.equal(p.length,65);assert.equal(p[0].phi,-Math.PI);assert.equal(p.at(-1).phi,Math.PI);p.forEach(v=>assert.ok(Math.abs(v.p.reduce((a,b)=>a+b,0)-1)<1e-10));});
test('partial dephasing decreases purity monotonically for the fixed circuit',()=>{const p=noiseSweep(FIXED_PARAMS);for(let i=1;i<p.length;i++)assert.ok(p[i].purity<=p[i-1].purity+1e-10);assert.ok(p.at(-1).purity<1);});
test('short-run report records a missing source visit as null',()=>{const r=summarize(runSimulation({steps:1}));assert.equal(r.firstVisitTick,null);assert.equal(r.steps,1);assert.equal(r.actions.reduce((a,b)=>a+b,0),1);});
