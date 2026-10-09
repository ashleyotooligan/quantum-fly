# Defined dephasing channel

For each qubit q, the channel is

`E_q(rho) = (1-gamma)*rho + gamma*(P0 rho P0 + P1 rho P1)`.

P0 and P1 project on that qubit's zero and one states. Gamma belongs to [0,1]. This is a convex mixture of retaining the density and discarding coherence across that qubit's basis partitions, hence a completely positive trace-preserving channel.

The two channels are applied independently. Entry `(i,j)` is multiplied by `(1-gamma)^h`, where h is the Hamming distance between their two-bit basis labels. Diagonal entries have h=0, so populations are preserved. At gamma=1, all off-diagonal entries vanish. This occurs **before** the final H/RY readout gates.

This gamma is our mixture parameter; it must not be interpreted as the identically named parameter of every library's phase-damping API. A physical hardware noise model would need a separately specified mapping and calibration.

The fixed-input sweep reports final measurement probabilities and output purity at 21 strengths. The fully dephased policy uses gamma=1 regardless of the UI slider. The coherent policy uses the slider value. The classical policy calculates the circuit as a diagnostic preview but uses its own softmax probabilities to move.
