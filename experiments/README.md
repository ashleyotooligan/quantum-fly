# Reproduce the experiments

Run `npm run experiments`. The dependency-free runner uses the shared simulation and writes three datasets plus a replay example and [RESULTS.md](RESULTS.md).

| Definition | Question | Output |
|---|---|---|
| [phase-sweep.json](phase-sweep.json) | Does relative phase change the readout at frozen inputs? | [phase-sweep.json](../data/phase-sweep.json) |
| [dephasing-sweep.json](dephasing-sweep.json) | What does partial dephasing change before readout? | [dephasing-sweep.json](../data/dephasing-sweep.json) |
| [matched-navigation.json](matched-navigation.json) | How do three declared policies behave in the same world? | [matched-runs.json](../data/matched-runs.json) |
| [lesion.json](lesion.json) | What does silencing the recurrent group change? | Run example below |

Definitions document parameters; the bundled runner has an explicit implementation of the first three, rather than interpreting arbitrary JSON as executable experiments. The lesion intervention is available in the UI or programmatically:

```sh
node --input-type=module -e "import {runSimulation} from './src/core/simulation.mjs'; import {summarize} from './src/lab/analysis.mjs'; console.log(summarize(runSimulation({seed:41,steps:640,lesion:true})));"
```

The matched batch uses ten listed seeds and three policies. Report all runs, not just a visually appealing path. A source visit is an entrance event within radius 28. Final distance is not cumulative reward. Mean odor is averaged over the 640 pre-action readings. The state at a frame includes its post-action body.

The fixed sweeps hold theta0=1.3, theta1=0.7, readout=0.8, and reference phi=0.65. Phase sweep varies phi only. Noise sweep varies gamma only. Exact probabilities are computed, not estimated from a finite shot histogram.
