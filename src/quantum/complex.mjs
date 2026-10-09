export const cx=(re=0,im=0)=>[re,im];
export const add=(a,b)=>[a[0]+b[0],a[1]+b[1]];
export const mul=(a,b)=>[a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]];
export const conj=a=>[a[0],-a[1]];
export const scale=(a,k)=>[a[0]*k,a[1]*k];
export const abs2=a=>a[0]*a[0]+a[1]*a[1];
export const phaseCx=a=>[Math.cos(a),Math.sin(a)];
