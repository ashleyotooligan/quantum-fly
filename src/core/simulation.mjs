import {randomStream} from './random.mjs';
import {validateConfig} from './config.mjs';
import {initialBody,moveBody} from './world.mjs';
import {sense} from './sensors.mjs';
import {createNetwork,neuralStep,encodeCircuit} from './neural.mjs';
import {classicalPolicy} from './baseline.mjs';
import {decisionCircuit,sampleBorn} from '../quantum/circuit.mjs';
export function createSimulation(options={}) {
  const config=validateConfig(options),rng=randomStream(config.seed^0xa53cb9),network=createNetwork(config.seed);
  return {config,rng,network,body:initialBody(config.seed),tick:0,previousOdor:0,frames:[],latest:null};
}
export function step(sim) {
  const sensors=sense(sim.body,sim.tick,sim.previousOdor);
  const neural=neuralStep(sim.network,sensors.values,sim.config.lesion);
  const params=encodeCircuit(sensors,neural,sim.config.phase);
  const gamma=sim.config.mode==='dephased'?1:sim.config.dephasing;
  const circuit=decisionCircuit(params,gamma);
  const p=sim.config.mode==='classical'?classicalPolicy(sensors,neural):circuit.probabilities;
  const uniform=sim.rng.next(),action=sampleBorn(p,uniform);
  const movement=moveBody(sim.body,action,sim.tick);
  sim.previousOdor=sensors.odor;sim.tick++;
  const frame={tick:sim.tick,body:{...sim.body},sensors,neural,circuit,probabilities:p.slice(),uniform,action,movement};
  sim.latest=frame;sim.frames.push(frame);if(sim.frames.length>1200)sim.frames.shift();
  return frame;
}
export function runSimulation(options={}) {
  const sim=createSimulation(options);for(let i=0;i<sim.config.steps;i++) step(sim);return sim;
}
export function checkpoint(sim) {return JSON.parse(JSON.stringify({schema:'quantum-fly/checkpoint/1',config:sim.config,tick:sim.tick,previousOdor:sim.previousOdor,body:sim.body,network:sim.network,randomState:sim.rng.state()}));}
export function restoreCheckpoint(saved) {
  if(saved.schema!=='quantum-fly/checkpoint/1'||!Number.isInteger(saved.tick)||saved.tick<0||saved.tick>20000) throw new Error('invalid checkpoint');
  if(!saved.network||saved.network.v?.length!==48||saved.network.rate?.length!==48||saved.network.spikes?.length!==48||saved.network.refractory?.length!==48) throw new Error('invalid checkpoint network');
  if(!saved.body||[saved.body.x,saved.body.y,saved.body.heading,saved.body.energy,saved.body.speed,saved.body.contacts,saved.body.visits,saved.body.travel,saved.previousOdor].some(v=>!Number.isFinite(v))) throw new Error('invalid checkpoint body');
  for(const key of ['v','rate','spikes','refractory']) if(saved.network[key].some(v=>!Number.isFinite(v)||v<0||v>1e3)) throw new Error('invalid checkpoint neural state');
  if(!Array.isArray(saved.network.links)||saved.network.links.length>2304||saved.network.links.some(e=>!Number.isInteger(e.from)||!Number.isInteger(e.to)||e.from<0||e.from>47||e.to<0||e.to>47||!Number.isFinite(e.weight)||Math.abs(e.weight)>1)) throw new Error('invalid checkpoint links');
  if(!Number.isInteger(saved.randomState)||saved.randomState<0||saved.randomState>0xffffffff) throw new Error('invalid checkpoint random state');
  const sim=createSimulation(saved.config);sim.tick=saved.tick;sim.previousOdor=saved.previousOdor;sim.body={...saved.body};sim.network=structuredClone(saved.network);sim.rng.restore(saved.randomState);return sim;
}
