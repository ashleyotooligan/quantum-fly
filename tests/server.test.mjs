import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
test('loopback launcher serves source/art and rejects traversal, missing paths, and writes',{timeout:5000},async()=>{
  const child=spawn(process.execPath,['scripts/serve.mjs'],{cwd:fileURLToPath(new URL('../',import.meta.url)),env:{...process.env,QF_PORT:'0'},stdio:['ignore','pipe','pipe']});
  try{
    const base=await new Promise((resolve,reject)=>{child.stdout.once('data',b=>resolve(b.toString().match(/http:\/\/127\.0\.0\.1:\d+/)[0]));child.once('error',reject);child.once('exit',code=>{if(code)reject(new Error('Server exited '+code));});});
    const root=await fetch(base+'/');assert.equal(root.status,200);assert.match(await root.text(),/Quantum Fly/);
    const mod=await fetch(base+'/src/view/app.mjs');assert.equal(mod.status,200);assert.match(mod.headers.get('content-type'),/javascript/);
    const png=await fetch(base+'/assets/brand/pixel-fly.png');assert.equal(png.status,200);assert.equal(png.headers.get('content-type'),'image/png');
    assert.equal((await fetch(base+'/missing.png')).status,404);
    assert.equal((await fetch(base+'/%2e%2e%2fREADME.md')).status,403);
    assert.equal((await fetch(base+'/',{method:'POST'})).status,405);
    assert.equal((await fetch(base+'/src/')).status,404);
  }finally{child.kill();}
});
