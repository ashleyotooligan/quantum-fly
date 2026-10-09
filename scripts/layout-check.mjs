/** Check whole-canvas text bounds without editing pixels or model state. */
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {createLab} from '../src/lab/laboratory.mjs';
import {renderLab} from '../src/view/render.mjs';
import {SCENES} from '../src/view/scenes.mjs';
const n=createRequire(import.meta.url)('@napi-rs/canvas');
n.GlobalFonts.registerFromPath('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf','DejaVu Sans');n.GlobalFonts.registerFromPath('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf','DejaVu Sans Mono');
const root=new URL('../',import.meta.url),art={};
for(const [key,path] of Object.entries({fly:'assets/art/holographic-fly.png',pixel:'assets/brand/pixel-fly.png',macro:'assets/art/fly-macro.png'}))art[key]=await n.loadImage(new URL(path,root).pathname);
const lab=createLab({},art),raw=n.createCanvas(1600,1000).getContext('2d'),bad=[];let scene='';
const ctx=new Proxy(raw,{get(target,key){if(key==='fillText')return (t,x,y,...args)=>{const width=target.measureText(String(t)).width;if(x<0||x+width>1590||y<0||y>980)bad.push({scene,t,x,y,width});return target.fillText(t,x,y,...args);};const v=Reflect.get(target,key);return typeof v==='function'?v.bind(target):v;},set(target,key,value){target[key]=value;return true;}});
const before=JSON.stringify(lab.sim.latest);
for(const s of SCENES){scene=s.id;renderLab(ctx,lab,s.id);}
assert.deepEqual(bad,[],'text exceeds viewport');assert.equal(JSON.stringify(lab.sim.latest),before,'rendering mutated model');console.log('All 14 view text bounds checked; rendering leaves model unchanged.');
