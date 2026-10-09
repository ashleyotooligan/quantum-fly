import {average} from '../core/random.mjs';
import {WORLD} from '../core/world.mjs';
import {decisionCircuit} from '../quantum/circuit.mjs';
export function summarize(sim) {
  const frames=sim.frames,first=frames.find(f=>f.body.inside);
  return {seed:sim.config.seed,mode:sim.config.mode,steps:sim.tick,visits:sim.body.visits,firstVisitTick:first?.tick??null,finalDistance:Math.hypot(sim.body.x-WORLD.source.x,sim.body.y-WORLD.source.y),pathLength:sim.body.travel,contacts:sim.body.contacts,meanOdor:average(frames.map(f=>f.sensors.odor)),meanPurity:average(frames.map(f=>f.circuit.purity)),spikeCount:frames.reduce((a,f)=>a+f.neural.spikes.reduce((b,s)=>b+s,0),0),actions:[0,1,2,3].map(a=>frames.filter(f=>f.action===a).length)};
}
export function phaseSweep(params,gamma=0,points=65) {
  return Array.from({length:points},(_,i)=>{const phi=-Math.PI+2*Math.PI*i/(points-1),c=decisionCircuit({...params,phi},gamma);return {phi,p:c.probabilities,purity:c.purity};});
}
export function noiseSweep(params) {return Array.from({length:21},(_,i)=>{const gamma=i/20,c=decisionCircuit(params,gamma);return {gamma,p:c.probabilities,purity:c.purity};});}
export const FIXED_PARAMS={theta0:1.3,theta1:0.7,phi:0.65,readout:0.8};
