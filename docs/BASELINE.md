# Classical comparison

The reference policy uses four logits in action order:

```text
advance = 1.4 + 1.3*odorDelta + motorMean
left    = -11*(odorRight-odorLeft) + 1.8*wallRight
right   =  11*(odorRight-odorLeft) + 1.8*wallLeft
pause   = -0.9 + 0.8*(1-energy)
```

Subtract the largest logit, exponentiate, and normalize. The action is sampled using the same classical PRNG and one draw per tick. Wiring and body initialization are identical for each matched seed, but sensors diverge after actions do.

The coherent and fully dephased policies use the same gate architecture; the latter applies complete dephasing before readout. The reference uses different equations and is not an ablation of those gates. It provides a practical navigation comparator.

Navigation metrics are end distance, mean odor, source visits, path length, and contacts. No training budget is spent. No hypothesis test, confidence interval, hardware speed comparison, or quantum advantage claim follows from the illustrative ten-seed batch.

In the included results, the reference navigates substantially better. That is a useful finding about these parameters. Phase sensitivity is established by the frozen-input sweep, not by pretending the circuit outperforms the baseline.
