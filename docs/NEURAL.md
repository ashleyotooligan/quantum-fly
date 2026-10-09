# Synthetic neural controller

`src/core/neural.mjs` creates 48 units in three equal groups. They are software units with invented connectivity, not imported cell identities. Local same-group links are sampled with probability 0.10; forward group links with 0.17; remaining links with 0.015. Self-links are excluded. Eighteen percent of accepted links receive negative weight. Weight magnitude is uniform from 0.045 to 0.115.

Each update reads last tick's binary spikes. Its drive is a group-specific bias plus one sensory input and the weighted incoming spikes. Potentials follow `v_next = max(0, 0.83*v + drive)`. A value at least 1 emits a spike, resets the potential to zero, and sets two refractory ticks. The rate follows `rate_next = 0.9*rate + 0.1*spike`.

The sensory group uses `0.10 + 0.31*input`; recurrent uses `0.11 + 0.16*input`; motor uses `0.10 + 0.20*input`. Input mapping cycles `unitIndex % 12`. This is intentionally explicit. It does not attempt cellular electrophysiology or reproduce an anatomical brain region.

The recurrent-lesion setting zeros potentials, spikes, and rates for units 16–31. Other groups still update. Changes in the recurrent group feed the encoder through its group mean; effects can propagate through the declared network.

Displayed rate means are dimensionless exponentially smoothed activity. They are not firing rates in hertz. The three-ring network layout is a diagram, not a measured neuron morphology.
