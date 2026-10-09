import {PALETTE as C,textAt,line,panel,metric,rows,imageFit,glow,dot,curve,grid} from './primitives.mjs';
import {arenaPlot,probabilityPlot,rasterPlot,networkPlot,circuitPlot,sweepPlot,sensorPlot} from './plots.mjs';
import {SCENES} from './scenes.mjs';
import {ACTIONS,ACTION_COLORS} from '../core/config.mjs';
import {phaseSweep,noiseSweep,FIXED_PARAMS,summarize} from '../lab/analysis.mjs';
export const VIEW_SIZE={width:1600,height:1000};
export function renderLab(c,lab,scene='observatory') {
  const s=SCENES.find(v=>v.id===scene)??SCENES[0],sim=lab.sim,f=sim.latest,q=f.circuit,art=lab.art||{};
  c.clearRect(0,0,1600,1000);c.fillStyle=C.bg;c.fillRect(0,0,1600,1000);
  glow(c,1250,150,400,'#12254d44');line(c,218,0,218,1000);
  imageFit(c,art.pixel,22,17,50,50);textAt(c,'QUANTUM FLY',81,29,18,C.ink,true);textAt(c,'QF / LOCAL LABORATORY',24,100,12,C.muted,true);
  textAt(c,'OBSERVATION',24,153,12,C.cyan,true);
  SCENES.forEach((v,i)=>{const yy=183+i*43;if(v.id===s.id){c.fillStyle='#153046';c.beginPath();c.roundRect(14,yy-8,190,36,7);c.fill();dot(c,25,yy+8,3,C.cyan);}textAt(c,`${String(i+1).padStart(2,'0')}  ${v.id}`,39,yy,14,v.id===s.id?C.cyan:C.muted,true);});
  line(c,24,835,191,835);textAt(c,'EXECUTION',24,858,11,C.muted,true);textAt(c,'CLASSICAL CPU',24,883,14,C.ink,true);textAt(c,'synthetic controller',24,915,12,C.muted);textAt(c,'v0.1.0 / offline',24,949,12,C.cyan,true);
  textAt(c,s.title,247,38,36);textAt(c,scene==='readout'&&sim.config.mode==='classical'?'Classical softmax probabilities / one seeded draw':s.subtitle,249,91,18,C.muted);
  dot(c,1440,52,4,C.green);textAt(c,'LOCAL SIM',1454,45,14,C.green,true);line(c,246,134,1566,134);
  metric(c,254,155,230,'SEED',String(sim.config.seed),'deterministic replay');metric(c,500,155,230,'CONTROLLER','48 units','12 normalized inputs',C.violet);metric(c,814,155,230,'DECISION','2 qubits','4 basis outcomes');metric(c,1120,155,230,'FRAME',String(sim.tick).padStart(4,'0'),sim.config.mode,C.orange);
  const x=247,y=280,w=1318,h=626;
  if(scene==='observatory') {
    panel(c,x,y,838,h,'SPECIMEN / QF-041','ILLUSTRATION');glow(c,x+435,y+266,330,'#15487366');imageFit(c,art.fly,x+38,y+56,756,440);
    textAt(c,'SENSE  /  SPIKE  /  INTERFERE  /  MOVE',x+36,y+502,20,C.cyan,true);textAt(c,'A small body, an inspectable decision loop.',x+36,y+545,22);textAt(c,'Neural state and qubits are simulated locally.',x+36,y+580,16,C.muted);
    panel(c,x+858,y,460,306,'LAST ACTION / PROBABILITIES');probabilityPlot(c,f.probabilities,x+885,y+62,403,223,f.action);
    panel(c,x+858,y+326,460,300,'NEURAL EVENTS / LAST 180 TICKS');rasterPlot(c,sim.frames,x+901,y+383,385,178);
  } else if(scene==='specimen') {
    panel(c,x,y,910,h,'BODY RECORD','ART / ORIGINAL');imageFit(c,art.fly,x+10,y+51,880,523);textAt(c,'Fly-inspired morphology / stylized, not measured anatomy',x+26,y+588,17,C.muted);
    panel(c,x+930,y,388,h,'SPECIMEN REGISTER');rows(c,[['specimen','QF-041'],['world','720 x 440'],['odor probes','2'],['controller','48 units'],['groups','3'],['actuation','4 moves'],['source','procedural'],['art','generated']],x+953,y+77,338,52);textAt(c,'No biological recording',x+953,y+524,18,C.violet);textAt(c,'is embedded in this model.',x+953,y+552,17,C.muted);
  } else if(scene==='network') {
    panel(c,x,y,970,h,'FUNCTIONAL NETWORK / SYNTHETIC');networkPlot(c,sim,x+26,y+70,920,480);textAt(c,'Node brightness = smoothed spike activity. Links = model weights.',x+26,y+587,16,C.muted);
    panel(c,x+990,y,328,h,'INTERNAL STATE');rows(c,[['units','48'],['links',String(sim.network.links.length)],['threshold','1.00'],['leak','0.83'],['reset','0.00'],['refractory','2 ticks']],x+1013,y+78,280,53);textAt(c,'RECURRENT DRIVE',x+1013,y+456,13,C.violet,true);curve(c,sim.frames.slice(-100).map(v=>v.neural.groups[1]),x+1013,y+498,274,74,C.violet,0,0.3);
  } else if(scene==='spikes') {
    panel(c,x,y,w,430,'SPIKE RASTER / ALL 48 UNITS');rasterPlot(c,sim.frames,x+76,y+64,w-118,307);
    panel(c,x,y+450,w,176,'GROUP ACTIVITY / EXPONENTIAL MOVING AVERAGE');const data=sim.frames.slice(-180);[C.cyan,C.violet,C.orange].forEach((color,g)=>curve(c,data.map(v=>v.neural.groups[g]),x+54,y+501,w-96,81,color,0,0.3));textAt(c,'sensory',x+66,y+593,13,C.cyan,true);textAt(c,'recurrent',x+195,y+593,13,C.violet,true);textAt(c,'motor',x+350,y+593,13,C.orange,true);
  } else if(scene==='sensors') {
    panel(c,x,y,718,h,'THE INPUT STREAM');sensorPlot(c,f,x+24,y+74,665,518);
    panel(c,x+738,y,580,411,'TWO PROBES / ONE ODOR FIELD');arenaPlot(c,sim,x+762,y+65,532,296);textAt(c,'left antenna',x+764,y+381,13,C.cyan,true);textAt(c,'right antenna',x+949,y+381,13,C.violet,true);
    panel(c,x+738,y+431,580,195,'SENSORY CONTRAST');metric(c,x+762,y+485,250,'LEFT - RIGHT',(f.sensors.values[0]-f.sensors.values[1]).toFixed(4),'feeds the phase encoder');
  } else if(scene==='circuit') {
    panel(c,x,y,w,323,'THE EXACT GATE SEQUENCE','2-QUBIT / CPU');circuitPlot(c,q,x+30,y+57,w-65,203);
    panel(c,x,y+343,650,283,'ENCODED PARAMETERS');rows(c,[['theta0',q.params.theta0.toFixed(6)],['theta1',q.params.theta1.toFixed(6)],['phi',q.params.phi.toFixed(6)],['readout',q.params.readout.toFixed(6)]],x+26,y+402,595,45);
    panel(c,x+670,y+343,648,283,'THE INTERFERENCE STEP');textAt(c,'RZ preserves basis probabilities.',x+699,y+410,22,C.violet);textAt(c,'H makes relative phase visible',x+699,y+453,22);textAt(c,'in the final measurement odds.',x+699,y+486,22);textAt(c,'D = partial dephasing before H / RY',x+699,y+555,16,C.muted,true);
  } else if(scene==='readout') {
    panel(c,x,y,662,h,'FOUR BASIS OUTCOMES');probabilityPlot(c,f.probabilities,x+32,y+98,597,349,f.action);textAt(c,'Sum of probabilities',x+32,y+523,17,C.muted);textAt(c,f.probabilities.reduce((a,b)=>a+b,0).toFixed(10),x+332,y+520,22,C.cyan,true);
    panel(c,x+682,y,636,281,'ONE SEEDED DRAW');metric(c,x+712,y+69,300,'UNIFORM SAMPLE',f.uniform.toFixed(6),'classical pseudorandom number',C.violet);textAt(c,'selected -> '+ACTIONS[f.action],x+712,y+216,24,ACTION_COLORS[f.action],true);
    panel(c,x+682,y+301,636,325,sim.config.mode==='classical'?'UNUSED CIRCUIT PREVIEW':'DENSITY DIAGNOSTICS');rows(c,[['purity Tr(rho^2)',q.purity.toFixed(6)],['gamma',q.gamma.toFixed(3)],['Bloch q0',q.bloch[0].map(v=>v.toFixed(2)).join(' ')],['Bloch q1',q.bloch[1].map(v=>v.toFixed(2)).join(' ')]],x+710,y+365,583,52);textAt(c,'One readout per simulation tick.',x+710,y+566,17,C.muted);
  } else if(scene==='phase') {
    panel(c,x,y,w,438,'PHASE SWEEP / FIXED INPUTS');sweepPlot(c,phaseSweep(FIXED_PARAMS),x+84,y+80,w-132,294);textAt(c,'relative phase phi / radians',x+513,y+402,15,C.muted,true);
    panel(c,x,y+458,738,168,'THE SAME SENSORY STATE');textAt(c,'Change only phi. Keep every other gate fixed.',x+27,y+515,21);textAt(c,'Each line is one exact action probability.',x+27,y+555,18,C.muted);
    panel(c,x+758,y+458,560,168,'READOUT');ACTIONS.forEach((a,i)=>{dot(c,x+787+(i%2)*255,y+521+Math.floor(i/2)*40,4,ACTION_COLORS[i]);textAt(c,a,x+801+(i%2)*255,y+511+Math.floor(i/2)*40,17,ACTION_COLORS[i],true);});
  } else if(scene==='noise') {
    panel(c,x,y,858,410,'ERASE PHASE / HOLD INPUTS FIXED');sweepPlot(c,noiseSweep(FIXED_PARAMS),x+80,y+76,733,275,'gamma');
    panel(c,x+878,y,440,410,'PURITY');grid(c,x+946,y+80,324,245);curve(c,noiseSweep(FIXED_PARAMS).map(p=>p.purity),x+946,y+80,324,245,C.violet);textAt(c,'gamma 0 -> 1',x+997,y+360,15,C.muted,true);
    panel(c,x,y+430,w,196,'CHANNEL DEFINITION');textAt(c,'E_q(rho) = (1-gamma)rho + gamma * diagonal-in-q(rho)',x+27,y+491,24,C.cyan,true);textAt(c,'Applied independently to both qubits before the final gates. Not a biological decoherence measurement.',x+27,y+544,17,C.muted);
  } else if(scene==='arena') {
    panel(c,x,y,970,h,'THE NAVIGATION CHAMBER');arenaPlot(c,sim,x+22,y+63,925,519);
    panel(c,x+990,y,328,h,'BODY TELEMETRY');const r=summarize(sim);rows(c,[['position',`${sim.body.x.toFixed(0)},${sim.body.y.toFixed(0)}`],['energy',sim.body.energy.toFixed(3)],['contacts',String(r.contacts)],['source visits',String(r.visits)],['distance',r.finalDistance.toFixed(1)],['path length',r.pathLength.toFixed(1)]],x+1013,y+78,280,55);textAt(c,'ODOR AT BODY',x+1013,y+466,13,C.cyan,true);curve(c,sim.frames.slice(-180).map(v=>v.sensors.odor),x+1013,y+508,274,75,C.cyan);
  } else if(scene==='fork') {
    panel(c,x,y,858,h,'COMMON SEED / PHASE 0 VS +PI/2');arenaPlot(c,lab.pair[0],x+22,y+66,814,498,lab.pair[1]);textAt(c,'Both runs start at the same body state.',x+25,y+589,17,C.muted);
    panel(c,x+878,y,440,288,'PHASE 0');metric(c,x+905,y+79,350,'END DISTANCE',summarize(lab.pair[0]).finalDistance.toFixed(1),'cyan trajectory');textAt(c,'One uniform draw per tick.',x+905,y+222,18,C.muted);
    panel(c,x+878,y+308,440,318,'PHASE +PI/2');metric(c,x+905,y+389,350,'END DISTANCE',summarize(lab.pair[1]).finalDistance.toFixed(1),'violet trajectory',C.violet);textAt(c,'Different odds select different',x+905,y+525,18,C.muted);textAt(c,'moves from the same draws.',x+905,y+557,18,C.muted);
  } else if(scene==='baseline') {
    panel(c,x,y,w,375,'MATCHED RUNS / SEED 41 / 640 TICKS');textAt(c,'POLICY',x+28,y+76,14,C.muted,true);textAt(c,'END DISTANCE',x+430,y+76,14,C.muted,true);textAt(c,'MEAN ODOR',x+766,y+76,14,C.muted,true);textAt(c,'VISITS',x+1090,y+76,14,C.muted,true);
    lab.references.forEach((s,i)=>{const r=summarize(s),yy=y+127+i*74;line(c,x+26,yy-15,x+w-26,yy-15);textAt(c,s.config.mode,x+28,yy,24,[C.cyan,C.violet,C.orange][i],true);textAt(c,r.finalDistance.toFixed(2),x+430,yy,24,C.ink,true);textAt(c,r.meanOdor.toFixed(3),x+766,yy,24,C.ink,true);textAt(c,r.visits,x+1090,yy,24,C.ink,true);});
    panel(c,x,y+395,w,231,'INTERPRETATION');textAt(c,'Different policies create different paths.',x+28,y+459,27);textAt(c,'A lower end distance does not establish quantum advantage.',x+28,y+509,21,C.violet);textAt(c,'The repository includes a ten-seed batch, raw metrics, and an explicit classical reference.',x+28,y+560,17,C.muted);
  } else if(scene==='replay') {
    panel(c,x,y,775,h,'ACTION LEDGER / LAST 8 DECISIONS');[['TICK',30],['ACTION',122],['DRAW',310],['ODOR',451],['PURITY',591]].forEach(([t,dx])=>textAt(c,t,x+dx,y+76,16,C.muted,true));
    sim.frames.slice(-8).forEach((v,i)=>{const yy=y+119+i*52;line(c,x+27,yy-8,x+747,yy-8);textAt(c,String(v.tick).padStart(4,'0'),x+30,yy,18,C.ink,true);textAt(c,ACTIONS[v.action].padEnd(8),x+122,yy,18,ACTION_COLORS[v.action],true);textAt(c,v.uniform.toFixed(4),x+310,yy,18,C.violet,true);textAt(c,v.sensors.odor.toFixed(3),x+451,yy,18,C.cyan,true);textAt(c,v.circuit.purity.toFixed(3),x+591,yy,18,C.muted,true);});
    panel(c,x+795,y,523,h,'REPLAY CONTRACT');rows(c,[['seed',String(sim.config.seed)],['tick',String(sim.tick)],['random stream','saved'],['membrane state','saved'],['weights','saved'],['body state','saved'],['phase offset','saved'],['schema','checkpoint/1']],x+820,y+79,473,49);textAt(c,'Resume the next decision exactly.',x+820,y+530,20,C.cyan);textAt(c,'Download JSON from the toolbar.',x+820,y+571,17,C.muted);
  } else if(scene==='macro') {
    panel(c,x,y,w,h,'QUANTUM FLY / OPTICAL PORTRAIT','ILLUSTRATION');imageFit(c,art.macro,x+2,y+57,w-4,h-59,true);c.fillStyle='#050a12b8';c.fillRect(x+20,y+280,460,250);textAt(c,'The smallest thing',x+44,y+305,30);textAt(c,'in the room.',x+44,y+348,30);textAt(c,'The clearest loop',x+44,y+407,24,C.cyan);textAt(c,'you can inspect.',x+44,y+442,24,C.cyan);textAt(c,'Original art / no biological scan',x+44,y+491,14,C.muted,true);
  }
  line(c,247,930,1565,930);textAt(c,'SYNTHETIC NEURAL MODEL  /  TWO-QUBIT MATHEMATICAL SIMULATION',247,951,13,C.muted,true);textAt(c,'ASHLEY TOOLIGAN',1370,951,13,C.cyan,true);
}
