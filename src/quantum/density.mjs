import {cx,mul,conj,add,scale,abs2} from './complex.mjs';
export const outer=state=>state.map(a=>state.map(b=>mul(a,conj(b))));
export function evolveDensity(rho,u) {
  const n=rho.length;
  const tmp=Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>u[i].reduce((s,e,k)=>add(s,mul(e,rho[k][j])),cx())));
  return Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>tmp[i].reduce((s,e,k)=>add(s,mul(e,conj(u[j][k]))),cx())));
}
/** E_q(rho)=(1-gamma)rho+gamma(P0 rho P0+P1 rho P1), independently on each qubit. */
export function dephase(rho,gamma) {
  if(!Number.isFinite(gamma)||gamma<0||gamma>1) throw new Error('invalid dephasing');
  return rho.map((row,i)=>row.map((z,j)=>{const k=((i^j)&1?1:0)+((i^j)&2?1:0);return scale(z,(1-gamma)**k);}));
}
export const trace=rho=>rho.reduce((s,row,i)=>s+row[i][0],0);
export const purity=rho=>rho.reduce((s,row)=>s+row.reduce((t,z)=>t+abs2(z),0),0);
export function probabilities(rho) {
  const p=rho.map((row,i)=>row[i][0]);
  if(p.some(v=>v < -1e-10)||Math.abs(p.reduce((a,b)=>a+b,0)-1)>1e-8) throw new Error('invalid density probabilities');
  return p.map(v=>Math.max(0,v));
}
export function reducedBloch(rho,q) {
  const mask=1<<(1-q);let a=0,d=0,z=cx();
  for(let i=0;i<4;i++) if(!(i&mask)) {a+=rho[i][i][0];d+=rho[i|mask][i|mask][0];z=add(z,rho[i][i|mask]);}
  return [2*z[0],-2*z[1],a-d];
}
