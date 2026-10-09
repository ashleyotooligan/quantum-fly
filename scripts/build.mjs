/** Dependency-free, deliberately explicit bundler for these small ES modules. */
import {readFile,writeFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const files=['src/core/random.mjs','src/core/config.mjs','src/core/world.mjs','src/core/sensors.mjs','src/core/neural.mjs','src/quantum/complex.mjs','src/quantum/gates.mjs','src/quantum/density.mjs','src/quantum/circuit.mjs','src/core/baseline.mjs','src/core/simulation.mjs','src/lab/analysis.mjs','src/lab/laboratory.mjs','src/view/scenes.mjs','src/view/primitives.mjs','src/view/plots.mjs','src/view/render.mjs','src/view/app.mjs'];
let js='';
for(const f of files){let code=await readFile(new URL(f,root),'utf8');code=code.replace(/^import .*?;\s*$/gm,'').replace(/^export /gm,'');if(f==='src/view/render.mjs')code='const C=PALETTE;\n'+code;js+=`\n// ${f}\n${code}\n`;}
const mapping={fly:'assets/art/holographic-fly.png',pixel:'assets/brand/pixel-fly.png',macro:'assets/art/fly-macro.png'},assets={};
for(const [name,path] of Object.entries(mapping))assets[name]='data:image/png;base64,'+(await readFile(new URL(path,root))).toString('base64');
const html=await readFile(new URL('index.html',root),'utf8');
const output=html.replace('<script type="module" src="src/view/app.mjs"></script>',`<script>globalThis.QF_ASSETS=${JSON.stringify(assets)};\n(()=>{\n${js.replace(/<\/script/gi,'<\\/script')}\n})();</script>`);
await writeFile(new URL('Quantum-Fly.html',root),output);
console.log('Built Quantum-Fly.html with all code and original artwork embedded.');
