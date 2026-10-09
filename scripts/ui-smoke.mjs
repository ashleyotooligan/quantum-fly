/** Native Canvas + DOM harness, not a browser-engine integration test. */
import {createRequire} from 'node:module';
import {readFile} from 'node:fs/promises';
import {Script,createContext} from 'node:vm';
import assert from 'node:assert/strict';
const {createCanvas,Image,GlobalFonts}=createRequire(import.meta.url)('@napi-rs/canvas');
GlobalFonts.registerFromPath('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf','DejaVu Sans');GlobalFonts.registerFromPath('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf','DejaVu Sans Mono');
class Element {
  constructor(id,tagName='INPUT'){this.id=id;this.tagName=tagName;this.value='';this.textContent='';this.checked=false;this.hidden=false;this.handlers={};this.children=[];}
  addEventListener(type,fn){(this.handlers[type]??=[]).push(fn);}
  appendChild(e){this.children.push(e);}
  async fire(type,event={}){for(const fn of this.handlers[type]??[])await fn({target:this,...event});}
  click(){return this.fire('click');}
}
const ids=['scene','play','step','reset','seed','mode','phase','gamma','lesion','export','import','capture','status','error','loading'];
const elements=Object.fromEntries(ids.map(id=>[id,new Element(id)]));
for(const [id,v] of Object.entries({seed:'41',phase:'0',gamma:'0',mode:'coherent'}))elements[id].value=v;
const canvas=createCanvas(1600,1000);canvas.handlers={};canvas.addEventListener=Element.prototype.addEventListener;canvas.fire=Element.prototype.fire;canvas.getBoundingClientRect=()=>({left:0,top:0,width:1600,height:1000});elements.lab=canvas;
const urls=[];const document={getElementById:id=>elements[id],createElement:tag=>new Element('',tag.toUpperCase())};
const ctx=createContext({document,window:{addEventListener(){}},Image,console,structuredClone,Blob,URL:{createObjectURL:b=>{urls.push(b);return 'blob:test';},revokeObjectURL(){}},setTimeout,requestAnimationFrame(){}});
const html=await readFile(new URL('../Quantum-Fly.html',import.meta.url),'utf8'),js=html.match(/<script>([\s\S]*?)<\/script>/)[1];new Script(js).runInContext(ctx,{timeout:15000});
for(let i=0;i<200&&!ctx.QF_TEST;i++)await new Promise(r=>setTimeout(r,10));
assert.ok(ctx.QF_TEST,'boot did not complete');assert.equal(elements.error.textContent,'');assert.equal(elements.scene.children.length,14);assert.equal(ctx.QF_TEST.getLab().sim.tick,640);
for(const option of elements.scene.children)ctx.QF_TEST.setScene(option.value);
await elements.step.click();assert.equal(ctx.QF_TEST.getLab().sim.tick,641);
elements.mode.value='classical';await elements.mode.fire('change');assert.equal(ctx.QF_TEST.getLab().sim.config.mode,'classical');
elements.phase.value='1.2';elements.gamma.value='0.35';elements.lesion.checked=true;await elements.reset.click();assert.equal(ctx.QF_TEST.getLab().sim.config.phase,1.2);assert.equal(ctx.QF_TEST.getLab().sim.config.lesion,true);
await elements.export.click();assert.equal(urls.length,1);const data=JSON.parse(await urls[0].text());assert.equal(data.schema,'quantum-fly/checkpoint/1');
elements.import.files=[{size:50000,text:async()=>JSON.stringify(data)}];await elements.import.fire('change');assert.equal(ctx.QF_TEST.getLab().sim.tick,641);assert.equal(elements.error.textContent,'');
await canvas.fire('click',{clientX:90,clientY:235});assert.equal(elements.scene.value,'specimen');
elements.seed.value='-1';await elements.reset.click();assert.match(elements.error.textContent,/seed/);
console.log('Native Canvas/DOM smoke passed: boot, 14 views, step, settings, reset, checkpoint export/import, sidebar, invalid input.');
