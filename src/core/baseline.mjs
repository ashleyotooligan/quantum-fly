/** Deliberately simple reference policy; shares sensors but does not run the circuit. */
export function classicalPolicy(s,n) {
  const contrast=(s.values[1]-s.values[0])*11;
  const logits=[1.4+1.3*s.values[2]+n.groups[2],-contrast+1.8*s.values[6],contrast+1.8*s.values[5],-0.9+0.8*(1-s.values[8])];
  const m=Math.max(...logits),e=logits.map(x=>Math.exp(x-m)),z=e.reduce((a,b)=>a+b,0);
  return e.map(x=>x/z);
}
