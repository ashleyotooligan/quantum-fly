import {readFile,readdir,stat} from 'node:fs/promises';
import {resolve,dirname,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {Script} from 'node:vm';
const root=fileURLToPath(new URL('../',import.meta.url)),files=[];
async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){if(e.name==='node_modules'||e.name==='.git')continue;const p=resolve(dir,e.name);e.isDirectory()?await walk(p):files.push(p);}}
await walk(root);let links=0,pngs=0;
for(const f of files){
  if(extname(f)==='.mjs'){const r=spawnSync(process.execPath,['--check',f],{encoding:'utf8'});if(r.status!==0)throw new Error(r.stderr);}
  if(extname(f)==='.json')JSON.parse(await readFile(f,'utf8'));
  if(extname(f)==='.png'){const b=await readFile(f);if(b.toString('hex',0,8)!=='89504e470d0a1a0a')throw new Error('Invalid PNG '+f);if(f.includes('/screenshots/')&&(b.readUInt32BE(16)!==1600||b.readUInt32BE(20)!==1000))throw new Error('Screenshot dimensions '+f);pngs++;}
  if(extname(f)==='.md'||extname(f)==='.html'){
    const t=await readFile(f,'utf8'),refs=[...t.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g),...t.matchAll(/(?:src|href)="([^"\n]+)"/g)].map(m=>m[1]);
    for(const ref of refs){if(/^(?:https?:|data:|#|mailto:)/.test(ref))continue;const path=decodeURIComponent(ref.split('#')[0]);if(!path)continue;await stat(resolve(dirname(f),path)).catch(()=>{throw new Error(`Missing link ${ref} in ${f}`);});links++;}
  }
}
const html=await readFile(resolve(root,'Quantum-Fly.html'),'utf8');for(const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new Script(m[1]);
if(files.length>100)throw new Error('Archive exceeds the browser upload guide\'s 100-file budget');
console.log(JSON.stringify({files:files.length,relativeLinks:links,pngs,standaloneSyntax:'valid'},null,2));
