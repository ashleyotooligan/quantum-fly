# Methods

Every decision starts by sensing the pre-movement body at tick t. The network updates once. Encoder angles are calculated from these readings and the new group rates. A fresh `|00>` state evolves through the declared gates. A density matrix is used after optional dephasing. One uniform draw selects an action. The body then moves and the record becomes frame t+1.

This ordering matters: a frame includes inputs from before its action and a body position from after it. The observation view shows the just-completed decision, not an independent prediction of the next frame.

The odor plume is deterministic but time dependent. The world contains a fixed source and two disks. Network weights and initial membrane potentials come from one seed-derived stream. Action draws come from a separate seed-derived stream. Rendering consumes no model randomness.

No optimization, learned weights, real-world data ingestion, or biological fitting is performed. The model isolates small, inspectable operations; it is not a calibrated Drosophila simulation. The quantum subsystem is exact small-matrix calculation on a CPU.

The reference comparison holds initialization and draw sequences constant. Because actions diverge, subsequent environments as sensed by the fly also diverge. Frozen-input sweeps address a separate circuit-only question. Read [baseline design](BASELINE.md) before interpreting navigation comparisons.

The default experiment horizon is 640 ticks. In-memory visualization retains at most 1,200 frames. Reported batch statistics use the complete 640-frame horizon; summaries of longer interactive sessions describe the retained window for odor/spikes/actions and cumulative body counters for movement/visits.
