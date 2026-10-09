# Checkpoint and replay

Schema: `quantum-fly/checkpoint/1`. A checkpoint contains configuration, current tick, previous odor, the complete body, membrane potentials, rates, spike flags, refractory counters, wiring, and action-PRNG state.

It excludes image data, UI selection, rendering state, and historical frames. Restore reconstructs the action stream and model state, then the viewer computes the next frame for display. A newly restored raster starts with that next frame. This does not lose information needed for future decisions.

Network wiring comes from a distinct initialization stream. Rendering consumes no randomness. One draw per decision is preserved even for pause or collision. These choices allow common-random-number comparisons and exact continuation.

The test exports a checkpoint after 95 updates with partial dephasing, resumes it, and compares 50 subsequent full frames against uninterrupted execution. Exact equality is verified in the same JavaScript runtime. Across engines, floating-point elementary functions can differ in their least significant bits; no cross-engine bitwise guarantee is claimed.

The browser rejects malformed state shape, nonfinite values, impossible link indices, invalid configuration, and files over 2 MB. Checkpoints are plain data and are never evaluated as code. Only import files from a source you intended to use.
