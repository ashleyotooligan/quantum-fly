import {runSimulation} from '../core/simulation.mjs';
export function createLab(options={},art={}) {
  const sim=runSimulation(options);
  const references=['coherent','dephased','classical'].map(mode=>runSimulation({seed:41,steps:640,mode}));
  const pair=[runSimulation({seed:41,steps:640,phase:0}),runSimulation({seed:41,steps:640,phase:Math.PI/2})];
  return {sim,references,pair,art};
}
