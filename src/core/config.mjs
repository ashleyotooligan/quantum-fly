export const VERSION = '0.1.0';
export const DEFAULTS = Object.freeze({seed:41, steps:640, mode:'coherent', phase:0, dephasing:0, lesion:false});
export const MODES = ['coherent','dephased','classical'];
export const ACTIONS = ['advance','left','right','pause'];
export const ACTION_COLORS = ['#64dcff','#b496ff','#ffbc82','#768ba5'];
export const INPUT_NAMES = ['odor left','odor right','odor delta','light left','light right','wall left','wall right','speed','energy','heading sin','heading cos','clock'];
export function validateConfig(overrides={}) {
  const c = {...DEFAULTS,...overrides};
  if (!Number.isInteger(c.seed) || c.seed<0 || c.seed>0xffffffff) throw new Error('seed must be a uint32');
  if (!Number.isInteger(c.steps) || c.steps<1 || c.steps>20000) throw new Error('steps must be 1..20000');
  if (!MODES.includes(c.mode)) throw new Error('unknown controller mode');
  if (!Number.isFinite(c.phase) || Math.abs(c.phase)>Math.PI*4) throw new Error('phase outside ±4π');
  if (!Number.isFinite(c.dephasing) || c.dephasing<0 || c.dephasing>1) throw new Error('dephasing must be 0..1');
  if (typeof c.lesion!=='boolean') throw new Error('lesion must be boolean');
  return c;
}
