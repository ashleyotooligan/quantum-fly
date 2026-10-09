import {randomStream,clamp,average} from './random.mjs';
export const GROUPS=[{name:'sensory',start:0,end:16,color:'#64dcff'},{name:'recurrent',start:16,end:32,color:'#b496ff'},{name:'motor',start:32,end:48,color:'#ffbc82'}];
/** 48 synthetic discrete-time leaky integrate-and-fire units; not anatomical cells. */
export function createNetwork(seed=41) {
  const r=randomStream(seed^0x7f4a7c15);
  const links=[];
  for(let to=0;to<48;to++) for(let from=0;from<48;from++) {
    if(from===to)continue;
    const same=Math.floor(to/16)===Math.floor(from/16);
    const forward=Math.floor(to/16)===Math.floor(from/16)+1;
    if(r.next()<(same?0.10:forward?0.17:0.015)) links.push({from,to,weight:(r.next()<0.18?-1:1)*(0.045+r.next()*0.07)});
  }
  return {v:Array.from({length:48},()=>r.next()*0.3),rate:Array(48).fill(0),spikes:Array(48).fill(0),refractory:Array(48).fill(0),links};
}
export function neuralStep(net,inputs,lesion=false) {
  const old=net.spikes.slice(),next=[];
  for(let i=0;i<48;i++) {
    const group=Math.floor(i/16),input=inputs[i%12];
    let drive=group===0?0.10+0.31*input:group===1?0.11+0.16*input:0.10+0.20*input;
    for(const e of net.links) if(e.to===i) drive+=e.weight*old[e.from];
    if(lesion&&group===1) {net.v[i]=0;net.rate[i]=0;next[i]=0;continue;}
    if(net.refractory[i]>0) {net.refractory[i]--;net.v[i]=0;next[i]=0;}
    else {net.v[i]=Math.max(0,0.83*net.v[i]+drive);next[i]=Number(net.v[i]>=1);if(next[i]) {net.v[i]=0;net.refractory[i]=2;}}
    net.rate[i]=0.9*net.rate[i]+0.1*next[i];
  }
  net.spikes=next;
  return {spikes:next.slice(),v:net.v.slice(),rates:net.rate.slice(),groups:GROUPS.map(g=>average(net.rate.slice(g.start,g.end))),motor:net.rate.slice(32)};
}
export function encodeCircuit(s,n,phase=0) {
  const contrast=clamp((s.values[1]-s.values[0])*7,-1,1);
  const wall=s.values[5]-s.values[6];
  return {theta0:Math.PI*(0.32+0.3*s.values[0]+0.12*n.groups[1]),theta1:Math.PI*(0.18+0.32*s.values[1]+0.2*n.groups[2]),phi:phase+contrast*2.4+wall*0.7,readout:Math.PI*(0.1+0.18*n.groups[2])};
}
