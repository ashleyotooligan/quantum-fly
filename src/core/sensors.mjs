import {WORLD,odorAt} from './world.mjs';
import {clamp} from './random.mjs';
export function sense(body,t,previousOdor=0) {
  const point=(angle,d=22)=>({x:body.x+Math.cos(body.heading+angle)*d,y:body.y+Math.sin(body.heading+angle)*d});
  const left=point(-0.62),right=point(0.62),middle=odorAt(body.x,body.y,t);
  const wall=p=>{
    let d=Math.min(p.x,p.y,WORLD.width-p.x,WORLD.height-p.y);
    for(const o of WORLD.obstacles) d=Math.min(d,Math.hypot(p.x-o.x,p.y-o.y)-o.r);
    return clamp(1-d/65);
  };
  const light=p=>clamp(0.5+0.45*Math.sin(p.x/160+t/180));
  return {values:[odorAt(left.x,left.y,t),odorAt(right.x,right.y,t),clamp(0.5+(middle-previousOdor)*20),light(left),light(right),wall(point(-0.6,40)),wall(point(0.6,40)),body.speed/3.6,body.energy,0.5+Math.sin(body.heading)/2,0.5+Math.cos(body.heading)/2,0.5+Math.sin(t/20)/2],odor:middle,left,right};
}
