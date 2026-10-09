import {cx,phaseCx,mul,add} from './complex.mjs';
export const H=[[cx(1/Math.sqrt(2)),cx(1/Math.sqrt(2))],[cx(1/Math.sqrt(2)),cx(-1/Math.sqrt(2))]];
export const X=[[cx(),cx(1)],[cx(1),cx()]];
export const ry=a=>[[cx(Math.cos(a/2)),cx(-Math.sin(a/2))],[cx(Math.sin(a/2)),cx(Math.cos(a/2))]];
export const rz=a=>[[phaseCx(-a/2),cx()],[cx(),phaseCx(a/2)]];
export function identity(n=4) {return Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>cx(Number(i===j))));}
/** Big-endian basis |q0 q1>: q0 is the most significant bit. */
export function lift(g,q) {
  if(q!==0&&q!==1) throw new Error('qubit must be 0 or 1');
  const mask=1<<(1-q);
  return Array.from({length:4},(_,i)=>Array.from({length:4},(_,j)=>(i&~mask)===(j&~mask)?g[(i&mask)?1:0][(j&mask)?1:0].slice():cx()));
}
export const CNOT=Array.from({length:4},(_,i)=>Array.from({length:4},(_,j)=>cx(Number(i===(j&2?j^1:j)))));
export function applyVector(state,u) {return u.map(row=>row.reduce((s,e,j)=>add(s,mul(e,state[j])),cx()));}
