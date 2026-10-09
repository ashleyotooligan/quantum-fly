import {createLab} from '../lab/laboratory.mjs';
import {renderLab} from './render.mjs';
import {SCENES} from './scenes.mjs';
import {step,runSimulation,checkpoint,restoreCheckpoint} from '../core/simulation.mjs';
const $=id=>document.getElementById(id);
const assetPaths={fly:'assets/art/holographic-fly.png',pixel:'assets/brand/pixel-fly.png',macro:'assets/art/fly-macro.png'};
let lab,scene='observatory',playing=false,lastTime=0;
const canvas=$('lab'),ctx=canvas.getContext('2d');
function updateView() {renderLab(ctx,lab,scene);$('status').textContent=`Seed ${lab.sim.config.seed} · tick ${lab.sim.tick} · ${lab.sim.config.mode}`;}
function settings() {return {seed:Number($('seed').value),phase:Number($('phase').value),dephasing:Number($('gamma').value),mode:$('mode').value,lesion:$('lesion').checked,steps:640};}
function loadArt(name,path) {return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve([name,img]);img.onerror=()=>reject(new Error('Artwork missing: '+path));img.src=globalThis.QF_ASSETS?.[name]??path;});}
function resetRun() {try {lab.sim=runSimulation(settings());updateView();$('error').textContent='';}catch(e){$('error').textContent=e.message;}}
function saveJson() {const data=JSON.stringify(checkpoint(lab.sim),null,2),url=URL.createObjectURL(new Blob([data],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=`quantum-fly-seed-${lab.sim.config.seed}-tick-${lab.sim.tick}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
async function importJson(event) {
  try {const file=event.target.files?.[0];if(!file)return;if(file.size>2_000_000)throw new Error('Checkpoint exceeds 2 MB');const next=restoreCheckpoint(JSON.parse(await file.text()));lab.sim=next;step(lab.sim);playing=false;$('play').textContent='Play';$('seed').value=String(next.config.seed);$('phase').value=String(next.config.phase);$('gamma').value=String(next.config.dephasing);$('mode').value=next.config.mode;$('lesion').checked=next.config.lesion;updateView();$('error').textContent='';}
  catch(e){$('error').textContent='Import failed: '+e.message;}
}
function animate(t) {if(playing&&t-lastTime>=80){step(lab.sim);lastTime=t;updateView();}requestAnimationFrame(animate);}
async function boot() {
  try {
    const art=Object.fromEntries(await Promise.all(Object.entries(assetPaths).map(([n,p])=>loadArt(n,p))));
    lab=createLab({},art);
    for(const s of SCENES){const o=document.createElement('option');o.value=s.id;o.textContent=s.title;$('scene').appendChild(o);}
    $('scene').addEventListener('change',()=>{scene=$('scene').value;updateView();});
    canvas.addEventListener('click',e=>{const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)*1600/r.width,y=(e.clientY-r.top)*1000/r.height;if(x<218&&y>=175&&y<777){const i=Math.floor((y-175)/43);if(SCENES[i]){scene=SCENES[i].id;$('scene').value=scene;updateView();}}});
    $('play').addEventListener('click',()=>{playing=!playing;$('play').textContent=playing?'Pause':'Play';});
    $('step').addEventListener('click',()=>{step(lab.sim);updateView();});
    $('reset').addEventListener('click',resetRun);$('export').addEventListener('click',saveJson);$('import').addEventListener('change',importJson);
    ['phase','gamma','mode','lesion'].forEach(id=>$(id).addEventListener('change',resetRun));
    $('seed').addEventListener('change',resetRun);
    $('capture').addEventListener('click',()=>{const a=document.createElement('a');a.download=`quantum-fly-${scene}.png`;a.href=canvas.toDataURL('image/png');a.click();});
    window.addEventListener('keydown',e=>{if(/INPUT|SELECT/.test(e.target.tagName))return;if(e.code==='Space'){e.preventDefault();$('play').click();}if(e.key==='ArrowRight')$('step').click();});
    updateView();$('loading').hidden=true;requestAnimationFrame(animate);
    globalThis.QF_TEST={getLab:()=>lab,setScene:id=>{scene=id;updateView();},resetRun};
  } catch(e){$('error').textContent=e.message;$('loading').textContent='The lab could not start. Check the art paths or open Quantum-Fly.html.';}
}
boot();
