import {clamp,wrap} from './random.mjs';
export const WORLD = Object.freeze({width:720,height:440,source:{x:558,y:214},radius:28,obstacles:[{x:325,y:133,r:32},{x:343,y:319,r:41}]});
export function odorAt(x,y,t=0) {
  const dx=(x-WORLD.source.x)/235,dy=(y-WORLD.source.y)/88;
  return clamp(Math.exp(-0.5*(dx*dx+dy*dy))*(0.91+0.09*Math.cos(y/35+t/80)));
}
export function initialBody(seed) { return {x:115,y:192+(seed%7)*8,heading:0,energy:1,speed:0,contacts:0,visits:0,travel:0,inside:false}; }
export function moveBody(body,action,clock) {
  const before={x:body.x,y:body.y};
  if(action===1) body.heading=wrap(body.heading-0.27);
  if(action===2) body.heading=wrap(body.heading+0.27);
  body.speed=action===0?3.6:action===3?0:1.55;
  body.x=clamp(body.x+Math.cos(body.heading)*body.speed,14,WORLD.width-14);
  body.y=clamp(body.y+Math.sin(body.heading)*body.speed,14,WORLD.height-14);
  let collision=body.x===14||body.y===14||body.x===WORLD.width-14||body.y===WORLD.height-14;
  for(const o of WORLD.obstacles) {
    const dx=body.x-o.x,dy=body.y-o.y,d=Math.hypot(dx,dy);
    if(d<o.r+10) {const a=d?Math.atan2(dy,dx):body.heading+Math.PI;body.x=o.x+Math.cos(a)*(o.r+10);body.y=o.y+Math.sin(a)*(o.r+10);collision=true;}
  }
  if(collision) {body.contacts++;body.heading=wrap(body.heading+0.71);}
  body.travel+=Math.hypot(body.x-before.x,body.y-before.y);
  const inside=Math.hypot(body.x-WORLD.source.x,body.y-WORLD.source.y)<WORLD.radius;
  if(inside&&!body.inside) body.visits++;
  body.inside=inside;
  body.energy=clamp(body.energy-0.00036*body.speed+(inside?0.008:0));
  return {collision,inside,clock};
}
