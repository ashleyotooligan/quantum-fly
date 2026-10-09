import test from 'node:test';
import assert from 'node:assert/strict';
import {createNetwork,neuralStep} from '../src/core/neural.mjs';
test('synthetic network wiring is reproducible and changes with seed',()=>{assert.deepEqual(createNetwork(41),createNetwork(41));assert.notDeepEqual(createNetwork(41).links,createNetwork(42).links);});
test('spikes reset potential and produce a two-tick refractory period',()=>{const n=createNetwork();n.links=[];n.v[0]=0.99;let f=neuralStep(n,Array(12).fill(1));assert.equal(f.spikes[0],1);assert.equal(n.v[0],0);for(let i=0;i<2;i++){f=neuralStep(n,Array(12).fill(1));assert.equal(f.spikes[0],0);assert.equal(n.v[0],0);}f=neuralStep(n,Array(12).fill(1));assert.ok(n.v[0]>0);});
test('recurrent lesion silences exactly the designated group',()=>{const n=createNetwork();for(let t=0;t<30;t++)neuralStep(n,Array(12).fill(1),true);assert.ok(n.rate.slice(0,16).some(v=>v>0));assert.ok(n.rate.slice(32).some(v=>v>0));assert.ok(n.rate.slice(16,32).every(v=>v===0));});
test('48 units remain finite and bounded over repeated spikes',()=>{const n=createNetwork();for(let t=0;t<200;t++){const f=neuralStep(n,Array(12).fill(0.8));assert.equal(f.spikes.length,48);assert.ok(f.v.every(v=>v>=0&&v<1));assert.ok(f.rates.every(v=>v>=0&&v<=1));}});
