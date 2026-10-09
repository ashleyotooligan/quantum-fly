import {PALETTE,textAt,line,dot,panel,curve,grid,glow} from './primitives.mjs';
import {WORLD,odorAt} from '../core/world.mjs';
import {ACTIONS,ACTION_COLORS,INPUT_NAMES} from '../core/config.mjs';
import {GROUPS} from '../core/neural.mjs';
export function arenaPlot(c,sim,x,y,w,h,other=null) {
  const size=Math.min(w/WORLD.width,h/WORLD.height);x+=(w-WORLD.width*size)/2;y+=(h-WORLD.height*size)/2;w=WORLD.width*size;h=WORLD.height*size;
  const sx=size,sy=size;
  c.save();c.beginPath();c.roundRect(x,y,w,h,10);c.clip();c.fillStyle='#070e18';c.fillRect(x,y,w,h);
  for(let i=0;i<WORLD.width;i+=12)for(let j=0;j<WORLD.height;j+=12){c.fillStyle=`rgba(72,209,234,${odorAt(i,j,sim.tick)*0.29})`;c.fillRect(x+i*sx,y+j*sy,12*sx,12*sy);}
  for(let i=0;i<=WORLD.width;i+=60)line(c,x+i*sx,y,x+i*sx,y+h,'#21324855');
  for(let j=0;j<=WORLD.height;j+=55)line(c,x,y+j*sy,x+w,y+j*sy,'#21324855');
  for(const o of WORLD.obstacles){dot(c,x+o.x*sx,y+o.y*sy,o.r*sx,'#182637');c.strokeStyle='#56718b';c.lineWidth=1;c.stroke();}
  const px=x+WORLD.source.x*sx,py=y+WORLD.source.y*sy;glow(c,px,py,80, '#64dcff22');
  dot(c,px,py,WORLD.radius*sx,'#64dcff0c');c.strokeStyle=PALETTE.cyan;c.lineWidth=1.4;c.stroke();dot(c,px,py,5,PALETTE.cyan);
  const trail=(s,color)=>{c.beginPath();s.frames.forEach((f,i)=>{const bx=x+f.body.x*sx,by=y+f.body.y*sy;i?c.lineTo(bx,by):c.moveTo(bx,by);});c.strokeStyle=color;c.lineWidth=2.2;c.stroke();};
  if(other)trail(other,PALETTE.violet);trail(sim,PALETTE.cyan);
  if(other)dot(c,x+other.body.x*sx,y+other.body.y*sy,6,PALETTE.violet);
  c.translate(x+sim.body.x*sx,y+sim.body.y*sy);c.rotate(sim.body.heading);
  c.fillStyle='#c2efff';c.beginPath();c.ellipse(-5,-7,13,5,0.55,0,Math.PI*2);c.ellipse(-5,7,13,5,-0.55,0,Math.PI*2);c.fill();
  c.fillStyle='#45a7c7';c.beginPath();c.ellipse(-6,0,10,5,0,0,Math.PI*2);c.fill();dot(c,5,-3,4,PALETTE.violet);dot(c,5,3,4,PALETTE.violet);
  c.restore();textAt(c,'ODOR SOURCE',px+16,py-38,12,PALETTE.cyan,true);
}
export function probabilityPlot(c,p,x,y,w,h,active=null) {
  const gap=h/4;
  p.forEach((v,i)=>{const yy=y+i*gap;textAt(c,`|${i.toString(2).padStart(2,'0')}> ${ACTIONS[i]}`,x,yy,17,active===i?PALETTE.ink:PALETTE.muted,true);c.fillStyle='#172539';c.fillRect(x,yy+28,w-85,12);c.fillStyle=ACTION_COLORS[i];c.fillRect(x,yy+28,(w-85)*v,12);textAt(c,(v*100).toFixed(1)+'%',x+w-74,yy+21,18,ACTION_COLORS[i],true);});
}
export function rasterPlot(c,frames,x,y,w,h) {
  const data=frames.slice(-180),rh=h/48;
  GROUPS.forEach(g=>{c.fillStyle=g.color+'09';c.fillRect(x,y+g.start*rh,w,16*rh);textAt(c,String(g.start).padStart(2,'0'),x-32,y+g.start*rh,12,g.color,true);});
  for(let i=0;i<=6;i++){const xx=x+i*w/6;line(c,xx,y,xx,y+h,'#22344b77');textAt(c,String(Math.max(0,(data[0]?.tick??0)+Math.round(i*(data.length-1)/6))),xx,y+h+15,12,PALETTE.muted,true);}
  data.forEach((f,t)=>f.neural.spikes.forEach((v,n)=>{if(v){c.fillStyle=GROUPS[Math.floor(n/16)].color;c.fillRect(x+t*w/data.length,y+n*rh,Math.max(2,w/data.length),Math.max(2,rh*0.65));}}));
}
export function networkPlot(c,sim,x,y,w,h) {
  const loc=Array.from({length:48},(_,i)=>{const g=Math.floor(i/16),a=(i%16)/16*Math.PI*2;return {x:x+w*(0.20+g*0.30)+Math.cos(a)*(w*0.13),y:y+h*0.50+Math.sin(a)*h*0.32};});
  for(const e of sim.network.links){const a=loc[e.from],b=loc[e.to];line(c,a.x,a.y,b.x,b.y,e.weight<0?'#ffbc8228':'#5da6ca24',1);}
  loc.forEach((p,i)=>{const g=GROUPS[Math.floor(i/16)],r=sim.latest.neural.rates[i];if(sim.latest.neural.spikes[i])glow(c,p.x,p.y,22,g.color+'55');dot(c,p.x,p.y,4+r*17,g.color);textAt(c,String(i).padStart(2,'0'),p.x+7,p.y-8,10,PALETTE.muted,true);});
  GROUPS.forEach((g,i)=>{textAt(c,g.name.toUpperCase(),x+w*(0.20+i*0.30)-48,y+h-23,13,g.color,true);});
}
export function circuitPlot(c,q,x,y,w,h) {
  const x0=x+64,dx=(w-100)/7,ys=[y+h*0.35,y+h*0.7];
  ys.forEach((yy,i)=>{textAt(c,`q${i} |0>`,x,yy-8,17,PALETTE.muted,true);line(c,x0,yy,x+w,yy,PALETTE.muted,1.5);});
  const gate=(label,col,bit,color=PALETTE.cyan)=>{const xx=x0+col*dx;c.fillStyle='#0e2134';c.fillRect(xx-27,ys[bit]-24,54,48);c.strokeStyle=color;c.lineWidth=1.2;c.strokeRect(xx-27,ys[bit]-24,54,48);textAt(c,label,xx-20,ys[bit]-8,15,color,true);};
  gate('RY',0.5,0);gate('RY',0.5,1);const xx=x0+2*dx;line(c,xx,ys[0],xx,ys[1],PALETTE.violet,2);dot(c,xx,ys[0],5,PALETTE.violet);c.beginPath();c.arc(xx,ys[1],12,0,Math.PI*2);c.strokeStyle=PALETTE.violet;c.stroke();line(c,xx-8,ys[1],xx+8,ys[1],PALETTE.violet);line(c,xx,ys[1]-8,xx,ys[1]+8,PALETTE.violet);
  gate('RZ',3.2,0,PALETTE.violet);ys.forEach((_,i)=>gate('D',4.2,i,PALETTE.orange));gate('H',5.2,0);gate('RY',5.2,1);ys.forEach((_,i)=>gate('M',6.4,i,PALETTE.green));
  textAt(c,`theta0 ${q.params.theta0.toFixed(3)} / theta1 ${q.params.theta1.toFixed(3)}`,x+64,y+h-17,14,PALETTE.muted,true);
}
export function sweepPlot(c,points,x,y,w,h,key='phi') {
  grid(c,x,y,w,h);for(let a=0;a<4;a++)curve(c,points.map(p=>p.p[a]),x,y,w,h,ACTION_COLORS[a]);
  textAt(c,key==='phi'?'-pi':'0.00',x,y+h+16,13,PALETTE.muted,true);textAt(c,key==='phi'?'0':'0.50',x+w/2-10,y+h+16,13,PALETTE.muted,true);textAt(c,key==='phi'?'+pi':'1.00',x+w-26,y+h+16,13,PALETTE.muted,true);
}
export function sensorPlot(c,f,x,y,w,h) {
  const gap=h/12;
  f.sensors.values.forEach((v,i)=>{const yy=y+i*gap;textAt(c,INPUT_NAMES[i],x,yy,15,PALETTE.muted,true);c.fillStyle='#18273b';c.fillRect(x+170,yy+3,w-245,12);c.fillStyle=i<3?PALETTE.cyan:i<7?PALETTE.violet:PALETTE.orange;c.fillRect(x+170,yy+3,(w-245)*v,12);textAt(c,v.toFixed(3),x+w-61,yy,15,PALETTE.ink,true);});
}
