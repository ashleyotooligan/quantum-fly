/** Independent, serializable random streams. All sampling is classical. */
export function randomStream(seed) {
  let value = seed >>> 0;
  return {
    next() {
      value = (value + 0x6D2B79F5) >>> 0;
      let t = value;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
    state() { return value; },
    restore(v) { value = v >>> 0; }
  };
}
export const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
export const wrap = a => Math.atan2(Math.sin(a), Math.cos(a));
export const average = a => a.length ? a.reduce((s, v) => s + v, 0) / a.length : 0;
