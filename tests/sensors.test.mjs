import test from 'node:test';
import assert from 'node:assert/strict';
import {sense} from '../src/core/sensors.mjs';
import {initialBody,odorAt,WORLD} from '../src/core/world.mjs';
import {validateConfig} from '../src/core/config.mjs';
test('the twelve sensor channels are finite and normalized',()=>{for(let i=0;i<80;i++){const b=initialBody(i);b.heading=i/7;const s=sense(b,i,0);assert.equal(s.values.length,12);assert.ok(s.values.every(v=>Number.isFinite(v)&&v>=0&&v<=1));}});
test('odor is strongest at the defined source relative to a distant point',()=>{assert.ok(odorAt(WORLD.source.x,WORLD.source.y)>odorAt(40,40));});
test('configuration rejects invalid seeds, phase, modes, and channel strengths',()=>{for(const c of [{seed:1.5},{seed:-1},{phase:Infinity},{dephasing:1.1},{mode:'hardware'},{steps:0},{lesion:'yes'}])assert.throws(()=>validateConfig(c));assert.equal(validateConfig({seed:0}).seed,0);});
