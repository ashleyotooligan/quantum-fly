/** Same renderer as the browser. Optional local dependency: @napi-rs/canvas@0.1.100. */
import {createRequire} from 'node:module';
import {writeFile,mkdir} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {createLab} from '../src/lab/laboratory.mjs';
import {renderLab} from '../src/view/render.mjs';
import {SCENES} from '../src/view/scenes.mjs';
const require=createRequire(import.meta.url);
let native;
try{native=require('@napi-rs/canvas');}catch{throw new Error('Screenshots only: install npm install --no-save @napi-rs/canvas@0.1.100 first. The demo and tests need no packages.');}
for(const [path,family] of [['/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf','DejaVu Sans'],['/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf','DejaVu Sans Mono']]) if(existsSync(path))native.GlobalFonts.registerFromPath(path,family);
const root=new URL('../',import.meta.url),art={};
for(const [name,path] of Object.entries({fly:'assets/art/holographic-fly.png',pixel:'assets/brand/pixel-fly.png',macro:'assets/art/fly-macro.png'}))art[name]=await native.loadImage(new URL(path,root).pathname);
const lab=createLab({},art),canvas=native.createCanvas(1600,1000),ctx=canvas.getContext('2d');
await mkdir(new URL('assets/screenshots/',root),{recursive:true});
for(const [i,s] of SCENES.entries()) {renderLab(ctx,lab,s.id);const name=`${String(i+1).padStart(2,'0')}-${s.id}.png`;await writeFile(new URL('assets/screenshots/'+name,root),canvas.toBuffer('image/png'));console.log(name);}
