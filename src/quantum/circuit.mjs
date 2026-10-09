import {cx} from './complex.mjs';
import {ry,rz,H,lift,CNOT,applyVector} from './gates.mjs';
import {outer,evolveDensity,dephase,probabilities,purity,reducedBloch} from './density.mjs';
export const BASIS=['00','01','10','11'];
export function decisionCircuit(params,gamma=0) {
  const {theta0,theta1,phi,readout}=params;
  if([theta0,theta1,phi,readout].some(x=>!Number.isFinite(x))) throw new Error('nonfinite circuit parameter');
  let state=[cx(1),cx(),cx(),cx()];
  const gates=[{name:'RY',q:0,angle:theta0,u:lift(ry(theta0),0)},{name:'RY',q:1,angle:theta1,u:lift(ry(theta1),1)},{name:'CX',q:0,target:1,u:CNOT},{name:'RZ',q:0,angle:phi,u:lift(rz(phi),0)}];
  const stages=[];
  for(const g of gates) {state=applyVector(state,g.u);stages.push({name:g.name,state:state.map(z=>z.slice())});}
  const before=outer(state);let rho=dephase(before,gamma);
  const readGates=[{name:'H',q:0,u:lift(H,0)},{name:'RY',q:1,angle:readout,u:lift(ry(readout),1)}];
  for(const g of readGates) rho=evolveDensity(rho,g.u);
  return {params:{...params},gamma,stateBeforeNoise:state,rho,probabilities:probabilities(rho),purity:purity(rho),bloch:[reducedBloch(rho,0),reducedBloch(rho,1)],stages,gates:[...gates,...readGates].map(({u,...g})=>g)};
}
export function sampleBorn(p,u) {
  if(!Number.isFinite(u)||u<0||u>=1) throw new Error('uniform draw must be in [0,1)');
  if(p.length!==4||p.some(x=>!Number.isFinite(x)||x<0)||Math.abs(p.reduce((a,b)=>a+b,0)-1)>1e-8) throw new Error('invalid probabilities');
  let c=0;for(let i=0;i<4;i++){c+=p[i];if(u<c)return i;}return 3;
}
